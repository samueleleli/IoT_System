// Import libraries
import {Data} from "../Models/Data";

// funzione che fa la query nel db per ottenere la lista degli eventi filtrati o la lista di tutti gli eventi
export async function eventsList(filterMap:Map<String,Object>, res:any): Promise<void>{
    try {
        if(filterMap.size == 0){  // se l'oggetto Map non ha dati al suo interno
            // ricerca senza filtri
            await Data.findAll({
              attributes: ['topic', 'value', 'timestamp' ],
              order: [['timestamp','DESC']],
          }).then((eventsList: object[]) => {
                // restituzione lista di tutti gli eventi
                res.status(200).json({Message:"All events", EventsList:eventsList});
            });
        }else{
            // altrimenti si ottiene l'oggetto dall'oggeto map
            let filterObj = Object.fromEntries(filterMap);
            Data.findAll({
                where:filterObj,
                attributes: ['topic', 'value', 'timestamp' ],
                order: [['timestamp','DESC']],
            }).then((eventsList: object[])=>{
                // restituzione degli eventi filtrati
                res.status(200).json({Message:"Filtered Events", EventsList:eventsList});
            })
        }
    }
    catch (error:any){
    console.log("db error");
   }
}

// funzione che fa la query nel db per ottenere gli ultimi eventi registrati
export async function getLastEvents(res:any){
  // lista dei topic
  const topics = ['led', 'movimento', 'proxZone'];
  // inizializzazione lista da mandare
  const mostRecentEvents = [];
  // si scorre la lista dei topic
  for (const topic of topics) {
    // viene ottenuto l'ultimo evento per il topic selezionato
    const mostRecentEvent = await Data.findOne({
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
  res.status(200).json({Message:"Most recents events", EventsList:mostRecentEvents});
}