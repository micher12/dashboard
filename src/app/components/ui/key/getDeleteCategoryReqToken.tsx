"use server";
export default async function getDeleteCategoryReqToken(){
    return process.env.DELETE_CATEGORY;
}