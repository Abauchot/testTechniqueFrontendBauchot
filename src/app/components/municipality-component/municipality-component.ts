import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MunicipalityService } from '../../services/municipality/municipality-service';
import { Municipality } from '../../models/municipality.model';

@Component({
  selector: 'app-municipality-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './municipality-component.html',
  styleUrl: './municipality-component.css',
})
export class MunicipalityComponent implements OnInit {
  municipalities = signal<Municipality[]>([]);
  departmentCode = signal<string>('');
  isLoading = signal<boolean>(false);

  constructor(
    private route: ActivatedRoute,
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
}
