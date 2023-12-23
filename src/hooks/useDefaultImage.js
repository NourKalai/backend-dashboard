import { useEffect } from "react";
import { addDefaultSrc, removeImgEventListeners } from "@/utils/handleImageError";
export default function useDefaultImage(defaultIcon , dependencies=[]){
  useEffect(() => {
    setTimeout(()=>addDefaultSrc(defaultIcon),0);
    return () => {
      removeImgEventListeners();
    }
  });
}