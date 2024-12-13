"use server";

import { list } from "@vercel/blob";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getimage(req: NextApiRequest, res: NextApiResponse){
    if(req.method === "POST"){

        const header = req.headers;

        if(header["x-key"]){

            const token = header["x-key"].toString().split("Bearer ")[1];

            if(token === process.env.GET_IMAGE_TOKEN){
                try {
                    
             
                const blobs = await list({ prefix: `produto/${req.body.id}` });

                    res.setHeader("Cache-Control","s-maxage=10, stale-while-revalidate");
                    return res.status(200).json(blobs);

                } catch (error) {
                    console.log(error);
                    return res.status(500).json({erro:"Algo deu errado!"})
                }
            }

            return res.status(401).json({erro:"Inválido!"})
           
        }

        return res.status(401).json({erro:"Inválido!"})
        
    }

    return res.status(405).json({erro:"Inválido!"})
}