import { neon } from "@neondatabase/serverless";
import { NextApiRequest, NextApiResponse } from "next";

export default async function updateProduct(req:NextApiRequest, res: NextApiResponse){

    if(req.method === "POST"){
        const header = req.headers;
        if(header["x-key"]?.toString().split("Bearer ")[1] === process.env.UPDATE_PRODUCT){
            const body = req.body;

            const ativado_produto = (body.ativado_produto === "true") ? true : false;
            const descricao_produto = body.descricao_produto as string;
            const id_produto = parseInt(body.id_produto);
            const nome_produto = body.nome_produto as string;
            const preco_produto = parseInt(body.preco_produto);
            const prod_produto = ((body.prod_produto.toString().trim()) === "") ? null : body.prod_produto;
            const quantidade_estoque = parseInt(body.quantidade_estoque);
            const rascunho_produto = (body.rascunho_produto === "true") ? true : false;
            const id_categoria = parseInt(body.id_categoria);

            if(!nome_produto || preco_produto <= 0 || id_produto <= 0 || !descricao_produto || quantidade_estoque <= 0 || id_categoria <= 0)
                return res.status(500).json({erro: "Dados inválidos!"})

            const sql = neon(`${process.env.DATABASE_URL}`)

            const query = ` UPDATE produto SET ativado_produto = $1, descricao_produto = $2, nome_produto = $3, preco_produto = $4, prod_produto = $5, rascunho_produto = $6, id_categoria = $7 WHERE id_produto = $8 `
            const values = [ ativado_produto, descricao_produto, nome_produto, preco_produto, prod_produto, rascunho_produto, id_categoria, id_produto ];

            await sql(query, values);

            const id_estoque: any = await sql(`SELECT id_estoque FROM estoque WHERE id_produto = ${id_produto}`);

            await sql('UPDATE estoque SET quantidade_estoque = $1 WHERE id_estoque = $2', [quantidade_estoque, id_estoque[0].id_estoque]);

            res.setHeader("Cache-Control","s-maxage=10, stale-while-revalidate");
            return res.status(200).json({sucesso: "ok"})

        }

        return res.status(401).json({erro: "Inválido!"})
    }

    return res.status(405).json({erro: "Inválido!"})

}