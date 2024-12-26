"use server";

export default async function getSetCapeReqToken(){
    return process.env.SET_CAPE;
}