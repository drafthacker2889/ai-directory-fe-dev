import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // 1. Import this

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule], // 2. Add this to enable links
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {}