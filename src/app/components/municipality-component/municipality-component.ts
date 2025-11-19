import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MunicipalityService } from '../../services/municipality/municipality-service';
import { Municipality } from '../../models/municipality.model';

@Component({
  selector: 'app-municipality-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './municipality-component.html',
  styleUrl: './municipality-component.css',
})
export class MunicipalityComponent implements OnInit {
  municipalities = signal<Municipality[]>([]);
  departmentCode = signal<string>('');
  isLoading = signal<boolean>(false);
  
  // Pagination
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  pageSizeOptions = [5, 10, 20, 50, 100];

  protected readonly Math = Math;

  // Computed signals
  totalPages = computed(() => {
    const total = this.municipalities().length;
    const size = this.pageSize();
    return Math.ceil(total / size);
  });

  paginatedMunicipalities = computed(() => {
    const municipalities = this.municipalities();
    const page = this.currentPage();
    const size = this.pageSize();
    const start = (page - 1) * size;
    const end = start + size;
    return municipalities.slice(start, end);
  });

  // Calculate visible page numbers with ellipsis
  visiblePages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const delta = 2;
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (current > delta + 2) {
        pages.push('...');
      }

      const start = Math.max(2, current - delta);
      const end = Math.min(total - 1, current + delta);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < total - delta - 1) {
        pages.push('...');
      }

      if (total > 1) {
        pages.push(total);
      }
    }

    return pages;
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private municipalityService: MunicipalityService
  ) {}

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('code');
    
    if (code) {
      this.departmentCode.set(code);
      this.loadMunicipalities(code);
    }
  }

  private loadMunicipalities(departmentCode: string): void {
    this.isLoading.set(true);
    this.municipalityService.getMunicipalitiesByDepartment(departmentCode).subscribe({
      next: (municipalities) => {
        this.municipalities.set(municipalities);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading municipalities:', error);
        this.isLoading.set(false);
        this.municipalities.set([]);
      }
    });
  }

  // Pagination methods
  onPageSizeChange(newSize: number): void {
    this.pageSize.set(newSize);
    this.currentPage.set(1);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  isNumber(value: number | string): boolean {
    return typeof value === 'number';
  }

  goBack(): void {
    this.location.back();
  }

  goToSearch(): void {
    this.router.navigate(['/search']);
  }
}
