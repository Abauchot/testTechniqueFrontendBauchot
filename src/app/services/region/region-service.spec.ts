import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { RegionService } from './region-service';
import { Region } from '../../models/region.model';



describe('RegionService', () => {
  let service: RegionService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://geo.api.gouv.fr';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RegionService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(RegionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search regions by name', () => {
    const mockRegions: Region[] = [
      { nom: 'Normandie', code: '28' },
      { nom: 'Pays de la Loire', code: '52' },
    ];
    const searchTerm = 'Norm';

    service.searchRegions(searchTerm).subscribe((regions) => {
      expect(regions.length).toBe(2);
      expect(regions).toEqual(mockRegions);
      expect(regions[0].nom).toBe('Normandie');
    });

    const req = httpMock.expectOne(`${apiUrl}/regions?nom=${searchTerm}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRegions);
  });

  it('should get region by code', () => {
    const mockRegion: Region = { nom: 'Normandie', code: '28' };
    const regionCode = '28';

    service.getRegionByCode(regionCode).subscribe((region) => {
      expect(region).toEqual(mockRegion);
      expect(region.nom).toBe('Normandie');
      expect(region.code).toBe('28');
    });

    const req = httpMock.expectOne(`${apiUrl}/regions/${regionCode}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRegion);
  });

  it('should handle empty search results', () => {
    const searchTerm = 'NonExistentRegion';

    service.searchRegions(searchTerm).subscribe((regions) => {
      expect(regions).toEqual([]);
      expect(regions.length).toBe(0);
    });

    const req = httpMock.expectOne(`${apiUrl}/regions?nom=${searchTerm}`);
    req.flush([]);
  });

  it('should handle HTTP errors gracefully', () => {
    const searchTerm = 'Test';
    const errorMessage = 'Network error';

    service.searchRegions(searchTerm).subscribe({
      next: () => fail('should have failed with network error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/regions?nom=${searchTerm}`);
    req.flush('Network error', { status: 500, statusText: errorMessage });
  });
});
