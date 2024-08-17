import * as Router from "koa-router";
import {routers} from "./index";
import {sign} from "../sign";
import {client} from "../database";
import {checkParamsAndBack} from "../utils";
import * as md5 from "md5"
import {toBase64} from "js-base64"

export const adminroute=new Router();

const inviteCode=client.db("skymatrix").collection("invite_codes");
const code=client.db("skymatrix").collection("codes");
const users=client.db("skymatrix").collection("users");
/**
 * {
 *     email:string
 *     username:string
 *     password:string
 *     invite_code:string
 * }
 */
adminroute.post("/admin/generate",async (ctx:any)=>{
    const data=ctx.request.body;
    const type=String(data.type)
    const count=String(data.count)
    if(data.count>100){
        ctx.body="count is too large"
        return;
    }
    if(!ctx.payload.doPermission("admin.generation")){
        ctx.body="no permission"
        return;
    }
    if(!checkParamsAndBack(ctx, "type","count"))return;
    if(type==="invite"){
            const data:Array<any> =[]
        const rv:Array<string> =[]
            for (let i=0;i<parseInt(count);i++){
                const code=String(md5(Math.random()+" "+Date.now()));
                data.push({
                    code:code,
                    used:false
                })
                rv.push(code)
            }
             ctx.body=rv;
            await inviteCode.insertMany(data)

    }
    if(type==="code"){
        if( ctx.request.body.payload){
            const data:Array<any> =[]
            const rv:Array<string> =[]
            const basePaylaod=toBase64( JSON.stringify(ctx.request.body.payload));
            for (let i=0;i<parseInt(count);i++){
                const code=String(md5(Math.random()+" "+Date.now()))+"."+basePaylaod;
                data.push({
                    code:code,
                    used:false
                })
                rv.push(code)
            }
            ctx.body=rv;
            await code.insertMany(data)


        }else {
            ctx.body="no provide payload.md"
        }
    }

})
