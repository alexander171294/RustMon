import { RustService } from 'src/app/rustRCON/rust.service';
import { BotData } from './BotData';
import { BotService } from './bot.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-bot',
  templateUrl: './bot.component.html',
  styleUrls: ['./bot.component.scss']
})
export class BotComponent implements OnInit {

  @Output() close = new EventEmitter<void>();
  public session: string;
  public linkLogin: string;

  icons = {
    faDiscord,
    faCircleNotch
  }

  public accountData: BotData;
  public loading: boolean = true;

  public tab = 0;

  constructor(private botSrv: BotService, private rustSrv: RustService) { }

  ngOnInit(): void {
    this.session = this.botSrv.getSession();
    this.linkLogin = undefined;
    this.accountData = undefined;
    this.botSrv.getLoginLink().subscribe(resp =>  {
      this.linkLogin = resp;
    });
    this.getBotData();
  }

  getBotData() {
    if(this.session) {
      this.botSrv.getBotData().subscribe(r => {
        console.log('Account data', r);
        this.accountData = r;
        this.loading = false;
      });
    }
  }
  remove() {
    this.loading = true;
    this.botSrv.remove().subscribe(resp => {
      this.getBotData();
    });
  }

  discordLogin() {
    if(this.linkLogin) {
      window.location.href = this.linkLogin;
    }
  }

  botInvitation() {
    window.open(this.accountData.invitation, '_blank');
  }

  selectServer(id: string) {
    this.loading = true;
    this.botSrv.setDefinition({
      accessToken: '',
      discordID: id,
      password: this.rustSrv.getRconPasswd(),
      port: this.rustSrv.getRconPort() + '',
      server: this.rustSrv.getConnectionString()
    }).subscribe(d => {
      this.getBotData();
    });
  }

}
