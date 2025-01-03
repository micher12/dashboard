"use server";

import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

export default async function createProductStripe(req: NextApiRequest, res: NextApiResponse){

    if(req.method === "POST"){
        const headers = req.headers;

        if(!headers["x-key"])
            return res.status(401).json({erro:"Inválido"});

        const key = headers["x-key"].toString().split("Bearer ")[1];

        if(key != process.env.STRIPE_API)
            return res.status(401).json({erro:"Inválido"});
        
        try {

            const body = req.body;

            if(!body) return res.status(500).json({erro: "Body not found"});

            const name = body.nome as string;
            const preco = body.preco as number;
            const metadata: Stripe.MetadataParam = body.metadata;
            const description = body.descricao as string;
            const images = body.images as string[];

            const stripe = new Stripe(process.env.STRIPE_SECRET as string);

            const product = await stripe.products.create({
                name: name,
                description: description,
                metadata: metadata,
                default_price_data: {
                    currency: "brl",
                    unit_amount: preco
                },
                images: images
            });
            

            return res.status(200).json({sucesso: "ok", product: product});


        } catch (error) {
            console.log(error);
            return res.status(505).json({erro:"Inválido"});
        }

    }

    return res.status(405).json({erro:"Inválido"})

}
