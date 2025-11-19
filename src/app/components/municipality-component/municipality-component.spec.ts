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
    // Setup spy BEFORE detectChanges
    municipalityService.getMunicipalitiesByDepartment.and.returnValue(of([]));
    
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load municipalities on init based on route param', () => {
    const mockMunicipalities: Municipality[] = [
      { nom: 'Caen', code: '14118', codeDepartement: '14', codeRegion: '28' },
      { nom: 'Lisieux', code: '14366', codeDepartement: '14', codeRegion: '28' }
    ];

    municipalityService.getMunicipalitiesByDepartment.and.returnValue(of(mockMunicipalities));

    fixture.detectChanges();

    expect(municipalityService.getMunicipalitiesByDepartment).toHaveBeenCalledWith('14');
    expect(component.municipalities().length).toBe(2);
    expect(component.municipalities()[0].nom).toBe('Caen');
  });

  it('should handle empty list', () => {
    municipalityService.getMunicipalitiesByDepartment.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component.municipalities().length).toBe(0);
    expect(component.isLoading()).toBeFalse();
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
});
