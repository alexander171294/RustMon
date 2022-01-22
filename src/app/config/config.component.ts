import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { RustService } from '../rustRCON/rust.service';
import { REType, RustEvent } from '../rustRCON/RustEvent';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit, OnDestroy {

  @Output() close = new EventEmitter<void>();

  public serverSeed: number;
  public worldSize: number;

  public serverName: string;
  public serverDescription: string;
  public serverUrl: string;
  public serverImage: string;
  public serverTags: string;
  public serverMaxPlayers: number;

  private subCfg: Subscription;

  constructor(private rustSrv: RustService) { }

  ngOnInit() {
    this.subCfg = this.rustSrv.getEvtRust().subscribe((d: RustEvent) => {
      if(d.type == REType.UNKOWN) {
        if(d.raw.indexOf('server.seed:') >= 0) {
          this.serverSeed = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        } else if(d.raw.indexOf('server.worldsize:') >= 0) {
          this.worldSize = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        } else if(d.raw.indexOf('server.hostname:') >= 0) {
          this.serverName = d.raw.split(' ').slice(1).join(' ').split('"').join('');
        } else if(d.raw.indexOf('server.description:') >= 0) {
          this.serverDescription = d.raw.split(' ').slice(1).join(' ').split('"').join('');
        } else if(d.raw.indexOf('server.url:') >= 0) {
          this.serverUrl = d.raw.split(' ').slice(1).join(' ').split('"').join('');
        } else if(d.raw.indexOf('server.headerimage:') >= 0) {
          this.serverImage = d.raw.split(' ').slice(1).join(' ').split('"').join('');
        } else if(d.raw.indexOf('server.tags:') >= 0) {
          this.serverTags = d.raw.split(' ').slice(1).join(' ').split('"').join('');
        } else if(d.raw.indexOf('server.maxplayers:') >= 0) {
          this.serverMaxPlayers = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        }
      }
    });
    this.rustSrv.sendCommand('server.seed');
    this.rustSrv.sendCommand('server.worldsize');
    this.rustSrv.sendCommand('server.hostname');
    this.rustSrv.sendCommand('server.description');
    this.rustSrv.sendCommand('server.url');
    this.rustSrv.sendCommand('server.tags');
    this.rustSrv.sendCommand('server.headerimage');
    this.rustSrv.sendCommand('server.maxplayers');

    // server.idlekick
    // server.ip
    // server.motd
    // server.playertimeout
    // server.pve
    //
  }

  ngOnDestroy() {
    this.subCfg.unsubscribe();
  }

  writeCFG() {
    this.rustSrv.sendCommand('server.writecfg');
    this.close.emit();
  }

  save() {
    this.serverName = this.serverName.split('"').join('');
    this.serverDescription = this.serverDescription.split('"').join('');
    this.serverImage = this.serverImage.split('"').join('');
    this.serverUrl = this.serverUrl.split('"').join('');

    this.rustSrv.sendCommand('server.hostname "'+this.serverName+'"');
    this.rustSrv.sendCommand('server.description "'+this.serverDescription+'"');
    this.rustSrv.sendCommand('server.url "'+this.serverUrl+'"');
    this.rustSrv.sendCommand('server.tags "'+this.serverTags+'"');
    this.rustSrv.sendCommand('server.headerimage "'+this.serverImage+'"');
    this.rustSrv.sendCommand('server.maxplayers '+this.serverMaxPlayers);

    this.writeCFG();
    this.close.emit();
  }

}
