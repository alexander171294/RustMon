import { PlayerWithStatus } from './../rustRCON/Player';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Player } from '../rustRCON/Player';
import { RustService } from '../rustRCON/rust.service';
import { MenuItem } from 'primeng/api/menuitem';
import {MessageService, ConfirmationService} from 'primeng/api';
import { PromptData, PromptService } from '../ui-kit/prompt/prompt.service';
import { Clipboard } from '../utils/clipboard';

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
  @Output() onlyOnlineEvt: EventEmitter<boolean> = new EventEmitter<boolean>();;

  public playerCols = [
    { field: 'ConnectedSeconds', header: 'Time', width: '72px' },
    { field: 'DisplayName', header: 'Name', width: '260px'},
    { field: 'Health', header: 'HP', width: '52px' },
    { field: 'Address', header: 'IP', width: '122px' },
    { field: 'Ping', header: 'Ping', width: '61px' }
  ];

  public selectedPlayer: PlayerWithStatus;
  ctxMenu: MenuItem[] = [
    { label: 'Admin/Mod', items: [
      { label: 'Make moderator', command: (event) => this.ctxAddMod(this.selectedPlayer) },
      { label: 'Remove moderation', command: (event) => this.ctxRemMod(this.selectedPlayer) },
      { label: 'Make Owner', command: (event) => this.ctxAddOwner(this.selectedPlayer) },
      { label: 'Remove Owner', command: (event) => this.ctxRemOwner(this.selectedPlayer) },
    ]},
    { label: 'Moderation', items: [
      { label: 'Ban', command: (event) => this.ctxBan(this.selectedPlayer) },
      { label: 'Kick', command: (event) => this.ctxKick(this.selectedPlayer) },
    ]},
    { label: 'TeamInfo', command: (event) => this.ctxTeamInfo(this.selectedPlayer.SteamID) },
    { label: 'Steam', items: [
      { label: 'Open Profile', command: (event) => this.ctxSteamProfile(this.selectedPlayer) },
      { label: 'Copy SteamID', command: (event) => this.ctxSteamID(this.selectedPlayer)}
    ]},

  ];

  constructor(private rustSrv: RustService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private promptSrv: PromptService) { }

  ngOnInit() {
  }


  ctxAddOwner(player: PlayerWithStatus) {
    this.confirmationService.confirm({
      message: `Converting ${player.DisplayName} in owner, Are you sure?`,
      accept: () => {
        this.doOwner(player.SteamID, player.DisplayName);
        this.messageService.add({severity: 'success', summary: 'Added admin', detail: player.SteamID + ' | ' + player.DisplayName});
      }
    });
  }

  ctxRemOwner(player: PlayerWithStatus) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to remove ownership from ${player.DisplayName}?`,
      accept: () => {
        this.unOwner(player.SteamID);
        this.messageService.add({severity: 'success', summary: 'Removed owner', detail: player.SteamID + ' | ' + player.DisplayName});
      }
    });
  }

  ctxAddMod(player: PlayerWithStatus) {
    this.confirmationService.confirm({
      message: `Converting ${player.DisplayName} in moderator, Are you sure?`,
      accept: () => {
        this.doMod(player.SteamID, player.DisplayName);
        this.messageService.add({severity: 'success', summary: 'Added admin', detail: player.SteamID + ' | ' + player.DisplayName});
      }
    });
  }

  ctxRemMod(player: PlayerWithStatus) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to remove moderator ${player.DisplayName}?`,
      accept: () => {
        this.unMod(player.SteamID);
        this.messageService.add({severity: 'success', summary: 'Removed admin', detail: player.SteamID + ' | ' + player.DisplayName});
      }
    });
  }

  ctxBan(player: PlayerWithStatus) {
    this.ban(player.SteamID, player.DisplayName);
  }

  ctxKick(player: PlayerWithStatus) {
    this.kick(player.SteamID);
  }

  ctxSteamProfile(player: PlayerWithStatus) {
    window.open('https://steamcommunity.com/profiles/' + player.SteamID, '_blank');
  }

  ctxSteamID(player: PlayerWithStatus) {
    if(Clipboard.writeText(player.SteamID)) {
      this.messageService.add({severity: 'success', summary: 'Copied to clipboard.', detail: player.SteamID + ' | ' + player.DisplayName});
    } else {
      this.messageService.add({severity: 'info', summary: 'Clipboard disabled :(', detail: player.SteamID + ' | ' + player.DisplayName});
    }
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
  }

  doMod(steamID: string, name: string) {
    this.userPopup.opened = false;
    this.rustSrv.sendCommand('moderatorid ' + steamID + ' ' + name);
  }

  ban(steamID: string, name: string) {
    this.userPopup.opened = false;
    this.promptSrv.openPrompt(new PromptData('Write the reason:')).then(reason => {
      this.rustSrv.sendCommand('banid ' + steamID + ' "' + name + '" "' + reason + '"');
      this.messageService.add({severity: 'success', summary: 'Banned', detail: steamID + ' | ' + name});
    });
  }

  kick(steamID: string) {
    this.userPopup.opened = false;
    this.promptSrv.openPrompt(new PromptData('Write the reason:')).then(reason => {
      this.rustSrv.sendCommand('kick ' + steamID + ' "' + reason + '"');
      this.messageService.add({severity: 'success', summary: 'Kicked', detail: steamID + ' | ' + name});
    });
  }

  ctxTeamInfo(steamID: string) {
    this.rustSrv.sendCommand('teaminfo ' + steamID);
  }

  unOwner(steamID: string) {
    this.rustSrv.sendCommand('removeowner ' + steamID);
  }

  unMod(steamID: string) {
    this.rustSrv.sendCommand('removemoderator ' + steamID);
  }

  changeOnlineFilter(evt) {
    this.onlyOnlineEvt.emit(evt.checked);
  }

}
