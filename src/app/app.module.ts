import { MessageService, ConfirmationService } from 'primeng/api';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConnectionComponent } from './connection/connection.component';
import { UptimePipe } from './connection/uptime.pipe';
import { CommonModule } from '@angular/common';
import { UptimeFixedPipe } from './connection/uptimeFixed.pipe';
import { PortRemovePipe } from './connection/port-remove.pipe';
import {TableModule} from 'primeng/table';
import { PlayersComponent } from './players/players.component';
import {InputSwitchModule} from 'primeng/inputswitch';
import {ContextMenuModule} from 'primeng/contextmenu';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ChatComponent } from './chat/chat.component';
import {SidebarModule} from 'primeng/sidebar';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { ConfigComponent } from './config/config.component';
import { PromptModule } from './ui-kit/prompt/prompt.module';
import { HttpClientModule } from '@angular/common/http';
import { PlayerToolsComponent } from './player-tools/player-tools.component';

@NgModule({
  declarations: [
    AppComponent,
    ConnectionComponent,
    UptimePipe,
    UptimeFixedPipe,
    PortRemovePipe,
    PlayersComponent,
    ChatComponent,
    ConfigComponent,
    PlayerToolsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    TableModule,
    InputSwitchModule,
    ContextMenuModule,
    ToastModule,
    ConfirmDialogModule,
    OverlayPanelModule,
    SidebarModule,
    PromptModule,
    HttpClientModule
  ],
  providers: [
    MessageService,
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
