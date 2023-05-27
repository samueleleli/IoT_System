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
const Data_1 = require("../Models/Data");
// funzione che fa la query nel db per ottenere la lista degli eventi filtrati o la lista di tutti gli eventi
function eventsList(filterMap, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (filterMap.size == 0) { // se l'oggetto Map non ha dati al suo interno
                // ricerca senza filtri
                yield Data_1.Data.findAll({
                    attributes: ['topic', 'value', 'timestamp'],
                    order: [['timestamp', 'DESC']],
                }).then((eventsList) => {
                    // restituzione lista di tutti gli eventi
                    res.status(200).json({ Message: "All events", EventsList: eventsList });
                });
            }
            else {
                // altrimenti si ottiene l'oggetto dall'oggeto map
                let filterObj = Object.fromEntries(filterMap);
                Data_1.Data.findAll({
                    where: filterObj,
                    attributes: ['topic', 'value', 'timestamp'],
                    order: [['timestamp', 'DESC']],
                }).then((eventsList) => {
                    // restituzione degli eventi filtrati
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
// funzione che fa la query nel db per ottenere gli ultimi eventi registrati
function getLastEvents(res) {
    return __awaiter(this, void 0, void 0, function* () {
        // lista dei topic
        const topics = ['led', 'movimento', 'proxZone'];
        // inizializzazione lista da mandare
        const mostRecentEvents = [];
        // si scorre la lista dei topic
        for (const topic of topics) {
            // viene ottenuto l'ultimo evento per il topic selezionato
            const mostRecentEvent = yield Data_1.Data.findOne({
                where: {
                    topic: topic
                },
                order: [['timestamp', 'DESC']],
                limit: 1,
            });
            // viene inserito nella lista
            mostRecentEvents.push(mostRecentEvent);
        }
        // invio della lista al client
        res.status(200).json({ Message: "Most recents events", EventsList: mostRecentEvents });
    });
}
exports.getLastEvents = getLastEvents;
