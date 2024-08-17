
import * as Koa from "koa"
import {routers} from "./router";
import * as Router from "koa-router"
import * as config from "../config/config.json"
import {
    jwt_middleware,
    logger_middleware,
    paylaodDecode_middleware,
    restful_middleware,
    unauth_middleware
} from "./middleware";
import * as log4js from "log4js"
import * as jwksRsa from "jwks-rsa";
import * as jose from 'jose'
import {generate} from "./sign";
import {checkParams} from "./utils";
import * as bodyparser from "koa-bodyparser";


log4js.configure(process.cwd()+'/config/log4js.json');
const logger = log4js.getLogger("[RECORD]");

(async ()=>{
    console.log(checkParams({name:"213"},"name","user","wewe","asdddd"))
    await generate();
    // var publicKey = fs.readFileSync('/path/to/public.pub');
    // app.use(jwt({ secret: publicKey }));
    const app=new Koa()
    app.use(logger_middleware)
    app.use(restful_middleware)
    app.use(unauth_middleware)
    app.use(jwt_middleware)
    app.use(paylaodDecode_middleware)
    app.use(bodyparser())
    // 加载所有router
    routers.forEach((v:Router)=>{
        app.use(v.routes()).use(v.allowedMethods())
    })
    app.listen(config.port)
    logger.info(`Server are listening port ${config.port}`)
})()


