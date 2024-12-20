"use server";
export default async function getUpdateProductToken(){
    return process.env.UPDATE_PRODUCT;
}