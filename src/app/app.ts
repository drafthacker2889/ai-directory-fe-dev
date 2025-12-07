import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigation } from './components/navigation/navigation'; // <--- Import Navigation

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navigation], // <--- Add Navigation to imports
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'AI Directory';
}