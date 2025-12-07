import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authbutton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './authbutton.html',
  styleUrl: './authbutton.css'
})
export class Authbutton {
  constructor(public auth: AuthService) {}

  login() {
    // Simple prompt for login
    const user = prompt('Username (Try "user"):');
    const pass = prompt('Password (Try "user_pass"):');
    if(user && pass) {
        this.auth.login(user, pass).subscribe({
            next: () => alert('Success!'),
            error: () => alert('Invalid credentials')
        });
    }
  }
}