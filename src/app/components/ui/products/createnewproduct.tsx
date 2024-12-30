"use client";

import { useEffect, useState } from "react"
import AlertUI from "../AlertUI";
import SenderFileUI from "../SenderFileUI";
import React from "react";
import getCategoriaReqToken from "../key/getCategoriaReqToken";
import Skeleton from "../../Skeleton";

interface formValues{
    [key: string]: string;
}

interface ImagesInterface{

    downloadUr: string,
    pathname: string,
    size: number,
    uploadedAt: string,
    url: string
    
}

interface CategoriaInterface{
    [key: number]: {id_categoria: number, nome_categoria: string}
}

export default function CreateNewProduct(){

    const [valForm, setValForm] = useState<formValues>({nome: "", preco:""});
    const [alertType, setAlertType] = useState<"sucesso" | "erro" | null>(null);
    const [carregado, setCarregado] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [files, setFiles] = useState<FileList | null>(null);
    const [images, setImages] = useState<ImagesInterface[]>([{
            downloadUr:"",
            pathname:"",
            size: 0,
            uploadedAt:"",
            url:""
            
    }]);

    const [categorias, setCategorias] = useState<CategoriaInterface>({
        0:{id_categoria: 0, nome_categoria: ""}
    });

    useEffect(()=>{
        getCategorias();
    },[]);

    const getCategorias = async ()=>{
        const token = await getCategoriaReqToken();

        const api = await fetch("/api/getcategorias",{
            method: "POST",
            headers:{
                "Content-type":"application/json",
                "x-key": `Bearer ${token}`
            }
        });

        const response = await api.json();

        setCategorias(response.data);

        setCarregado(true);
    }

    
    function changeInput(e: React.ChangeEvent<HTMLInputElement>): void {
        e.preventDefault();

        const {name, value} = e.target;

        if(name === "preco_produto" || name === "quantidade_estoque"){
            const finalVal = value.replace(/[^0-9]/g, "");
            const intVal = isNaN(parseInt(finalVal)) ? "0" : finalVal;

            setValForm((prev)=>({...prev, [name]: intVal}))
        }else{
            setValForm((prev)=>({...prev, [name]: value}))
        }

    }

    function changeSelection(e: React.ChangeEvent<HTMLSelectElement>): void {
        e.preventDefault();
        const {name, value} = e.target;

        setValForm((prev)=>({...prev, [name]: value}))
    }

    function chnageFile(newFiles: FileList | null): void {
        setFiles(newFiles);
    }


    function RenderCategorias(){
    
        const res = Object.entries(categorias).map(([key,val])=>(
            <React.Fragment key={key}>
    
                <option value={val.id_categoria} >{val.nome_categoria}</option>
        
            </React.Fragment>
        ));


        return(
            <>
            {res}
            </>
        )
    }

    function sendForm(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();

        const obj = new FormData(e.target as HTMLFormElement);
        const formDate: any = {};

        obj.forEach((val,key)=>{
            formDate[key] = val;
        });

        console.log(formDate);

    }

    return(
        <div className="flex flex-col productContainer">
        <div className="productContent">
            {!carregado ?
            <Skeleton type="create_new_product" />
            :
            <>
            <form method="POST" onSubmit={sendForm} className="w-full flex flex-col form_edit_product gap-5">
                <div>
                    <h2>Nome: </h2>
                    <input onChange={changeInput} type="text" name="nome_produto" value={valForm.nome_produto || ""} />
                </div>
                <div>
                    <h2>Descrição: </h2>
                    <input onChange={changeInput} type="text" name="descricao_produto" value={valForm.descricao_produto || ""} />
                </div>
                <div>
                    <h2>{`Preço:`}</h2>
                    <input onChange={changeInput} type="text" name="preco_produto" value={valForm.preco_produto || 0} />
                </div>
                <div>
                    <h2>Quantidade em estoque: </h2>
                    <input onChange={changeInput} type="text" name="quantidade_estoque" value={valForm.quantidade_estoque || 0}/>
                </div>
                <div>
                    <h2>Categoria: </h2>
                    <select name="id_categoria" >
                        <RenderCategorias />
                    </select>
                </div>
                <div>
                    <h2>Produto Ativado: </h2>
                    <select name="ativado_produto" onChange={changeSelection} value={valForm.ativado_produto || "false"}>
                        <option value="false">não</option>
                        <option value="true">sim</option>
                    </select>
                </div>
                <div>
                    <h2>Produto em rascunho: </h2>
                    <select name="rascunho_produto" onChange={changeSelection} value={valForm.rascunho_produto || "true"}>
                        <option value="true">sim</option>
                        <option value="false" >não</option>
                    </select>
                </div>

                <div>
                    <SenderFileUI changeFiles={chnageFile} />
                </div>

                <input type="submit" value={"CADASTRAR"} className="cursor-pointer bg-blue-500 text-slate-50 transition scale hover:bg-blue-400" />
                
            </form>
            <AlertUI type={alertType} message={alertMessage} />
            </>
            }
        </div>
        </div>
    )
}