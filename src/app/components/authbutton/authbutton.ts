import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-authbutton',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './authbutton.html',
  styleUrls: ['./authbutton.css'] 
})
export class Authbutton {
  constructor(public authService: AuthService) {} 
}