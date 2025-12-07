import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authuser',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './authuser.html',
  styleUrl: './authuser.css'
})
export class Authuser {
  constructor(public auth: AuthService) {}
}