import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('login() should store token and username in localStorage', () => {
    const mockResponse = { token: 'header.eyJmb28iOiJiYXIifQ.signature' };
    service.login('testuser', 'password').subscribe();

    const req = httpMock.expectOne('http://localhost:5000/api/v1.0/auth/login');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(localStorage.getItem('token')).toContain('header.');
    expect(localStorage.getItem('username')).toBe('testuser');
  });

  it('logout() should remove token from localStorage', () => {
    localStorage.setItem('token', 'old-token');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });
});