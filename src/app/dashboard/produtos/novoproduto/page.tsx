import AsideBar from "@/app/components/AsideBar";
import MainContent from "@/app/components/MainContent";
import CreateNewProduct from "@/app/components/ui/products/createnewproduct";

export default function NewProduct(){

    return(
        <>
         <main className='min-h-screen flex items-start jutify-center relative'>
            <AsideBar />
            <MainContent content={<CreateNewProduct />} />
        </main>
        </>
    )

}