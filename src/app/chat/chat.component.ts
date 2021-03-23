import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ChatMessage } from '../rustRCON/ChatMessage';
import { OverlayPanel } from 'primeng/overlaypanel';
import { MenuItem, MessageService } from 'primeng/api';
import { RustService } from '../rustRCON/rust.service';
import { PromptData, PromptService } from '../ui-kit/prompt/prompt.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  ctxMenu: MenuItem[] = [
    { label: 'Ban', command: (event) => this.ctxBan(event) },
    { label: 'Kick', command: (event) => this.ctxKick(event) },
    { label: 'Steam Profile', command: (event) => this.ctxSteamProfile(event) },
    { label: 'Copy STEAMID', command: (event) => this.ctxSteamID(event)},
    { label: 'Copy Message', command: (event) => this.ctxMessage(event)}
  ];

  @Input() chatMessages: ChatMessage[];
  clickedMessage: ChatMessage;
  contextMessage: ChatMessage;

  @ViewChild('chat', {static: true}) chatBox;

  constructor(private rustSrv: RustService, private messageService: MessageService, private promptSrv: PromptService) { }

  ngOnInit() {
  }

  showData(evt, message: ChatMessage, overlaypanel: OverlayPanel) {
    this.clickedMessage = message;
    overlaypanel.toggle(evt);
  }

  goToDown() {
    this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
  }

  ctxBan(evt) {
    if(this.contextMessage) {
      this.ban(this.contextMessage.UserId, this.contextMessage.Username);
    }
    this.contextMessage = undefined;
  }

  ctxKick(evt) {
    if(this.contextMessage) {
      this.kick(this.contextMessage.UserId, this.contextMessage.Username);
    }
    this.contextMessage = undefined;
  }

  ctxSteamProfile(evt) {
    if(this.contextMessage) {
      window.open('https://steamcommunity.com/profiles/' + this.contextMessage.UserId, '_blank');
    }
    this.contextMessage = undefined;
  }

  ctxSteamID(evt) {
    if(this.contextMessage) {
      navigator.clipboard.writeText(this.contextMessage.UserId);
      this.messageService.add({severity: 'success', summary: 'Copied to clipboard.', detail: this.contextMessage.UserId + ' | ' + this.contextMessage.Username});
    }
    this.contextMessage = undefined;
  }

  ctxMessage(evt) {
    if(this.contextMessage) {
      const message = '['+this.contextMessage.UserId+']('+this.contextMessage.Username+'): ' + this.contextMessage.Message;
      navigator.clipboard.writeText(message);
      this.messageService.add({severity: 'success', summary: 'Copied to clipboard.', detail: message});
    }
    this.contextMessage = undefined;
  }

  ctxSelect(message, $event) {
    this.contextMessage = message;
  }

  ban(steamID: string, name: string) {
    this.promptSrv.openPrompt(new PromptData('ban('+name+') Write the reason:')).then(reason => {
      this.rustSrv.sendCommand('banid ' + steamID + ' "' + name + '" "' + reason + '"');
      this.messageService.add({severity: 'success', summary: 'Banned', detail: this.contextMessage.UserId + ' | ' + this.contextMessage.Username});
    });
  }

  kick(steamID: string, name: string) {
    this.promptSrv.openPrompt(new PromptData('kick('+name+') Write the reason:')).then(reason => {
      this.rustSrv.sendCommand('kick ' + steamID + ' "' + reason + '"');
      this.messageService.add({severity: 'success', summary: 'Banned', detail: this.contextMessage.UserId + ' | ' + this.contextMessage.Username});
    });
  }

}
