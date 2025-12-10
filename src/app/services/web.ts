import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // Import HttpParams
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class WebService {
  // Ensure this matches your backend URL (localhost:5000 based on previous context)
  private apiUrl = 'http://localhost:5000/api/v1.0';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // 1. Get list with Filters
  getBusinesses(page: number, filters?: any) {
    let params = new HttpParams()
        .set('pn', page)
        .set('ps', 6); // Page size of 6

    if (filters) {
        if (filters.category) {
            params = params.set('category', filters.category);
        }
        if (filters.manufacturer) {
            params = params.set('manufacturer', filters.manufacturer);
        }
        if (filters.ram_gb) {
            params = params.set('ram_gb', filters.ram_gb);
        }
    }

    return this.http.get<any[]>(`${this.apiUrl}/devices/`, { params });
  }

  // 2. Search Devices
  searchDevices(query: string) {
     return this.http.get<any[]>(`${this.apiUrl}/devices/search?q=${query}`);
  }

  // 3. Get single device
  getBusiness(id: string) {
    return this.http.get<any>(`${this.apiUrl}/devices/${id}`);
  }

  // 4. Update Device
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

  // 5. Delete Device
  deleteDevice(id: string) {
    return this.http.delete(
      `${this.apiUrl}/devices/delete/${id}`,
      { headers: this.authService.getAuthHeader() }
    );
  }

  // 6. Get reviews
  getReviews(id: string) {
    return this.http.get<any[]>(`${this.apiUrl}/devices/${id}/reviews/`);
  }

  // 7. Post review
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
  // 8. Delete review
  deleteReview(deviceId: string, reviewId: string) {
    return this.http.delete(
      `${this.apiUrl}/devices/${deviceId}/reviews/delete/${reviewId}`,
      { headers: this.authService.getAuthHeader() }
    );
  }

  // 9. Add new device
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