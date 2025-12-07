import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebService } from '../../services/web';
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
    private route: ActivatedRoute,
    public authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    // We removed 'username' because the backend grabs it from the Token
    this.reviewForm = this.formBuilder.group({
        comment: ['', Validators.required],
        stars: [5, Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
        this.webService.getBusiness(id).subscribe(data => {
            this.business = data;
        });
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
                  alert('Review posted successfully!');
                  this.reviewForm.reset({ stars: 5 }); // Reset form and keep stars at 5
                  this.refreshReviews(id);
              },
              error: (err) => {
                console.error(err);
                alert('Error: You must be logged in to review.');
              }
          });
      }
  }
}