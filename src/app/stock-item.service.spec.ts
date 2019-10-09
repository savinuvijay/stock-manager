import { TestBed, inject } from '@angular/core/testing';

import { StockItemService } from './stock-item.service';

describe('StockItemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StockItemService]
    });
  });

  it('should be created', inject([StockItemService], (service: StockItemService) => {
    expect(service).toBeTruthy();
  }));
});
