import { TestBed } from '@angular/core/testing';

import { KnmiService } from './knmi.service';

describe('KnmiService', () => {
  let service: KnmiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KnmiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
