import { TestBed } from '@angular/core/testing';

import { ConnectionHistoryService } from './connection-history.service';

describe('ConnectionHistoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConnectionHistoryService = TestBed.get(ConnectionHistoryService);
    expect(service).toBeTruthy();
  });
});
