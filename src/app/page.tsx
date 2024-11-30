"use client";

import {ListBlobResult, type PutBlobResult } from '@vercel/blob';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {

  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [blobs, setBlobs] = useState<ListBlobResult | null>(null);

  useEffect(()=>{
    async function updateBlobs(){
      const api = await fetch(`api/getblob`,{method:"POST"});
  
      const response = await api.json();
      const status = api.status;
      if(status === 200)
        setBlobs(response);
    }
    updateBlobs();
  },[blob]);

  const RenderBlobs = ()=>{

    const list = blobs?.blobs;
    const res = list?.map((val,key)=>(
      <Image style={{width: "auto"}} priority key={key} alt='imagem' width={500} height={500} src={val.url} />
    ));

    return (
      res
    )
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);

    const file = form.get("imagem") as File;
    
    const api = await fetch(`api/upload?filename=${file.name}`,{
      method: "POST",
      body: file,
    })

    const response = await api.json();
    const status = api.status;

    console.log("STATUS: "+status);
    console.log(response);

    const newBlob = response as PutBlobResult;

    setBlob(newBlob);

  }

  return (
    <div className="container">
      <form onSubmit={handleUpload} className="flex flex-col" >
        <input type="file" name="imagem" alt="imagem" />
        <button className="bg-slate-300 w-fit px-12 py-0.5 rounded mt-3">ENVIAR</button>
      </form>

      {blobs &&
        <RenderBlobs />
      }

    </div>
  );
}
