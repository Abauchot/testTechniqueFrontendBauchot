import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Region } from '../models/region.model';

@Injectable({
  providedIn: 'root',
})
export class RegionService {
  private apiUrl = 'https://geo.api.gouv.fr';

  constructor(private http: HttpClient) {}

  searchRegions(name: string): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.apiUrl}/regions?nom=${name}`);
  }

  getRegionByCode(code: string): Observable<Region> {
    return this.http.get<Region>(`${this.apiUrl}/regions/${code}`);
  }
}