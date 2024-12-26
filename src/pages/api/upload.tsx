// pages/api/upload.js
import { put } from '@vercel/blob';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false, // Desabilitar o parsing automático para lidar com arquivos binários
  },
};

export default async function upload(req: NextApiRequest, res: NextApiResponse) {
  function gerarCodigo() {
    const gerarParte = () => {
      // Gera um número aleatório entre 0 e 9999, e formata para 4 dígitos com zeros à esquerda
      return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    }

    // Gera as 3 partes do código e as junta com o hífen
    return `${gerarParte()}-${gerarParte()}-${gerarParte()}`;
  }

  if (req.method === 'POST') {

    const header = req.headers;
    if(!header["x-key"])
      return res.status(401).json({erro: "Inválido!"})

    const key = header["x-key"].toString().split("Bearer ")[1];

    if(key != process.env.GET_UPLOAD)
      return res.status(401).json({erro: "Inválido!"})
    
    try {

      const form = new IncomingForm();
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Erro ao fazer upload', err);
          return res.status(500).json({ message: 'Erro ao processar o upload' });
        }

        const id = fields.id_produto;


        const uploadedFiles = files.files;

        if (uploadedFiles){
          uploadedFiles.forEach((file, ) => {



            const myFile = new File([fs.readFileSync(file.filepath)], file.originalFilename as string, {
              type: file.mimetype as string,
            });

            const filename = file.originalFilename as string;
            const extension = filename.split(".")[1];

            sender(myFile, extension);

          });
        }


        async function sender(file: File, extension: string) {
          const code = gerarCodigo();
          await put(`produto/${id}/${code}.${extension}`, file, {
            access: 'public',
          });
        }



      });


      res.setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate");
      return res.status(200).json({ sucesso: "ok" });

    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Inválido!" });
    }
  }

  res.status(405).json({ message: 'Method not allowed' });

}
