import { Component, ChangeDetectorRef } from '@angular/core';
import { WebService } from '../../services/web';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-test-web-service',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test-web-service.html',
  styleUrl: './test-web-service.css'
})
export class TestWebService {
  testId: string = '';
  testPage: number = 1;
  searchQuery: string = '';
  
  apiResponse: any = null;
  errorMessage: string = '';

  constructor(
    private webService: WebService,
    private cdr: ChangeDetectorRef
  ) {}

  private handleResponse(obs: any) {
    this.apiResponse = 'Loading...';
    this.errorMessage = '';
    
    obs.subscribe({
      next: (data: any) => {
        this.apiResponse = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.errorMessage = `Error: ${err.status} - ${err.message}`;
        this.apiResponse = null;
        this.cdr.detectChanges();
      }
    });
  }


  testGetList() {
    this.handleResponse(this.webService.getBusinesses(this.testPage));
  }

  testSearch() {
    this.handleResponse(this.webService.searchDevices(this.searchQuery));
  }

  testGetOne() {
    if (!this.testId) { alert('Enter an ID first'); return; }
    this.handleResponse(this.webService.getBusiness(this.testId));
  }

  testDelete() {
    if (!this.testId) { alert('Enter an ID first'); return; }
    if (!confirm('Are you sure? This will delete the device from the DB.')) return;
    
    this.handleResponse(this.webService.deleteDevice(this.testId));
  }

  testUpdate() {
    if (!this.testId) { alert('Enter an ID first'); return; }
    
    const dummyUpdate = {
      name: 'TEST UPDATE ' + new Date().getTime(),
      category: 'Test Category',
      price_usd: 999,
      processor: 'Test Processor'
    };

    this.handleResponse(this.webService.updateDevice(this.testId, dummyUpdate));
  }
}