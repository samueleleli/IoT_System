import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';
import {ReactiveFormsModule} from '@angular/forms'
import {HttpClientModule } from '@angular/common/http';

import { EventComponent } from './event/event.component';
import { AppRoutingModule } from './app-routing.module';

import { Router, RouterModule } from '@angular/router';
import { LastEventsComponent } from './last-events/last-events.component';
import { HomepageComponent } from './homepage/homepage.component'; // new
export const connection: IMqttServiceOptions = {
  hostname: 'broker.emqx.io',
  port: 8083,
  path: '/mqtt',
  clean: true, // 保留会话
  connectTimeout: 4000, // 超时时间
  reconnectPeriod: 4000, // 重连时间间隔
  // 认证信息
  clientId: 'mqttx_597046f4',
  username: 'emqx_test',
  password: 'emqx_test',
  protocol: 'ws',
  connectOnCreate: false,
}
@NgModule({
  declarations: [
    AppComponent,
    EventComponent,
    LastEventsComponent,
    HomepageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatButtonModule,
    MatSelectModule,
    MqttModule.forRoot(connection),
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
