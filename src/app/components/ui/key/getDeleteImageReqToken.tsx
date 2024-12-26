"use server";

export default async function getDeleteImageReqToken(){
    return process.env.DELETE_IMAGE;
}