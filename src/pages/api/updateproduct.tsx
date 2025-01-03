import getStripeApi from "@/app/components/ui/key/getStripeApi";
import { metadata } from "@/app/layout";
import { neon } from "@neondatabase/serverless";
import { error } from "console";
import { url } from "inspector";
import { NextApiRequest, NextApiResponse } from "next";

export default async function updateProduct(req:NextApiRequest, res: NextApiResponse){

    if(req.method === "POST"){
        const header = req.headers;
        if(header["x-key"]?.toString().split("Bearer ")[1] === process.env.UPDATE_PRODUCT){
            const body = req.body;

            const ativado_produto = (body.ativado_produto.toString().trim() === "true") ? true : false;
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


            async function getImages(){
                const token = process.env.GET_IMAGE_TOKEN;

                const urls: string[] = [];
            
                const api = await fetch(`${process.env.DOMAIN_PATH}api/getimage`,{
                method:"POST",
                body: JSON.stringify({id: id_produto}),
                headers:{
                    "Content-type":"application/json",
                    "x-key": `Bearer ${token}`
                }
                })

                const status = api.status;
                const response = await api.json();

                if(status === 200){
                    if(response && response.blobs.length > 0){
                        
                        for(const preUrl of response.blobs){

                            if(preUrl.url.toString().split(`produto/${id_produto}/`)[1] === "")
                                continue;
                            if(preUrl.url.toString().includes(".txt"))
                                continue;

                            urls.push(preUrl.url);
                        }
                    }
                }

                return urls;
            }

            async function ativarProduto(){
                const urls = await getImages();

                const productInfo = {
                    nome: nome_produto,
                    preco: preco_produto,
                    metadata:{
                        id_categoria: id_categoria,
                        quantidade_estoque: quantidade_estoque
                    },
                    descricao: descricao_produto,
                    images: urls
                };

                const newProductToken = await getStripeApi();

                const newProduct = await fetch(`${process.env.DOMAIN_PATH}/api/createproductstripe`,{
                    method: "POST",
                    body: JSON.stringify(productInfo),
                    headers:{
                        "Content-type":"application/json",
                        "x-key": `Bearer ${newProductToken}`
                    }
                })

                const productStatus = newProduct.status;
                const responseProduct = await newProduct.json();

                if(productStatus === 200){

                    const newProdProduto = responseProduct.product.id;

                    const sql = neon(`${process.env.DATABASE_URL}`)

                    const query = ` UPDATE produto SET ativado_produto = $1, descricao_produto = $2, nome_produto = $3, preco_produto = $4, prod_produto = $5, rascunho_produto = $6, id_categoria = $7 WHERE id_produto = $8 `
                    const values = [ ativado_produto, descricao_produto, nome_produto, preco_produto, newProdProduto, rascunho_produto, id_categoria, id_produto ];

                    await sql(query, values);

                    const id_estoque: any = await sql(`SELECT id_estoque FROM estoque WHERE id_produto = ${id_produto}`);

                    await sql('UPDATE estoque SET quantidade_estoque = $1 WHERE id_estoque = $2', [quantidade_estoque, id_estoque[0].id_estoque]);

                }else{
                    return res.status(500).json({erro: "Não foi possível concluir a ação no momento."})
                }

            }

            async function updateProduto(){
                const urls = await getImages();

                const data = {
                    id_produto: id_produto,
                    nome_produto: nome_produto,
                    descricao_produto: descricao_produto,
                    preco_produto: preco_produto,
                    prod_produto: prod_produto,
                    ativado_produto: ativado_produto,
                    metadata: {
                        id_categoria: id_categoria,
                        quantidade_estoque: quantidade_estoque,
                    },
                    images: urls,
                }

                const token = await getStripeApi();

                const api = await fetch(`${process.env.DOMAIN_PATH}/api/updateproductstripe`,{
                    method: "POST",
                    body: JSON.stringify(data),
                    headers:{
                        "Content-type":"application/json",
                        "x-key":`Bearer ${token}`,
                    }
                });

                const statusUpdate = api.status;

                if(statusUpdate != 200)
                    return res.status(500).json({erro: "Algo deu errado."});

                const sql = neon(`${process.env.DATABASE_URL}`)

                const query = ` UPDATE produto SET ativado_produto = $1, descricao_produto = $2, nome_produto = $3, preco_produto = $4, prod_produto = $5, rascunho_produto = $6, id_categoria = $7 WHERE id_produto = $8 `
                const values = [ativado_produto, descricao_produto, nome_produto, preco_produto, prod_produto, rascunho_produto, id_categoria, id_produto ];

                await sql(query, values);

                const id_estoque: any = await sql(`SELECT id_estoque FROM estoque WHERE id_produto = ${id_produto}`);

                await sql('UPDATE estoque SET quantidade_estoque = $1 WHERE id_estoque = $2', [quantidade_estoque, id_estoque[0].id_estoque]);

            }

            if(ativado_produto === true && prod_produto === null){
                ativarProduto();
            }

            if(prod_produto != null){
                updateProduto();
            }else{
                const sql = neon(`${process.env.DATABASE_URL}`)

                const query = ` UPDATE produto SET ativado_produto = $1, descricao_produto = $2, nome_produto = $3, preco_produto = $4, prod_produto = $5, rascunho_produto = $6, id_categoria = $7 WHERE id_produto = $8 `
                const values = [ativado_produto, descricao_produto, nome_produto, preco_produto, prod_produto, rascunho_produto, id_categoria, id_produto ];

                await sql(query, values);

                const id_estoque: any = await sql(`SELECT id_estoque FROM estoque WHERE id_produto = ${id_produto}`);

                await sql('UPDATE estoque SET quantidade_estoque = $1 WHERE id_estoque = $2', [quantidade_estoque, id_estoque[0].id_estoque]);
            }

            res.setHeader("Cache-Control","s-maxage=10, stale-while-revalidate");
            return res.status(200).json({sucesso: "ok"})

        }

        return res.status(401).json({erro: "Inválido!"})
    }

    return res.status(405).json({erro: "Inválido!"})

}