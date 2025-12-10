import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
})
export class Register {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.email]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { username, password, email } = this.registerForm.value;
      this.authService.register(username, password, email).subscribe({
        next: () => {
          alert('Registration successful! Please log in.');
          this.router.navigate(['/']); // Go back home
        },
        error: (err) => {
          // Handle backend error
          this.errorMessage = err.error.error || 'Registration failed';
        }
      });
    }
  }
}