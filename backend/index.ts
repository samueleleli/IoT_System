import { Op } from 'sequelize';
import * as controller from './Controller/controller';
import * as middleware from './Middleware/events_middleware';
import moment from 'moment';

const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

// Body della richiesta deve essere in formato json
app.use(bodyparser.json());

app.use((req:any, res:any, next:any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use((req:any, res:any, next:any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Rotta per mostrare la lista degli eventi, filtrabile per topic, valore del topic e data/ora
app.post('/event', middleware.validateTopic,middleware.validateValueTopic,middleware.validateDate,(req:any,res:any) => {
  console.log('get events');
  let filter = new Map()

  if(Object.keys(req.body).includes('topic')) filter.set("topic",req.body.topic);
  if(Object.keys(req.body).includes('topic_value')) filter.set("value",req.body.topic_value);
  if(Object.keys(req.body).includes('start_date') && Object.keys(req.body).includes('end_date'))
    filter.set("timestamp",{[Op.between]:[moment(req.body.start_date).utcOffset("+02:00").format(),moment(req.body.end_date).utcOffset("+02:00").format()]})
  controller.eventsList(filter, res);
});

// Rotta per ottenere gli ultimi eventi registrati
app.get("/lastEvents",(req:any,res:any)=>{
  controller.getLastEvents(res)
});

// Si mette l'applicazione in ascolto sulla porta 3000
app.listen(3000,()=>{
  console.log('server running');
})

