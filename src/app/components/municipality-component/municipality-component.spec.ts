import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MunicipalityComponent } from './municipality-component';
import { MunicipalityService } from '../../services/municipality/municipality-service';
import { Municipality } from '../../models/municipality.model';

describe('MunicipalityComponent', () => {
  let component: MunicipalityComponent;
  let fixture: ComponentFixture<MunicipalityComponent>;
  let municipalityService: jasmine.SpyObj<MunicipalityService>;

  const createMockMunicipalities = (count: number): Municipality[] => {
    return Array.from({ length: count }, (_, i) => ({
      nom: `Commune ${i + 1}`,
      code: `14${String(i + 1).padStart(3, '0')}`,
      codeDepartement: '14',
      codeRegion: '28'
    }));
  };

  beforeEach(async () => {
    const municipalityServiceSpy = jasmine.createSpyObj('MunicipalityService', ['getMunicipalitiesByDepartment']);

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: () => '14'
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [MunicipalityComponent],
      providers: [
        { provide: MunicipalityService, useValue: municipalityServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    municipalityService = TestBed.inject(MunicipalityService) as jasmine.SpyObj<MunicipalityService>;
    fixture = TestBed.createComponent(MunicipalityComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    municipalityService.getMunicipalitiesByDepartment.and.returnValue(of([]));
    
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load municipalities on init based on route param', () => {
    const mockMunicipalities = createMockMunicipalities(25);

    municipalityService.getMunicipalitiesByDepartment.and.returnValue(of(mockMunicipalities));

    fixture.detectChanges();

    expect(municipalityService.getMunicipalitiesByDepartment).toHaveBeenCalledWith('14');
    expect(component.municipalities().length).toBe(25);
  });

  it('should display department code', () => {
    const mockMunicipalities: Municipality[] = [];
    municipalityService.getMunicipalitiesByDepartment.and.returnValue(of(mockMunicipalities));

    fixture.detectChanges();

    expect(component.departmentCode()).toBe('14');
  });

  it('should handle errors gracefully', () => {
    municipalityService.getMunicipalitiesByDepartment.and.returnValue(
      throwError(() => new Error('API Error'))
    );

    fixture.detectChanges();

    expect(component.isLoading()).toBeFalse();
    expect(component.municipalities().length).toBe(0);
  });

  // Pagination tests
  it('should initialize with default page size of 10', () => {
    municipalityService.getMunicipalitiesByDepartment.and.returnValue(of([]));
    
    fixture.detectChanges();

    expect(component.pageSize()).toBe(10);
  });

  it('should display first page of municipalities with default page size', () => {
    const mockMunicipalities = createMockMunicipalities(25);
    municipalityService.getMunicipalitiesByDepartment.and.returnValue(of(mockMunicipalities));

    fixture.detectChanges();

    const paginatedMunicipalities = component.paginatedMunicipalities();
    expect(paginatedMunicipalities.length).toBe(10);
    expect(paginatedMunicipalities[0].nom).toBe('Commune 1');
  });

  it('should change page size when selector is changed', () => {
    const mockMunicipalities = createMockMunicipalities(25);
    municipalityService.getMunicipalitiesByDepartment.and.returnValue(of(mockMunicipalities));

    fixture.detectChanges();

    component.onPageSizeChange(20);

    expect(component.pageSize()).toBe(20);
    expect(component.paginatedMunicipalities().length).toBe(20);
    expect(component.currentPage()).toBe(1); // Reset to first page
  });

  it('should navigate to next page', () => {
    const mockMunicipalities = createMockMunicipalities(25);
    municipalityService.getMunicipalitiesByDepartment.and.returnValue(of(mockMunicipalities));

    fixture.detectChanges();

    component.nextPage();

    expect(component.currentPage()).toBe(2);
    const paginatedMunicipalities = component.paginatedMunicipalities();
    expect(paginatedMunicipalities[0].nom).toBe('Commune 11');
  });

  it('should navigate to previous page', () => {
    const mockMunicipalities = createMockMunicipalities(25);
    municipalityService.getMunicipalitiesByDepartment.and.returnValue(of(mockMunicipalities));

    fixture.detectChanges();

    component.nextPage();
    component.previousPage();

    expect(component.currentPage()).toBe(1);
    const paginatedMunicipalities = component.paginatedMunicipalities();
    expect(paginatedMunicipalities[0].nom).toBe('Commune 1');
  });

  it('should not go to previous page when on first page', () => {
    const mockMunicipalities = createMockMunicipalities(25);
    municipalityService.getMunicipalitiesByDepartment.and.returnValue(of(mockMunicipalities));

    fixture.detectChanges();

    component.previousPage();

    expect(component.currentPage()).toBe(1);
  });

  it('should not go to next page when on last page', () => {
    const mockMunicipalities = createMockMunicipalities(25);
    municipalityService.getMunicipalitiesByDepartment.and.returnValue(of(mockMunicipalities));

    fixture.detectChanges();

    component.nextPage();
    component.nextPage();
    component.nextPage(); // Try to go beyond last page

    expect(component.currentPage()).toBe(3); // Should stay on last page
  });

  it('should calculate total pages correctly', () => {
    const mockMunicipalities = createMockMunicipalities(25);
    municipalityService.getMunicipalitiesByDepartment.and.returnValue(of(mockMunicipalities));

    fixture.detectChanges();

    expect(component.totalPages()).toBe(3); // 25 items / 10 per page = 3 pages
  });

  it('should go to specific page', () => {
    const mockMunicipalities = createMockMunicipalities(50);
    municipalityService.getMunicipalitiesByDepartment.and.returnValue(of(mockMunicipalities));

    fixture.detectChanges();

    component.goToPage(3);

    expect(component.currentPage()).toBe(3);
    const paginatedMunicipalities = component.paginatedMunicipalities();
    expect(paginatedMunicipalities[0].nom).toBe('Commune 21');
  });

  it('should handle empty list pagination', () => {
    municipalityService.getMunicipalitiesByDepartment.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component.paginatedMunicipalities().length).toBe(0);
    expect(component.totalPages()).toBe(0);
  });
});
