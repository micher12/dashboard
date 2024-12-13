import { neon } from "@neondatabase/serverless";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getCategorias(req: NextApiRequest, res: NextApiResponse){

    if(req.method === "POST"){

        const header = req.headers;

        if(header["x-key"] && header["x-key"].toString().split("Bearer ")[1] === process.env.GET_CATEGORIA){

            const sql = neon(`${process.env.DATABASE_URL}`)

            const query = await sql(`
                SELECT * FROM categoria
            `);
            
            res.setHeader("Cache-Control","s-maxage=10, stale-while-revalidate");
            return res.status(200).json({sucesso: "ok", data: query})
        }

        return res.status(401).json({erro: "Inválido!"})

    }

    return res.status(405).json({erro: "Inválido!"})

}