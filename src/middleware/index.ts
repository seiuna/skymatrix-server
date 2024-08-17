import * as jwt from "koa-jwt";
import * as jwksRsa from "jwks-rsa";
import * as log4js from "log4js";
import {Context} from "koa";
import * as jose from "jose";
import {permission} from "../utils";
const logger = log4js.getLogger("[RECORD]");
import * as config from "../../config/config.json"
export const jwt_middleware=jwt({
    debug:true,
    secret: jwksRsa.koaJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 2,
        jwksUri: config.jwks_url

    }),
    audience:config.audience,
    issuer:config.issuer,
    algorithms: [ 'RS256' ]
}).unless(
    {
        path: [/^\/public/,/^\/.well-known/],
    }
)

export const logger_middleware=async (ctx:any,next:any)=>{
    const started = Date.now()
    await next().finally(()=>{
        const ellapsed = (Date.now() - started) + 'ms'
        logger.info('Response time is:', ellapsed," Path:",ctx.request.url," Protocol:",ctx.protocol," status:",ctx.status)
        ctx.set('X-ResponseTime', ellapsed)
    })

}
export const restful_middleware=async (ctx:any,next:any)=>{
    await next()
    if(ctx.url.includes("/.well-known/"))return
    ctx.body={
        path:ctx.request.url,
        code: ctx.status,
        message: ctx.message,
        data: ctx.body,
    }
}
export const unauth_middleware=async (ctx:any,next:any)=>{
    await next().catch((err:any)=>{
        if(err.status == 401){
            ctx.status=401;
        }else {
            throw err;
        }
    })

}
export const paylaodDecode_middleware=async (ctx:Context,next:any)=>{
    if(ctx.request.headers.authorization){
        const v=ctx.request.headers.authorization.split(" ");
        if(v.length===2){
            const token=v[1];
            const a=  token.split(".");
            ctx.payload=jose.decodeJwt(token);
            ctx.payload.doPermission=(function (this:any,...perm:Array<string>){
               return  permission(this.permissions,...perm)
            }).bind(ctx.payload)
        }
    }
    await next()
}
