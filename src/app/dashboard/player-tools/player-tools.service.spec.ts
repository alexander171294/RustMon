import { TestBed } from '@angular/core/testing';

import { PlayerToolsService } from './player-tools.service';

describe('PlayerToolsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlayerToolsService = TestBed.get(PlayerToolsService);
    expect(service).toBeTruthy();
  });
});
