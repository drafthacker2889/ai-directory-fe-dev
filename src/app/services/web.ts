import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth'; // Note: importing from './auth'

@Injectable({
  providedIn: 'root'
})
export class WebService {
  private apiUrl = 'http://localhost:5000/api/v1.0';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Get list of devices
  getBusinesses(page: number) {
    return this.http.get<any[]>(`${this.apiUrl}/devices/?pn=${page}&ps=3`);
  }

  // Get single device
  getBusiness(id: string) {
    return this.http.get<any>(`${this.apiUrl}/devices/${id}`);
  }

  // Get reviews
  getReviews(id: string) {
    return this.http.get<any[]>(`${this.apiUrl}/devices/${id}/reviews/`);
  }

  // Post review (Using FormData for your Python backend)
  postReview(id: string, review: any) {
    const formData = new FormData();
    formData.append('comment', review.comment);
    formData.append('rating', review.stars);

    return this.http.post(
      `${this.apiUrl}/devices/${id}/reviews/add`,
      formData,
      { headers: this.authService.getAuthHeader() }
    );
  }
}