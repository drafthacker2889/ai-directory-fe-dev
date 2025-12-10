import { Component, OnInit } from '@angular/core';
import { WebService } from '../../services/web';
import { AuthService } from '../../services/auth'; // Import AuthService
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Import Form tools
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

  // Add Device Variables
  addMode: boolean = false;
  addForm: FormGroup;

  constructor(
    private webService: WebService, 
    public authService: AuthService, // Inject Auth
    private formBuilder: FormBuilder // Inject Builder
  ) {
    // Initialize the Add Device Form
    this.addForm = this.formBuilder.group({
        name: ['', Validators.required],
        category: ['', Validators.required],
        price_usd: ['', [Validators.required, Validators.min(0)]],
        processor: [''],
        ram_gb: [0],
        manufacturer_name: [''],
        manufacturer_country: ['']
    });
  }

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

  // Helper to check if user is admin
  get isAdmin(): boolean {
    return this.authService.getCurrentUser() === 'admin';
  }

  toggleAddMode() {
      this.addMode = !this.addMode;
  }

  submitAddDevice() {
      if(this.addForm.valid) {
          this.webService.postDevice(this.addForm.value).subscribe({
              next: () => {
                  alert('Device added successfully!');
                  this.addMode = false;
                  this.addForm.reset(); // Clear form
                  this.loadBusinesses(); // Refresh list to show new item
              },
              error: (err) => {
                  console.error(err);
                  alert('Error adding device. Ensure you are an Admin.');
              }
          });
      }
  }

  loadBusinesses() {
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