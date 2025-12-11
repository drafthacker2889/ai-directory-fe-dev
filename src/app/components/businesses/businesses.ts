import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { WebService } from '../../services/web';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
  
  isLoading: boolean = false;
  errorMessage: string = '';
  isSearching: boolean = false;

  searchControl = new FormControl('');
  filterForm: FormGroup;
  addForm: FormGroup;
  
  showFilters: boolean = false;
  addMode: boolean = false;

  categories = ['Single-board Computer', 'AI Accelerator', 'Edge AI Board', 'Mini PC'];
  manufacturers = [
    'AMD', 'ASUS', 'Google', 'Hardkernel', 'Intel', 
    'NVIDIA', 'ODROID', 'Qualcomm', 'Raspberry Pi Foundation', 'Seeed Studio'
  ];
  ram_options = [4, 8, 16, 32];

  constructor(
    private webService: WebService, 
    public authService: AuthService, 
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.filterForm = this.formBuilder.group({
      category: [''],
      manufacturer: [''],
      ram_gb: ['']
    });

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

  get isAdmin(): boolean {
    if (typeof this.authService['isAdmin'] === 'function') {
        return this.authService['isAdmin']();
    }
    return this.authService.getCurrentUser() === 'admin';
  }

  toggleFilters() { this.showFilters = !this.showFilters; }
  toggleAddMode() { this.addMode = !this.addMode; }

  applyFilters() {
    this.page = 1;
    this.loadBusinesses();
  }

  clearFilters() {
    this.filterForm.reset({ category: '', manufacturer: '', ram_gb: '' });
    this.page = 1;
    this.loadBusinesses();
  }

  submitAddDevice() {
      if(this.addForm.valid) {
          this.webService.postDevice(this.addForm.value).subscribe({
              next: () => {
                  alert('Device added successfully!');
                  this.addMode = false;
                  this.addForm.reset();
                  this.loadBusinesses();
              },
              error: (err) => {
                  console.error(err);
                  alert('Error adding device. Ensure you are an Admin.');
              }
          });
      }
  }


  loadBusinesses() {
    this.isLoading = true;
    this.errorMessage = '';
    
    const filters = this.filterForm.value;

    this.webService.getBusinesses(this.page, filters).subscribe({
      next: (response) => {
        this.business_list = response;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Unable to load devices. The server might be down.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  searchDevices(query: string) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.webService.searchDevices(query).subscribe({
        next: (response) => {
          this.business_list = response;
          this.isLoading = false;
          this.cdr.detectChanges(); 
        },
        error: (err) => {
          this.errorMessage = 'Search failed.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
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