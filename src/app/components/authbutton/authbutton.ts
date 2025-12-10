import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-authbutton',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './authbutton.html',
  styleUrls: ['./authbutton.css'] // Note: Ensure this file exists or remove this line
})
export class Authbutton {
  // CHANGE 'private' TO 'public'
  constructor(public authService: AuthService) {} 
}