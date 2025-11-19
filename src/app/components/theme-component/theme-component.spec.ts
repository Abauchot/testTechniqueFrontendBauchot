import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeToggleComponent } from './theme-component';
import { ThemeService } from '../../services/theme/theme-service';

describe('ThemeToggleComponent', () => {
  let component: ThemeToggleComponent;
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let themeService: ThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeToggleComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display current theme', () => {
    themeService.setTheme('light');
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('span')?.textContent).toContain('Dark');
    
    themeService.setTheme('dark');
    fixture.detectChanges();
    
    expect(compiled.querySelector('span')?.textContent).toContain('Light');
  });

  it('should toggle theme when button is clicked', () => {
    themeService.setTheme('light');
    fixture.detectChanges();
    
    const button = fixture.nativeElement.querySelector('button');
    button?.click();
    
    expect(themeService.currentTheme()).toBe('dark');
    
    button?.click();
    
    expect(themeService.currentTheme()).toBe('light');
  });

  it('should have proper aria-label', () => {
    themeService.setTheme('light');
    fixture.detectChanges();
    
    const button = fixture.nativeElement.querySelector('button');
    expect(button?.getAttribute('aria-label')).toBe('Switch to dark mode');
    
    themeService.setTheme('dark');
    fixture.detectChanges();
    
    expect(button?.getAttribute('aria-label')).toBe('Switch to light mode');
  });
});
