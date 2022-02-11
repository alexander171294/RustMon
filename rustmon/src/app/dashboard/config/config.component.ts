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

  public retryLoading: boolean = false;

  public serverSeed: number = 0;
  public worldSize: number = 0;

  public serverName: string = '';
  public serverDescription: string = '';
  public serverUrl: string = '';
  public serverImage: string = '';
  public serverTags: string = '';
  public serverMaxPlayers: number = 0;

  // misc configs:
  public globalChat: any;
  public airdropMinplayers: number = 0;
  public idlekick: number = 0;
  public idlekickMode: any;
  public idlekickAdmins: any;
  public motd: any;
  public pve: any;
  public radiation: any;
  public instantCraft: any;
  public aiThink: any;
  public npcEnable: any;
  public stability: any;
  public aiMove: any;
  public chatEnabled: any;
  public itemDespawn: any;
  public respawnResetRange: any;

  // security
  public saveinterval: number = 0;
  public fpsLimit: number = 0;
  public serverSecure: any;

  // batch 
  public batchCommand: string = '';

  public populations = {
    wolf: -1, // wolf.population
    zombie: -1, // zombie.population
    bear: -1, // bear.population
    polarbear: -1, // polarbear.population
    boar: -1, // boar.population
    chicken: -1, // chicken.population
    stag: -1, // stag.population
    horse: -1, // horse.population
    ridablehorse: -1, // ridablehorse.population
    minicopter: -1, // minicopter.population
    modulecar: -1, // modulecar.population
    motorrowboat: -1, // motorrowboat.population
    rhib: -1, // rhib.rhibpopulation
    scraptransporthelicopter: -1, // scraptransporthelicopter.population
    halloweenmurderer: -1, // halloween.murdererpopulation
    halloweenscarecrow: -1, // halloween.scarecrowpopulation
    hotairballoon: -1, // hotairballoon.population
  }

  public mapData?: MapData;

  private subCfg?: Subscription;

  public tab = 0;

  constructor(private rustSrv: RustService,
              private userDataSrv: UserDataService) { }

  ngOnInit() {
    this.subCfg = this.rustSrv.getEvtRust().subscribe((d: RustEvent) => {
      if(d.type == REType.SRV_INFO) {
        if(d.raw.indexOf('server.seed:') === 0) {
          this.serverSeed = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
          if(this.worldSize) {
            this.getMap();
          }
        } else if(d.raw.indexOf('server.worldsize:') === 0) {
          this.worldSize = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
          if(this.serverSeed) {
            this.getMap();
          }
        } else if(d.raw.indexOf('server.hostname:') === 0) {
          this.serverName = d.raw.split(' ').slice(1).join(' ').split('"').join('');
        } else if(d.raw.indexOf('server.description:') === 0) {
          this.serverDescription = d.raw.split(' ').slice(1).join(' ').split('"').join('');
        } else if(d.raw.indexOf('server.url:') === 0) {
          this.serverUrl = d.raw.split(' ').slice(1).join(' ').split('"').join('');
        } else if(d.raw.indexOf('server.headerimage:') === 0) {
          this.serverImage = d.raw.split(' ').slice(1).join(' ').split('"').join('');
        } else if(d.raw.indexOf('server.tags:') === 0) {
          this.serverTags = d.raw.split(' ').slice(1).join(' ').split('"').join('');
        } else if(d.raw.indexOf('server.maxplayers:') === 0) {
          this.serverMaxPlayers = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        } else if(d.raw.indexOf('server.globalchat:') === 0) {
          this.globalChat = d.raw.split(' ').slice(1).join(' ').split('"').join('');
        } else if(d.raw.indexOf('airdrop.min_players:') === 0) {
          this.airdropMinplayers = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        } else if(d.raw.indexOf('server.saveinterval:') === 0) {
          this.saveinterval = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        } else if(d.raw.indexOf('server.idlekick:') === 0) {
          this.idlekick = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        } else if(d.raw.indexOf('server.idlekickmode:') === 0) {
          this.idlekickMode = d.raw.split(' ').slice(1).join(' ').split('"').join('');
        } else if(d.raw.indexOf('server.idlekickadmins:') === 0) {
          this.idlekickAdmins = d.raw.split(' ').slice(1).join(' ').split('"').join('');
        } else if(d.raw.indexOf('server.motd:') === 0) {
          this.motd = d.raw.split(' ').slice(1).join(' ').split('"').join('');
        } else if(d.raw.indexOf('server.pve:') === 0) {
          this.pve = d.raw.split(' ').slice(1).join(' ').split('"').join('');
        } else if(d.raw.indexOf('server.radiation:') === 0) {
          this.radiation = d.raw.split(' ').slice(1).join(' ').split('"').join('');
        } else if(d.raw.indexOf('craft.instant:') === 0) {
          this.instantCraft = d.raw.split(' ').slice(1).join(' ').split('"').join('');
        } else if(d.raw.indexOf('ai.think:') === 0) {
          this.aiThink = d.raw.split(' ').slice(1).join(' ').split('"').join('');
        } else if(d.raw.indexOf('ai.npc_enable:') === 0) {
          this.npcEnable = d.raw.split(' ').slice(1).join(' ').split('"').join('');
        } else if(d.raw.indexOf('ai.move:') === 0) {
          this.aiMove = d.raw.split(' ').slice(1).join(' ').split('"').join('');
        } else if(d.raw.indexOf('server.stability:') === 0) {
          this.stability = d.raw.split(' ').slice(1).join(' ').split('"').join('');
        } else if(d.raw.indexOf('chat.enabled:') === 0) {
          this.chatEnabled = d.raw.split(' ').slice(1).join(' ').split('"').join('');
        } else if(d.raw.indexOf('server.itemdespawn:') === 0) {
          this.itemDespawn = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        } else if(d.raw.indexOf('server.respawnresetrange:') === 0) {
          this.respawnResetRange = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        } else if(d.raw.indexOf('fps.limit:') === 0) {
          this.fpsLimit = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        } else if(d.raw.indexOf('server.secure:') === 0) {
          this.serverSecure = d.raw.split(' ').slice(1).join(' ').split('"').join('');
        } else if(d.raw.indexOf('wolf.population:') === 0) {
          this.populations.wolf = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        } else if(d.raw.indexOf('zombie.population:') === 0) {
          this.populations.zombie = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        } else if(d.raw.indexOf('bear.population:') === 0) {
          this.populations.bear = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        } else if(d.raw.indexOf('polarbear.population:') === 0) {
          this.populations.polarbear = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        } else if(d.raw.indexOf('boar.population:') === 0) {
          this.populations.boar = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        } else if(d.raw.indexOf('chicken.population:') === 0) {
          this.populations.chicken = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        } else if(d.raw.indexOf('stag.population:') === 0) {
          this.populations.stag = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        } else if(d.raw.indexOf('horse.population:') === 0) {
          this.populations.horse = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        } else if(d.raw.indexOf('ridablehorse.population:') === 0) {
          this.populations.ridablehorse = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        } else if(d.raw.indexOf('minicopter.population:') === 0) {
          this.populations.minicopter = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        } else if(d.raw.indexOf('modularcar.population:') === 0) {
          this.populations.modulecar = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        } else if(d.raw.indexOf('motorrowboat.population:') === 0) {
          this.populations.motorrowboat = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        } else if(d.raw.indexOf('rhib.rhibpopulation:') === 0) {
          this.populations.rhib = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        } else if(d.raw.indexOf('scraptransporthelicopter.population:') === 0) {
          this.populations.scraptransporthelicopter = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        } else if(d.raw.indexOf('halloween.murdererpopulation:') === 0) {
          this.populations.halloweenmurderer = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        } else if(d.raw.indexOf('halloween.scarecrowpopulation:') === 0) {
          this.populations.halloweenscarecrow = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        } else if(d.raw.indexOf('hotairballoon.population:') === 0) {
          this.populations.hotairballoon = parseInt(d.raw.split(' ').slice(1).join(' ').split('"').join(''));
        } else {
          console.log('unknown config', d.raw);
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

    // misc data
    this.rustSrv.sendCommand('server.globalchat', REType.SRV_INFO);
    this.rustSrv.sendCommand('server.idlekick', REType.SRV_INFO);
    this.rustSrv.sendCommand('server.idlekickmode', REType.SRV_INFO);
    this.rustSrv.sendCommand('server.idlekickadmins', REType.SRV_INFO);
    this.rustSrv.sendCommand('server.motd', REType.SRV_INFO);
    this.rustSrv.sendCommand('server.pve', REType.SRV_INFO);
    this.rustSrv.sendCommand('server.radiation', REType.SRV_INFO);
    this.rustSrv.sendCommand('craft.instant', REType.SRV_INFO);
    this.rustSrv.sendCommand('ai.think', REType.SRV_INFO);
    this.rustSrv.sendCommand('ai.npc_enable', REType.SRV_INFO);
    this.rustSrv.sendCommand('ai.move', REType.SRV_INFO);
    this.rustSrv.sendCommand('server.stability', REType.SRV_INFO);
    this.rustSrv.sendCommand('chat.enabled', REType.SRV_INFO);
    this.rustSrv.sendCommand('server.itemdespawn', REType.SRV_INFO);
    this.rustSrv.sendCommand('server.respawnresetrange', REType.SRV_INFO);

    // security
    this.rustSrv.sendCommand('server.saveinterval', REType.SRV_INFO);
    this.rustSrv.sendCommand('fps.limit', REType.SRV_INFO);
    this.rustSrv.sendCommand('server.secure', REType.SRV_INFO);

    // Population
    this.rustSrv.sendCommand('wolf.population', REType.SRV_INFO);
    this.rustSrv.sendCommand('zombie.population', REType.SRV_INFO);
    this.rustSrv.sendCommand('bear.population', REType.SRV_INFO);
    this.rustSrv.sendCommand('polarbear.population', REType.SRV_INFO);
    this.rustSrv.sendCommand('boar.population', REType.SRV_INFO);
    this.rustSrv.sendCommand('chicken.population', REType.SRV_INFO);
    this.rustSrv.sendCommand('stag.population', REType.SRV_INFO);
    this.rustSrv.sendCommand('horse.population', REType.SRV_INFO);
    this.rustSrv.sendCommand('ridablehorse.population', REType.SRV_INFO);
    this.rustSrv.sendCommand('minicopter.population', REType.SRV_INFO);
    this.rustSrv.sendCommand('modularcar.population', REType.SRV_INFO);
    this.rustSrv.sendCommand('motorrowboat.population', REType.SRV_INFO);
    this.rustSrv.sendCommand('rhib.rhibpopulation', REType.SRV_INFO);
    this.rustSrv.sendCommand('scraptransporthelicopter.population', REType.SRV_INFO);
    this.rustSrv.sendCommand('halloween.murdererpopulation', REType.SRV_INFO);
    this.rustSrv.sendCommand('halloween.scarecrowpopulation', REType.SRV_INFO);
    this.rustSrv.sendCommand('hotairballoon.population', REType.SRV_INFO);

  }

  ngOnDestroy() {
    this.subCfg?.unsubscribe();
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

    this.rustSrv.sendCommand(`server.hostname "${this.serverName}"`);
    this.rustSrv.sendCommand(`server.description "${this.serverDescription}"`);
    this.rustSrv.sendCommand(`server.url "${this.serverUrl}"`);
    this.rustSrv.sendCommand(`server.tags "${this.serverTags}"`);
    this.rustSrv.sendCommand(`server.headerimage "${this.serverImage}"`);
    this.rustSrv.sendCommand(`server.maxplayers "${this.serverMaxPlayers}"`);
    
    this.doClose();
  }

  doClose() {
    this.close.emit();
  }

  getMap() {
    if(!this.mapData) {
      this.userDataSrv.getMap(this.serverSeed.toString(), this.worldSize.toString()).subscribe(r => {
        this.mapData = r;
        this.retryLoading = false;
      });
    }
  }

  mapRetry() {
    this.retryLoading = true;
    this.userDataSrv.mapInvalidateCache(this.serverSeed.toString(), this.worldSize.toString()).subscribe(r => {
      this.getMap();
    });
  }

  applyMisc() {
    this.rustSrv.sendCommand(`server.globalchat "${this.globalChat}"`);
    this.rustSrv.sendCommand(`server.idlekick "${this.idlekick}"`);
    this.rustSrv.sendCommand(`server.idlekickmode "${this.idlekickMode}"`);
    this.rustSrv.sendCommand(`server.idlekickadmins "${this.idlekickAdmins}"`);
    this.rustSrv.sendCommand(`server.motd "${this.motd}"`);
    this.rustSrv.sendCommand(`server.pve "${this.pve}"`);
    this.rustSrv.sendCommand(`server.radiation "${this.radiation}"`);
    this.rustSrv.sendCommand(`craft.instant "${this.instantCraft}"`);
    this.rustSrv.sendCommand(`ai.think "${this.aiThink}"`);
    this.rustSrv.sendCommand(`ai.npc_enable "${this.npcEnable}"`);
    this.rustSrv.sendCommand(`ai.move "${this.aiMove}"`);
    this.rustSrv.sendCommand(`server.stability "${this.stability}"`);
    this.rustSrv.sendCommand(`chat.enabled "${this.chatEnabled}"`);
    this.rustSrv.sendCommand(`server.itemdespawn "${this.itemDespawn}"`);
    this.rustSrv.sendCommand(`server.respawnresetrange "${this.respawnResetRange}"`);
    this.doClose();
  }

  saveMisc() {
    this.applyMisc();
    this.rustSrv.sendCommand('server.writecfg');
  }

  applySec() {
    this.rustSrv.sendCommand(`fps.limit "${this.fpsLimit}"`);
    this.rustSrv.sendCommand(`server.saveinterval "${this.saveinterval}"`);
    this.rustSrv.sendCommand(`server.secure "${this.serverSecure}"`);
    this.doClose();
  }

  saveSec() {
    this.applySec();
    this.rustSrv.sendCommand('server.writecfg');
  }

  applyPop() {
    this.rustSrv.sendCommand(`wolf.population "${this.populations.wolf}"`);
    this.rustSrv.sendCommand(`zombie.population "${this.populations.zombie}"`);
    this.rustSrv.sendCommand(`bear.population "${this.populations.bear}"`);
    this.rustSrv.sendCommand(`polarbear.population "${this.populations.polarbear}"`);
    this.rustSrv.sendCommand(`boar.population "${this.populations.boar}"`);
    this.rustSrv.sendCommand(`chicken.population "${this.populations.chicken}"`);
    this.rustSrv.sendCommand(`stag.population "${this.populations.stag}"`);
    this.rustSrv.sendCommand(`horse.population "${this.populations.horse}"`);
    this.rustSrv.sendCommand(`ridablehorse.population "${this.populations.ridablehorse}"`);
    this.rustSrv.sendCommand(`minicopter.population "${this.populations.minicopter}"`);
    this.rustSrv.sendCommand(`modularcar.population "${this.populations.modulecar}"`);
    this.rustSrv.sendCommand(`motorrowboat.population "${this.populations.motorrowboat}"`);
    this.rustSrv.sendCommand(`rhib.rhibpopulation "${this.populations.rhib}"`);
    this.rustSrv.sendCommand(`scraptransporthelicopter.population "${this.populations.scraptransporthelicopter}"`);
    this.rustSrv.sendCommand(`halloween.murdererpopulation "${this.populations.halloweenmurderer}"`);
    this.rustSrv.sendCommand(`halloween.scarecrowpopulation "${this.populations.halloweenscarecrow}"`);
    this.rustSrv.sendCommand(`hotairballoon.population "${this.populations.hotairballoon}"`);
    this.doClose();
  }

  savePop() {
    this.applySec();
    this.rustSrv.sendCommand('server.writecfg');
  }

  loadBatch() {
    const oldBatch = localStorage.getItem('cfg-batch');
    this.batchCommand = oldBatch ? oldBatch : '';
  }

  batchChange() {
    localStorage.setItem('cfg-batch', this.batchCommand);
  }

  execBatch() {
    this.batchCommand.split('\n').forEach(cmd => {
      this.rustSrv.sendCommand(cmd);
    })
  }

}
