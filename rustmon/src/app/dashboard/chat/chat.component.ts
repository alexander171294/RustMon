import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { MenuItem, MessageService } from 'primeng/api';
import { ChatMessage } from 'src/app/rustRCON/ChatMessage';
import { RustService } from 'src/app/rustRCON/rust.service';
import { Clipboard } from 'src/app/utils/clipboard';
import { PromptData, PromptService } from '../prompt/prompt.service';
import { PlayerStorageService } from 'src/app/rustRCON/player-storage.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  ctxMenu: MenuItem[] = [
    { label: 'Chat', items: [
      { label: 'Mute', command: (event) => this.ctxMute(event) },
      { label: 'Unmute', command: (event) => this.ctxUnmute(event) },
    ]},
    { label: 'Moderation', items: [
      { label: 'Ban', command: (event) => this.ctxBan(event) },
      { label: 'Kick', command: (event) => this.ctxKick(event) },
    ]},
    { label: 'TeamInfo', command: (event) => this.ctxTeamInfo(event) },
    { label: 'Steam', items: [
      { label: 'Steam Profile', command: (event) => this.ctxSteamProfile(event) },
      { label: 'Copy STEAMID', command: (event) => this.ctxSteamID(event)},
    ]},
    { label: 'Copy Message', command: (event) => this.ctxMessage(event)}
  ];

  @Input() chatMessages?: ChatMessage[];
  @Input() showTeamMessages?: boolean;
  clickedMessage?: ChatMessage;
  contextMessage?: ChatMessage;

  @ViewChild('chat', {static: true}) chatBox: any;

  constructor(private rustSrv: RustService,
              private messageService: MessageService,
              private promptSrv: PromptService,
              private playerStrg: PlayerStorageService) { }

  ngOnInit() {
  }

  getAvatar(id: string) {
    const user = this.playerStrg.getCachedUData(id);
    return user.userData && user.userData.avatarmedium ? user.userData.avatarmedium : '/favicon.png';
  }

  showData(evt: any, message: ChatMessage, overlaypanel: OverlayPanel) {
    this.clickedMessage = message;
    overlaypanel.toggle(evt);
  }

  goToDown() {
    this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
  }

  ctxBan(evt: any) {
    if(this.contextMessage) {
      this.ban(this.contextMessage.UserId, this.contextMessage.Username);
    }
    this.contextMessage = undefined;
  }

  ctxKick(evt: any) {
    if(this.contextMessage) {
      this.kick(this.contextMessage.UserId, this.contextMessage.Username);
    }
    this.contextMessage = undefined;
  }

  ctxMute(evt: any) {
    if(this.contextMessage) {
      this.rustSrv.sendCommand('mute ' + this.contextMessage.UserId);
      this.messageService.add({severity: 'success', summary: 'Muted', detail: this.contextMessage.UserId + ' | ' + this.contextMessage.Username});
    }
    this.contextMessage = undefined;
  }


  ctxUnmute(evt: any) {
    if(this.contextMessage) {
      this.rustSrv.sendCommand('unmute ' + this.contextMessage.UserId);
      this.messageService.add({severity: 'success', summary: 'Unmuted', detail: this.contextMessage.UserId + ' | ' + this.contextMessage.Username});
    }
    this.contextMessage = undefined;
  }

  ctxTeamInfo(evt: any) {
    if(this.contextMessage) {
      this.rustSrv.sendCommand('teaminfo ' + this.contextMessage.UserId);
    }
    this.contextMessage = undefined;
  }

  ctxSteamProfile(evt: any) {
    if(this.contextMessage) {
      window.open('https://steamcommunity.com/profiles/' + this.contextMessage.UserId, '_blank');
    }
    this.contextMessage = undefined;
  }

  ctxSteamID(evt: any) {
    if(this.contextMessage) {
      if(Clipboard.writeText(this.contextMessage.UserId)) {
        this.messageService.add({severity: 'success', summary: 'Copied to clipboard.', detail: this.contextMessage.UserId + ' | ' + this.contextMessage.Username});
      } else {
        this.messageService.add({severity: 'info', summary: 'Clipboard disabled :(.', detail: this.contextMessage.UserId + ' | ' + this.contextMessage.Username});
      }
    }
    this.contextMessage = undefined;
  }

  ctxMessage(evt: any) {
    if(this.contextMessage) {
      const message = '['+this.contextMessage.UserId+']('+this.contextMessage.Username+'): ' + this.contextMessage.Message;
      if(Clipboard.writeText(message)) {
        this.messageService.add({severity: 'success', summary: 'Copied to clipboard.', detail: message});
      } else {
        this.messageService.add({severity: 'info', summary: 'Clipboard disabled :(', detail: message});
      }
    }
    this.contextMessage = undefined;
  }

  ctxSelect(message: ChatMessage, $event: any) {
    this.contextMessage = message;
  }

  ban(steamID: string, name: string) {
    this.promptSrv.openPrompt(new PromptData('ban('+name+') Write the reason:')).then(reason => {
      this.rustSrv.sendCommand('banid ' + steamID + ' "' + name + '" "' + reason + '"');
      this.messageService.add({severity: 'success', summary: 'Banned', detail: this.contextMessage?.UserId + ' | ' + this.contextMessage?.Username});
    });
  }

  kick(steamID: string, name: string) {
    this.promptSrv.openPrompt(new PromptData('kick('+name+') Write the reason:')).then(reason => {
      this.rustSrv.sendCommand('kick ' + steamID + ' "' + reason + '"');
      this.messageService.add({severity: 'success', summary: 'Banned', detail: this.contextMessage?.UserId + ' | ' + this.contextMessage?.Username});
    });
  }

}
