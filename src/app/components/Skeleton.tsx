"use client";

import { FunctionComponent } from "react";

interface SkeletonProps{
    type: "image" | "header",
    className?: string
}

const Skeleton:FunctionComponent<SkeletonProps> = ({type, className}) => {

    
    if(type === "image"){
        const classe = `bg-slate-300 rounded-lg shadown skeleton-image ${className}`;

        return(
            <div className="flex items-center gap-16 justify-start flex-wrap">
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
            </div>
        );
    }
    if(type === "header"){
        const classe = `rounded-lg shadow-lg skeleton-bg w-20 h-4`;

        return(
            <div className="flex items-center gap-3 jusity-center">
                <div className={classe}></div>
                <div className={classe}></div>
            </div>
        );
    }

}

export default Skeleton;