"use client";

import { useState } from "react"

interface formValues{
    [key: string]: string;
}

export default function CreateNewProduct(){

    const [valForm, setValForm] = useState<formValues>({nome: "", preco:""});

    
    function changeInput(e: React.ChangeEvent<HTMLInputElement>): void {
        e.preventDefault();

        const {name, value} = e.target;

        setValForm((prev)=> ({...prev, [name]: value}));
    }

    return(
        <div className="productContent">
            <form className="newProduct flex flex-col gap-5">
            <div className="flex flex-col gap-2">
            <label>Nome: </label>
            <input onChange={changeInput} type="text" name="nome" value={valForm.nome}  className="outline-none" />
            </div>

            <div className="flex flex-col gap-2">
            <label>Preço: </label>
            <input onChange={changeInput} type="text" name="preco" value={valForm.preco}  className="outline-none" />
            </div>

        </form>
        </div>
    )
}