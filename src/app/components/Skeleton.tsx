"use client";

import { FunctionComponent } from "react";

interface SkeletonProps{
    type: "image" | "header" | "products" | "edit_product" | "create_new_product",
    className?: string
}

const Skeleton:FunctionComponent<SkeletonProps> = ({type, className}) => {

    
    if(type === "image"){
        const classe = `bg-slate-300 rounded-lg skeleton-image ${className}`;

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
        const classe = `rounded-lg skeleton-bg w-20 h-4`;

        return(
            <div className="flex items-center gap-3 jusity-center">
                <div className={classe}></div>
                <div className={classe}></div>
            </div>
        );
    }
    if(type === "products"){
        const classe = `bg-slate-300 rounded bg-skeleton h-10 w-32 grow-1`;
        const cape = `h-24 w-24 rounded-lg`;
        const mainClass = `border-y py-5 flex items-center justify-around flex-nowrap ${className}`;

        return(
            <>
            <div className={mainClass}>
                <div className={`${classe} ${cape}`}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
            </div>
            <div className={mainClass}>
                <div className={`${classe} ${cape}`}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
            </div>
            <div className={mainClass}>
                <div className={`${classe} ${cape}`}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
            </div>
            <div className={mainClass}>
                <div className={`${classe} ${cape}`}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
            </div>
            <div className={mainClass}>
                <div className={`${classe} ${cape}`}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
            </div>
            </>
        )
    }
    if(type === "edit_product"){
        const classe = `bg-slate-300 rounded bg-skeleton h-10`;
        const imageClass = `bg-slate-300 rounded-lg bg-skeleton w-32 h-32 flex-1`;

        return(
            <>
            <div className="flex items-center gap-16 justify-start flex-wrap w-max">
                <div className={imageClass}></div>
                <div className={imageClass}></div>
                <div className={imageClass}></div>
                <div className={imageClass}></div>
                <div className={imageClass}></div>
                <div className={imageClass}></div>
            </div>
            <div className="flex flex-col gap-12 mt-8">
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
            </div>
            </>
        )
    }
    if(type === "create_new_product"){
        const classe = `bg-slate-300 rounded bg-skeleton h-10`;
        const imageClass = `bg-slate-300 rounded-lg bg-skeleton w-40 h-40`;

        return(
            <>
            
            <div className="flex flex-col gap-12 mt-8">
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className={classe}></div>
                <div className="flex items-center gap-16 justify-start flex-wrap">
                    <div className={imageClass}></div>
                    <div className={imageClass}></div>
                    <div className={imageClass}></div>
                    <div className={imageClass}></div>
                    <div className={imageClass}></div>
                </div>
            </div>
            </>
        )
    }

}

export default Skeleton;