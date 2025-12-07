import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Authbutton } from '../authbutton/authbutton';
import { Authuser } from '../authuser/authuser';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterModule, Authbutton, Authuser],
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.css']
})
export class Navigation {}