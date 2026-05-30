import { TestBed } from '@angular/core/testing';

import { MeatScan } from './meat-scan';

describe('MeatScan', () => {
  let service: MeatScan;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeatScan);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
