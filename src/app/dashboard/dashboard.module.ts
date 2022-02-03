import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UptimePipe } from './uptime.pipe';
import { UptimeFixedPipe } from './uptimeFixed.pipe';
import { PortRemovePipe } from './port-remove.pipe';
import { ConfirmDialogModule, ContextMenuModule, InputSwitchModule, OverlayPanelModule, SidebarModule, TableModule, ToastModule } from 'primeng';
import { ChatComponent } from './chat/chat.component';
import { PromptModule } from './prompt/prompt.module';
import { PlayersComponent } from './players/players.component';
import { ConfigComponent } from './config/config.component';
import { PlayerToolsComponent } from './player-tools/player-tools.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardComponent
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    UptimePipe,
    UptimeFixedPipe,
    PortRemovePipe,
    ChatComponent,
    PlayersComponent,
    ConfigComponent,
    PlayerToolsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    TableModule,
    InputSwitchModule,
    ContextMenuModule,
    ToastModule,
    ConfirmDialogModule,
    OverlayPanelModule,
    SidebarModule,
    PromptModule,
  ]
})
export class DashboardModule { }
