"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxesStacked, faHouse } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AsideBar(){

    const [mobiled,setMobiled] = useState(false);

    useEffect(()=>{
        function resize(){
            const width = window.innerWidth;
            if(width <= 1368){
                setMobiled(false);
            }else{
                setMobiled(true);
            }
        }
        resize();

        window.addEventListener("resize",resize);

        ()=>{
            return window.removeEventListener("resize",resize);
        }

    },[]);

    return(
        <aside className="flex flex-col justify-start gap-5 items-center min-w-72 py-10 min-h-screen asideStyle shadow-lg px-3">
            <Link href={"/"} >
                <Image style={{width: "auto"}} priority src={"/icon-black.png"} width={50} height={100} alt="Logo" />
            </Link>
            <div className="flex flex-col gap-3 mt-2">
                <Link href={"/dashboard"} className="flex items-center gap-1 font-semibold text-lg cursor-pointer"><FontAwesomeIcon icon={faHouse} style={{width: "20px"}} /> {mobiled ? "HOME" : <></>}</Link>
                <Link href={"/dashboard/produtos"} className="flex items-center gap-1 font-semibold text-lg cursor-pointer"><FontAwesomeIcon icon={faBoxesStacked} style={{width: "20px"}} /> {mobiled ? "PRODUTOS" : <></>}</Link>
            </div>
        </aside>
    )
}