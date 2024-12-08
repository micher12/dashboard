"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Skeleton from "../../Skeleton";

interface dataProps{
    ativado_produto: boolean,
    descricao_produto: string,
    nome_produto: string,
    preco_produto: number
    prod_produto: string,
    rascunho_produto: boolean,
    quantidade_estoque: number
    nome_categoria: string
}

export default function ProductsPending(){

    const router = useRouter();
    const [data, setData] = useState<dataProps[] | null>(null);
    const [classResize, setClassResize] = useState<string>("skeletonPending");

    useEffect(()=>{
        getData();

        const interval = setInterval(() => {
          getData();
        }, 5000); 
    
        return () => clearInterval(interval);
    },[]);

    async function getData(){
        const api = await fetch("/api/getrascunho",{
            method: "POST"
        });

        const res:dataProps[] = await api.json();

        setData(res);
    }

    function newProduct(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        e.preventDefault();

        router.push("/dashboard/produtos/novoproduto");
    }

    const RenderProducts = ()=>{

        if(!data)
            return;

        const res = Object.entries(data).map(([key, val], index)=>(
            <div key={index} className="border-b py-5 flex justify-between skeletonPending w-full px-8">
                <div className="">IMAGEM</div>
                <div className="">
                    {val.nome_produto}
                </div>
                <div className="">
                    {val.descricao_produto}
                </div>
                <div className="">
                    {val.preco_produto/100}
                </div>
                <div className="">{val.ativado_produto === true ? "true" : "false"}</div>
                <div className="">{val.quantidade_estoque}</div>
                <div className="">{val.nome_categoria}</div>
            </div>
        ));

        return(
            res
        )
    }

    return(
        <>
            <button onClick={newProduct} className="w-fit bg-blue-600 hover:bg-blue-500 text-slate-50 py-1 px-3 rounded font-semibold scale transition">CRIAR NOVO PRODUTO</button>
            <div className="pendingProducts mt-10 flex flex-col w-full gap-20">
                {data === null ?
                <Skeleton type="products" className={classResize} />
                :
                <RenderProducts/>
                }
            </div>
        </>
    )
}