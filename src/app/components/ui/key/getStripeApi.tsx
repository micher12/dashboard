"use server";
export default async function getStripeApi(){
    return process.env.STRIPE_API;
}