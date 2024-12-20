"use client";

import { FunctionComponent } from "react";

interface AlertComponent{
    type: "sucesso" | "erro" | null,
    message?: string
}

const AlertUI:FunctionComponent<AlertComponent> = ({type, message})=>{

    
    if(type === "sucesso"){
        return(
            <div className="alertSucesso bg-green-500 text-slate-50 rounded px-6 py-1 font-bold">
                {message}
            </div>
        )
    }
    if(type === "erro"){
        return(
            <div className="alertSucesso bg-red-500 text-slate-50 rounded px-6 py-1 font-bold">
                {message}
            </div>
        )
    }
    if(type === null)
        return null;


}

export default AlertUI;