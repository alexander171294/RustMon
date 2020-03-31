import { TestBed } from '@angular/core/testing';

import { RustService } from './rust.service';

describe('RustService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RustService = TestBed.get(RustService);
    expect(service).toBeTruthy();
  });
});
