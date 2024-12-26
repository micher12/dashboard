"use server";

import { del } from "@vercel/blob";
import { NextApiRequest, NextApiResponse } from "next";

export default async function deleteImage(req: NextApiRequest, res: NextApiResponse){

    if(req.method === "POST"){

        const header = req.headers;
        if(!header["x-key"])
            return res.status(401).json({erro: "Inválido!"});

        const key = header["x-key"].toString().split("Bearer ")[1];

        if(key != process.env.DELETE_IMAGE)
            return res.status(401).json({erro: "Inválido!"});

        const url: string = req.body.url;

        if(url){

            //buscar se é capa.

            await del(url);

            res.setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate");
            return res.status(200).json({sucesso: "ok"})
            
        }

        return res.status(500).json({erro: "Algo deu errado!"})

    }

    return res.status(405).json({erro: "Inváldio!"})

}