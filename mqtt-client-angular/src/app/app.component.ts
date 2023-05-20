import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  IMqttMessage,
  IMqttServiceOptions,
  MqttService,
} from 'ngx-mqtt';
import { IClientSubscribeOptions } from 'mqtt-browser';

interface Data {
  value: any;
  timestamp: string;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  tempoRealeShow = true;
  storicoShow = false;
  topicSelected = false;


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

  constructor(private _mqttService: MqttService) {

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

  toggleTempoRealeButton(component: any) {
    this.tempoRealeShow = true
    this.storicoShow = false
  }

  toggleStoricoButton(component: any) {
    this.tempoRealeShow = false
    this.storicoShow = true
  }


}

/* test on terminal

mosquitto_pub -V mqttv311 -t led -m "{\"value\":\"on\",\"timestamp\":12113413}" -d
mosquitto_pub -V mqttv311 -t movimento -m "{\"value\":\"rilevato\",\"timestamp\":1684012499}" -d
mosquitto_pub -V mqttv311 -t proxZone -m "{\"value\":\"entrata\",\"timestamp\":\"25-03-2024 \"}" -d
*/
