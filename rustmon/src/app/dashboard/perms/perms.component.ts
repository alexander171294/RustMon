import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { UserDataService } from 'src/app/api/user-data.service';
import { REType, RustEvent } from 'src/app/rustRCON/RustEvent';
import { RustService } from 'src/app/rustRCON/rust.service';
import { Clipboard } from 'src/app/utils/clipboard';

@Component({
  selector: 'app-perms',
  templateUrl: './perms.component.html',
  styleUrls: ['./perms.component.scss']
})
export class PermsComponent implements OnInit {

  @Output() close: EventEmitter<void> = new EventEmitter();

  tab = 0;
  groups: string[] = [];
  members: { steamID: string, nick: string }[] = [];
  groupPerms: string[] = [];
  perms: {name: string}[] = [];
  selectedPermission?: string;

  constructor(
    private rustSrv: RustService,
    private uData: UserDataService,
    private confirmationService: ConfirmationService,) { }

  ngOnInit(): void {
    console.log('INIT');
    this.rustSrv.getEvtRust().subscribe((d: RustEvent) => {
      if (d.type === REType.GROUPS) {
        const parts = d.raw.split('\n');
        parts.shift();
        const groups = parts.map((v) => {
          return v.split(',').map(d => d.trim());
        }).reduce((acc, val) => acc.concat(val.filter(q => q)), []);
        if(groups.length) {
          this.groups = groups;
        }
      }
      if (d.type === REType.PERMS) {
        if(!d.raw.length) {
          return;
        }
        this.perms = d.raw.split('\n')[1].split(',').map(d => { return {name: d.trim()}}).filter(q => q.name).sort((a, b) => a.name.localeCompare(b.name));
      }
      if(d.type === REType.GROUP_DETAILS) {
        if(!d.raw.length) {
          return;
        }
        const parts = d.raw.split('Group \'');
        this.members = [];
        this.groupPerms = [];
        if(parts.length < 3) {
          return;
        }
        const linesMembers = parts[1].split('\n');
        linesMembers.shift();
        // console.log('linesMembers', linesMembers)
        if(linesMembers[0] !== 'No players currently in group') {
          const members = linesMembers[0].split(',').filter(v => v.length).map((v) => {
            const parts = /([0-9]+)\s\((.+)/gm.exec(v);
            const steamID = parts[1];
            const nick = parts[2].substring(0, parts[2].length - 1);
            return { steamID, nick };
          }).reduce((acc, val) => acc.concat(val), []);
          this.members = members;
          // console.log('Members', members);
        }
        const linesPerms = parts[2].split('\n');
        linesPerms.shift();
        if(linesPerms[0] != 'No permissions currently granted') {
          this.groupPerms = linesPerms[0].split(',').map((v) => {
            return v.trim();
          }).filter(v => v.length);
        }
        this.groupLoading = false;
      }
    });
    this.getGroups();
    this.rustSrv.sendCommand('o.show perms', REType.PERMS);
  }

  notAssignedFilter(p: {name: string}[]) {
    return p.filter(pi => !this.groupPerms.includes(pi.name));
  }

  getGroups() {
    this.rustSrv.sendCommand('o.show groups', REType.GROUPS);
  }

  newGroup() {
    const groupName = prompt('Enter the new group name').replace(/\s/gmi, '_');
    if(groupName) {
      this.rustSrv.sendCommand(`o.group add ${groupName}`);
      this.getGroups();
    }
  }

  removeGroup(name: string) {
    if(name && name !== 'default' && name !== 'admin') {
      this.confirmationService.confirm({
        message: `Are you sure that you want to remove ${name} group?`,
        accept: () => {
            if (name == this.groupSelected) {
              this.groupSelected = undefined;
              this.groupLoading = false;
            }
            // TODO: prompt de confirmar
            this.rustSrv.sendCommand(`o.group remove ${name}`);
            this.getGroups();
        }
      });
    }
  }

  addPlayer() {
    const steamID = prompt('Enter the steamID');
    if(steamID) {
      this.rustSrv.sendCommand(`o.usergroup add ${steamID} ${this.groupSelected}`);
      this.showGroup(this.groupSelected);
    }
  }

  removePlayer(steamID: string) {
    if(steamID) {
      this.confirmationService.confirm({
        message: `Are you sure that you want to remove ${steamID} from ${this.groupSelected} group?`,
        accept: () => {
          this.rustSrv.sendCommand(`o.usergroup remove ${steamID} ${this.groupSelected}`);
          this.showGroup(this.groupSelected);
        }
      });
    }
  }

  groupSelected?: string;
  groupLoading = false;
  showGroup(name: string) {
    this.groupSelected = name;
    this.rustSrv.sendCommand(`o.show group ${name}`, REType.GROUP_DETAILS);
    this.groupLoading = true;
  }

  addPerm(name: string) {
    if(this.groupSelected) {
      this.rustSrv.sendCommand(`o.grant group ${this.groupSelected} ${name}`);
      this.selectedPermission = undefined;
      this.showGroup(this.groupSelected);
    }
  }

  removePerm(name: string) {
    if(this.groupSelected) {
      this.confirmationService.confirm({
        message: `Are you sure that you want to remove ${name} permission from ${this.groupSelected} group?`,
        accept: () => {
          this.rustSrv.sendCommand(`o.revoke group ${this.groupSelected} ${name}`);
          this.showGroup(this.groupSelected);
        }
      });
    }
  }

  copy(text: string) {
    Clipboard.writeText(text);
  }

  export() {

  }

  import() {

  }
}
