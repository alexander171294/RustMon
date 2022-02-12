import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PlayerToolsService } from './player-tools.service';

@Component({
  selector: 'app-player-tools',
  templateUrl: './player-tools.component.html',
  styleUrls: ['./player-tools.component.scss']
})
export class PlayerToolsComponent implements OnInit {

  @Output()
  public close: EventEmitter<void> = new EventEmitter<void>();

  public maxPingAllowed: number = 0;
  public message: string = '';

  public tab = 0;

  constructor(private playerTool: PlayerToolsService) { }

  ngOnInit() {
    const autokick = this.playerTool.getAutoKick();
    if(autokick) {
      this.maxPingAllowed = autokick.ping;
      this.message = autokick.message;
    }
  }

  save() {
    this.playerTool.saveAutoKick(this.maxPingAllowed, this.message);
    this.close.emit();
  }

}
