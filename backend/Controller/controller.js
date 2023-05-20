"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastEvents = exports.eventsList = void 0;
// Import libraries
const singleton_1 = require("../Singleton/singleton");
const Data_1 = require("../Models/Data");
const sequelize = singleton_1.DBSingleton.getConnection();
function eventsList(filterMap, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (filterMap.size == 0) {
                yield Data_1.Data.findAll().then((eventsList) => {
                    res.status(200).json({ Message: "All events", EventsList: eventsList });
                });
            }
            else {
                let filterObj = Object.fromEntries(filterMap);
                Data_1.Data.findAll({
                    where: filterObj,
                    attributes: ['topic', 'value', 'timestamp'],
                    order: [['timestamp', 'DESC']],
                }).then((eventsList) => {
                    res.status(200).json({ Message: "Filtered Events", EventsList: eventsList });
                });
            }
        }
        catch (error) {
            console.log("db error");
        }
    });
}
exports.eventsList = eventsList;
function getLastEvents(res) {
    return __awaiter(this, void 0, void 0, function* () {
        const topics = ['led', 'movimento', 'proxZone'];
        const mostRecentEvents = [];
        for (const topic of topics) {
            const mostRecentEvent = yield Data_1.Data.findOne({
                where: {
                    topic: topic
                },
                order: [['timestamp', 'DESC']],
                limit: 1,
            });
            mostRecentEvents.push(mostRecentEvent);
        }
        res.status(200).json({ Message: "Most recents events", EventsList: mostRecentEvents });
    });
}
exports.getLastEvents = getLastEvents;
