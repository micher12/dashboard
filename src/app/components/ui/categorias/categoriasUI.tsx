"use client";

import { useEffect, useState } from "react"
import getCategoriaReqToken from "../key/getCategoriaReqToken";
import "@/app/components/css/categoriaStyle.css";
import Skeleton from "../../Skeleton";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import getDeleteCategoryReqToken from "../key/getDeleteCategoryReqToken";
import AlertUI from "../AlertUI";

interface CategoriaData{
    id_categoria: number
    nome_categoria: string
}

export default function CategoriasUI(){

    const [categorias, setCaregorias] = useState<CategoriaData[]>();
    const [alertType, setAlertType] = useState<"sucesso" | "erro" | null>(null);
    const [alertMessage, setAlertMessage] = useState<string>("");

    useEffect(()=>{
        getCategorias();
    },[]);

    async function getCategorias() {
        const token = await getCategoriaReqToken();

        const api = await fetch("/api/getcategorias",{
            method: "POST",
            headers:{
                "Content-type":"application/json",
                "x-key": `Bearer ${token}`
            }
        })

        const status = api.status;
        const response = await api.json();

        const preData: CategoriaData[] = response.data;

        if(status === 200)
            setCaregorias(preData);

    }

    function ConfirmDelete(){
        return(
            <AlertDialog.Root>
                <AlertDialog.Trigger>
                    <div className="bg-red-500 rounded text-slate-50 px-3 font-semibold text-lg hover:bg-red-600 transition scale">
                    Deletar
                    </div>
                </AlertDialog.Trigger>
                <AlertDialog.Portal>
                    <AlertDialog.Overlay className="AlertDialogOverlay" />
                    <AlertDialog.Content className="AlertDialogContent">
                        <AlertDialog.Title className="font-bold text-xl">
                            Você realmente tem certeza dessa ação ?
                        </AlertDialog.Title>
                        <AlertDialog.Description className="mt-1">
                            Após confirmar está ação, NÃO será possível reverter ou recuperar o conteúdo. 
                        </AlertDialog.Description>
                        <div className="mt-3" style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}>
                            <AlertDialog.Cancel asChild>
                            <button className="Button mauve">Cancelar</button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action asChild>
                                <button onClick={deletarCategoria} className="bg-red-500 font-semibold text-slate-50 px-3 rounded text-lg">Deletar</button>
                            </AlertDialog.Action>
                        </div>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>
        )
    }

    async function deletarCategoria(){
        
        const form = document.getElementById("senderForm") as HTMLFormElement;

        const obj = new FormData(form);

        const id_categoria = obj.get("id_categoria");

        const token = await getDeleteCategoryReqToken();

        const api = await fetch("/api/deletecategory",{
            method: "POST",
            body: JSON.stringify({id_categoria: id_categoria}),
            headers:{
                "Content-type":"application/json",
                "x-key": `Bearer ${token}`,
            }
        })

        const status = api.status;
        const response = await api.json();

        if(status === 200 && response.sucesso === "ok"){
            setAlertType("sucesso");
            setAlertMessage("Categoria excluída com sucesso!")
            limpaAlert();
            getCategorias();
        }else{
            setAlertType("erro");
            setAlertMessage(response.erro)
            limpaAlert();
        }

    }

    function limpaAlert(){
        setTimeout(()=>{
            setAlertType(null);
            setAlertMessage("");
        },3800);
    }

    return(
        <>
        <div className="flex flex-col productContainer">
        <div className="productContent p-3">
        
            {categorias ?
            <div className="border shadown-2 w-full rounded-lg p-2 px-3 categoriasCadastradas">
            <form id="senderForm">
                <h2 className="text-xl font-semibold">Categorias cadastradas: </h2>
                <div className="flex gap-5 mt-3">
                    <select name="id_categoria">
                        {categorias && Object.entries(categorias).map(([key,val])=>(
                            <option key={key} value={val.id_categoria}>{val.nome_categoria}</option>
                        ))}
                    </select>
                    <ConfirmDelete />
                </div>
            </form>
            </div>
            :
            <Skeleton type="edit_product" />
            }

        </div>
        </div>
        <AlertUI type={alertType} message={alertMessage} />
        </>
    )
}