"use server";

export default async function getUploadReqToken(){
    return process.env.GET_UPLOAD;
}