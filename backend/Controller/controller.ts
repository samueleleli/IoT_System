// Import libraries
import {DBSingleton} from "../Singleton/singleton";
import {Op, QueryTypes, Sequelize} from 'sequelize';
import {Data} from "../Models/Data";

const sequelize: Sequelize = DBSingleton.getConnection();

export async function eventsList(filterMap:Map<String,Object>, res:any): Promise<void>{
    try {
        if(filterMap.size == 0){
            await Data.findAll().then((eventsList: object[]) => {
                res.status(200).json({Message:"All events", EventsList:eventsList});
            });
        }else{
            let filterObj = Object.fromEntries(filterMap);
            Data.findAll({
                where:filterObj,
                attributes: ['topic', 'value', 'timestamp' ],
                order: [['timestamp','DESC']],
            }).then((eventsList: object[])=>{
                res.status(200).json({Message:"Filtered Events", EventsList:eventsList});
            })
        }
    }
    catch (error:any){
    console.log("db error");
   }
}
export async function getLastEvents(res:any){
  const topics = ['led', 'movimento', 'prossimita'];
  const mostRecentEvents = [];

  for (const topic of topics) {
    const mostRecentEvent = await Data.findOne({
      where: {
        topic: topic
      },
      order: [['timestamp', 'DESC']],
      limit: 1,
    });

    mostRecentEvents.push(mostRecentEvent);
  }
  res.status(200).json({Message:"Most recents events", EventsList:mostRecentEvents});
}