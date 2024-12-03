// pages/api/upload.js
import { list } from '@vercel/blob';
import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless';

export const config = {
  api: {
    bodyParser: false, // Desabilitar o parsing automático para lidar com arquivos binários
  },
};

export default async function upload(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {

      const sql = neon(`${process.env.DATABASE_URL}`);

      const query = await sql("SELECT * FROM produto");

      
      const blobs = await list({ prefix: 'imagens/' });


      return res.status(200).json(blobs);

    } catch (error) {
        console.log(error);
      res.status(500).json({ error: "Inválido!"});
    }
  } 
  
  res.status(405).json({ message: 'Method not allowed' });
  
}
