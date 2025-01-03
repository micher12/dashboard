"use server";
export default async function getActiveReqToken(){
    return process.env.GET_ACTIVE;
}