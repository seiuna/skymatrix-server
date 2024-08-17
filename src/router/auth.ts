import * as Router from "koa-router";
import {routers} from "./index";
import {sign} from "../sign";
import {client} from "../database";
import {checkParamsAndBack} from "../utils";
import {ObjectId} from "mongodb";

export const authroute=new Router();

const inviteCode=client.db("skymatrix").collection("invite_codes");
const users=client.db("skymatrix").collection("users");
/**
 * {
 *     email:string
 *     username:string
 *     password:string
 *     invite_code:string
 * }
 */
authroute.post("/public/register",async (ctx:any)=>{
    const data=ctx.request.body;
    const username=String(data.username)
    const email=String(data.email)
    const invite_code=String(data.invite_code)
    const password=String(data.password)
    if(!checkParamsAndBack(ctx, "email", "username", "password", "invite_code"))return;
    const aabb=await users.findOne({$or:[
            {email:String(email)},
            {username:String(username)},
            {invite_code:String(invite_code)},
        ]});
    if(aabb){
        if(aabb.invite_code===invite_code){
            ctx.body="invite code is used"
            return;
        }else {
            ctx.body="email or username is used"
            return;
        }
    }else {
        if(await inviteCode.findOne({code:invite_code})){
            await users.insertOne({
                email:email,
                username:username,
                password:password,
                invite_code:invite_code,
                register_time:Date.now(),
                permissions:[
                    "user.base"
                ],
                prefix:"User",
                irc_name:username
            })
            await inviteCode.findOneAndReplace({code:invite_code},{code:invite_code,used:true})
            ctx.body="ok"
            return;
        }
    }

})

/**
 * {
 *     data:{
 *         username
 *         password
 *     }
 *     time:number
 *     sign:string
 * }
 */
authroute.post("/public/login",async (ctx:any)=>{
    const data=ctx.request.body;
    if(checkParamsAndBack(ctx, "username","password","guest")){
        const username=String(data.username)
        const password=String(data.password)

        const user=   await users.findOne({
            $and:[
                {password:password},
                {username:username}
            ]
        })
   if( user){
       ctx.body=await sign({
           userid:String(user._id),
           username:user.username,
           guest:false,
           permissions:user.permissions,
           irc:{
               irc_name:user.irc_name,
               prefix:user.perfix
           }
       })
   }else {
       ctx.body="no user found"
   }

    }else if(data.guest){
        ctx.body=await sign({
            userid:"-1",
            username:"Guest",
            guest:true,
            permissions:[
                "irc.send",
                "irc.receive"
            ],
            irc:{
                irc_name:"Guest",
                prefix:"Guest"
            }
        })
    }

})

