import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestWebService } from './test-web-service';
import { WebService } from '../../services/web';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../services/auth';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('TestWebService Component', () => {
  let component: TestWebService;
  let fixture: ComponentFixture<TestWebService>;
  let webServiceSpy: jasmine.SpyObj<WebService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('WebService', ['getBusinesses', 'getBusiness', 'deleteDevice', 'updateDevice', 'searchDevices']);

    await TestBed.configureTestingModule({
      imports: [TestWebService, HttpClientTestingModule, FormsModule],
      providers: [
        { provide: WebService, useValue: spy },
        { provide: AuthService, useValue: {} }
      ]
    }).compileComponents();

    webServiceSpy = TestBed.inject(WebService) as jasmine.SpyObj<WebService>;
    fixture = TestBed.createComponent(TestWebService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getBusinesses when "Test Get List" is clicked', () => {
    webServiceSpy.getBusinesses.and.returnValue(of([{ name: 'Test Device' }]));

    component.testPage = 1;
    component.testGetList();

    expect(webServiceSpy.getBusinesses).toHaveBeenCalledWith(1);
    expect(component.apiResponse).toEqual([{ name: 'Test Device' }]);
  });
});