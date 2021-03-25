import { TestBed } from '@angular/core/testing';

import { IPGeocodeService } from './ipgeocode.service';

describe('IPGeocodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IPGeocodeService = TestBed.get(IPGeocodeService);
    expect(service).toBeTruthy();
  });
});
