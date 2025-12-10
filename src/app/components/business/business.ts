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
      this.editForm = this.formBuilder.group({
          name: ['', Validators.required],
          category: ['', Validators.required],
          price_usd: ['', Validators.required],
          processor: ['', Validators.required]
      });
  }

  ngOnInit() {
    this.reviewForm = this.formBuilder.group({
        comment: ['', Validators.required],
        stars: [5, Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
        this.webService.getBusiness(id).subscribe(data => {
            this.business = data;
            this.editForm.patchValue({
                name: data.name,
                category: data.category,
                price_usd: data.price_usd,
                processor: data.processor
            });
        });
        this.refreshReviews(id);
    }
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  refreshReviews(id: string) {
      this.webService.getReviews(id).subscribe(data => this.reviews = data);
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
                  console.error(err);
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
                  this.webService.getBusiness(id).subscribe(data => this.business = data);
              },
              error: (err) => {
                  console.error(err);
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
    // Use the service method to check for true admin privileges (via token)
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