import { Component, OnInit } from '@angular/core';
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
  reviewForm: any;
  
  editMode: boolean = false;
  editForm: FormGroup;

  constructor(
    private webService: WebService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private formBuilder: FormBuilder
  ) {
      // Initialize the form for editing the business/device details
      this.editForm = this.formBuilder.group({
          name: ['', Validators.required],
          category: ['', Validators.required],
          price_usd: ['', Validators.required],
          processor: ['', Validators.required]
      });
  }

  ngOnInit() {
    // Initialize the form for posting a new review
    this.reviewForm = this.formBuilder.group({
        comment: ['', Validators.required],
        stars: [5, Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
        // Fetch the business details
        this.webService.getBusiness(id).subscribe(data => {
            this.business = data;
            // Patch the edit form with the retrieved data
            this.editForm.patchValue({
                name: data.name,
                category: data.category,
                price_usd: data.price_usd,
                processor: data.processor
            });
        });
        // Fetch the reviews
        this.refreshReviews(id);
    }
  }

  /**
   * @returns boolean - Checks if the currently logged-in user is 'admin'.
   */
  get isAdmin(): boolean {
    return this.authService.getCurrentUser() === 'admin';
  }

  /**
   * Fetches and updates the list of reviews for a given business ID.
   * @param id The ID of the business/device.
   */
  refreshReviews(id: string) {
      this.webService.getReviews(id).subscribe(data => this.reviews = data);
  }

  /**
   * Deletes the current device/business (Admin-only).
   */
  deleteDevice() {
      const id = this.business._id;
      if (confirm('Are you sure you want to delete this device? This cannot be undone.')) {
          this.webService.deleteDevice(id).subscribe({
              next: () => {
                  alert('Device deleted!');
                  this.router.navigate(['/businesses']);
              },
              error: (err) => {
                  console.error(err);
                  alert('Error: You likely need Admin permissions to delete.');
              }
          });
      }
  }

  /**
   * Toggles the local state for showing the edit form.
   */
  toggleEdit() {
      this.editMode = !this.editMode;
  }

  /**
   * Submits the updated device/business data (Admin-only).
   */
  saveEdit() {
      if (this.editForm.valid) {
          const id = this.business._id;
          this.webService.updateDevice(id, this.editForm.value).subscribe({
              next: () => {
                  alert('Device updated successfully!');
                  this.editMode = false;
                  // Refresh the displayed data
                  this.webService.getBusiness(id).subscribe(data => this.business = data);
              },
              error: (err) => {
                  console.error(err);
                  alert('Error: You likely need Admin permissions to update.');
              }
          });
      }
  }

  /**
   * Submits a new review for the business/device.
   */
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

  /**
   * Checks if the current user can delete a specific review.
   * @param review The review object to check ownership against.
   * @returns boolean
   */
  canEditReview(review: any): boolean {
    const currentUser = this.authService.getCurrentUser();
    // 1. If Admin, they can edit/delete anything
    if (currentUser === 'admin') return true;
    // 2. If regular user, they can only edit/delete their own
    return currentUser === review.user;
  }

  /**
   * Deletes a specific review.
   * @param reviewId The ID of the review to delete.
   */
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
