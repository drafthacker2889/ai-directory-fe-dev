import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestWebService } from './test-web-service';

describe('TestWebService', () => {
  let component: TestWebService;
  let fixture: ComponentFixture<TestWebService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestWebService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestWebService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
