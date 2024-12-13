import AsideBar from "@/app/components/AsideBar";
import MainContent from "@/app/components/MainContent";
import EditProduct from "@/app/components/ui/products/editproduct";

export default function Editar(){
    return(
        <main className="min-h-screen flex items-start jutify-center relative">
            <AsideBar/>
            <MainContent content={<EditProduct/>} />
        </main>
    )
}