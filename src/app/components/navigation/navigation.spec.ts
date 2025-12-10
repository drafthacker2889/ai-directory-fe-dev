import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Navigation } from './navigation';
import { AuthService } from '../../services/auth';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('Navigation', () => {
  let component: Navigation;
  let fixture: ComponentFixture<Navigation>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['logout', 'isAuthenticated', 'getCurrentUser'], { isLoggedIn$: of(false) });

    await TestBed.configureTestingModule({
      imports: [Navigation],
      providers: [
        { provide: AuthService, useValue: authSpy },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Navigation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});