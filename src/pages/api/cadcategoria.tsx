import { neon } from "@neondatabase/serverless";
import { NextApiRequest, NextApiResponse } from "next";

export default async function cadCategoria(req: NextApiRequest, res: NextApiResponse){

    if(req.method === "POST"){

        const header = req.headers;

        if(!header["x-key"])
            return res.status(401).json({erro: "Inválido!"});

        const key = header["x-key"].toString().split("Bearer ")[1];

        if(key != process.env.CAD_CATEGORIA)
            return res.status(401).json({erro: "Inválido!"});


        const body = req.body;

        if(!body && !body.nome_categoria)
            return res.status(500).json({erro: "Inválido!"});


        try {
            
            const sql = neon(`${process.env.DATABASE_URL}`);

            const nome_categoria = body.nome_categoria;

            await sql(`INSERT INTO categoria VALUES(DEFAULT,$1)`, [nome_categoria]);

        } catch (error) {
            console.log(error);
            return res.status(505).json({erro: "Algo deu errado"})
        }

        res.setHeader("Cache-Control","s-maxage=10, stale-while-revalidate");
        return res.status(200).json({sucesso: "ok"})

    }

    return res.status(405).json({erro: "Inválido!"})

}