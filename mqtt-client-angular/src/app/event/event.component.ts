import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EventsService } from '../services/events.service';
import { Event } from '../model/Event';


interface Topic{
  value: any;
  viewValue: string;
}

@Component({
  selector: 'event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  searchForm!:FormGroup;
  localStorageSensors = localStorage;

  topics: Topic[] = [
    {value:  null,viewValue:""},
    {value: 'led', viewValue: 'Led'},
    {value: 'movimento', viewValue: 'Movimento'},
    {value: 'proxZone', viewValue: 'Prossimità'},
  ];

  selectedValue:Topic[] = []

  possibleValueFilter:any = {
  led_value: [
    {value: null, viewValue: ''},
    {value: 'acceso', viewValue: 'Acceso'},
    {value: 'spento', viewValue: 'Spento'},
  ],

  movimento_value:[
    {value: null, viewValue: ''},
    {value: 'rilevato', viewValue: 'Rilevato'},
    {value: 'non rilevato', viewValue: 'Non Rilevato'},
  ],

  prossimita_value:[
    {value: null, viewValue: ''},
    {value: 'entrata', viewValue: 'Entrata'},
    {value: 'uscita', viewValue: 'Uscita'},
  ]}


  preview:any = '';
  responseData: any;
  events!:Event[]
  topicSelected = false;
  isValidFormSubmitted = false;
  constructor(private fb: FormBuilder, private service:EventsService) {}

  ngOnInit() {

    this.searchForm = this.fb.group({
      topic: new FormControl(''),
      topic_value: new FormControl(''),
      start_date: new FormControl(''),
      end_date: new FormControl('')
    });

    this.setDefaults();

    this.searchForm.get("topic")?.valueChanges
      .subscribe(f => {
        this.onTopicChanged(f);
      })
    this.searchForm.get("topic_value")?.valueChanges
      .subscribe(f => {
        this.onValueTopicChanged(f);
    })

    this.searchForm.get("start_date")?.valueChanges
      .subscribe(f => {
        this.onStartDateChanged(f);
    })

    this.searchForm.get("end_date")?.valueChanges
      .subscribe(f => {
        this.onEndDateChanged(f);
    })
    this.search()

  }

  onTopicChanged(value:string) {
    const formData = this.searchForm.value;
    formData.topic = value;
    formData.topic_value = null;

    switch(value){
      case "movimento":
        this.selectedValue = this.possibleValueFilter.movimento_value;
        this.topicSelected = true;
        this.search()
        //this.localStorageSensors.setItem('topic', value);
        break;
      case "led":
        this.selectedValue = this.possibleValueFilter.led_value;
        this.topicSelected = true;
        this.search()
        //this.localStorageSensors.setItem('topic', value);
        break;
      case "proxZone":
        this.selectedValue = this.possibleValueFilter.prossimita_value;
        this.topicSelected = true;
        //this.localStorageSensors.setItem('topic', value);
        this.search()
        break;
      case null:
        this.topicSelected = false;
        formData.topic_value = null;
        formData.topic = null;
    }
  }

  onValueTopicChanged(value:string) {
    const formData = this.searchForm.value;
    if(formData.topic != null) formData.topic_value = value;
    this.search()
  }

  onStartDateChanged(value:string) {
    const formData= this.searchForm.value;
    formData.start_date = value;
    console.log(value)
    this.search()
  }
  onEndDateChanged(value:string) {
    const formData = this.searchForm.value;
    formData.end_date = value;
    this.search()
  }
  setDefaults() {
    this.searchForm.get("start_date")?.patchValue(null);
    this.searchForm.get("end_date")?.patchValue(null);
    this.searchForm.get("topic_value")?.patchValue(null);
    this.searchForm.get("topic")?.patchValue(null);
  }



  search() {
    const formData = this.searchForm.value;

    if(formData.start_date == null) delete formData.start_date;
    else {
      let start_date:string = formData.start_date
      if(!start_date.includes(":00Z")) formData.start_date = formData.start_date+":00Z"
      if(formData.start_date  === ":00Z") formData.start_date = null
    }
    if(formData.end_date == null) delete formData.end_date;
    else {
      let end_date:string = formData.end_date
      if(!end_date.includes(":00Z")) formData.end_date = formData.end_date+":00Z"
      if(formData.end_date  === ":00Z") formData.end_date = null
      console.log("a")
    }

    if(formData.topic == null) delete formData.topic;
    if(formData.topic_value == null) delete formData.topic_value;
    if(formData.end_date == null) delete formData.end_date;
    if(formData.start_date == null) delete formData.start_date;
    const formDataString = JSON.stringify(formData);
    this.preview = formDataString
    //this.preview = formDataString
    this.service.getEvent(formData)
        .subscribe((response:any) => {
          let responseData = response;
          this.events = responseData.EventsList.map((eventData:Event) => new Event(eventData.topic, eventData.value, eventData.timestamp));
        });

  }
}
