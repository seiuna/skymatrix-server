
import * as log4js from "log4js"
import * as config from "../../config/config.json"
import {MongoClient} from "mongodb";
const logger = log4js.getLogger("[MONGODB]");

const options:any={  }
export const client= new MongoClient(config.mongodb_url,options);

export async function connect(){

}
