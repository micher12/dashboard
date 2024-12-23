"use client";

import { useRouter } from "next/navigation";
import { FunctionComponent, useEffect, useState } from "react";
import Skeleton from "../../Skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import React from "react";
import getRascunhoReqToken from "../key/getRascunhoReqToken";
import RenderProductAdminUI from "./RenderProductAdminUI";

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

interface RenderImageInterface{
    urls: string[]
}

export default function ProductsPending(){

    const router = useRouter();
    const [data, setData] = useState<dataProps[] | null>(null);
    const classResize = "skeletonPending";

    useEffect(()=>{
        getData();

    },[]);

    async function getData(){
        const token = await getRascunhoReqToken();

        const api = await fetch("/api/getrascunho",{
            method: "POST",
            headers:{
                "Content-type":"application/json",
                "x-key": `Bearer ${token}`,
            }
        });

        const status = api.status
        const res:dataProps[] = await api.json();

        if(status === 200)
            setData(res);
    }

    function newProduct(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        e.preventDefault();

        router.push("/dashboard/produtos/novoproduto");
    }


    return(
        <>
            <button onClick={newProduct} className="w-fit bg-blue-600 hover:bg-blue-500 text-slate-50 py-1 px-3 rounded font-semibold scale transition">CRIAR NOVO PRODUTO</button>
            <div className="pendingProducts mt-10 flex flex-col w-full">
                {data === null ?
                <Skeleton type="products" className={classResize} />
                :
                <RenderProductAdminUI data={data} />
                }
            </div>
        </>
    )
}