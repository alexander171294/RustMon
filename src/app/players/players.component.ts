import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../rustRCON/Player';
import { RustService } from '../rustRCON/rust.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {

  @Input() playerList: Player[];
  public selctedUser: Player;
  public userPopup = { x: 0, y: 0, opened: false };

  public playerCols = [
    { field: 'ConnectedSeconds', header: 'Time', width: '94px' },
    { field: 'DisplayName', header: 'Name', width: '150px'},
    { field: 'Health', header: 'HP', width: '50px' },
    { field: 'Address', header: 'IP', width: '135px' },
    { field: 'Ping', header: 'Ping', width: '50px' }
  ];

  constructor(private rustSrv: RustService) { }

  ngOnInit() {
  }

  openUserPopup(user, event) {
    this.selctedUser = user;
    this.userPopup = {
      x: event.clientX + 20,
      y: event.clientY + 20,
      opened: true
    };
    console.log(event.offsetX, event);
  }

  doOwner(steamID: string, name: string) {
    this.userPopup.opened = false;
    this.rustSrv.sendCommand('ownerid ' + steamID + ' ' + name);
    alert('El usuario debe reloguear para que impacten los cambios.');
  }

  doMod(steamID: string, name: string) {
    this.userPopup.opened = false;
    this.rustSrv.sendCommand('moderatorid ' + steamID + ' ' + name);
    alert('El usuario debe reloguear para que impacten los cambios.');
  }

  ban(steamID: string, name: string) {
    this.userPopup.opened = false;
    const reason = prompt('Ingrese la razon');
    if (reason) {
      this.rustSrv.sendCommand('banid ' + steamID + ' ' + name + ' ' + reason);
    }
  }

  kick(steamID: string) {
    this.userPopup.opened = false;
    const reason = prompt('Ingrese la razon');
    if (reason) {
      this.rustSrv.sendCommand('kick ' + steamID + ' ' + reason);
    }
  }

  unOwner() {
    const steamID = prompt('Ingrese el steamID');
    if (steamID) {
      this.rustSrv.sendCommand('removeowner ' + steamID);
    }
  }

  unMod() {
    const steamID = prompt('Ingrese el steamID');
    if (steamID) {
      this.rustSrv.sendCommand('removemoderator ' + steamID);
    }
  }

}
