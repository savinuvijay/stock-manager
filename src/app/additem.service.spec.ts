import { TestBed, inject } from '@angular/core/testing';

import { AdditemService } from './additem.service';

describe('AdditemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdditemService]
    });
  });

  it('should be created', inject([AdditemService], (service: AdditemService) => {
    expect(service).toBeTruthy();
  }));
});
