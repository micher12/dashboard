"use client";

import { useEffect, useState } from "react";
import Skeleton from "../../Skeleton";
import RenderProductAdminUI from "./RenderProductAdminUI";
import getProductReqToken from "../key/getProductReqToken";

interface dataProps{
    id_produto: number,
    ativado_produto: boolean,
    descricao_produto: string,
    nome_produto: string,
    preco_produto: number
    prod_produto: string,
    rascunho_produto: boolean,
    quantidade_estoque: number,
    nome_categoria: string,
    urls: string[]
}

export default function ProductsAll(){

    const [data, setData] = useState<dataProps[] | null>(null);
    
    useEffect(()=>{
        getData();
    },[]);

    async function getData(){
        const token = await getProductReqToken();

        const api = await fetch("/api/getproducts",{
            method: "POST",
            headers:{
                "Content-type":"application/json",
                "x-key": `Bearer ${token}`,
            }
        })

        const status = api.status; 
        const response = await api.json();
        const preData: dataProps[] = response.data;

        if(status === 200)
            setData(preData);
    }

    return(
        <>
         <div className="pendingProducts mt-10 flex flex-col w-full">
            {data === null ?
            <Skeleton type="products" className="skeletonPending" />
            :
            <RenderProductAdminUI data={data} type={"all"} />
            }
        </div>
        </>
    )
}