import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ChatMessage } from '../rustRCON/ChatMessage';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @Input() chatMessages: ChatMessage[];
  clickedMessage: ChatMessage;

  @ViewChild('chat', {static: true}) chatBox;

  constructor() { }

  ngOnInit() {
  }

  showData(evt, message: ChatMessage, overlaypanel: OverlayPanel) {
    this.clickedMessage = message;
    overlaypanel.toggle(evt);
  }

  goToDown() {
    this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
  }

}
