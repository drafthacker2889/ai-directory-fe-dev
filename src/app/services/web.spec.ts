import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WebService } from './web';
import { AuthService } from './auth';

describe('WebService', () => {
  let service: WebService;
  let httpMock: HttpTestingController;

  const authServiceMock = {
    getAuthHeader: () => ({ 'x-access-token': 'fake-token' })
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WebService,
        { provide: AuthService, useValue: authServiceMock }
      ]
    });
    service = TestBed.inject(WebService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getBusinesses() should call correct URL with pagination', () => {
    service.getBusinesses(1).subscribe();

    const req = httpMock.expectOne(req => req.url.includes('/devices/'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('pn')).toBe('1');
    req.flush([]);
  });

  it('searchDevices() should call search endpoint', () => {
    service.searchDevices('Nvidia').subscribe();
    const req = httpMock.expectOne('http://localhost:5000/api/v1.0/devices/search?q=Nvidia');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  // --- NEW DELETE TEST ---
  it('deleteDevice() should send DELETE request to correct endpoint', () => {
    const mockId = '1234567890';
    
    service.deleteDevice(mockId).subscribe();

    const req = httpMock.expectOne(`http://localhost:5000/api/v1.0/devices/delete/${mockId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({}); // Respond with empty success object
  });
});