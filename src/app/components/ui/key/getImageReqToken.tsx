"use server";

export default async function getImageReqToken(){
    return process.env.GET_IMAGE_TOKEN;
}