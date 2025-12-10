import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Authbutton } from './authbutton';
import { AuthService } from '../../services/auth';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('Authbutton', () => {
  let component: Authbutton;
  let fixture: ComponentFixture<Authbutton>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['logout'], { isLoggedIn$: of(false) });

    await TestBed.configureTestingModule({
      imports: [Authbutton],
      providers: [
        { provide: AuthService, useValue: authSpy },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Authbutton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});