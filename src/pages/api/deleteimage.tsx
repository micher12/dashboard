"use server";

import { del, list } from "@vercel/blob";
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
            const id = url.split("produto")[1].split("/")[1];

            const findCape = await list({
                prefix: `produto/${id}/capa_`
            });

            if(findCape.blobs.length > 0){
                const parts = url.split("produto")[1].split("/")[2].split("-");

                const imageId = parts.filter((_,index)=> index !== 3 ).join("-");
                
                const partsCape = findCape.blobs[0].url.split("capa_")[1].split("-");
                const capeId = partsCape.filter((_,index)=> index !== 3 ).join("-");

                if(capeId === imageId){
                    await del(findCape.blobs[0].url);
                    await del(url);
                }else{
                    await del(url);
                }
            }else{
                await del(url);
            }

            res.setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate");
            return res.status(200).json({sucesso: "ok"})
            
        }

        return res.status(500).json({erro: "Algo deu errado!"})

    }

    return res.status(405).json({erro: "Inváldio!"})

}