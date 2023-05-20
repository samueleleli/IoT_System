
export const validateTopic = async (req: any, res: any, next: any) => {
  console.log("request body: ", req.body);
  if(!Object.keys(req.body).includes('topic')){
    next()
  }
  else{
    if(isNaN(req.body.topic)){
      next()
    }
    else{
      next("error bad format")
    }
  }
};

export const validateValueTopic = async (req: any, res: any, next: any) => {
  if(Object.keys(req.body).includes('topic_value')){
    if(Object.keys(req.body).includes('topic')){
      if(isNaN(req.body.topic)){
        next()
      }
      else{
        next("error no string")
      }
    }else{
      next("error no topic")
    }
  }
  else{
    next()
  }
}

export const validateDate = async (req:any,res:any,next:any) =>{
    const check = new RegExp(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z$/);
    if(Object.keys(req.body).includes('start_date') && Object.keys(req.body).includes('end_date') ){
      if(check.test(req.body.start_date) && Date.parse(req.body.start_date) &&
      (check.test(req.body.end_date) && Date.parse(req.body.end_date)) &&
      Date.parse(req.body.start_date) <= Date.parse(req.body.end_date) ){
        next()
      }else{
        //console.log("2")
        next("error date non valida")
      }
    } else if(!Object.keys(req.body).includes('start_date') && Object.keys(req.body).includes('end_date') ){
      req.body.start_date = "1970-01-01T00:00:00.000Z"
      if( (check.test(req.body.end_date) && Date.parse(req.body.end_date)) &&
        Date.parse(req.body.start_date) <= Date.parse(req.body.end_date) ){
        next()
      }else{
        //console.log("2")
        next("error end date")
      }
    } else if (!Object.keys(req.body).includes('end_date') && Object.keys(req.body).includes('start_date')){ // only start date
        // set della data odierna
        const today = new Date();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        const hour = today.getHours().toString().padStart(2, '0');
        const minute = today.getMinutes().toString().padStart(2, '0');
        const second = today.getSeconds().toString().padStart(2, '0');
        const timestamp = today.getFullYear() + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second + 'Z';
        console.log(timestamp)
        req.body.end_date = timestamp

        if(check.test(req.body.start_date) && Date.parse(req.body.start_date) &&
        Date.parse(req.body.start_date) <= Date.parse(req.body.end_date) ){
          next()
        }else{
          //console.log("2")
          next("error date non valida")
        }
    } else {
       next()  // without date filters
    }
}
