import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Register } from './register';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('Register Component', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['register']);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Register, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: rSpy }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call register() with correct values', () => {
    component.registerForm.controls['username'].setValue('newuser');
    component.registerForm.controls['password'].setValue('password123');
    component.registerForm.controls['email'].setValue('test@test.com');

    authServiceSpy.register.and.returnValue(of({ message: 'Success' }));

    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalledWith('newuser', 'password123', 'test@test.com');
  });

  it('should navigate to home after success', () => {
    component.registerForm.controls['username'].setValue('newuser');
    component.registerForm.controls['password'].setValue('password123');
    component.registerForm.controls['email'].setValue('test@test.com');

    authServiceSpy.register.and.returnValue(of({ message: 'Success' }));

    component.onSubmit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle registration errors', () => {
    component.registerForm.controls['username'].setValue('existinguser');
    component.registerForm.controls['password'].setValue('password123');
    component.registerForm.controls['email'].setValue('taken@test.com');

    // Simulate backend 409 Conflict error
    const errorResponse = { error: { error: 'Username already exists' } };
    authServiceSpy.register.and.returnValue(throwError(() => errorResponse));

    component.onSubmit();

    expect(component.errorMessage).toBe('Username already exists');
  });
});