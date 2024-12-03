import Image from "next/image";
import { useEffect, useState } from "react";

export default function Left_Open_Side(){

    const [closedSide, setClosedSide] = useState(false);

    useEffect(()=>{
        const width = window.innerWidth;
    },[]);

    function changeIcon(): void {
        setClosedSide(!closedSide);

        const aside = document.querySelector("aside") as HTMLElement;

        if(!closedSide){
            aside.style.display = "none"
        }else{
            aside.style.display = "flex"
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