import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Businesses } from './businesses';
import { WebService } from '../../services/web';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('Businesses', () => {
  let component: Businesses;
  let fixture: ComponentFixture<Businesses>;
  let webServiceSpy: jasmine.SpyObj<WebService>;

  beforeEach(async () => {
    // Create a fake WebService
    const spy = jasmine.createSpyObj('WebService', ['getBusinesses', 'searchDevices']);
    spy.getBusinesses.and.returnValue(of([])); // Return empty list by default

    await TestBed.configureTestingModule({
      imports: [Businesses],
      providers: [
        { provide: WebService, useValue: spy },
        provideRouter([]) // Fixes Router dependency
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
});