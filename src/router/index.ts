import * as Router from "koa-router";
import {authroute} from "./auth";
import {jwtroute} from "./jwt";
import {adminroute} from "./admin";
import {userroute} from "./user";


export const routers:Array<Router>=[

]
export const route=new Router();

routers.push(authroute)
routers.push(jwtroute)
routers.push(adminroute)
routers.push(userroute)



