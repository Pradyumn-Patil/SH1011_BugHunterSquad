import { TestBed } from '@angular/core/testing';

import { MarketStatusService } from './market-status.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MarketStatusService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: MarketStatusService = TestBed.get(MarketStatusService);
    expect(service).toBeTruthy();
  });
});
