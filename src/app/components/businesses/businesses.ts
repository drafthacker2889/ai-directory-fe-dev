import { Component, OnInit } from '@angular/core';
import { WebService } from '../../services/web';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-businesses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './businesses.html',
  styleUrls: ['./businesses.css']
})
export class Businesses implements OnInit {
  business_list: any[] = [];
  page: number = 1;

  constructor(private webService: WebService) {}

  ngOnInit() {
    // If we stored the page number in session, retrieve it
    if (sessionStorage.getItem('page')) {
      this.page = Number(sessionStorage.getItem('page'));
    }
    this.loadBusinesses();
  }

  loadBusinesses() {
    this.webService.getBusinesses(this.page).subscribe((response) => {
      this.business_list = response;
    });
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      sessionStorage.setItem('page', this.page.toString());
      this.loadBusinesses();
    }
  }

  nextPage() {
    this.page++;
    sessionStorage.setItem('page', this.page.toString());
    this.loadBusinesses();
  }
}