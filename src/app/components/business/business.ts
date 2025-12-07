import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebService } from '../../services/web';
import { BusinessData } from '../../services/business-data';
import { AuthService } from '../../services/auth';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
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

  constructor(
    private webService: WebService,
    private businessData: BusinessData,
    private route: ActivatedRoute,
    public authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.reviewForm = this.formBuilder.group({
        username: ['', Validators.required],
        comment: ['', Validators.required],
        stars: 5
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
        // 1. Get Business Details
        this.webService.getBusiness(id).subscribe(data => {
            this.business = data;
        });
        // 2. Get Reviews
        this.refreshReviews(id);
    }
  }

  refreshReviews(id: string) {
      this.webService.getReviews(id).subscribe(data => {
          this.reviews = data;
      });
  }

  onSubmit() {
      const id = this.route.snapshot.paramMap.get('id');
      if(id && this.reviewForm.valid) {
          this.webService.postReview(id, this.reviewForm.value).subscribe({
              next: () => {
                  this.reviewForm.reset();
                  this.refreshReviews(id);
              },
              error: () => alert('Error: Please login to review.')
          });
      }
  }
}