import {Table} from '../../widgets/layout/tables';
import {useSelector} from 'react-redux';
import Axios from 'axios';
import {config} from '../../axios'
import {setPrestataires} from '../../store/slices/selectPrestataires';
import { useEffect, useState } from 'react';
import { exemplePrestataires } from '../../exemplePrestataires'
import { updateSeller } from '@/apiCalls/sellers';
import { useDispatch } from 'react-redux';
import { XCircleIcon } from "@heroicons/react/24/outline";
import {Dialog, DialogHeader, DialogBody, Input, Switch, Button, Typography} from '@material-tailwind/react';
import { Calendar } from 'react-date-range';
import useWaiting from '@/hooks/useWaiting';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
export function Prestataires(){
    const dispatch = useDispatch();
    const [waiting, enableWaiting, disableWaiting] = useWaiting();
    const searchBarValue = useSelector(state => state.searchBarValue.value.searchBarValue);
    const prestataires = useSelector(state => state.selectPrestataires.value.prestataires);
    const token = useSelector(state => state.auth.value.token);
    const [openEditModal, setOpenEditModal] = useState(null);
    const [editDataState,setEditDataState] = useState(null);
    useEffect(()=>{
        if(openEditModal){
            setEditDataState({
                'id': openEditModal._id,
                'Prénom': openEditModal.firstname,
                'Nom': openEditModal.lastname,
                'CIN': openEditModal.cin,
                'Numéro de Téléphone': openEditModal.phoneNumber,
                'Adresse': openEditModal.address,
                'Statut': openEditModal.isApproved || false,
                'Date de Naissance':new Date(openEditModal.dateBirth).toString() !== 'Date Invalide'? new Date(openEditModal.dateBirth) : null
            });
        }
        else{
            setEditDataState(null);
        }
    },[openEditModal]);
    if(!prestataires){
        return <h1>Chargement...</h1>
    }
    return (
    <>
    {openEditModal && editDataState && <Dialog className="px-2 sm:px-8 py-4 relative overflow-y-scroll max-h-[90%]" size="xl" open={openEditModal?true:false} handler={() =>{
        setOpenEditModal(null)}
        }>
        <div className="absolute top-2 right-2" style={{cursor:'pointer'}} onClick={()=>{
            setOpenEditModal(null);
        }}>
            <XCircleIcon className="h-6 w-6 text-red-500 hover:text-gray-600" />
        </div>
        <DialogHeader className="mb-4 pb-2 px-0 border-b-2 border-gray-400">
           Modifier Les Informations de {openEditModal.firstname}&nbsp;{openEditModal.lastname}
        </DialogHeader>
        <DialogBody className="px-0">
            <div className="flex flex-col gap-4">
                {
                    Object.keys(editDataState).filter(key=>key!=='id').map((key)=>{
                        if(key==='Statut'){
                            return(<div className="flex gap-2" key={key}>
                                    <Typography color="gray" className="font-medium">{key}:</Typography>
                                    <Typography color="gray" className="font-normal w-28">{editDataState[key]?'Approuvé(e)':'Non Approuvé(e)'}</Typography>
                                    <Switch key={key} checked={editDataState[key]} onChange={(e)=>{setEditDataState({...editDataState,[key]:e.target.checked})}} />
                            </div>)
                        }
                        if(key === 'Date de Naissance'){
                            return(
                                <div className="flex flex-col gap-2" key={key}>
                                    <Typography color="gray" className="font-medium">{key}:</Typography>
                                    <Calendar className='scale-[0.75] origin-top-left sm:scale-100' date={editDataState[key]||new Date()} onChange={(e)=>{
                                        if(Date.now()>e){
                                            setEditDataState({...editDataState,[key]:e})
                                        }
                                    }}/>
                                </div>
                            )
                        }
                        return <Input key={key} type={key==='Numéro De Téléphone' || key ==='CIN'?'number':'text'} label={key} value={editDataState[key]} onInput={(e)=>{setEditDataState({...editDataState,[key]:e.target.value})}} />
                    })
                }
                    <Button style={{width:"fit-content"}} onClick={async ()=>{
                        try{
                            enableWaiting();
                            const data = {
                                firstname: editDataState['Prénom'],
                                lastname: editDataState['Nom'],
                                cin: editDataState['CIN'],
                                phoneNumber: editDataState['Numéro de Téléphone'],
                                address: editDataState['Adresse'],
                                isApproved: editDataState['Statut'],
                                dateBirth: editDataState['Date de Naissance'].toISOString()
                            }
                            const res = await updateSeller(editDataState['id'],data,token)
                            if(res.status<300&&res.status>=200){
                                const copy = [...prestataires];
                                for(let i = 0; i<copy.length; i++){
                                    if(copy[i]._id===editDataState['id']){
                                        copy[i] = {...copy[i], ...data}
                                        break;
                                    }
                                }

                                dispatch(setPrestataires([...copy]));
                                setOpenEditModal(null);
                            }
                            disableWaiting();
                        }
                        catch(err){
                            console.error(err);
                            disableWaiting();
                        }
                    }}>Save</Button>
                
            </div>
        </DialogBody>
    </Dialog>}
    <Table setOpenEditModal={setOpenEditModal} name={"prestataires"} title={"Prestataires"} pdata={prestataires.filter((el)=>{
        return searchBarValue==="" ||  (el.firstname+" "+el.lastname).toLowerCase().startsWith(searchBarValue.toLowerCase()) || (el.lastname+" "+el.firstname).toLowerCase().startsWith(searchBarValue.toLowerCase()) || el.cin.toLowerCase().startsWith(searchBarValue.toLowerCase()) || el.phoneNumber.toLowerCase().startsWith(searchBarValue);
    })} />
    </>)
}