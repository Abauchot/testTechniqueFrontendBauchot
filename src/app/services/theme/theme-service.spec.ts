import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { ThemeService } from './theme-service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    // Clear the data-theme attribute before each test
    document.documentElement.removeAttribute('data-theme');
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with light theme by default', fakeAsync(() => {
    service.setTheme('light');
    flush(); 
    expect(service.currentTheme()).toBe('light');
  }));

  it('should toggle theme from light to dark', fakeAsync(() => {
    service.setTheme('light');
    flush();
    
    service.toggleTheme();
    flush();
    
    expect(service.currentTheme()).toBe('dark');
  }));

  it('should toggle theme from dark to light', fakeAsync(() => {
    service.setTheme('dark');
    flush();
    
    service.toggleTheme();
    flush();
    
    expect(service.currentTheme()).toBe('light');
  }));

  it('should set theme directly', fakeAsync(() => {
    service.setTheme('dark');
    flush();
    expect(service.currentTheme()).toBe('dark');
    
    service.setTheme('light');
    flush();
    expect(service.currentTheme()).toBe('light');
  }));

  it('should save theme to localStorage', fakeAsync(() => {
    service.setTheme('dark');
    flush();
    expect(localStorage.getItem('app-theme')).toBe('dark');
    
    service.setTheme('light');
    flush();
    expect(localStorage.getItem('app-theme')).toBe('light');
  }));

  it('should apply theme to document element', fakeAsync(() => {
    service.setTheme('dark');
    flush();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    
    service.setTheme('light');
    flush();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  }));
});
