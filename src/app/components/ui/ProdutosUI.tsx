"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductsAll from "./products/products_all";
import ProductsActive from "./products/products_active";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import ProductsPending from "./products/products_pending";
import ProdutcsArchived from "./products/products_archived";

export default function ProdutosUI(){

    const router = useRouter();
    const [selected,setSelected] = useState("");
    const [productsOpen, setProductsOpen] = useState(false);
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
            <DropdownMenu.Root>
                <DropdownMenu.Trigger id="changeMenu" style={{outline: "none", pointerEvents: "auto"}} className="produto__btnMobile cursor-pointer">

                    <span className="ln __ln1"></span>
                    <span className="ln __ln2"></span>
                    <span className="ln __ln3"></span>
              
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content style={{outline: "none"}} className="bg-slate-100 p-3 px-5 rounded-lg shadown dropmenu"  sideOffset={10}>
                        <DropdownMenu.Item className="py-1 cursor-pointer" style={{outline: "none"}}>
                            <a onClick={(e)=>{updateSelected(e,null)}} className={(selected === "") ? classSelected : "rounded px-2"}>Todos</a>
  
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className="py-1 cursor-pointer " style={{outline: "none"}}>
                            <a onClick={(e)=>{updateSelected(e,"active")}} className={(selected === "active") ? classSelected : "rounded px-2"} >Ativos</a>
       
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className="py-1 cursor-pointer" style={{outline: "none"}}>
                            <a onClick={(e)=>{updateSelected(e,"pending")}} className={(selected === "pending") ? classSelected : "rounded px-2"} >Rascunhos</a>
                       
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className="py-1 cursor-pointer" style={{outline: "none"}}>
                            <a onClick={(e)=>{updateSelected(e,"archived")}} className={(selected === "archived") ? classSelected : "rounded px-2"} >Arquivado</a>
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
            
            <div className="flex bg-slate-100 py-1.5 px-2 rounded-xl gap-1 produtcs-selection produto__selectionContent">
                <a onClick={(e)=>{updateSelected(e,null)}} className={(selected === "") ? classSelected : "rounded px-2"}>Todos</a>
                <a onClick={(e)=>{updateSelected(e,"active")}} className={(selected === "active") ? classSelected : "rounded px-2"} >Ativos</a>
                <a onClick={(e)=>{updateSelected(e,"pending")}} className={(selected === "pending") ? classSelected : "rounded px-2"} >Rascunhos</a>
                <a onClick={(e)=>{updateSelected(e,"archived")}} className={(selected === "archived") ? classSelected : "rounded px-2"} >Arquivado</a>
            </div>
            </div>
            <div className="mt-3 productContent">
                {selected === "" && <ProductsAll />}
                {selected === "active" && <ProductsActive />}
                {selected === "pending" && <ProductsPending />}
                {selected === "archived" && <ProdutcsArchived />}
            </div>
        </div>
    )
}