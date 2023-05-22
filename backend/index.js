"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const controller = __importStar(require("./Controller/controller"));
const middleware = __importStar(require("./Middleware/events_middleware"));
const moment_1 = __importDefault(require("moment"));
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
// require('dotenv').config();
const app = express();
//sapp.use(cors());
app.use(bodyparser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
// Rotta per mostrare la lista degli eventi, filtrabile per topic, valore del topic e data/ora
app.post('/event', middleware.validateTopic, middleware.validateValueTopic, middleware.validateDate, (req, res) => {
    console.log('get events');
    let filter = new Map();
    if (Object.keys(req.body).includes('topic'))
        filter.set("topic", req.body.topic);
    if (Object.keys(req.body).includes('topic_value'))
        filter.set("value", req.body.topic_value);
    if (Object.keys(req.body).includes('start_date') && Object.keys(req.body).includes('end_date'))
        filter.set("timestamp", { [sequelize_1.Op.between]: [(0, moment_1.default)(req.body.start_date).utcOffset("+02:00").format(), (0, moment_1.default)(req.body.end_date).utcOffset("+02:00").format()] });
    controller.eventsList(filter, res);
});
app.get("/lastEvents", (req, res) => {
    controller.getLastEvents(res);
});
app.listen(3000, () => {
    console.log('server running');
});
