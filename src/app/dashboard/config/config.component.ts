import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { MapData } from 'src/app/api/MapDataDto';
import { UserDataService } from 'src/app/api/user-data.service';
import { RustService } from 'src/app/rustRCON/rust.service';
import { REType, RustEvent } from 'src/app/rustRCON/RustEvent';

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

  public mapData: MapData;

  private subCfg: Subscription;

  public tab = 0;

  constructor(private rustSrv: RustService,
              private userDataSrv: UserDataService) { }

  ngOnInit() {
    this.subCfg = this.rustSrv.getEvtRust().subscribe((d: RustEvent) => {
      if(d.type == REType.SRV_INFO) {
        if(d.raw.indexOf('server.seed:') >= 0) {
          this.serverSeed = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
          if(this.worldSize) {
            this.getMap();
          }
        } else if(d.raw.indexOf('server.worldsize:') >= 0) {
          this.worldSize = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
          if(this.serverSeed) {
            this.getMap();
          }
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
    this.rustSrv.sendCommand('server.seed', REType.SRV_INFO);
    this.rustSrv.sendCommand('server.worldsize', REType.SRV_INFO);
    this.rustSrv.sendCommand('server.hostname', REType.SRV_INFO);
    this.rustSrv.sendCommand('server.description', REType.SRV_INFO);
    this.rustSrv.sendCommand('server.url', REType.SRV_INFO);
    this.rustSrv.sendCommand('server.tags', REType.SRV_INFO);
    this.rustSrv.sendCommand('server.headerimage', REType.SRV_INFO);
    this.rustSrv.sendCommand('server.maxplayers', REType.SRV_INFO);

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

  save() {
    this.apply();
    this.rustSrv.sendCommand('server.writecfg');
  }

  apply() {
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
    
    this.doClose();
  }

  doClose() {
    this.close.emit();
  }

  getMap() {
    if(!this.mapData) {
      this.userDataSrv.getMap(this.serverSeed.toString(), this.worldSize.toString()).subscribe(r => {
        this.mapData = r;
      });
    }
  }

}
