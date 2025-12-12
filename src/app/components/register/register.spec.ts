import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Register } from './register';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, provideRouter } from '@angular/router'; // <--- Import provideRouter
import { of, throwError } from 'rxjs';

describe('Register Component', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [Register, ReactiveFormsModule],
      providers: [
        provideRouter([]), // <--- FIX: Provides ActivatedRoute & Router
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate'); // <--- Spy on the real router

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

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle registration errors', () => {
    component.registerForm.controls['username'].setValue('existinguser');
    component.registerForm.controls['password'].setValue('password123');
    component.registerForm.controls['email'].setValue('taken@test.com');

    const errorResponse = { error: { error: 'Username already exists' } };
    authServiceSpy.register.and.returnValue(throwError(() => errorResponse));

    component.onSubmit();

    expect(component.errorMessage).toBe('Username already exists');
  });
});