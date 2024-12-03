import AsideBar from "@/app/components/AsideBar";
import MainContent from "@/app/components/MainContent";
import ProdutosUI from "@/app/components/ui/ProdutosUI";

export default function Produtos(){
    return(
        <main className='min-h-screen flex items-start jutify-center relative'>
            <AsideBar />
            <MainContent content={<ProdutosUI />} />
        </main>
    )
}