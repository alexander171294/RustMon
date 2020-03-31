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

@NgModule({
  declarations: [
    AppComponent,
    ConnectionComponent,
    UptimePipe,
    UptimeFixedPipe,
    PortRemovePipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
