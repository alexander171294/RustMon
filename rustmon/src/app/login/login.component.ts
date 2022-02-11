import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RustService } from '../rustRCON/rust.service';
import { REType } from '../rustRCON/RustEvent';
import { HashParser } from '../utils/hasParser';
import { ConectionData, ConnectionHistoryService } from './connection-history.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public serverIP: string = '';
  public rconPort: number = 0;
  public rconPasswd: string = '';
  public loginLoading: boolean = false;

  public connections: ConectionData[] = [];
  public connectionSelected: number = 0;

  constructor(private rustSrv: RustService,
              private connectionHistory: ConnectionHistoryService,
              private messageService: MessageService,
              private router: Router) { }

  ngOnInit() {
    this.connections = this.connectionHistory.getServerList();
    this.previousSessionLoad(null, 0);
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

  previousSessionLoad(evt: any, idConn: number) {
    const conection = this.connections[idConn];
    if(conection) {
      this.serverIP = conection.server;
      this.rconPort = parseInt(conection.port);
      this.rconPasswd = conection.password;
    }
  }

  kpConn(evt: any) {
    if(evt.keyCode == 13) {
      this.connect();
    }
  }

  connect() {
    this.loginLoading = true;
    this.connectionHistory.save(this.serverIP, this.rconPort.toString(), this.rconPasswd);
    const subscription = this.rustSrv.connect(this.serverIP, this.rconPort, this.rconPasswd).subscribe(d => {
      if(d.type === REType.CONNECTED) {
        subscription.unsubscribe();
        this.router.navigateByUrl('/dashboard').then(navigated => {
          if(navigated) {
            this.loginLoading = false;
          }
        });
      } else if (d.type === REType.DISCONNECT || d.type == REType.ERROR) {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Can\'t connect to server.'});
        this.loginLoading = false;
        subscription.unsubscribe();
      }
    });
  }

}
