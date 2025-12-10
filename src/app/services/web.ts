import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class WebService {
  private apiUrl = 'http://localhost:5000/api/v1.0';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getBusinesses(page: number, filters?: any) {
    let params = new HttpParams()
        .set('pn', page)
        .set('ps', 6);

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

  searchDevices(query: string) {
     return this.http.get<any[]>(`${this.apiUrl}/devices/search?q=${query}`);
  }

  getBusiness(id: string) {
    return this.http.get<any>(`${this.apiUrl}/devices/${id}`);
  }

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

  deleteDevice(id: string) {
    return this.http.delete(
      `${this.apiUrl}/devices/delete/${id}`,
      { headers: this.authService.getAuthHeader() }
    );
  }

  getReviews(id: string) {
    return this.http.get<any[]>(`${this.apiUrl}/devices/${id}/reviews/`);
  }

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
  deleteReview(deviceId: string, reviewId: string) {
    return this.http.delete(
      `${this.apiUrl}/devices/${deviceId}/reviews/delete/${reviewId}`,
      { headers: this.authService.getAuthHeader() }
    );
  }

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