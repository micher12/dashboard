import AsideBar from "@/app/components/AsideBar";
import MainContent from "@/app/components/MainContent";
import CategoriasUI from "@/app/components/ui/categorias/categoriasUI";


export default function Produtos(){


    return(
        <>
        <main className='min-h-screen flex items-start jutify-center relative'>
            <AsideBar />
            <MainContent content={<CategoriasUI/> } />
        </main>
        </>
    )
}