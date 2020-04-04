import { Player } from './../rustRCON/Player';
import { REType } from './../rustRCON/RustEvent';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RustService } from '../rustRCON/rust.service';
import { ServerInfo } from '../rustRCON/ServerInfo';
import { ChatMessage } from '../rustRCON/ChatMessage';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

  public serverIP: string;
  public rconPort: number;
  public rconPasswd: string;

  // login?
  public loginLoading: boolean;
  public isLogged: boolean = false;

  // getted values?
  public hasInfo: boolean = false;
  public hasStack: boolean = false;

  // data variable
  public serverInfo: ServerInfo;
  public chatMessages: ChatMessage[];
  public playerList: Player[];

  public consoleMessages: string[] = [];

  // form variables.
  public message: string;
  public command: string;

  @ViewChild('chat', {static: false}) chatBox;
  @ViewChild('console', {static: false}) consoleBox;

  constructor(private rustSrv: RustService) { }

  ngOnInit() {
    if (localStorage.getItem('rcon-server')) {
      this.serverIP = localStorage.getItem('rcon-server');
      this.rconPort = parseInt(localStorage.getItem('rcon-port'), 10);
      this.rconPasswd = localStorage.getItem('rcon-password');
    }
  }

  connect() {
    this.loginLoading = true;
    localStorage.setItem('rcon-server', this.serverIP);
    localStorage.setItem('rcon-port', this.rconPort.toString());
    localStorage.setItem('rcon-password', this.rconPasswd);
    this.rustSrv.connect(this.serverIP, this.rconPort, this.rconPasswd).subscribe(d => {
      if (d.type === REType.UNKOWN) {
        // show in console.
      }
      if (d.type === REType.GET_INFO) {
        // console.log('Information: ', d.data);
        this.hasInfo = true;
        this.serverInfo = d.data;
        if (this.hasStack && !this.isLogged) {
          this.logIn();
        }
      }
      if (d.type === REType.CHAT_STACK) {
        console.log('Chat Stack: ', d.data);
        this.hasStack = true;
        this.chatMessages = d.data;
        if (this.hasInfo && !this.isLogged) {
          this.logIn();
        }
        setTimeout(() => {
          this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
        }, 100);
      }
      if (d.type === REType.PLAYERS) {
        this.playerList = d.data;
      }
      if (d.rawtype === 'Chat') {
        this.chatMessages.push(d.data);
        console.log(this.chatBox.nativeElement);
        setTimeout(() => {
          this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
        }, 100);
      }
      if (d.type === REType.UNKOWN) {
        this.consoleMessages.push(d.raw);
        setTimeout(() => {
          this.consoleBox.nativeElement.scrollTop = this.consoleBox.nativeElement.scrollHeight;
        }, 100);
      }
      if (d.type === REType.BAN_LIST) {
        this.consoleMessages.push('Banlist: ' + d.raw);
        setTimeout(() => {
          this.consoleBox.nativeElement.scrollTop = this.consoleBox.nativeElement.scrollHeight;
        }, 100);
      }
      // if (d.type === REType.)
    });
  }

  info() {
    this.rustSrv.getInfo();
  }

  send() {
    this.rustSrv.sendCommand(this.command);
    this.command = '';
  }

  players() {
    this.rustSrv.players();
  }

  sendMessage() {
    this.rustSrv.sendCommand('say ' + this.message);
    this.message = '';
  }

  chatKp(evt) {
    console.log(evt);
    if (evt.keyCode === 13) {
      this.sendMessage();
    }
  }

  testCommand() {
    this.rustSrv.sendCommand(this.command);
    this.command = '';
  }

  restart() {
    const time = prompt('Segundos antes del reinicio');
    if (time) {
      this.rustSrv.sendCommand('restart');
    }
  }

  unban() {
    const steamID = prompt('Ingrese el steamID');
    if (steamID) {
      this.rustSrv.sendCommand('unban ' + steamID);
    }
  }

  banlist() {
    this.rustSrv.banList();
  }

  logIn() {
    this.isLogged = true;
    setInterval(() => {
      this.info();
    }, 1000);
    this.players();
    // setInterval(() => {
    //   this.players();
    // }, 3500);
  }

  config() {
    alert('proximamente');
  }

  help() {
    alert('proximamente');
  }
}
