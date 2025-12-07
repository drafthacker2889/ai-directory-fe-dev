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
    // 1. Retrieve the stored page number
    const storedPage = sessionStorage.getItem('page');
    
    if (storedPage) {
      this.page = Number(storedPage);
    }

    // 2. CRITICAL FIX: If page is 0, NaN, or invalid, FORCE it to 1
    if (!this.page || this.page < 1) {
      console.warn('Invalid page detected (' + this.page + '). Resetting to 1.');
      this.page = 1;
      sessionStorage.setItem('page', '1'); // Overwrite the bad data
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