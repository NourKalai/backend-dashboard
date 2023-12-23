import {useSelector} from 'react-redux';
import { Table } from '../../widgets/layout/tables';
import { useDispatch } from 'react-redux';
import { XCircleIcon } from "@heroicons/react/24/outline";
import {Dialog, DialogHeader, DialogBody, Input, Switch, Button, Typography} from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import {setClients} from '../../store/slices/selectClients';
import {updateBuyer} from '@/apiCalls/buyers';
import { Calendar } from 'react-date-range';
import { Routes, Route ,useSearchParams } from 'react-router-dom';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import useWaiting from '@/hooks/useWaiting';
export const Clients = ()=>{
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.value.token);
    const [openEditModal, setOpenEditModal] = useState(null);
    const [editDataState,setEditDataState] = useState(null);
    const clients = useSelector(state => state.selectClients.value.clients);
    const searchBarValue = useSelector(state => state.searchBarValue.value.searchBarValue);
    const [waiting, enableWaiting, disableWaiting] = useWaiting();
    useEffect(()=>{
        if(openEditModal){
            setEditDataState({
                'id': openEditModal._id,
                'Prénom': openEditModal.firstname,
                'Nom': openEditModal.lastname,
                'Numéro de Téléphone': openEditModal.phoneNumber,
                'Adresse': openEditModal.address,
                'Date De Naissance':new Date(openEditModal.dateBirth).toString() !== 'Invalid Date'? new Date(openEditModal.dateBirth) : null
            });
        }
        else{
            setEditDataState(null);
        }
    },[openEditModal]);
    if(!clients){
        return <h1>Chargement...</h1>
    }

    return(<> 
        {openEditModal && editDataState && <Dialog className="px-4 py-4 relative overflow-y-scroll max-h-[90%] sm:p-8" size="xl" open={openEditModal?true:false} handler={() =>{
            setOpenEditModal(null)}
            }>
            <div className="absolute top-2 right-2" style={{cursor:'pointer'}} onClick={()=>{
                setOpenEditModal(null);
            }}>
                <XCircleIcon className="h-6 w-6 text-red-500 hover:text-gray-600" />
            </div>
            <DialogHeader className="mb-4 pb-2 px-0 border-b-2 border-gray-400">
                Edit &nbsp;{openEditModal.firstname}&nbsp;{openEditModal.lastname}'s data
            </DialogHeader>
            <DialogBody className="px-0">
                <div className="flex flex-col gap-4">
                    {
                        Object.keys(editDataState).filter(key=>key!=='id').map((key)=>{
                            if(key==='Status'){
                                return(<div className="flex gap-2" key={key}>
                                    <Typography color="gray" className="font-medium">{key}:</Typography>
                                    <Typography color="gray" className="font-normal w-28">{editDataState[key]?'Approved':'Not Approved'}</Typography>
                                 <Switch key={key} checked={editDataState[key]} onChange={(e)=>{setEditDataState({...editDataState,[key]:e.target.checked})}} />
                                    </div>
                                )
                            }
                            if(key === 'Date De Naissance'){
                                return(
                                    <div className="flex flex-col gap-2" key={key}>
                                        <Typography color="gray" className="font-medium">{key}:</Typography>
                                        <Calendar className='origin-top-left' date={editDataState[key]||new Date()} onChange={(e)=>{
                                            if(Date.now()>e){
                                                setEditDataState({...editDataState,[key]:e})
                                            }
                                        }}/>
                                    </div>
                                )
                            }
                            return <Input key={key} type={key==='Numéro De Téléphone'?'number':'text'} label={key} value={editDataState[key]} onInput={(e)=>{setEditDataState({...editDataState,[key]:e.target.value})}} />
                        })
                    }
                        <Button style={{width:"fit-content"}} onClick={async ()=>{
                            enableWaiting();
                            try{
                                const data = {
                                    firstname: editDataState['Prénom'],
                                    lastname: editDataState['Nom'],
                                    phoneNumber: editDataState['Numéro de Téléphone'],
                                    address: editDataState['Adresse'],
                                    dateBirth: editDataState['Date De Naissance'].toISOString()
                                }
                                const res = await updateBuyer(editDataState['id'],data,token)
                                if(res.status<300&&res.status>=200){
                                    const copy = [...clients];
                                    for(let i = 0; i<copy.length; i++){
                                        if(copy[i]._id===editDataState['id']){
                                            copy[i] = {...copy[i], ...data}
                                            break;
                                        }
                                    }

                                    dispatch(setClients([...copy]));
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
        <Table setOpenEditModal={setOpenEditModal} name={"clients"} title={"Clients"} pdata={clients.filter((el)=>{
            return searchBarValue=="" ||  (el.firstname+" "+el.lastname).toLowerCase().startsWith(searchBarValue.toLowerCase()) || (el.lastname+" "+el.firstname).toLowerCase().startsWith(searchBarValue.toLowerCase()) || el.phoneNumber.toLowerCase().startsWith(searchBarValue.toLowerCase());
        })}/>
    </>)

}