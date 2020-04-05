import { TestBed } from '@angular/core/testing';

import { PlayerStorageService } from './player-storage.service';

describe('PlayerStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlayerStorageService = TestBed.get(PlayerStorageService);
    expect(service).toBeTruthy();
  });
});
