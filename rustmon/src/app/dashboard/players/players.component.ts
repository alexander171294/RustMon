import { PlayerStorageService } from './../../rustRCON/player-storage.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import {MessageService, ConfirmationService} from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Player, PlayerWithStatus } from 'src/app/rustRCON/Player';
import { RustService } from 'src/app/rustRCON/rust.service';
import { PromptData, PromptService } from '../prompt/prompt.service';
import { UserDataService } from 'src/app/api/user-data.service';
import { Clipboard } from 'src/app/utils/clipboard';
import { faEyeSlash, faStickyNote, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {

  @Input() playerList: PlayerWithStatus[] = [];
  public selctedUser?: Player;
  public userPopup = { x: 0, y: 0, opened: false };
  @Input() onlyOnline?: boolean;
  @Output() onlyOnlineEvt: EventEmitter<boolean> = new EventEmitter<boolean>();

  public playerClicked?: PlayerWithStatus;

  public icons = {
    faExclamationTriangle,
    faEyeSlash,
    faStickyNote
  }

  public playerCols = [
    { field: 'ConnectedSeconds', header: 'Alive', width: '50px' },
    { field: 'DisplayName', header: 'Name', width: '300px'},
    { field: 'Health', header: 'HP', width: '52px' },
    { field: 'Address', header: 'IP', width: '130px' },
    { field: 'Ping', header: 'Lag', width: '30px' }
  ];

  public selectedPlayer: PlayerWithStatus = new PlayerWithStatus();
  ctxMenu: MenuItem[] = [
    { label: 'Admin/Mod', items: [
      { label: 'Make moderator', command: (event) => this.ctxAddMod(this.selectedPlayer) },
      { label: 'Remove moderation', command: (event) => this.ctxRemMod(this.selectedPlayer) },
      { label: 'Make Owner', command: (event) => this.ctxAddOwner(this.selectedPlayer) },
      { label: 'Remove Owner', command: (event) => this.ctxRemOwner(this.selectedPlayer) },
    ]},
    { label: 'Moderation', items: [
      { label: 'Ban', command: (event) => this.ctxBan(this.selectedPlayer) },
      { label: 'Unban', command: (event) => this.ctxUnban(this.selectedPlayer) },
      { label: 'Kick', command: (event) => this.ctxKick(this.selectedPlayer) },
    ]},
    { label: 'Chat', items: [
      { label: 'Mute', command: (event) => this.ctxMute(this.selectedPlayer) },
      { label: 'Unmute', command: (event) => this.ctxUnmute(this.selectedPlayer) },
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
              private promptSrv: PromptService,
              private userDataSrv: UserDataService,
              private playerStorageSrv: PlayerStorageService) { }

  ngOnInit() {
  }

  ctxMute(player: PlayerWithStatus) {
    this.rustSrv.sendCommand('mute ' + player.SteamID);
    this.messageService.add({severity: 'success', summary: 'Muted', detail: player.SteamID + ' | ' + player.DisplayName});
  }


  ctxUnmute(player: PlayerWithStatus) {
    this.rustSrv.sendCommand('unmute ' + player.SteamID);
    this.messageService.add({severity: 'success', summary: 'Unmuted', detail: player.SteamID + ' | ' + player.DisplayName});
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

  ctxUnban(player: PlayerWithStatus) {
    this.rustSrv.sendCommand('unban ' + player.SteamID);
    this.messageService.add({severity: 'success', summary: 'Unbanned', detail: player.SteamID + ' | ' + player.DisplayName});
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

  openUserPopup(user: any, event: any) {
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

  changeOnlineFilter(evt: any) {
    this.onlyOnlineEvt.emit(evt.checked);
  }

  showPlayerData(evt: any, player: PlayerWithStatus, op: OverlayPanel) {
    this.playerClicked = player;
    console.log(this.playerClicked);
    op.toggle(evt);
  }

  clearCache(steamID: string) {
    this.userDataSrv.clearCache(steamID).subscribe(result => {
      if(result == 'OK') {
        this.messageService.add({severity: 'success', summary: 'Cleared cache', detail: steamID});
      } else {
        this.messageService.add({severity: 'warning', summary: 'Error clearing cache', detail: result + ' - ' + steamID});
      }
    });
  }

  getStringFromInputEvent(evt: any): string {
    return evt.target.value;
  }

  saveNote(note: string, steamID: string) {
    this.playerStorageSrv.saveNote(steamID, note);
  }
}
