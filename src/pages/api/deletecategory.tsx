import { neon } from "@neondatabase/serverless";
import { NextApiRequest, NextApiResponse } from "next";

export default async function deleteCategory(req: NextApiRequest, res: NextApiResponse){

    if(req.method === "POST"){
        const header = req.headers;
        if(!header["x-key"])
            return res.status(401).json({erro: "Inválido!"})

        const key = header["x-key"].toString().split("Bearer ")[1];

        if(key != process.env.DELETE_CATEGORY)
            return res.status(401).json({erro: "Inválido!"})

        const body = req.body;

        if(!body)
            return res.status(500).json({erro: "Algo deu errado!"})

        const id_categoria = body.id_categoria;

        if(!id_categoria)
            return res.status(500).json({erro: "Algo deu errado!"})

        //deletar
        const sql = neon(`${process.env.DATABASE_URL}`);

        try {
            await sql(`delete from categoria WHERE id_categoria = $1`, [id_categoria]);

        } catch (error: any) {
            const code = parseInt(error.code);

            if(code === 23503)
                return res.status(500).json({erro: "Categoria está vinculada com um produto!"})
            
            return res.status(500).json({erro: "Algo deu errado!"})
        }

        res.setHeader("Cache-Control","s-maxage=10, stale-while-revalidate");
        return res.status(200).json({sucesso: "ok"})
    }

    return res.status(405).json({erro: "Inválido!"})

}