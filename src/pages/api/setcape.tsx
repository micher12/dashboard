"use server";

import { del, list, put } from "@vercel/blob";
import { NextApiRequest, NextApiResponse } from "next";

export default async function setCape(req: NextApiRequest, res: NextApiResponse){

    if(req.method === "POST"){

        const header = req.headers;
        if(!header["x-key"])
            return res.status(401).json({erro: "Inválido!"});

        const key = header["x-key"].toString().split("Bearer ")[1];

        if(key != process.env.SET_CAPE)
            return res.status(401).json({erro: "Inválido!"});

        const id: number = req.body.id_produto;
        const imageId: string = req.body.id_image;

        if(id && imageId){

            
            const findCape = await list({
                prefix: `produto/${id}/capa_`
            });

            const hasCape = findCape.blobs.length > 0 ? true : false;

            try {
                
                if(hasCape){
                    const lastCape = findCape.blobs[0].url
                    await del(lastCape);
                    
                    await put(`produto/${id}/capa_${imageId}.txt`, `capa_${imageId}`, {
                        access: 'public',
                    });


                }else{
                    await put(`produto/${id}/capa_${imageId}.txt`, `capa_${imageId}`, {
                        access: 'public',
                    });
                }

            } catch (error) {
                console.log(error);
                return res.status(505).json({erro: "Algo deu errado!"})
            }
            
            res.setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate");
            return res.status(200).json({sucesso: "ok"})
            
        }

        return res.status(500).json({erro: "Algo deu errado!"})

    }

    return res.status(405).json({erro: "Inváldio!"})

}