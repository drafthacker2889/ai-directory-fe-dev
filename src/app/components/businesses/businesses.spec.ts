import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Businesses } from './businesses';
import { WebService } from '../../services/web';
import { AuthService } from '../../services/auth';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';

describe('Businesses Component', () => {
  let component: Businesses;
  let fixture: ComponentFixture<Businesses>;
  let webServiceSpy: jasmine.SpyObj<WebService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const wSpy = jasmine.createSpyObj('WebService', ['getBusinesses', 'searchDevices', 'postDevice']);
    const aSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'isAdmin']);

    wSpy.getBusinesses.and.returnValue(of([{ name: 'Test Device', category: 'GPU' }]));
    
    wSpy.searchDevices.and.returnValue(of([])); 
    wSpy.postDevice.and.returnValue(of({}));

    aSpy.getCurrentUser.and.returnValue('testuser');

    await TestBed.configureTestingModule({
      imports: [Businesses, ReactiveFormsModule],
      providers: [
        { provide: WebService, useValue: wSpy },
        { provide: AuthService, useValue: aSpy },
        provideRouter([])
      ]
    }).compileComponents();

    webServiceSpy = TestBed.inject(WebService) as jasmine.SpyObj<WebService>;
    fixture = TestBed.createComponent(Businesses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load businesses on init', () => {
    expect(webServiceSpy.getBusinesses).toHaveBeenCalled();
    expect(component.business_list.length).toBe(1);
    expect(component.business_list[0].name).toBe('Test Device');
  });

  it('should call searchDevices when search input changes', (done) => {
    component.searchControl.setValue('Nvidia');
    setTimeout(() => {
      expect(webServiceSpy.searchDevices).toHaveBeenCalledWith('Nvidia');
      done();
    }, 600);
  });
});