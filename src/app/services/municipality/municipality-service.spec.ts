import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MunicipalityService } from './municipality-service';
import { Municipality } from '../../models/municipality.model';

describe('MunicipalityService', () => {
  let service: MunicipalityService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://geo.api.gouv.fr';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MunicipalityService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(MunicipalityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get municipalities by department code', () => {
    const mockMunicipalities: Municipality[] = [
      { nom: 'Caen', code: '14118', codeDepartement: '14', codeRegion: '28' },
      { nom: 'Lisieux', code: '14366', codeDepartement: '14', codeRegion: '28' },
      { nom: 'Hérouville-Saint-Clair', code: '14327', codeDepartement: '14', codeRegion: '28' }
    ];
    const departmentCode = '14';

    service.getMunicipalitiesByDepartment(departmentCode).subscribe((municipalities: Municipality[]) => {
      expect(municipalities).toEqual(mockMunicipalities);
      expect(municipalities.length).toBe(3);
      expect(municipalities[0].nom).toBe('Caen');
      expect(municipalities[0].codeDepartement).toBe('14');
    });

    const req = httpMock.expectOne(`${apiUrl}/departements/${departmentCode}/communes`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMunicipalities);
  });

  it('should handle empty municipality list', () => {
    const departmentCode = '99';

    service.getMunicipalitiesByDepartment(departmentCode).subscribe((municipalities: Municipality[]) => {
      expect(municipalities).toEqual([]);
      expect(municipalities.length).toBe(0);
    });

    const req = httpMock.expectOne(`${apiUrl}/departements/${departmentCode}/communes`);
    req.flush([]);
  });

  it('should handle HTTP errors gracefully', () => {
    const departmentCode = '14';
    const errorMessage = 'Server error';

    service.getMunicipalitiesByDepartment(departmentCode).subscribe({
      next: () => fail('should have failed with server error'),
      error: (error: any) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/departements/${departmentCode}/communes`);
    req.flush('Server error', { status: 500, statusText: errorMessage });
  });
});
