import * as jswbt from "jsonwebtoken"
import * as jose from "jose";
import {createLocalJWKSet} from "jose";
import fs from "fs";
import * as config from "../config/config.json"
export const keys=[]


export let RSA_PUB:any
export let RSA_PRI:any
export async function sign(data:any){
    const token  = await new jose.SignJWT(data)
        .setProtectedHeader({ alg: 'RS256' })
        .setIssuedAt()
        .setIssuer(config.issuer)
        .setAudience(config.audience)
        .setExpirationTime(config.exp_time)
        .sign(RSA_PRI)
    return token;
}
export async function generate(){
   const { publicKey, privateKey }= await jose.generateKeyPair('RS256')
    RSA_PUB=publicKey;
    RSA_PRI=privateKey;
  }
