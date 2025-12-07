import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigation } from './components/navigation/navigation'; // Import Navigation

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navigation], // Add Navigation here
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('AiDirectoryFE');
}