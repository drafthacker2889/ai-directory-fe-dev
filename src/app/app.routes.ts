import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Businesses } from './components/businesses/businesses';
import { Business } from './components/business/business';
import { TestWebService } from './components/test-web-service/test-web-service';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'businesses', component: Businesses },
  { path: 'businesses/:id', component: Business },
  { path: 'test', component: TestWebService }
];