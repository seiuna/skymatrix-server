import * as Router from "koa-router";
import {client} from "../database";
import {checkParamsAndBack} from "../utils";
import * as md5 from "md5";
import {fromBase64, toBase64} from "js-base64";
import {ObjectId} from "mongodb";

export const userroute=new Router();

const inviteCode=client.db("skymatrix").collection("invite_codes");
const codes=client.db("skymatrix").collection("codes");
const users=client.db("skymatrix").collection("users");
/**
 */
userroute.post("/user/code",async (ctx:any)=>{
    const data=ctx.request.body;
    const code=String(data.code)

    if(checkParamsAndBack(ctx,"code")){
        const codec=await codes.findOne({code:code});
        if(codec){
           if(!codec.used){
               const userid=new ObjectId(ctx.payload.userid);
               const user:any=await users.findOne({_id:userid})
               const v=JSON.parse(fromBase64(codec.code.split(".")[1]));
               user.permissions.push(...v.permissions)
               ctx.body={
                   message:"update user permissions",
                   permissions:user.permissions
               }
               await codes.updateOne({code:code},{$set:{used:true}})
               await users.updateOne({_id:userid},{$set:user})
           }else {
                ctx.body="code is used"
           }
        }else {
            ctx.body="code not found"
        }
    }
})
