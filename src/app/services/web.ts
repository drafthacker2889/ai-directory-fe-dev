import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class WebService {
  private apiUrl = 'http://127.0.0.1:5000/api/v1.0';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // 1. Get list (Existing)
  getBusinesses(page: number) {
    return this.http.get<any[]>(`${this.apiUrl}/devices/?pn=${page}&ps=6`);
  }

  // 2. Search Devices (New Requirement)
  searchDevices(query: string) {
     return this.http.get<any[]>(`${this.apiUrl}/devices/search?q=${query}`);
  }

  // 3. Get single device (Existing)
  getBusiness(id: string) {
    return this.http.get<any>(`${this.apiUrl}/devices/${id}`);
  }

  // 4. Update Device (New Requirement - Edit)
  // Your backend specifically looks for: name, category, price_usd, processor
  updateDevice(id: string, deviceData: any) {
    const formData = new FormData();
    formData.append('name', deviceData.name);
    formData.append('category', deviceData.category);
    formData.append('price_usd', deviceData.price_usd);
    formData.append('processor', deviceData.processor);

    return this.http.put(
      `${this.apiUrl}/devices/update/${id}`,
      formData,
      { headers: this.authService.getAuthHeader() }
    );
  }

  // 5. Delete Device (New Requirement - Delete)
  deleteDevice(id: string) {
    return this.http.delete(
      `${this.apiUrl}/devices/delete/${id}`,
      { headers: this.authService.getAuthHeader() }
    );
  }

  // 6. Get reviews (Existing)
  getReviews(id: string) {
    return this.http.get<any[]>(`${this.apiUrl}/devices/${id}/reviews/`);
  }

  // 7. Post review (Existing)
  postReview(id: string, review: any) {
    const formData = new FormData();
    formData.append('comment', review.comment);
    formData.append('rating', review.stars.toString());
    
    return this.http.post(
      `${this.apiUrl}/devices/${id}/reviews/add`,
      formData,
      { headers: this.authService.getAuthHeader() }
    );
  }
  // 8. Delete review (Existing)
  deleteReview(deviceId: string, reviewId: string) {
    return this.http.delete(
      `${this.apiUrl}/devices/${deviceId}/reviews/delete/${reviewId}`,
      { headers: this.authService.getAuthHeader() }
    );
  }

  // 9. Add new device (Admin only)
  postDevice(deviceData: any) {
    const formData = new FormData();
    formData.append('name', deviceData.name);
    formData.append('category', deviceData.category);
    formData.append('price_usd', deviceData.price_usd);
    formData.append('processor', deviceData.processor);
    formData.append('ram_gb', deviceData.ram_gb);
    formData.append('manufacturer_name', deviceData.manufacturer_name);
    formData.append('manufacturer_country', deviceData.manufacturer_country);

    return this.http.post(
      `${this.apiUrl}/devices/add`,
      formData,
      { headers: this.authService.getAuthHeader() }
    );
  }
}