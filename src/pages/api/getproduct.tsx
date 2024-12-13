import { neon } from "@neondatabase/serverless";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getproduct(req: NextApiRequest, res: NextApiResponse){

    if(req.method === "POST"){

        const header = req.headers;

        if(header["x-key"] && header["x-key"].toString().split("Bearer ")[1] === process.env.GET_PRODUCT){

            const body = req.body;

            if(!body.id_produto)
                return res.status(500).json({erro: "Undefined request."})

            const sql = neon(`${process.env.DATABASE_URL}`)

            const query = await sql(`
                SELECT p.id_produto, p.nome_produto, p.descricao_produto, p.preco_produto, p.ativado_produto, e.quantidade_estoque, p.id_categoria, p.prod_produto, c.nome_categoria, p.rascunho_produto
                FROM produto as p 
                LEFT JOIN estoque as e ON e.id_produto = p.id_produto
                LEFT JOIN categoria as c ON p.id_categoria = c.id_categoria
                WHERE p.id_produto = ${body.id_produto}
            `);
            
            res.setHeader("Cache-Control","s-maxage=10, stale-while-revalidate");
            return res.status(200).json({sucesso: "ok", data: query})
        }

        return res.status(401).json({erro: "Inválido!"})

    }

    return res.status(405).json({erro: "Inválido!"})

}