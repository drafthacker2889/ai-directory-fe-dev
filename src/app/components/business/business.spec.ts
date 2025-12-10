import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Business } from './business';
import { WebService } from '../../services/web';
import { AuthService } from '../../services/auth';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('Business', () => {
  let component: Business;
  let fixture: ComponentFixture<Business>;

  beforeEach(async () => {
    const webSpy = jasmine.createSpyObj('WebService', ['getBusiness', 'getReviews', 'postReview', 'deleteDevice', 'updateDevice']);
    webSpy.getBusiness.and.returnValue(of({ name: 'Test Device' }));
    webSpy.getReviews.and.returnValue(of([]));

    const authSpy = jasmine.createSpyObj('AuthService', [], { isLoggedIn$: of(false) });

    await TestBed.configureTestingModule({
      imports: [Business],
      providers: [
        { provide: WebService, useValue: webSpy },
        { provide: AuthService, useValue: authSpy },
        provideRouter([]), 
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '123' } } }         }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Business);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});