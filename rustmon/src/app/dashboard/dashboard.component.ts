import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChatMessage } from '../rustRCON/ChatMessage';
import { PlayerWithStatus } from '../rustRCON/Player';
import { PlayerStorageService } from '../rustRCON/player-storage.service';
import { RustService } from '../rustRCON/rust.service';
import { REType } from '../rustRCON/RustEvent';
import { ServerInfo } from '../rustRCON/ServerInfo';
import { ChatComponent } from './chat/chat.component';
import { PlayerToolsService } from './player-tools/player-tools.service';
import { PromptData, PromptService } from './prompt/prompt.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  // data variable
  public serverInfo: ServerInfo = new ServerInfo();
  public chatMessages?: ChatMessage[];
  public playerList?: PlayerWithStatus[];
  public consoleMessages: string[] = [];
  public connectionString: any;

  // flags variables
  public hasInfo = false;
  public hasStack = false;
  public openedConfig = false;
  public showTeamMessages = true;
  public playerToolsOpened = false;
  public cogMenu = false;
  public ready = false;

  // grid filter:
  public onlineFilter = true;

  // form variables.
  public message: string = '';
  public command: string = '';

  public version = environment.version;

  private subscription?: Subscription;

  @ViewChild('chatCompo', {static: false}) chatCompo?: ChatComponent;
  @ViewChild('console', {static: false}) consoleBox: any;

  constructor(private rustSrv: RustService,
              private psSrv: PlayerStorageService,
              private playerTool: PlayerToolsService,
              private messageService: MessageService,
              private router: Router,
              private promptSrv: PromptService) { }

  ngOnInit() {
    this.connectionString = this.rustSrv.getConnectionString();
    this.subscription = this.rustSrv.getEvtRust().subscribe(d => {
      if (d.type === REType.UNKOWN) {
        // show in console.
      }
      if (d.type === REType.GET_INFO) {
        this.hasInfo = true;
        this.serverInfo = d.data;
      }
      if (d.type === REType.CHAT_STACK) {
        this.hasStack = true;
        d.data.forEach((msg: any) => {
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
        setTimeout(() => {
          this.chatCompo?.goToDown();
        }, 100);
      }
      if (d.type === REType.PLAYERS) {
        this.playerList = this.psSrv.savePlayerList(d.data, this.onlineFilter);
        const autokick = this.playerTool.getAutoKick();
        if(autokick && autokick.ping > 0) {
          this.playerList.forEach(user => {
            if(user.Ping > autokick.ping) {
              this.rustSrv.sendCommand('kick ' + user.SteamID + ' "' + autokick.message.replace('%ping', user.Ping.toString()) + '"');
            }
          });
        }
        this.ready = true;
      }
      if (d.rawtype === 'Chat') {
        const betterChatPlugin = /\[([^\]]+)\]\s([^:]+):(.*)/gi.exec(d.data.Message);
        if(betterChatPlugin) {
          d.data.Message = betterChatPlugin[3].trim();
          d.data.Username = `[${betterChatPlugin[1]}] ${betterChatPlugin[2]}`;
          this.recordChatMessage(d.data);
        } else {
          const betterChatPlugin2 = /([^:]+):(.*)/gi.exec(d.data.Message);
          if(betterChatPlugin2 && betterChatPlugin2[1].trim() == d.data.Username.trim()) {
            d.data.Message = betterChatPlugin2[2].trim();
            d.data.Username = `${betterChatPlugin2[1]}`;
            this.recordChatMessage(d.data);
          } else {
            this.recordChatMessage(d.data);
          }
        }
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
      if (d.type === REType.DISCONNECT || d.type === REType.ERROR) {
        console.log('ERROR', d);
        this.messageService.add({severity: 'error', summary: 'Disconnected', detail: 'Disconnected from server.'});
        this.router.navigateByUrl('/login');
      }
    });
    this.rustSrv.frontThreadReady();
    this.setRefreshCommands();
  }

  setRefreshCommands() {
    setInterval(() => {
      this.info();
    }, 1000);
    this.players();
    setInterval(() => {
      this.players();
    }, 3500);
  }

  players() {
    this.rustSrv.players();
  }

  info() {
    this.rustSrv.getInfo();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }


  send() {
    this.rustSrv.sendCommand(this.command);
    this.command = '';
  }

  sendMessage() {
    this.rustSrv.sendCommand('say ' + this.message);
    this.message = '';
  }

  chatKp(evt: any) {
    if (evt.keyCode === 13) {
      this.sendMessage();
    }
  }

  sendCMD(cmd: string) {
    this.rustSrv.sendCommand(cmd);
    document.getElementById('commandInput')?.focus();
  }

  writeCMD(cmd: string) {
    this.command = cmd;
    document.getElementById('commandInput')?.focus();
  }

  testCommand() {
    this.rustSrv.sendCommand(this.command);
    this.command = '';
    document.getElementById('commandInput')?.focus();
  }

  kp(evt: any) {
    if(evt.keyCode == 13) {
      this.testCommand();
    }
  }

  restart() {
    this.promptSrv.openPrompt(new PromptData('Seconds before restart.', '15')).then(time => {
      this.promptSrv.openPrompt(new PromptData('Reason for restart.', 'restart for update')).then(reason => {
        this.rustSrv.sendCommand(`restart ${time} "${reason}"`);
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



  config() {
    this.openedConfig = true;
  }

  help() {
    window.open('https://www.corrosionhour.com/rust-admin-commands/', "__blank");
  }

  changeFilterOnline(onlineFilter: boolean) {
    this.onlineFilter = onlineFilter;
    this.players();
  }

  github() {
    window.open('https://github.com/alexander171294/RustMon', "__blank");
  }

  recordChatMessage(data: any) {
    if(this.chatMessages) {
      this.chatMessages.push(data);
      setTimeout(() => {
        this.chatCompo?.goToDown();
      }, 100);
    } else {
      setTimeout(() => { this.recordChatMessage(data); }, 100); // chat stack not received, retry in 100ms
    }
  }

}
