import { Component, OnInit } from '@angular/core';
import { WebService } from '../../services/web';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-businesses',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './businesses.html',
  styleUrls: ['./businesses.css']
})
export class Businesses implements OnInit {
  business_list: any[] = [];
  page: number = 1;
  searchControl = new FormControl('');
  isSearching: boolean = false;

  constructor(private webService: WebService) {}

  ngOnInit() {
    const storedPage = sessionStorage.getItem('page');
    if (storedPage) { this.page = Number(storedPage); }
    if (!this.page || this.page < 1) { this.page = 1; sessionStorage.setItem('page', '1'); }

    this.loadBusinesses();

    this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe(val => {
        if (val && val.trim() !== '') {
            this.isSearching = true;
            this.searchDevices(val);
        } else {
            this.isSearching = false;
            this.loadBusinesses();
        }
    });
  }

  loadBusinesses() {
    // REMOVED isLoading
    this.webService.getBusinesses(this.page).subscribe((response) => {
      this.business_list = response;
    });
  }

  searchDevices(query: string) {
      this.webService.searchDevices(query).subscribe(response => {
          this.business_list = response;
      });
  }

  previousPage() {
    if (this.page > 1 && !this.isSearching) {
      this.page--;
      sessionStorage.setItem('page', this.page.toString());
      this.loadBusinesses();
    }
  }

  nextPage() {
    if (!this.isSearching) {
        this.page++;
        sessionStorage.setItem('page', this.page.toString());
        this.loadBusinesses();
    }
  }
}