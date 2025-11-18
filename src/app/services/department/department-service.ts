import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../../models/department.model';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private readonly apiUrl = 'https://geo.api.gouv.fr';

  constructor(private http: HttpClient) {}

  getDepartmentsByRegion(regionCode: string): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/regions/${regionCode}/departements`);
  }
}
