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

    const RenderImage:FunctionComponent<RenderImageInterface> = ({urls})=>{
        if(urls){
            const res = Object.entries(urls).map(([key,val])=>(
                <React.Fragment key={key}>
                {val.split("produto")[1].split("/")[2].split("-")[0] === "capa" &&
                    <Image accessKey={key} style={{width: "auto"}} width={50} height={25} src={val} alt="imagem produto" />
                }
                </React.Fragment>
            ))

            return(
                res
            )
        }
        
    }

    const RenderProducts = ()=>{

        if(!data)
            return;

        const res = Object.entries(data).map(([key, val])=>(
            <div key={key} accessKey={val.id_produto.toString()} className="border-b py-5 flex justify-between skeletonPending w-full px-8 items-center">
                <RenderImage urls={val.urls} />
                <div className="">
                    {val.nome_produto}
                </div>
                <div className="">
                    {val.descricao_produto}
                </div>
                <div className="">
                    {val.preco_produto/100}
                </div>
                <div className="">Ativo: {val.ativado_produto === true ? "true" : "false"}</div>
                <div className="">Estoque: {val.quantidade_estoque}</div>
                <div className="">Categoria: {val.nome_categoria}</div>
                
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger className="outline-none">
                        <div className="cursor-pointer">{<FontAwesomeIcon icon={faEllipsis} />}</div>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content className="outline-none bg-slate-50 p-3 px-4 rounded-lg shadown font-semibold flex flex-col gap-2">
                        <DropdownMenu.Item>
                            <div className="cursor-pointer">Visualizar</div>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item>
                            <Link href={`/dashboard/produtos/editar?id=${val.id_produto}`} className="cursor-pointer">Editar</Link>
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator className="border border-1"></DropdownMenu.Separator>
                        <DropdownMenu.Item >
                            <div className="cursor-pointer">Excluir</div>
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </div>
        ));

        return(
            res
        )
    }

    return(
        <>
            <button onClick={newProduct} className="w-fit bg-blue-600 hover:bg-blue-500 text-slate-50 py-1 px-3 rounded font-semibold scale transition">CRIAR NOVO PRODUTO</button>
            <div className="pendingProducts mt-10 flex flex-col w-full">
                {data === null ?
                <Skeleton type="products" className={classResize} />
                :
                <RenderProducts/>
                }
            </div>
        </>
    )
}