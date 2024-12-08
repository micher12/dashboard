// pages/api/upload.js
import { list } from '@vercel/blob';
import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless';

export const config = {
  api: {
    bodyParser: false, // Desabilitar o parsing automático para lidar com arquivos binários
  },
};

export default async function getRascunho(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {

      const sql = neon(`${process.env.DATABASE_URL}`);

      const rascunho = true;

      const query = await sql(`
        SELECT p.nome_produto, p.descricao_produto, p.preco_produto, p.ativado_produto, e.quantidade_estoque, p.prod_produto, c.nome_categoria
        FROM produto as p 
        INNER JOIN estoque as e ON e.id_produto = p.id_produto
        INNER JOIN categoria as c ON p.id_categoria = c.id_categoria
        WHERE p.rascunho_produto = ${rascunho}`);

      
      //const blobs = await list({ prefix: 'imagens/' });


      return res.status(200).json(query);

    } catch (error) {
        console.log(error);
      res.status(500).json({ error: "Inválido!"});
    }
  } 
  
  res.status(405).json({ message: 'Method not allowed' });
  
}
