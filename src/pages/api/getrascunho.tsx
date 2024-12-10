// pages/api/upload.js
import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless';

interface UlrsInterface{
  [key: number]: string
}

export default async function getRascunho(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {

      const sql = neon(`${process.env.DATABASE_URL}`);

      const rascunho = true;

      const query = await sql(`
      SELECT p.id_produto, p.nome_produto, p.descricao_produto, p.preco_produto, p.ativado_produto, e.quantidade_estoque, p.prod_produto, c.nome_categoria
      FROM produto as p 
      LEFT JOIN estoque as e ON e.id_produto = p.id_produto
      LEFT JOIN categoria as c ON p.id_categoria = c.id_categoria
      WHERE p.rascunho_produto = ${rascunho}
      `);

      const ids: number[] = [];
      const urls: UlrsInterface[] = [];

      query.forEach((val)=>{
        if(val){
          ids.push(val.id_produto);
        }
      })

   
      await Promise.all(ids.map(async (val)=>{
        const api = await fetch(`${process.env.DOMAIN_PATH}api/getimage`,{
          method:"POST",
          body: JSON.stringify({id: val}),
          headers:{
            "Content-type":"application/json"
          }
        })

        const status = api.status;
        const response = await api.json();

        if(status === 200){
          if(response && response.blobs.length > 0){
            const preUrls: string[] = [];
            for(const preUrl of response.blobs.slice(1)){
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

      return res.status(200).json(query);

    } catch (error) {
        console.log(error);
      res.status(500).json({ error: "Inválido!"});
    }
  } 
  
  res.status(405).json({ message: 'Method not allowed' });
  
}
