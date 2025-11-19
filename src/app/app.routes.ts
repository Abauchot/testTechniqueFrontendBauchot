import { Routes } from '@angular/router';
import { RegionSearchComponent } from './components/region-search-component/region-search-component';
import { MunicipalityComponent } from './components/municipality-component/municipality-component';

export const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'search', component: RegionSearchComponent },
  { path: 'search/:regionCode', component: RegionSearchComponent },
  { path: 'municipalities/:code', component: MunicipalityComponent }
];
