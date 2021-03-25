import { TestBed } from '@angular/core/testing';

import { ValveApiService } from './valve-api.service';

describe('ValveApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ValveApiService = TestBed.get(ValveApiService);
    expect(service).toBeTruthy();
  });
});
