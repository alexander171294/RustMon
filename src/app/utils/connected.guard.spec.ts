import { TestBed, async, inject } from '@angular/core/testing';

import { ConnectedGuard } from './connected.guard';

describe('ConnectedGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConnectedGuard]
    });
  });

  it('should ...', inject([ConnectedGuard], (guard: ConnectedGuard) => {
    expect(guard).toBeTruthy();
  }));
});
