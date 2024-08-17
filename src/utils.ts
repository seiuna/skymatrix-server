import * as Lodash from "lodash"
import {Context} from "koa";

export function checkParams(data:any,...params:Array<string>){
    const lost:Array<string> =[]
    for (const a of params){
        if(data[a]===undefined){
            lost.push(a)
        }
    }
    return lost;
}
export function checkParamsAndBack(ctx:Context,...params:Array<string>){
    if(Lodash.isEmpty(ctx.request.body)){
        ctx.status=400;
        ctx.body="Lost params: "+params.join(",")
        return false;
    }
    const a=checkParams(ctx.request.body,...params);
    if(a.length===0){
        return true;
    }else {
        ctx.status=400;
        ctx.body="Lost params: "+a.join(",")
        return false;
    }
}

/**
 *     permission(perms,"irc.send","irec.receive","admin.generation","test.ccc","test.ccdc")
 *     irc.send true
 *     irec.receive false
 *     admin.generation true
 *     test.ccc true
 *     test.ccdc false
 *     admin admin.sss false
 * @param perms
 * @param permissions
 */
export  function permission(perms:Array<string>,...permissions:string[]){
    if(perms.includes("*"))return true;
    let flag=true;
    permissions.forEach((v)=>{
        flag=flag&&perms.some((p)=>{
            if(p.endsWith(".*")){
                return v.startsWith(p.replace(".*",""))
            }else {
                return v===p
            }
        })
    })
    return flag;
}
