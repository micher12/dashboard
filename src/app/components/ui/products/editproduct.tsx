"use client";

import { useEffect, useState, memo } from "react"
import getProductReqToken from "../key/getProductReqToken";
import Skeleton from "../../Skeleton";
import getCategoriaReqToken from "../key/getCategoriaReqToken";

interface ProductData{
    ativado_produto: boolean,
    descricao_produto: string,
    id_produto: number,
    nome_categoria: string,
    nome_produto: string,
    preco_produto: number,
    prod_produto: string,
    quantidade_estoque: number,
    rascunho_produto: boolean,
    id_categoria: number,
}

interface CategoriaInterface{
    [key: number]: {id_categoria: number, nome_categoria: string}
}

export default function EditProduct(){

    const [data, setData] = useState<ProductData>({
        ativado_produto: false,
        descricao_produto: "",
        id_produto: 0,
        nome_categoria: "",
        nome_produto: "",
        preco_produto: 0,
        prod_produto: "",
        quantidade_estoque: 0,
        rascunho_produto: true,
        id_categoria: 0,
    });
    const [categorias, setCategorias] = useState<CategoriaInterface>({
        0:{id_categoria: 0, nome_categoria: ""}
    });

    useEffect(()=>{
        getData();
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

    }

    const getData = async ()=>{
        const path = document.location.href;

        if(path.includes("?") && path.split("?")[1].includes("id=")){
            const id = path.split("id=")[1];
            const token = await getProductReqToken();
            const api = await fetch("/api/getproduct",{
                method: "POST",
                body: JSON.stringify({id_produto: id}),
                headers:{
                    "Content-type":"application/json",
                    "x-key": `Bearer ${token}`
                }
            })

            const status = api.status;
            const response = await api.json();

            if(status === 200 && response.sucesso === "ok"){
                setData(response.data[0]);
                getCategorias();
            }

        }

    }

    function ChangeInput(e: React.ChangeEvent<HTMLInputElement>): void {
        e.preventDefault();
        const {name, value} = e.target;

        if(name === "preco_produto"){
            const finalVal = value.replace(/[^0-9]/g, "");
            setData((prev)=>({...prev, [name]: parseInt(finalVal)}))
        }else{
            setData((prev)=>({...prev, [name]: value}))
        }   
       

    }

    function RenderCategorias(){
        const res = Object.entries(categorias).map(([key,val])=>(
            <option key={key} value={val.id_categoria} >{val.nome_categoria}</option>
        ))

        return(
            res
        )
    }

    return(
        <>
        {data.id_produto == 0 ?
        <Skeleton type="image" /> //criar o type correto depois
        :
        <form className="w-full flex flex-col form_edit_product gap-5">
            <input type="hidden" name="id_produto" value={data.id_produto} />
            <input type="hidden" name="prod_produto" value={data.prod_produto} />
            <div>
                <h2>Nome: </h2>
                <input onChange={ChangeInput} type="text" name="nome_produto" value={data?.nome_produto.toString()} />
            </div>
            <div>
                <h2>Descrição: </h2>
                <input onChange={ChangeInput} type="text" name="descricao_produto" value={data?.descricao_produto.toString()} />
            </div>
            <div>
                <h2>{`Preço: R$${(data.preco_produto/100).toString().replace(".",",")}`}</h2>
                <input onChange={ChangeInput} type="text" name="preco_produto" value={data?.preco_produto.toString()} />
            </div>
            <div>
                <h2>Categoria: </h2>
                <select name="id_categoria" >
                    <RenderCategorias />
                </select>
            </div>
            <div>
                <h2>Produto Ativado: </h2>
                <select name="ativado_produto" >
                    <option value={`${data?.ativado_produto}`} defaultValue={"false"}>{`${data?.ativado_produto === true ? "sim" : "não"}`}</option>
                    <option value={`${!data?.ativado_produto}`}>{`${!data?.ativado_produto === true ? "sim" : "não"}`}</option>
                </select>
            </div>
            <div>
                <h2>Produto em rascunho: </h2>
                <select name="rascunho_produto" >
                    <option value={`${data?.rascunho_produto}`} defaultValue={"true"}>{`${data?.rascunho_produto === true ? "sim" : "não"}`}</option>
                    <option value={`${!data?.rascunho_produto}`}>{`${!data?.rascunho_produto === true ? "sim" : "não"}`}</option>
                </select>
            </div>

            <input type="submit" value={"ATUALIZAR"} className="cursor-pointer bg-blue-500 text-slate-50 transition scale hover:bg-blue-400" />
        </form>
        }
        </>
    )
}