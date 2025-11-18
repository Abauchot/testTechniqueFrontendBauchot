import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { DepartmentService } from './department-service';
import { Department } from '../../models/department.model';

describe('DepartmentService', () => {
  let service: DepartmentService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://geo.api.gouv.fr';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DepartmentService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(DepartmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get departments by region code', () => {
    const mockDepartments: Department[] = [
      { nom: 'Calvados', code: '14', codeRegion: '28' },
      { nom: 'Eure', code: '27', codeRegion: '28' },
      { nom: 'Manche', code: '50', codeRegion: '28' }
    ];
    const regionCode = '28';

    service.getDepartmentsByRegion(regionCode).subscribe((departments) => {
      expect(departments).toEqual(mockDepartments);
      expect(departments.length).toBe(3);
      expect(departments[0].nom).toBe('Calvados');
      expect(departments[0].codeRegion).toBe('28');
    });

    const req = httpMock.expectOne(`${apiUrl}/regions/${regionCode}/departements`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDepartments);
  });

  it('should handle empty department list', () => {
    const regionCode = '99';

    service.getDepartmentsByRegion(regionCode).subscribe((departments) => {
      expect(departments).toEqual([]);
      expect(departments.length).toBe(0);
    });

    const req = httpMock.expectOne(`${apiUrl}/regions/${regionCode}/departements`);
    req.flush([]);
  });

  it('should handle HTTP errors gracefully', () => {
    const regionCode = '28';
    const errorMessage = 'Server error';

    service.getDepartmentsByRegion(regionCode).subscribe({
      next: () => fail('should have failed with server error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/regions/${regionCode}/departements`);
    req.flush('Server error', { status: 500, statusText: errorMessage });
  });
});
