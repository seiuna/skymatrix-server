import * as Router from "koa-router";
import {RSA_PRI, RSA_PUB, sign} from "../sign";
import * as jose from "jose";

export const jwtroute=new Router();

/**
 * e
 */
jwtroute.get("/.well-known/jwks.json",async (ctx:any)=>{
    const jwk=await jose.exportJWK(RSA_PUB);
    ctx.body={
        keys:[
            jwk
        ]
    }
})


