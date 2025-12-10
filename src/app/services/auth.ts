import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Point to your Python backend
  private apiUrl = 'http://localhost:5000/api/v1.0/auth';

  private loggedIn = new BehaviorSubject<boolean>(this.isAuthenticated());
  public isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    // This creates the "Basic Auth" header your Python backend expects
    const headers = new HttpHeaders({
      authorization: 'Basic ' + btoa(username + ':' + password)
    });

    return this.http.get<any>(`${this.apiUrl}/login`, { headers }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', username);
          
          // Decode the token to get the admin status
          const payload = this.decodeToken(response.token);
          if (payload && payload.admin) {
            localStorage.setItem('isAdmin', 'true');
          } else {
            localStorage.removeItem('isAdmin');
          }

          this.loggedIn.next(true);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    this.loggedIn.next(false);
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser() {
    return localStorage.getItem('username');
  }

  // Check if the current user has the admin claim
  isAdmin(): boolean {
    return localStorage.getItem('isAdmin') === 'true';
  }

  // Helper for your Python decorators
  getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders({ 'x-access-token': token }) : new HttpHeaders();
  }

  register(username: string, password: string, email: string) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('email', email);

    return this.http.post<any>(`${this.apiUrl}/register`, formData);
  }

  // Helper to decode JWT payload without external libraries
  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error parsing token', e);
      return null;
    }
  }
}