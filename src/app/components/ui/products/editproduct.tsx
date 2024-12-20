"use client";

import { FunctionComponent, useEffect, useState } from "react"
import getProductReqToken from "../key/getProductReqToken";
import Skeleton from "../../Skeleton";
import getCategoriaReqToken from "../key/getCategoriaReqToken";
import Zoom from "react-medium-image-zoom";
import 'react-medium-image-zoom/dist/styles.css'
import getImageReqToken from "../key/getImageReqToken";
import Image from "next/image";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useRouter } from "next/navigation";
import getUpdateProductToken from "../key/getUpdateProductToken";
import AlertUI from "@/app/components/ui/AlertUI";

interface ProductData{
    ativado_produto: boolean,
    descricao_produto: string,
    id_produto: number,
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

interface urlImage{
    url: string
}

interface ImagesInterface{

    downloadUr: string,
    pathname: string,
    size: number,
    uploadedAt: string,
    url: string
    
}


export default function EditProduct(){

    const [data, setData] = useState<ProductData>({
        ativado_produto: false,
        descricao_produto: "",
        id_produto: 0,
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
    const [images, setImages] = useState<ImagesInterface[]>([{
       
        downloadUr:"",
        pathname:"",
        size: 0,
        uploadedAt:"",
        url:""
        
    }]);
    const [alertType, setAlertType] = useState<"sucesso" | "erro" | null>(null);
    const [alertMessage, setAlertMessage] = useState<string>("");

    const router = useRouter();

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

    const getImages = async (id: number) =>{

        const token = await getImageReqToken();

        const api = await fetch("/api/getimage",{
            method: "POST",
            body: JSON.stringify({id: id}),
            headers:{
                "Content-type":"application/json",
                "x-key": `Bearer ${token}`,
            }
        });

        const status = api.status;
        const response = await api.json();

        if(status === 200 && response.blobs){
            if(response.blobs.length > 0){
                const urls: ImagesInterface[] = [];

                for(const preUrl of response.blobs.slice(1)){
                    const url: ImagesInterface = preUrl;
                    urls.push(url);
                }

                setImages(urls)
            }

        }

        

    }

    const getData = async ()=>{

        const path = document.location.href;

        if(path.includes("?") && path.split("?")[1].includes("id=")){
            const id = path.split("id=")[1];

            await getCategorias();
            await getImages(parseInt(id));

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
            }else{
                router.push("/dashboard/produtos?peding");
            }

        }

    }

    function ChangeInput(e: React.ChangeEvent<HTMLInputElement>): void {
        e.preventDefault();
        const {name, value} = e.target;

        if(name === "preco_produto" || name === "quantidade_estoque"){
            const finalVal = value.replace(/[^0-9]/g, "");
            const intVal = isNaN(parseInt(finalVal)) ? "0" : parseInt(finalVal);

            setData((prev)=>({...prev, [name]: intVal}))
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

    function DeleteImage(url: string){

        console.log(url)
    }

    const DotsImage:FunctionComponent<urlImage> = ({url})=>{
        return(
            <DropdownMenu.Root>
                <DropdownMenu.Trigger className="outline-none">
                    <div className="cursor-pointer text-slate-50">{<FontAwesomeIcon icon={faEllipsis} />}</div>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="outline-none bg-slate-50 p-3 px-4 rounded-lg shadown font-semibold flex flex-col gap-2">
                    <AlertDialog.Root>
                        <AlertDialog.Trigger>
                            deletar
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
                                    <button onClick={()=>DeleteImage(url)} className="bg-red-500 font-semibold text-slate-50 px-3 rounded text-lg">Deletar</button>
                                </AlertDialog.Action>
                            </div>
                            </AlertDialog.Content>
                        </AlertDialog.Portal>
                    </AlertDialog.Root>

                    
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        )
    }

    function RenderImages(){

        const finalUrls: string[] = [];
        const capaId: string[] = [];

        if(images.length > 0 && images[0].url != ""){
            Object.entries(images).map(([, val])=>{
                const image = val as ImagesInterface;
                
                if(image.pathname.includes("capa_"))
                    capaId.push(image.pathname.split("capa_")[1].split(".")[0]);
            });

            if(capaId.length > 0){
                Object.entries(images).map(([, val])=>{
                    const image = val as ImagesInterface;
                    if(!image.pathname.includes("capa_") && image.pathname.includes(capaId[0])){
                        finalUrls.push(image.url);
                    }
                });
            }

            Object.entries(images).map(([, val])=>{
                const image = val as ImagesInterface;

                if(!finalUrls[0].includes(image.url) && !image.pathname.includes("capa_")){
                    finalUrls.push(image.url);
                }
            });
        }

        if(finalUrls.length > 0)
            return(
                <div className="flex gap-6 justify-start relative p-3 min-w-max">

                    <div className="flex flex-col gap-3 bg-neutral-800 p-2 rounded-lg shadown">
                        <div style={{maxWidth: "80px"}} > 
                            <Zoom >
                            <Image priority className="rounded-lg" width={500} height={500} alt="imagem" src={finalUrls[0]} />
                            </Zoom>
                        </div>
                        <DotsImage url={finalUrls[0]} />
            
                    </div>
                    
                        {Object.entries(finalUrls).slice(1).map(([key,val])=>(
                            <React.Fragment key={key}>
                            <div className="min-h-full bg-slate-200 rounded-2xl w-0.5"></div>
                            <div className="flex flex-col gap-3 bg-neutral-800 p-2 rounded-lg shadown">
                                <div  style={{maxWidth: "80px"}}>
                                    <Zoom >
                                        <Image priority className="rounded-lg" width={500} height={500} alt="imagem" src={val} />
                                    </Zoom>
                                </div>
                                <DotsImage url={val} />
                            </div>
                            </React.Fragment>
                        ))}
                    

                </div>
            )
    }

    function limpaAlert(){
        setTimeout(()=>{
            setAlertMessage("");
            setAlertType(null);
        },3800);
    }

    async function updateTable(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const token = await getUpdateProductToken();
        const obj = new FormData(e.target as HTMLFormElement);
        const DateForm: any = {};

        obj.forEach((val,key)=>{
            DateForm[key] = val;
        })

        const api = await fetch("/api/updateproduct",{
            method: "POST",
            body: JSON.stringify(DateForm),
            headers:{
                "Content-type":"application/json",
                "x-key":`Bearer ${token}`,
            }
        });

        const status = api.status;
        const response = await api.json();

        if(status === 200){
            setAlertType("sucesso")
            setAlertMessage("Produto atualizado com sucesso!")
            limpaAlert();
        }else{
            setAlertType("erro")
            setAlertMessage("Algo deu errado!")
            limpaAlert();
        }

    }

    return(
        <div className="flex flex-col productContainer">
        <div className="mt-7 productContent p-3">
        {data.id_produto == 0 ?
        <Skeleton type="edit_product" /> //criar o type correto depois
        :
        <>
        <RenderImages />
        <form method="POST" onSubmit={updateTable} className="w-full flex flex-col form_edit_product gap-5 mt-10">
            <input type="hidden" name="id_produto" value={data.id_produto || ""} />
            <input type="hidden" name="prod_produto" value={data.prod_produto || ""} />
            <div>
                <h2>Nome: </h2>
                <input onChange={ChangeInput} type="text" name="nome_produto" value={data.nome_produto || ""} />
            </div>
            <div>
                <h2>Descrição: </h2>
                <input onChange={ChangeInput} type="text" name="descricao_produto" value={data.descricao_produto || ""} />
            </div>
            <div>
                <h2>{`Preço: R$${(data.preco_produto/100).toString().replace(".",",")}`}</h2>
                <input onChange={ChangeInput} type="text" name="preco_produto" value={data.preco_produto || 0} />
            </div>
            <div>
                <h2>Quantidade em estoque: </h2>
                <input onChange={ChangeInput} type="text" name="quantidade_estoque" value={data.quantidade_estoque || 0}/>
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
                    <option value={`${data.ativado_produto || true} `} defaultValue={"false"}>{`${data.ativado_produto === true ? "sim" : "não"}`}</option>
                    <option value={`${!data.ativado_produto}`}>{`${!data.ativado_produto === true ? "sim" : "não"}`}</option>
                </select>
            </div>
            <div>
                <h2>Produto em rascunho: </h2>
                <select name="rascunho_produto" >
                    <option value={`${data.rascunho_produto || true} `} defaultValue={"true"}> {`${data.rascunho_produto === true ? "sim" : "não"}`}</option>
                    <option value={`${!data.rascunho_produto}`}>{`${!data.rascunho_produto === true ? "sim" : "não"}`}</option>
                </select>
            </div>

            <input type="submit" value={"ATUALIZAR"} className="cursor-pointer bg-blue-500 text-slate-50 transition scale hover:bg-blue-400" />
            
        </form>
        <AlertUI type={alertType} message={alertMessage} />
        </>
        }
        </div>
        </div>
    )
}