import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
}

/* test on terminal

mosquitto_pub -V mqttv311 -t led -m "{\"value\":\"on\",\"timestamp\":12113413}" -d
mosquitto_pub -V mqttv311 -t movimento -m "{\"value\":\"rilevato\",\"timestamp\":1684012499}" -d
mosquitto_pub -V mqttv311 -t prossimita -m "{\"value\":\"lontano\",\"timestamp\":\"2023-05-18 20:30:00\"}" -d
*/
