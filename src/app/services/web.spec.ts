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
});