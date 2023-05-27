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
exports.validateDate = exports.validateValueTopic = exports.validateTopic = void 0;
// funzione per validare i topic
const validateTopic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("request body: ", req.body);
    if (!Object.keys(req.body).includes('topic')) { // se non è presente  nel body vuol dire che
        // l'utente non vuole filtrare per topic
        next();
    }
    else {
        // se è presente il parametro topic si controlla il tipo
        if (isNaN(req.body.topic)) { // il topic deve essere una stringa
            next();
        }
        else {
            next("error bad format");
        }
    }
});
exports.validateTopic = validateTopic;
// funzione per validare il valore del topic
const validateValueTopic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (Object.keys(req.body).includes('topic_value')) { // se il body ha l'attributo topic_value
        if (Object.keys(req.body).includes('topic')) { // si controlla che abbia anche inserito il valore del topic
            if (isNaN(req.body.topic)) { // si controlla che sia una stringa
                next();
            }
            else {
                next("error no string");
            }
        }
        else {
            next("error no topic");
        }
    }
    else {
        // vuol dire che l'utente non vuole filtrare per valore del topic
        next();
    }
});
exports.validateValueTopic = validateValueTopic;
// funzione per validare la data
const validateDate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // espressione regolare da utilizzare per il tesrting della data
    const check = new RegExp(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
    if (Object.keys(req.body).includes('start_date') && Object.keys(req.body).includes('end_date')) {
        // caso 1: se l'utente ha incluso sia data di inizio che data di fine
        if (check.test(req.body.start_date) && Date.parse(req.body.start_date) &&
            (check.test(req.body.end_date) && Date.parse(req.body.end_date)) &&
            Date.parse(req.body.start_date) <= Date.parse(req.body.end_date)) {
            // se le date sono valide e la data di inizio è prima della data di fine
            next();
        }
        else {
            next("error date non valida");
        }
    }
    else if (!Object.keys(req.body).includes('start_date') && Object.keys(req.body).includes('end_date')) {
        // caso 2: se l'utente ha indicato solo la data di fine viene impostata quella di inizio
        req.body.start_date = "1970-01-01T00:00:00.000";
        if ((check.test(req.body.end_date) && Date.parse(req.body.end_date)) &&
            Date.parse(req.body.start_date) <= Date.parse(req.body.end_date)) {
            // se le date sono valide
            next();
        }
        else {
            next("error end date");
        }
    }
    else if (!Object.keys(req.body).includes('end_date') && Object.keys(req.body).includes('start_date')) {
        // caso 3: se l'utente ha indicato solo la data di inizio viene impostata quella di fine
        // set della data odierna
        const today = new Date();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        const hour = today.getHours().toString().padStart(2, '0');
        const minute = today.getMinutes().toString().padStart(2, '0');
        const second = today.getSeconds().toString().padStart(2, '0');
        const timestamp = today.getFullYear() + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second; //+ 'Z';
        console.log(timestamp);
        req.body.end_date = timestamp;
        if (check.test(req.body.start_date) && Date.parse(req.body.start_date) &&
            Date.parse(req.body.start_date) <= Date.parse(req.body.end_date)) {
            // se le date sono valide
            next();
        }
        else {
            next("error date non valida");
        }
    }
    else {
        next(); // caso 4: vuol dire che l'utente non vuole filtrare per data
    }
});
exports.validateDate = validateDate;
