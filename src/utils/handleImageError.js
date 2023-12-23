export const addDefaultSrc = (src) => {
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
        img.addEventListener("error", () => {
            if(img.alt === "avatar"){
                img.src = src;
            }
        });
    });
}

export const removeImgEventListeners = () => {
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
        img.removeEventListener("error", () => {
            if(img.alt === "avatar"){
                img.src = "/img/logo-ct.png";
            }
        });
    });
}