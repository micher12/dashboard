"use client";

import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { FunctionComponent } from "react";

interface RenderImageInterface{
    urls: string[]
}

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

interface RenderProduct{
    data: dataProps[]
}

const RenderProductAdminUI:FunctionComponent<RenderProduct> = ({data})=>{

    const RenderImage:FunctionComponent<RenderImageInterface> = ({urls})=>{
        const capaId: string[] = [];

        if(urls){

            Object.entries(urls).map(([, val])=>{
                if(val.includes("capa_")){
                    val.split("capa_")[1].split("-").forEach((val, index)=>{
                        if(index < 3)
                            capaId.push(val);
                    })
                }
            });

            if(capaId.length > 0){                
                const res = Object.entries(urls).map(([key,val])=>(
                    <React.Fragment key={key}>
                    {(val.includes(capaId[0]) && val.includes(capaId[1]) && val.includes(capaId[2]) && !val.includes("capa_")) &&
                        <Image accessKey={key} style={{width: "auto"}} width={50} height={25} src={val} alt="imagem produto" className="rounded" />
                    }
                    </React.Fragment>
                ))
                


                return(
                    res
                )

            }else{
                return(
                    <Image style={{width: "auto"}} width={50} height={25} src={urls[0]} alt="imagem produto" className="rounded" />
                )
            };
         
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
        <RenderProducts  />
        </>
    )

}

export default RenderProductAdminUI;