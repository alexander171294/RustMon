import { PlayerWithStatus } from './../rustRCON/Player';
import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../rustRCON/Player';
import { RustService } from '../rustRCON/rust.service';
import { MenuItem } from 'primeng/api/menuitem';
import {MessageService, ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {

  @Input() playerList: PlayerWithStatus[];
  public selctedUser: Player;
  public userPopup = { x: 0, y: 0, opened: false };
  @Input() onlyOnline: boolean;

  public playerCols = [
    { field: 'ConnectedSeconds', header: 'Time', width: '72px' },
    { field: 'DisplayName', header: 'Name', width: '260px'},
    { field: 'Health', header: 'HP', width: '52px' },
    { field: 'Address', header: 'IP', width: '122px' },
    { field: 'Ping', header: 'Ping', width: '61px' }
  ];

  public selectedPlayer: PlayerWithStatus;
  ctxMenu: MenuItem[] = [
    { label: 'Owner?', command: (event) => this.ctxOwner(this.selectedPlayer) }, //, icon: 'pi pi-search'
    { label: 'Mod?', command: (event) => this.ctxMod(this.selectedPlayer) },
    { label: 'Ban', command: (event) => this.ctxBan(this.selectedPlayer) },
    { label: 'Kick', command: (event) => this.ctxKick(this.selectedPlayer) },
    { label: 'Steam Profile', command: (event) => this.ctxSteamProfile(this.selectedPlayer) },
    { label: 'Copy STEAMID', command: (event) => this.ctxSteamID(this.selectedPlayer)}
  ];

  constructor(private rustSrv: RustService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
  }

  ctxOwner(player: PlayerWithStatus) {
    this.confirmationService.confirm({
      header: 'Action selection',
      message: 'What do you want?',
      acceptLabel: 'Add admin',
      rejectLabel: 'Remove admin',
      accept: () => {
        this.doOwner(player.SteamID, player.DisplayName);
        this.messageService.add({severity: 'success', summary: 'Added moderator', detail: player.SteamID + ' | ' + player.DisplayName});
      },
      reject: () => {
        this.unOwner(player.SteamID);
        this.messageService.add({severity: 'success', summary: 'Removed moderator', detail: player.SteamID + ' | ' + player.DisplayName});
      }
    });
  }

  ctxMod(player: PlayerWithStatus) {
    this.confirmationService.confirm({
      message: 'What do you want?',
      acceptLabel: 'Add mod',
      rejectLabel: 'Remove mod',
      accept: () => {
        this.doMod(player.SteamID, player.DisplayName);
        this.messageService.add({severity: 'success', summary: 'Added admin', detail: player.SteamID + ' | ' + player.DisplayName});
      },
      reject: () => {
        this.unMod(player.SteamID);
        this.messageService.add({severity: 'success', summary: 'Removed admin', detail: player.SteamID + ' | ' + player.DisplayName});
      }
    });
  }

  ctxBan(player: PlayerWithStatus) {
    this.ban(player.SteamID, player.DisplayName);
    this.messageService.add({severity: 'success', summary: 'Banned', detail: player.SteamID + ' | ' + player.DisplayName});
  }

  ctxKick(player: PlayerWithStatus) {
    this.kick(player.SteamID);
    this.messageService.add({severity: 'success', summary: 'Kicked', detail: player.SteamID + ' | ' + player.DisplayName});
  }

  ctxSteamProfile(player: PlayerWithStatus) {
    window.open('https://steamcommunity.com/profiles/' + player.SteamID, '_blank');
  }

  ctxSteamID(player: PlayerWithStatus) {
    navigator.clipboard.writeText(player.SteamID);
    this.messageService.add({severity: 'success', summary: 'Copied to clipboard.', detail: player.SteamID + ' | ' + player.DisplayName});
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
    // alert('El usuario debe reloguear para que impacten los cambios.');
  }

  doMod(steamID: string, name: string) {
    this.userPopup.opened = false;
    this.rustSrv.sendCommand('moderatorid ' + steamID + ' ' + name);
    // alert('El usuario debe reloguear para que impacten los cambios.');
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

  unOwner(steamID: string) {
    this.rustSrv.sendCommand('removeowner ' + steamID);
  }

  unMod(steamID: string) {
    this.rustSrv.sendCommand('removemoderator ' + steamID);
  }

  testToast() {
    alert();
    this.messageService.add({severity: 'success', summary: 'Kicked', detail: 'Probando'});
  }

}
