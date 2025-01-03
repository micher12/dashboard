"use server";

import { neon } from "@neondatabase/serverless";
import { NextApiRequest, NextApiResponse } from "next";

interface UlrsInterface{
    [key: number]: string
}

export default async function getproducts(req: NextApiRequest, res: NextApiResponse){

    if(req.method === "POST"){

        const header = req.headers;

        if(header["x-key"] && header["x-key"].toString().split("Bearer ")[1] === process.env.GET_PRODUCT){

            const body = req.body;

            const sql = neon(`${process.env.DATABASE_URL}`)

            const query = await sql(`
                SELECT p.id_produto, p.nome_produto, p.descricao_produto, p.preco_produto, p.ativado_produto, e.quantidade_estoque, p.id_categoria, p.prod_produto, c.nome_categoria, p.rascunho_produto
                FROM produto as p 
                LEFT JOIN estoque as e ON e.id_produto = p.id_produto
                LEFT JOIN categoria as c ON p.id_categoria = c.id_categoria
            `);

            const ids: number[] = [];
            const urls: UlrsInterface[] = [];

            query.forEach((val)=>{
                if(val){
                ids.push(val.id_produto);
                }
            })

            const token = process.env.GET_IMAGE_TOKEN;
        
            await Promise.all(ids.map(async (val)=>{
                const api = await fetch(`${process.env.DOMAIN_PATH}api/getimage`,{
                method:"POST",
                body: JSON.stringify({id: val}),
                headers:{
                    "Content-type":"application/json",
                    "x-key": `Bearer ${token}`
                }
                })

                const status = api.status;
                const response = await api.json();

                if(status === 200){
                if(response && response.blobs.length > 0){
                    const preUrls: string[] = [];
                    for(const preUrl of response.blobs){
                    preUrls.push(preUrl.url);
                    }

                    urls[val] = preUrls;
                }
                }

            }));


            if(urls.length > 0){
                for(let x = 0; x < query.length; x++){
                if(urls[query[x].id_produto]){
                    query[x].urls = urls[query[x].id_produto];
                }
                }

            }
            
            res.setHeader("Cache-Control","s-maxage=10, stale-while-revalidate");
            return res.status(200).json({sucesso: "ok", data: query})
        }

        return res.status(401).json({erro: "Inválido!"})

    }

    return res.status(405).json({erro: "Inválido!"})

}