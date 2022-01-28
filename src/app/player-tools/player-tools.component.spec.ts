import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerToolsComponent } from './player-tools.component';

describe('PlayerToolsComponent', () => {
  let component: PlayerToolsComponent;
  let fixture: ComponentFixture<PlayerToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
