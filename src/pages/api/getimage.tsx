"use server";

import { list } from "@vercel/blob";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getimage(req: NextApiRequest, res: NextApiResponse){
    if(req.method === "POST"){
        const blobs = await list({ prefix: `produto/${req.body.id}` });

        return res.status(200).json(blobs);
    }

    return res.status(405).json({erro:"Inválido!"})
}