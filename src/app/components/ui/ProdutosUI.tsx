"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProdutosUI(){

    const router = useRouter();
    const [selected,setSelected] = useState("");
    const classSelected = "bg-neutral-50 shadown rounded px-2";

    function updateSelected(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, query: string | null){
        e.preventDefault();
        const path = document.location.href.split("?")[0];
        if(query === null){
            setSelected("");
            return router.push(`${path}`);
        }
        setSelected(query);
        return router.push(`${path}?${query}`);        
    }

    return(
        <div className="flex flex-col productContainer">
            <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Produtos</h2>
            <div className="flex bg-slate-100 py-1.5 px-2 rounded-xl gap-1 produtcs-selection">
                <a onClick={(e)=>{updateSelected(e,null)}} className={(selected === "") ? classSelected : "rounded px-2"}>Todos</a>
                <a onClick={(e)=>{updateSelected(e,"active")}} className={(selected === "active") ? classSelected : "rounded px-2"} >Ativos</a>
                <a onClick={(e)=>{updateSelected(e,"pending")}} className={(selected === "pending") ? classSelected : "rounded px-2"} >Rascunhos</a>
                <a onClick={(e)=>{updateSelected(e,"archived")}} className={(selected === "archived") ? classSelected : "rounded px-2"} >Arquivado</a>
            </div>
            </div>
            <div className="mt-3 productContent">
                
            </div>
        </div>
    )
}