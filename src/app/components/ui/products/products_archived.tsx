import { useEffect, useState } from "react"
import RenderProductAdminUI from "./RenderProductAdminUI";
import Skeleton from "../../Skeleton";

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

export default function ProdutcsArchived(){

     const [data, setData] = useState<dataProps[] | null>(null);

    useEffect(()=>{
        getData();
    },[]);

    async function getData() {
        const api = await fetch("/api/getarchived",{
            method: "POST",
            headers:{
                "Content-type":"application/json",
                "x-key": `Bearer `,
            }
        })

        const status = api.status;
        const res:dataProps[] = await api.json();

        if(status === 200)
            setData(res);
    }


    

    return(
        <>
        {data ?
            <RenderProductAdminUI data={data} />
        :
        <Skeleton type="products" />
        }
        </>
    )
}


