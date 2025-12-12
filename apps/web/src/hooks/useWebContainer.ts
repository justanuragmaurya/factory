import { useEffect, useState } from "react";
import { WebContainer } from "@webcontainer/api"

export  function useWebContainer(){
    const [webcontainer,setWebContainer] = useState<WebContainer>();
    
    async function main(){
        if(!webcontainer){
            const webcontainerInstance = await WebContainer.boot();
            setWebContainer(webcontainerInstance);
            console.log("Mounted");
        }
    }
    
    useEffect(()=>{
        main()
    },[])

    return webcontainer
}