// pages/api/upload.js
import { put } from '@vercel/blob';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false, // Desabilitar o parsing automático para lidar com arquivos binários
  },
};

export default async function upload(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      

      const { searchParams } = new URL(req.url as string, `http://${req.headers.host}`);
      const filename = searchParams.get('filename');



      const blob = await put(`imagens/${filename}`, req, {
          access: 'public',
      });

      return res.status(200).json(blob);

    } catch (error) {
        console.log(error);
      res.status(500).json({ error: "Inválido!"});
    }
  } 
  
  res.status(405).json({ message: 'Method not allowed' });
  
}
