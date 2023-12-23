import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Select,
  Option,
  DialogBody,
  Dialog
} from "@material-tailwind/react";
import { useCallback, useState } from "react";
import { createAdmin } from "@/apiCalls/admin";
import useWaiting from "@/hooks/useWaiting";
import { useDispatch, useSelector } from "react-redux";
import { getBuyerById } from "@/apiCalls/buyers";
import { setClients } from "@/store/slices/selectClients";
const InputItem = ({children }) => {
    return (
        <div className="flex flex-col w-full mb-4">
            {children}
        </div>
    );
};

function notEmpty(){
    return this.value.length > 0?"":"Ce champ est obligatoire";
}

export default function CreateAdmin(){

    const [info, setInfo] = useState({
        firstname:{
            label:"Prénom",
            type:"text",
            value:"",
            error:"",
            verifier:notEmpty
        },
        lastname:{
            label:"Nom",
            type:"text",
            value:"",
            error:"",
            verifier:notEmpty
        },
        phoneNumber:{
            label:"Numéro de téléphone",
            type:"text",
            value:"",
            error:"",
            verifier:function(){
                return this.value.length === 8?"":"Le numéro de téléphone doit contenir 8 chiffres";
            }
        },
        address:{
            label:"Adresse",
            type:"text",
            value:"",
            error:"",
            verifier:notEmpty
        },
        gender:{
            label:"Genre",
            type:"select",
            value:"",
            values:[{
                value:"MALE",
                label:"Homme"
            },
            {
                value:"FEMALE",
                label:"Femme"
            }],
            error:"",
            verifier:notEmpty
        },
        email:{
            label:"Email",
            type:"email",
            value:"",
            error:"",
            verifier:notEmpty
        },
        password:{
            label:"Mot de passe",
            type:"password",
            value:"",
            error:"",
            verifier:notEmpty
        }
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [error, setError] = useState("");
    const [waiting, enableWaiting, disableWaiting] = useWaiting();
    const {token} = useSelector(state=>state.auth.value);
    const [successMessage, setSuccessMessage] = useState("");
    const dispatch = useDispatch();
    const clients = useSelector(state=>state.selectClients.value.clients);
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        const newInfo = {...info};
        newInfo[name].value = value;
        setInfo(newInfo);
    }


    const handleClick = useCallback(async ()=>{
        setError("");
        let noErrors = true;
        Object.keys(info).forEach((key)=>{
            const err = info[key].verifier();
            if(err !== ""){
                noErrors = false;
            }
            if(err !== info[key].error){
                const newInfo = {...info};
                newInfo[key].error = err;
                setInfo(newInfo);
            }
        });
        if(info.password.value !== confirmPassword){
            setConfirmPasswordError("Les mots de passe ne correspondent pas");
            return;
        }
        else{
            setConfirmPasswordError("");
        }
        if(!noErrors){
            return;
        }
        enableWaiting();
        try{
            const body = Object.keys(info).reduce((acc, key)=>{
                if(key=="password" || key=="email"){
                    acc.user[key] = info[key].value;
                }
                else{
                    acc.buyer[key] = info[key].value;
                }
                return acc;
            },{buyer:{},user:{}});
            const response = await createAdmin(token, body);
            if(response.status >= 200 && response.status < 300){
                // clear info
                const newInfo = {...info};
                Object.keys(newInfo).forEach((key)=>{
                    newInfo[key].value = "";
                });
                const buyer = await getBuyerById(response.data.admin.buyerProfile, token);

                console.log(buyer);
                dispatch(setClients([...clients, buyer.data]));
                setInfo(newInfo);
                setConfirmPassword("");
                setError("");
                setConfirmPasswordError("");
                setSuccessMessage("Le compte a été créé avec succès");
            }
            disableWaiting();
        }
        catch(err){
            setError(err.response.data.message);
            disableWaiting();
        }
    },[info, confirmPassword, enableWaiting, disableWaiting, token, clients])


    return (<div className="flex flex-col py-12 sm:py-14 sm:px-6">
                {<Dialog open={successMessage!==""} className="px-4 py-3 rounded relative" handler={()=>setSuccessMessage("")}>
                    <DialogBody><Typography className="block sm:inline text-green-700">{successMessage}</Typography></DialogBody>
                </Dialog>
                }
                <Card>
                    <CardHeader color="blue" className="py-4 flex justify-center items-center">
                        <Typography variant="h6" className=" text-white mt-2 text-center relative bottom-1">
                            Créer un nouveau compte administrateur
                        </Typography>
                    </CardHeader>
                    <CardBody>
                        <div className="flex flex-wrap mt-4">
                            <div className="flex flex-col gap- w-full lg:w-6/12 px-4">
                                {
                                    Object.keys(info).map((key)=>{
                                        if(info[key].type === "select"){
                                            return (
                                                <InputItem key={key} error={info[key].error}>
                                                    <Select error={info[key].error !== ""} name={key} value={info[key].value} label={info[key].label} size="md" onChange={e=>handleInputChange({target:{name:key,value:e}})}>
                                                        {
                                                            info[key].values.map((value)=>{
                                                                return (
                                                                    <Option key={value.value} value={value.value}>{value.label}</Option>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                    {
                                                        info[key].error && <Typography color="red" variant="paragraph" className="text-xs">{info[key].error}</Typography>
                                                    }
                                                </InputItem>
                                            )
                                        }
                                        return (
                                            <InputItem key={key}>
                                                <Input error={info[key].error!==""} name={key} value={info[key].value} label={info[key].label} type={info[key].type} size="md" onChange={handleInputChange} />
                                                {
                                                        info[key].error && <Typography color="red" variant="paragraph" className="text-xs">{info[key].error}</Typography>
                                                }
                                            </InputItem>
                                        )
                                    })
                                }
                                <InputItem>
                                    <Input error={confirmPasswordError!==""} value={confirmPassword} label="Confirm Password" type="password" size="md" onChange={(e)=>setConfirmPassword(e.target.value)} />
                                    {confirmPasswordError!=="" && <Typography color="red" variant="paragraph" className="text-xs">{confirmPasswordError}</Typography>}
                                </InputItem>
                                {error!=="" && <Typography color="red" variant="paragraph" className="">{error}</Typography>}
                                <Button color="blue" className="mt-6" style={{width:'fit-content'}} onClick={handleClick}>
                                    Créer
                                </Button>

                            </div>
                        </div>
                    </CardBody>
                </Card>

            
            
            </div>);
}