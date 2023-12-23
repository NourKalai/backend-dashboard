import { XMarkIcon } from "@heroicons/react/24/solid";
import { Button, Typography } from "@material-tailwind/react";

export function ConfirmAction({action, description, handler, open, errorMessage}){
    if(!open){
        return null;
    }
    return(
        <div className="fixed z-50 inset-0 overflow-y-auto w-[100vw] h-[100vh] flex justify-center items-center bg-black bg-opacity-40">
            <div className="flex flex-col gap-8 items-center justify-center px-2 sm:px-8 py-12 bg-white rounded-md shadow-md relative max-w-[95%]">
                <XMarkIcon className="h-6 w-6 text-red-500 hover:text-gray-600 absolute right-2 top-2" onClick={()=>{
                    handler(null);
                }} />
                {errorMessage?<Typography color="red" className="font-medium text-md text-center">{errorMessage}</Typography>:
                    <Typography color="gray" className="w-[300px] sm:w-full font-medium text-md text-center">{description}</Typography>
                }
                {!errorMessage?<div className="flex gap-8">
                    <Button variant="outlined" style={{"width":"fit-content"}} onClick={action}>
                        Oui
                    </Button>
                    <Button style={{"width":"fit-content"}} onClick={()=>{
                        handler(null);
                    }}>
                        Non
                    </Button>
                </div>:
                    <Button style={{"width":"fit-content"}} onClick={()=>{
                        handler(null);
                    }}>
                        Fermer
                    </Button>
                }
            </div>
        </div>
            
    )
}
