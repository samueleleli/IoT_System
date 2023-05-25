// funzione per validare i topic
export const validateTopic = async (req: any, res: any, next: any) => {
  console.log("request body: ", req.body);
  if(!Object.keys(req.body).includes('topic')){ // se non è presente  nel body vuol dire che
                                                // l'utente non vuole filtrare per topic
    next()
  }
  else{
    // se è presente il parametro topic si controlla il tipo
    if(isNaN(req.body.topic)){  // il topic deve essere una stringa
      next()
    }
    else{
      next("error bad format")
    }
  }
};

// funzione per validare il valore del topic
export const validateValueTopic = async (req: any, res: any, next: any) => {
  if(Object.keys(req.body).includes('topic_value')){ // se il body ha l'attributo topic_value
    if(Object.keys(req.body).includes('topic')){ // si controlla che abbia anche inserito il valore del topic
      if(isNaN(req.body.topic)){  // si controlla che sia una stringa
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
    // vuol dire che l'utente non vuole filtrare per valore del topic
    next()
  }
}

// funzione per validare la data
export const validateDate = async (req:any,res:any,next:any) =>{
    // espressione regolare da utilizzare per il tesrting della data
    const check = new RegExp(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/)
    if(Object.keys(req.body).includes('start_date') && Object.keys(req.body).includes('end_date') ){
      // caso 1: se l'utente ha incluso sia data di inizio che data di fine
      if(check.test(req.body.start_date) && Date.parse(req.body.start_date) &&
      (check.test(req.body.end_date) && Date.parse(req.body.end_date)) &&
      Date.parse(req.body.start_date) <= Date.parse(req.body.end_date) ){
        // se le date sono valide e la data di inizio è prima della data di fine
        next()
      }else{
        next("error date non valida")
      }
    } else if(!Object.keys(req.body).includes('start_date') && Object.keys(req.body).includes('end_date') ){
      // caso 2: se l'utente ha indicato solo la data di fine viene impostata quella di inizio
      req.body.start_date = "1970-01-01T00:00:00.000"
      if( (check.test(req.body.end_date) && Date.parse(req.body.end_date)) &&
        Date.parse(req.body.start_date) <= Date.parse(req.body.end_date) ){
        // se le date sono valide
        next()
      }else{
        next("error end date")
      }
    } else if (!Object.keys(req.body).includes('end_date') && Object.keys(req.body).includes('start_date')){
        // caso 3: se l'utente ha indicato solo la data di inizio viene impostata quella di fine
        // set della data odierna
        const today = new Date();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        const hour = today.getHours().toString().padStart(2, '0');
        const minute = today.getMinutes().toString().padStart(2, '0');
        const second = today.getSeconds().toString().padStart(2, '0');
        const timestamp = today.getFullYear() + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second //+ 'Z';
        console.log(timestamp)
        req.body.end_date = timestamp

        if(check.test(req.body.start_date) && Date.parse(req.body.start_date) &&
        Date.parse(req.body.start_date) <= Date.parse(req.body.end_date) ){
          // se le date sono valide
          next()
        }else{
          next("error date non valida")
        }
    } else {
       next()  // caso 4: vuol dire che l'utente non vuole filtrare per data
    }
}
