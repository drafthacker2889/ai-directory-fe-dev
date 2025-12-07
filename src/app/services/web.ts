import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class WebService {
  // Use 127.0.0.1 to avoid potential CORS issues with localhost resolution
  private apiUrl = 'http://127.0.0.1:5000/api/v1.0';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Get list of devices (Pagination is supported by your backend)
  getBusinesses(page: number) {
    return this.http.get<any[]>(`${this.apiUrl}/devices/?pn=${page}&ps=6`);
  }

  // Get single device
  getBusiness(id: string) {
    return this.http.get<any>(`${this.apiUrl}/devices/${id}`);
  }

  // Get reviews
  getReviews(id: string) {
    return this.http.get<any[]>(`${this.apiUrl}/devices/${id}/reviews/`);
  }

  // Post review
  postReview(id: string, review: any) {
    const formData = new FormData();
    formData.append('comment', review.comment);
    // Backend expects rating to be parsable as int. 
    formData.append('rating', review.stars.toString());

    // We do NOT send 'username'. The backend takes the username from the JWT Token.
    
    return this.http.post(
      `${this.apiUrl}/devices/${id}/reviews/add`,
      formData,
      { headers: this.authService.getAuthHeader() }
    );
  }
}