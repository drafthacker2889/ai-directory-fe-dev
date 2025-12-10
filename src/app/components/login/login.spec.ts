import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create mocks
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Login, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: rSpy }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should call authService.login() when form is valid and submitted', () => {
    component.loginForm.controls['username'].setValue('testuser');
    component.loginForm.controls['password'].setValue('password123');
    
    authServiceSpy.login.and.returnValue(of({ token: 'fake-jwt' }));

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('testuser', 'password123');
  });

  it('should navigate to home on successful login', () => {
    component.loginForm.controls['username'].setValue('testuser');
    component.loginForm.controls['password'].setValue('password123');
    authServiceSpy.login.and.returnValue(of({ token: 'fake-jwt' }));

    component.onSubmit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should display error message on failed login', () => {
    component.loginForm.controls['username'].setValue('testuser');
    component.loginForm.controls['password'].setValue('wrongpass');
    
    authServiceSpy.login.and.returnValue(of(false));

    component.onSubmit();

    expect(component.errorMessage).toContain('Invalid credentials');
  });
});