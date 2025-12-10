import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Authuser } from './authuser';
import { AuthService } from '../../services/auth';
import { of } from 'rxjs';

describe('Authuser', () => {
  let component: Authuser;
  let fixture: ComponentFixture<Authuser>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser'], { isLoggedIn$: of(true) });

    await TestBed.configureTestingModule({
      imports: [Authuser],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Authuser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});