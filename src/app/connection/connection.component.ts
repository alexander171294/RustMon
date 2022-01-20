import { ChatComponent } from './../chat/chat.component';
import { Player, PlayerWithStatus } from './../rustRCON/Player';
import { REType } from './../rustRCON/RustEvent';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RustService } from '../rustRCON/rust.service';
import { ServerInfo } from '../rustRCON/ServerInfo';
import { ChatMessage } from '../rustRCON/ChatMessage';
import { PlayerStorageService } from '../rustRCON/player-storage.service';
import { MenuItem, MessageService } from 'primeng/api';
import { PromptData, PromptService } from '../ui-kit/prompt/prompt.service';
import { HashParser } from '../utils/hasParser';
import { environment } from 'src/environments/environment';

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
  public isLogged = false;

  // getted values?
  public hasInfo = false;
  public hasStack = false;

  // data variable
  public serverInfo: ServerInfo;
  public chatMessages: ChatMessage[];
  public playerList: PlayerWithStatus[];

  public consoleMessages: string[] = [];

  // form variables.
  public message: string;
  public command: string;

  public onlineFilter = true;
  public openedConfig = false;
  public showTeamMessages = true;

  public version = environment.version;

  cogMenu: boolean = false;

  @ViewChild('chatCompo', {static: false}) chatCompo: ChatComponent;
  @ViewChild('console', {static: false}) consoleBox;

  constructor(private rustSrv: RustService, private psSrv: PlayerStorageService, private promptSrv: PromptService, private messageService: MessageService) { }

  ngOnInit() {
    if (localStorage.getItem('rcon-server')) {
      this.serverIP = localStorage.getItem('rcon-server');
      this.rconPort = parseInt(localStorage.getItem('rcon-port'), 10);
      this.rconPasswd = localStorage.getItem('rcon-password');
    }
    if (window.location.hash) {
      const params = HashParser.getHashParams();
      if(params.server) {
        this.serverIP = params.server;
      }
      if(params.rport) {
        this.rconPort = parseInt(params.rport);
      }
      if(params.password) {
        this.rconPasswd = params.password;
      }
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
        d.data.forEach(msg => {
          const betterChatPlugin = /\[([^\]]+)\]\s([^:]+):(.*)/gi.exec(msg.Message);
          if(betterChatPlugin) {
            msg.Message = betterChatPlugin[3].trim();
            msg.Username = `[${betterChatPlugin[1]}] ${betterChatPlugin[2]}`;
          } else {
            const betterChatPlugin2 = /([^:]+):(.*)/gi.exec(msg.Message);
            if(betterChatPlugin2 && betterChatPlugin2[1].trim() == msg.Username.trim()) {
              msg.Message = betterChatPlugin2[2].trim();
              msg.Username = `${betterChatPlugin2[1]}`;
            }
          }
        });
        this.chatMessages = d.data;
        if (this.hasInfo && !this.isLogged) {
          this.logIn();
        }
        setTimeout(() => {
          this.chatCompo.goToDown();
        }, 100);
      }
      if (d.type === REType.PLAYERS) {
        this.playerList = this.psSrv.savePlayerList(d.data, this.onlineFilter);
      }
      if (d.rawtype === 'Chat') {
        const betterChatPlugin = /\[([^\]]+)\]\s([^:]+):(.*)/gi.exec(d.data.Message);
        if(betterChatPlugin) {
          d.data.Message = betterChatPlugin[3].trim();
          d.data.Username = `[${betterChatPlugin[1]}] ${betterChatPlugin[2]}`;
          this.chatMessages.push(d.data);
        } else {
          this.chatMessages.push(d.data);
        }
        setTimeout(() => {
          this.chatCompo.goToDown();
        }, 100);
      }
      if (d.type === REType.UNKOWN) {
        this.consoleMessages.push(d.raw.trim());
        setTimeout(() => {
          this.consoleBox.nativeElement.scrollTop = this.consoleBox.nativeElement.scrollHeight;
        }, 100);
      }
      if (d.type === REType.BAN_LIST) {
        this.consoleMessages.push('Banlist: ' + d.raw);
        setTimeout(() => {
          console.log(this.consoleBox);
          this.consoleBox.nativeElement.scrollTop = this.consoleBox.nativeElement.scrollHeight;
        }, 100);
      }
      if (d.type === REType.DISCONNECT || d.type == REType.ERROR) {
        this.isLogged = false;
        this.messageService.add({severity: 'error', summary: 'Disconnected', detail: 'Disconnected from server.'});
      }
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

  sendCMD(cmd: string) {
    this.rustSrv.sendCommand(cmd);
    document.getElementById('commandInput').focus();
  }

  writeCMD(cmd: string) {
    this.command = cmd;
    document.getElementById('commandInput').focus();
  }

  testCommand() {
    this.rustSrv.sendCommand(this.command);
    this.command = '';
    document.getElementById('commandInput').focus();
  }

  kp(evt) {
    if(evt.keyCode == 13) {
      this.testCommand();
    }
  }

  restart() {
    this.promptSrv.openPrompt(new PromptData('Seconds before restart.', '15')).then(time => {
      this.promptSrv.openPrompt(new PromptData('Reason for restart.', 'restart for update')).then(reason => {
        this.rustSrv.sendCommand(`restart ${time} ${reason}`);
      }).catch(e => {
        // cancelled
      });
    }).catch(e => {
      // cancelled
    });
  }

  skipQueue() {
    this.promptSrv.openPrompt(new PromptData('Put the 64 steamID', '76561100000000000')).then(steamID => {
      this.rustSrv.sendCommand('skipqueue ' + steamID);
    });
  }

  unban() {
    this.promptSrv.openPrompt(new PromptData('Put the steamID')).then(steamID => {
      this.rustSrv.sendCommand('unban ' + steamID);
    });
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
    setInterval(() => {
      this.players();
    }, 3500);
  }

  config() {
    this.openedConfig = true;
  }

  help() {
    window.open('https://www.corrosionhour.com/rust-admin-commands/', "__blank");
  }

  kpConn(evt) {
    if(evt.keyCode == 13) {
      this.connect();
    }
  }

  changeFilterOnline(onlineFilter: boolean) {
    this.onlineFilter = onlineFilter;
    this.players();
  }

  github() {
    window.open('https://github.com/alexander171294/RustMon', "__blank");
  }
}
