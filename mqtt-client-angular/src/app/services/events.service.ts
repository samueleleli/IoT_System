import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private url_event = 'http://localhost:3000/event';
  private url_last_event = 'http://localhost:3000/lastEvents';

  constructor(private httpClient: HttpClient) { }

  getEvent(data:any){
    return this.httpClient.post<any>(this.url_event,data)//,options);
  }

  getLastEvent(){
    return this.httpClient.get<any>(this.url_last_event)//,options);
  }
}
