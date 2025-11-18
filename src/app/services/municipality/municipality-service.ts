import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Municipality } from '../../models/municipality.model';

@Injectable({
  providedIn: 'root',
})
export class MunicipalityService {
  private readonly apiUrl = 'https://geo.api.gouv.fr';

  constructor(private http: HttpClient) {}

  getMunicipalitiesByDepartment(departmentCode: string): Observable<Municipality[]> {
    return this.http.get<Municipality[]>(`${this.apiUrl}/departements/${departmentCode}/communes`);
  }
}
