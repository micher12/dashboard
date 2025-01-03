"use server";

import { neon } from "@neondatabase/serverless";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

export default async function updateProductStripe(req: NextApiRequest, res: NextApiResponse){

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

            const id_produto = body.id_produto as number;
            const name = body.nome_produto as string;
            const descricao_produto = body.descricao_produto as string;
            const preco_produto = body.preco_produto as number;
            const prod_produto = body.prod_produto as string;
            const ativado_produto = body.ativado_produto as boolean;
            const metadata = body.metadata as {};
            const images = body.images as string[];

            const newPrice: any = {};
            newPrice.current = false;

            const stripe = new Stripe(process.env.STRIPE_SECRET as string);
            const sql = neon(`${process.env.DATABASE_URL}`);

            const result = await sql(`SELECT preco_produto FROM produto WHERE id_produto = $1`,[id_produto])

            const oldPrice = result[0].preco_produto;

            if(oldPrice != preco_produto){
                //gerarNewPriceId;
                const price = await stripe.prices.create({
                    currency: 'brl',
                    unit_amount: preco_produto,
                    product: prod_produto
                });

                newPrice.id = price.id;
                newPrice.current = true;
            }

            if(newPrice.current){
                await stripe.products.update(prod_produto,{
                    default_price: newPrice.id
                })
            }

            const product = await stripe.products.update(prod_produto,{
                active: ativado_produto,
                name: name,
                description: descricao_produto,
                metadata: metadata,
                images: images,
            })

            return res.status(200).json({sucesso: "ok", product: product});


        } catch (error) {
            console.log(error);
            return res.status(505).json({erro:"Inválido"});
        }

    }

    return res.status(405).json({erro:"Inválido"})

}
