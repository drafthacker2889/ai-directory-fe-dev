import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth';

/**
 * Primary Data Service for the AI Hardware Directory.
 * Handles all CRUD operations for Devices and Reviews, interacting with the Flask Backend.
 */
@Injectable({
  providedIn: 'root'
})
export class WebService {
  /** Backend API Base URL */
  private apiUrl = 'http://localhost:5000/api/v1.0';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Fetches a paginated list of devices from the database.
   * Supports dynamic filtering by category, manufacturer, and RAM.
   * * @param page The page number to retrieve (server defaults to 6 items per page)
   * @param filters Optional object containing filter criteria (category, manufacturer, ram_gb)
   * @returns An Observable array of Device objects
   */
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

  /**
   * Performs a text-based search for devices by name.
   * * @param query The search string entered by the user
   * @returns An Observable array of matching devices
   */
  searchDevices(query: string) {
     return this.http.get<any[]>(`${this.apiUrl}/devices/search?q=${query}`);
  }

  /**
   * Retrieves the full details for a single device by its ID.
   * * @param id The unique MongoDB _id of the device
   * @returns An Observable containing the device details
   */
  getBusiness(id: string) {
    return this.http.get<any>(`${this.apiUrl}/devices/${id}`);
  }

  /**
   * ADMIN ONLY: Updates an existing device's details.
   * * @param id The ID of the device to update
   * @param deviceData The object containing new values (name, category, price, processor)
   * @returns An Observable containing the update response
   */
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

  /**
   * ADMIN ONLY: Permanently deletes a device from the database.
   * * @param id The ID of the device to delete
   * @returns An Observable response
   */
  deleteDevice(id: string) {
    return this.http.delete(
      `${this.apiUrl}/devices/delete/${id}`,
      { headers: this.authService.getAuthHeader() }
    );
  }

  /**
   * Fetches all reviews associated with a specific device.
   * * @param id The ID of the device
   * @returns An Observable array of review objects
   */
  getReviews(id: string) {
    return this.http.get<any[]>(`${this.apiUrl}/devices/${id}/reviews/`);
  }

  /**
   * Posts a new review for a device. Requires User Authentication.
   * * @param id The ID of the device being reviewed
   * @param review Object containing comment and star rating
   * @returns An Observable response
   */
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

  /**
   * Deletes a specific review.
   * Can be performed by the review author or an Admin.
   * * @param deviceId The ID of the device
   * @param reviewId The ID of the review to delete
   * @returns An Observable response
   */
  deleteReview(deviceId: string, reviewId: string) {
    return this.http.delete(
      `${this.apiUrl}/devices/${deviceId}/reviews/delete/${reviewId}`,
      { headers: this.authService.getAuthHeader() }
    );
  }

  /**
   * ADMIN ONLY: Creates a new device entry in the database.
   * * @param deviceData The form data containing device specs (name, category, RAM, etc.)
   * @returns An Observable containing the new device URL
   */
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