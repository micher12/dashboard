"use client";

import { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import Skeleton from "./Skeleton";
import Left_Open_Side from "./ui/left_open_side";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface MainContentProps{
    content?: JSX.Element
}


const MainContent:FunctionComponent<MainContentProps> = ({ content }) => {

    const [navegation,setNavegation] = useState<JSX.Element[]>([]);
    const [loading,setLoading] = useState(true);
    const executedRef = useRef(false);


    function start(){
        
        const path = window.location.pathname;
        const parts = path.split("/")

        if(parts.length > 2){
            
            for (let i = 1; i < parts.length; i++) {
                if (i > 1) {
                    setNavegation((prev) => [
                        ...prev,
                        <FontAwesomeIcon key={`chevron-${i}`} style={{width: "7px"}} icon={faChevronRight} />,
                    ]);
                }
        
                const slug = parts.slice(1, i + 1).join("/"); // Gera o slug correto dinamicamente
                setNavegation((prev) => [
                    ...prev,
                    <Link key={`link-${i}`} href={`/${slug}`}>
                        {formatSlug(parts[i])}
                    </Link>,
                ]);
            }

        }else{
            const el: string = parts[1] ? formatSlug(parts[1]) : "Dashboard";

            setNavegation((prev)=> [...prev, <Link key={`link-0`} href={"/dashboard"}>{el}</Link>]);
        }

        
    }
    

    useEffect(()=>{
        if (!executedRef.current) {
            start();
            setLoading(false);
            executedRef.current = true;
        }

    },[])

    const formatSlug = (string: string): string =>{
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return(
        <div className="min-h-screen w-full">
            <header className="px-3 py-5 flex items-center gap-1">
                <Left_Open_Side />
                <ul className="w-full">
                    {loading ? 
                    <Skeleton type="header" />
                    :
                    <h2 className="flex gap-1 items-center">
                    {navegation}
                    </h2>
                    }
                </ul>
            </header>

            <div className="main-content rounded-lg shadown border p-5">
                {content}
            </div>
        </div>
    )
}

export default MainContent;