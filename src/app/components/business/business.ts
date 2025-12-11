import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { WebService } from '../../services/web';
import { AuthService } from '../../services/auth';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-business',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './business.html',
  styleUrl: './business.css'
})
export class Business implements OnInit {
  business: any = {};
  reviews: any[] = [];
  
  // UI States
  isLoading: boolean = true;
  errorMessage: string = '';
  
  editMode: boolean = false;
  editForm: FormGroup;
  reviewForm: FormGroup;

  constructor(
    private webService: WebService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
      this.editForm = this.formBuilder.group({
          name: ['', Validators.required],
          category: ['', Validators.required],
          price_usd: ['', Validators.required],
          processor: ['', Validators.required]
      });

      this.reviewForm = this.formBuilder.group({
        comment: ['', Validators.required],
        stars: [5, Validators.required]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
        this.loadDeviceDetails(id);
    } else {
        this.errorMessage = "Invalid Device ID";
        this.isLoading = false;
    }
  }

  get isAdmin(): boolean {
    if (typeof this.authService['isAdmin'] === 'function') {
        return this.authService['isAdmin']();
    }
    return this.authService.getCurrentUser() === 'admin';
  }

  loadDeviceDetails(id: string) {
    this.isLoading = true;
    
    this.webService.getBusiness(id).subscribe({
        next: (data) => {
            this.business = data;
            
            this.editForm.patchValue({
                name: data.name,
                category: data.category,
                price_usd: data.price_usd,
                processor: data.processor
            });

            this.refreshReviews(id); 
        },
        error: (err) => {
            console.error(err);
            this.errorMessage = "Device not found or server error.";
            this.isLoading = false;
            this.cdr.detectChanges();
        }
    });
  }

  refreshReviews(id: string) {
      this.webService.getReviews(id).subscribe({
          next: (data) => {
              this.reviews = data;
              this.isLoading = false; 
              this.cdr.detectChanges();
          },
          error: () => {
              this.isLoading = false;
              this.cdr.detectChanges();
          }
      });
  }

  deleteDevice() {
      const id = this.business._id;
      if (confirm('Are you sure you want to delete this device? This cannot be undone.')) {
          this.webService.deleteDevice(id).subscribe({
              next: () => {
                  alert('Device deleted!');
                  this.router.navigate(['/businesses']);
              },
              error: (err) => {
                  alert('Error: You likely need Admin permissions to delete.');
              }
          });
      }
  }

  toggleEdit() {
      this.editMode = !this.editMode;
  }

  saveEdit() {
      if (this.editForm.valid) {
          const id = this.business._id;
          this.webService.updateDevice(id, this.editForm.value).subscribe({
              next: () => {
                  alert('Device updated successfully!');
                  this.editMode = false;
                  this.loadDeviceDetails(id);
              },
              error: (err) => {
                  alert('Error: You likely need Admin permissions to update.');
              }
          });
      }
  }

  onSubmit() {
      const id = this.route.snapshot.paramMap.get('id');
      if(id && this.reviewForm.valid) {
          this.webService.postReview(id, this.reviewForm.value).subscribe({
              next: () => {
                  alert('Review posted!');
                  this.reviewForm.reset({ stars: 5 });
                  this.refreshReviews(id);
              },
              error: () => alert('Please log in to review.')
          });
      }
  }

  canEditReview(review: any): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (this.authService.isAdmin()) return true;
    return currentUser === review.user;
  }

  deleteReview(reviewId: string) {
      const deviceId = this.business._id;
      if (confirm('Delete this review?')) {
          this.webService.deleteReview(deviceId, reviewId).subscribe({
              next: () => {
                  alert('Review deleted');
                  this.refreshReviews(deviceId);
              },
              error: (err) => alert('Error deleting review (You may not have permissions).')
          });
      }
  }
}