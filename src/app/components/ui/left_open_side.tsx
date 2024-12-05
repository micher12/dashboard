"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Left_Open_Side(){

    const [closedSide, setClosedSide] = useState(false);
    const [resized, setResized] = useState(false);

    useEffect(()=>{
        function resize(){
            const width = window.innerWidth;

            if(width <= 980){
                if(!resized){
                    setClosedSide(!closedSide);
                    setResized(true);
                }
            }else{
                if(resized){
                    setClosedSide(!closedSide);
                    setResized(false);
                }
            }

        }
        resize();

        window.addEventListener("resize",resize);

        return ()=>{
            window.removeEventListener("resize",resize);
        }

    },[resized]);

    function changeIcon(): void {
        setClosedSide(!closedSide);

        const aside = document.querySelector("aside") as HTMLElement;
        const width = window.innerWidth;

        if(!closedSide){
            aside.style.display = "none"
        }else{
            aside.style.display = "flex"
            console.log("aqui")
        }
        
    }

    return(
        <>
        {closedSide ? 
        <div onClick={changeIcon} className="cursor-pointer"><Image src={"/left_panel_open.svg"} priority quality={100} width={30} height={20} alt="Close left panel" /></div>
        :
        <div onClick={changeIcon} className="cursor-pointer"><Image src={"/left_panel_close.svg"} priority quality={100} width={30} height={20} alt="Close left panel" /></div>
        }
        </>
    )
}