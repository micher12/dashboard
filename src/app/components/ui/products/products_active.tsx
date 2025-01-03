import { useEffect, useState } from "react"
import RenderProductAdminUI from "./RenderProductAdminUI";
import Skeleton from "../../Skeleton";
import getActiveReqToken from "../key/getActiveReqToken";

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

export default function ProdutcsActive(){

    const [data, setData] = useState<dataProps[] | null>(null);

    useEffect(()=>{
        getData();
    },[]);

    async function getData() {
        const token = await getActiveReqToken();

        const api = await fetch("/api/getactive",{
            method: "POST",
            headers:{
                "Content-type":"application/json",
                "x-key": `Bearer ${token}`,
            }
        })

        const status = api.status;
        const res:dataProps[] = await api.json();

        if(status === 200)
            setData(res);
    }


    

    return(
        <>
         <div className="pendingProducts mt-10 flex flex-col w-full">
            {data === null ?
            <Skeleton type="products" className="skeletonPending" />
            :
            <RenderProductAdminUI data={data} />
            }
        </div>
        </>
    )
}


