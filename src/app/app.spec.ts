import { TestBed } from '@angular/core/testing';
import { WebService } from './services/web';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './services/auth';

describe('WebService', () => {
  let service: WebService;

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
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});