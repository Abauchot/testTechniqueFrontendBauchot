import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, tap } from 'rxjs/operators';
import { RegionService } from '../../services/region/region-service';
import { DepartmentService } from '../../services/department/department-service';
import { Region } from '../../models/region.model';
import { Department } from '../../models/department.model';

@Component({
  selector: 'app-region-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './region-search-component.html',
  styleUrls: ['./region-search-component.css']
})
export class RegionSearchComponent implements OnInit {
  searchForm: FormGroup;
  filteredRegions$!: Observable<Region[]>;
  departments = signal<Department[]>([]);
  selectedRegion = signal<Region | null>(null);
  isLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private regionService: RegionService,
    private departmentService: DepartmentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.searchForm = this.fb.group({
      regionName: ['']
    });
  }

  ngOnInit(): void {
    // Check if there's a region code in the URL
    const regionCode = this.route.snapshot.paramMap.get('regionCode');
    if (regionCode) {
      this.loadRegionByCode(regionCode);
    }

    this.filteredRegions$ = this.searchForm.get('regionName')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(value => {
        if (!value || value.length < 2) {
          this.departments.set([]);
          this.selectedRegion.set(null);
          // Navigate back to search without region code
          if (this.route.snapshot.paramMap.get('regionCode')) {
            this.router.navigate(['/search'], { replaceUrl: true });
          }
        }
      }),
      switchMap(value => {
        // Don't search if we already have a selected region with the same name
        if (this.selectedRegion() && this.selectedRegion()?.nom === value) {
          return of([]);
        }
        
        if (!value || value.length < 2) {
          return of([]);
        }
        this.isLoading.set(true);
        return this.regionService.searchRegions(value);
      }),
      map(regions => {
        this.isLoading.set(false);
        return regions;
      })
    );
  }

  private loadRegionByCode(regionCode: string): void {
    this.isLoading.set(true);
    this.regionService.getRegionByCode(regionCode).subscribe({
      next: (region) => {
        this.selectedRegion.set(region);
        this.searchForm.get('regionName')?.setValue(region.nom, { emitEvent: false });
        this.loadDepartments(region.code);
      },
      error: (error) => {
        console.error('Error loading region:', error);
        this.isLoading.set(false);
        this.router.navigate(['/search']);
      }
    });
  }

  onRegionSelected(region: Region): void {
    this.selectedRegion.set(region);
    this.searchForm.get('regionName')?.setValue(region.nom, { emitEvent: false });
    this.router.navigate(['/search', region.code], { replaceUrl: true });
    this.loadDepartments(region.code);
  }

  private loadDepartments(regionCode: string): void {
    this.isLoading.set(true);
    this.departmentService.getDepartmentsByRegion(regionCode).subscribe({
      next: (departments) => {
        this.departments.set(departments);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.isLoading.set(false);
      }
    });
  }

  onDepartmentClick(department: Department): void {
    this.router.navigate(['/municipalities', department.code]);
  }
}
