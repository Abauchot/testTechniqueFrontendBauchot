import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { RegionSearchComponent } from './region-search-component';
import { RegionService } from '../../services/region/region-service';
import { DepartmentService } from '../../services/department/department-service';
import { Region } from '../../models/region.model';
import { Department } from '../../models/department.model';

describe('RegionSearchComponent', () => {
  let component: RegionSearchComponent;
  let fixture: ComponentFixture<RegionSearchComponent>;
  let regionService: jasmine.SpyObj<RegionService>;
  let departmentService: jasmine.SpyObj<DepartmentService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const regionServiceSpy = jasmine.createSpyObj('RegionService', ['searchRegions', 'getRegionByCode']);
    const departmentServiceSpy = jasmine.createSpyObj('DepartmentService', ['getDepartmentsByRegion']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegionSearchComponent, ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: RegionService, useValue: regionServiceSpy },
        { provide: DepartmentService, useValue: departmentServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    regionService = TestBed.inject(RegionService) as jasmine.SpyObj<RegionService>;
    departmentService = TestBed.inject(DepartmentService) as jasmine.SpyObj<DepartmentService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionSearchComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have a form with regionName control', () => {
    fixture.detectChanges();
    expect(component.searchForm.contains('regionName')).toBeTruthy();
  });

  it('should search regions when typing', fakeAsync(() => {
    const mockRegions: Region[] = [
      { nom: 'Normandie', code: '28' },
      { nom: 'Nouvelle-Aquitaine', code: '75' }
    ];

    regionService.searchRegions.and.returnValue(of(mockRegions));
    
    fixture.detectChanges();
    
    const sub = component.filteredRegions$.subscribe();
    
    tick(300); 
    regionService.searchRegions.calls.reset();

    component.searchForm.get('regionName')?.setValue('Norm');
    tick(300);

    expect(regionService.searchRegions).toHaveBeenCalledWith('Norm');
    
    sub.unsubscribe();
    flush();
  }));

  it('should display filtered regions', fakeAsync(() => {
    const mockRegions: Region[] = [
      { nom: 'Normandie', code: '28' }
    ];

    regionService.searchRegions.and.returnValue(of(mockRegions));
    
    fixture.detectChanges();
    tick(300);

    let resultRegions: Region[] = [];
    const sub = component.filteredRegions$.subscribe((regions) => {
      resultRegions = regions;
    });

    component.searchForm.get('regionName')?.setValue('Normandie');
    tick(300);

    expect(resultRegions.length).toBe(1);
    expect(resultRegions[0].nom).toBe('Normandie');
    
    sub.unsubscribe();
    flush();
  }));

  it('should load departments when region is selected', () => {
    const mockDepartments: Department[] = [
      { nom: 'Calvados', code: '14', codeRegion: '28' },
      { nom: 'Eure', code: '27', codeRegion: '28' }
    ];

    departmentService.getDepartmentsByRegion.and.returnValue(of(mockDepartments));
    
    fixture.detectChanges();

    const selectedRegion: Region = { nom: 'Normandie', code: '28' };
    component.onRegionSelected(selectedRegion);

    expect(departmentService.getDepartmentsByRegion).toHaveBeenCalledWith('28');
    expect(component.departments().length).toBe(2);
    expect(component.selectedRegion()).toEqual(selectedRegion);
  });

  it('should navigate to municipality list when department is clicked', () => {
    fixture.detectChanges();
    
    const department: Department = { nom: 'Calvados', code: '14', codeRegion: '28' };
    
    component.onDepartmentClick(department);

    expect(router.navigate).toHaveBeenCalledWith(['/municipalities', '14']);
  });

  it('should not search if input is less than 2 characters', fakeAsync(() => {
    regionService.searchRegions.and.returnValue(of([]));
    
    fixture.detectChanges();
    
    const sub = component.filteredRegions$.subscribe();
    
    tick(300);
    regionService.searchRegions.calls.reset();
    
    component.searchForm.get('regionName')?.setValue('N');
    tick(300);

    expect(regionService.searchRegions).not.toHaveBeenCalled();
    
    sub.unsubscribe();
    flush();
  }));

  it('should clear departments when region input is cleared', fakeAsync(() => {
    fixture.detectChanges();
    const sub = component.filteredRegions$.subscribe();
    
    const mockDepartments: Department[] = [
      { nom: 'Calvados', code: '14', codeRegion: '28' }
    ];
    departmentService.getDepartmentsByRegion.and.returnValue(of(mockDepartments));
    
    const selectedRegion: Region = { nom: 'Normandie', code: '28' };
    component.onRegionSelected(selectedRegion);
    
    expect(component.departments().length).toBe(1);

    component.searchForm.get('regionName')?.setValue('');
    tick(300);

    expect(component.departments().length).toBe(0);
    expect(component.selectedRegion()).toBeNull();
    
    sub.unsubscribe();
    flush();
  }));
});
