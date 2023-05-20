import { Component, OnInit } from '@angular/core';

import {
  IMqttMessage,
  IMqttServiceOptions,
  MqttService,
} from 'ngx-mqtt';
import { IClientSubscribeOptions } from 'mqtt-browser';
import { timestamp } from 'rxjs';
import { EventsService } from '../services/events.service';

interface Data {
  value: any;
  timestamp: string;
}

@Component({
  selector: 'app-last-events',
  templateUrl: './last-events.component.html',
  styleUrls: ['./last-events.component.scss']
})
export class LastEventsComponent implements OnInit {


  localStorageSensors = localStorage;
  // to access localStorage in html use localStorageAlice.getItem('key');
  private client: MqttService | undefined;
  private subscriptionLed = {
    topic: 'led',
    qos: 0,
  };
  private subscriptionMovimento = {
    topic: 'movimento',
    qos: 0,
  };
  private subscriptionProssimita = {
    topic: 'proxZone',
    qos: 0,
  };
  private connection = {
    hostname: 'localhost',
    port: 9001,
    path: '/mqtt',
    clean: true, // 保留会话
    connectTimeout: 4000, // 超时时间
    reconnectPeriod: 4000, // 重连时间间隔
    // 认证信息
    clientId: 'mqttx_597046f4',
    username: '',
    password: '',
    protocol: 'ws',
  }

  ledStatus = '';
  ledTimestamp = 0;
  movimentoStatus = '';
  movimentoTimestamp = 0;
  prossimitaStatus = '';
  prossimitaTimestamp = 0;

  private convertDateFormat(inputDate:string) {
    const dateObj = new Date(inputDate);

    const year = dateObj.getFullYear();
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
    const day = ('0' + dateObj.getDate()).slice(-2);
    const hours = ('0' + dateObj.getHours()).slice(-2);
    const minutes = ('0' + dateObj.getMinutes()).slice(-2);
    const seconds = ('0' + dateObj.getSeconds()).slice(-2);

    const outputDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return outputDate;
  }

  ngOnInit(): void {
    this.service.getLastEvent()
    .subscribe((response:any) => {
        let list:any[] = response.EventsList
        list.forEach((el)=>{
           let timestamp:any = ""
           console.log(el)
            switch(el.topic){
                case "led":
                  timestamp = this.localStorageSensors.getItem('ledTimestamp');
                  if(timestamp == null || Date.parse(timestamp) <= Date.parse(el.timestamp)){
                    this.localStorageSensors.setItem('ledTimestamp',this.convertDateFormat(el.timestamp))
                    this.localStorageSensors.setItem('ledStatus',el.value)
                  }
                  break;
                case "movimento":
                  timestamp = this.localStorageSensors.getItem('movimentoTimestamp');
                  if(timestamp == null || Date.parse(timestamp) <= Date.parse(el.timestamp)){
                    this.localStorageSensors.setItem('movimentoTimestamp',this.convertDateFormat(el.timestamp))
                    this.localStorageSensors.setItem('movimentoStatus',el.value)
                  }
                  break;
                case "proxZone":
                  timestamp = this.localStorageSensors.getItem('prossimitaTimestamp');
                  if(timestamp == null || Date.parse(timestamp) <= Date.parse(el.timestamp)){
                    this.localStorageSensors.setItem('prossimitaTimestamp',this.convertDateFormat(el.timestamp))
                    this.localStorageSensors.setItem('prossimitaStatus',el.value)
                  }
                  break;
            }
        });
    });
  }

  constructor(private _mqttService: MqttService,private service:EventsService) {
    this.client = this._mqttService;
    // connessione al broker
    this.client?.connect(this.connection as IMqttServiceOptions)


    let { topic, qos } = this.subscriptionLed
    // subscribe al topic led
    this.client?.observe(topic, { qos } as IClientSubscribeOptions).subscribe((message: IMqttMessage) => {
      console.log('Subscribe to topics res', message.payload.toString())
    })

    topic = this.subscriptionMovimento.topic
    qos = this.subscriptionMovimento.qos

    // subscribe al topic movimento
    this.client?.observe(topic, { qos } as IClientSubscribeOptions).subscribe((message: IMqttMessage) => {
      console.log('Subscribe to topics res', message.payload.toString())
    })

    topic = this.subscriptionProssimita.topic
    qos = this.subscriptionProssimita.qos

    // subscribe al topic prossimità
    this.client?.observe(topic, { qos } as IClientSubscribeOptions).subscribe((message: IMqttMessage) => {
      console.log('Subscribe to topics res', message.payload.toString())
    })

    // quando arriva un messaggio di un topic
    this.client?.onMessage.subscribe((packet: any) => {
      try{
        let data: Data = JSON.parse(packet.payload.toString());
        let date = data.timestamp;
        switch(packet.topic){
          case "led":
              this.localStorageSensors.setItem('ledStatus', data.value);
              this.localStorageSensors.setItem('ledTimestamp',String(date));
              break;
          case "movimento":
              this.localStorageSensors.setItem('movimentoStatus', data.value);
              this.localStorageSensors.setItem('movimentoTimestamp',String(date));
              break;
          case "proxZone":
              this.localStorageSensors.setItem('prossimitaStatus', data.value);
              this.localStorageSensors.setItem('prossimitaTimestamp',String(date));
              break;
        }
      }catch(error){
        console.error(error);
      }
    })
  }

}
