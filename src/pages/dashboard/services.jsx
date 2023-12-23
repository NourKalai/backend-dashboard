import {ServicesTable, Table} from '../../widgets/layout/tables';
import {useSelector} from 'react-redux';
import Axios from 'axios';
import {config} from '../../axios'
import {setPrestataires} from '../../store/slices/selectPrestataires';
import React, { useEffect, useState } from 'react';
import { exemplePrestataires } from '../../exemplePrestataires'
import { useDispatch } from 'react-redux';
import { XCircleIcon } from "@heroicons/react/24/outline";
import { searchCategory } from '@/apiCalls/categories';
import { Dialog, DialogHeader, DialogBody, Input, Switch, Button, Typography, Chip, Avatar } from "@material-tailwind/react";
import {setServices} from "@/store/slices/selectServices.js";
import {updateService} from "@/apiCalls/services.js"; // theme css file
import Select from 'react-select';
import useWaiting from '@/hooks/useWaiting';
import { Link } from "react-router-dom";
import useDefaultImage from '@/hooks/useDefaultImage';
import defaultIcon from '@/img/avatar.svg'

export function Services(){
    const dispatch = useDispatch();
    const searchBarValue = useSelector(state => state.searchBarValue.value.searchBarValue);
    const services = useSelector(state => state.selectServices.value.services);
    const categoriesArray = useSelector(state => state.selectCategories.value.categories);
    const token = useSelector(state => state.auth.value.token);
    const prestatairesArray = useSelector(state => state.selectPrestataires.value.prestataires);
    const [openEditModal, setOpenEditModal] = useState(null);
    const [editDataState,setEditDataState] = useState(null);
    const [selectedPrestataire,setSelectedPrestataire] = useState(null);
    const [selectedCategory,setSelectedCategory] = useState(null);
    const [waiting,enableWaiting,disableWaiting] = useWaiting();
    const prestatairesIndexed = prestatairesArray.reduce((map, object) => ((map[object._id] = {...object}), map), {});
    const categoriesIndexed = categoriesArray.reduce((map, object) => ((map[object._id] = {...object}), map), {});
    useDefaultImage(defaultIcon, selectedPrestataire);
    useEffect(()=>{
        if(openEditModal){
            setEditDataState({
                'id': openEditModal._id,
                'Titre': openEditModal.title,
                'Description': openEditModal.description,
                //'Prix': openEditModal.price || 0,
                //'User': openEditModal.user,
                'Statut': openEditModal.isActive || false,
                'Catégorie':openEditModal.category,
            });
        }
        else{
            setEditDataState(null);
        }
    },[openEditModal]);
    if(!services){
        return <h1>Chargement...</h1>
    }
    return (
        <>
            {selectedCategory?<Dialog className="p-2" size="xl" open={selectedCategory?true:false} handler={() =>{setSelectedCategory(null)}}>
                <DialogHeader className="mb-4 pb-2 px-0 border-b-2 border-gray-400">
                    {selectedCategory?.title}
                </DialogHeader>
                <DialogBody className="px-0">
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2">
                            <Typography color="gray" className="font-medium">Description:</Typography>
                            <Typography color="gray" className="font-normal">{selectedCategory?.description}</Typography>
                        </div>
                    </div>
                </DialogBody>
            </Dialog>:null}
            {selectedPrestataire?<Dialog className="p-6" size="xl" open={selectedPrestataire?true:false} handler={() =>{setSelectedPrestataire(null)}}>
                <DialogHeader className="mb-4 pb-2 px-0 border-b-2 border-gray-400">
                    <Avatar alt="avatar" size="xl" className="mr-4 rounded-full" src={selectedPrestataire?.profileImage?(config.wsUrl+selectedPrestataire.profileImage) : "/img/avatar.svg"} />
                    <h2 className="text-xl font-medium text-gray-900">{selectedPrestataire.firstname+" "+selectedPrestataire.lastname}</h2>
                </DialogHeader>
                <DialogBody className="px-0">
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2">
                            <Typography color="gray" className="font-medium">Numéro De Téléphone:</Typography>
                            <Typography color="gray" className="font-normal">{selectedPrestataire?.phoneNumber}</Typography>
                        </div>
                        <div className="flex gap-2">
                            <Typography color="gray" className="font-medium">Addresse:</Typography>
                            <Typography color="gray" className="font-normal">{selectedPrestataire?.address}</Typography>
                        </div>
                        <div className="flex gap-2">
                            <Typography color="gray" className="font-medium">Statut:</Typography>
                            <Chip
                              variant="gradient"
                              color={selectedPrestataire?.isApproved? "green" : "blue-gray"}
                              value={selectedPrestataire?.isApproved?'Approuvé(e)':'Non Approuvé(e)'}
                              className="py-0.5 px-2 text-[11px] font-medium"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Typography color="gray" className="font-medium">Date De Naissance:</Typography>
                            <Typography color="gray" className="font-normal">{new Date(selectedPrestataire?.dateBirth).toLocaleDateString()}</Typography>
                        </div>
                        <div className="flex gap-2">
                            <Typography color="gray" className="font-medium">CIN:</Typography>
                            <Typography color="gray" className="font-normal">{selectedPrestataire?.cin}</Typography>
                        </div>
                        <div className="flex gap-2">
                            <Link to={`/dashboard/seller/${selectedPrestataire?._id}`} className="focus-visible:outline-none" >
                                <Typography variant="h5" className="text-cyan-800 underline underline-offset-1">
                                    Voir Profil
                                </Typography>
                            </Link>
                        </div>
                    </div>
                </DialogBody>
            </Dialog>:null}
            {openEditModal && editDataState && <Dialog className="px-8 py-4 relative overflow-y-scroll max-h-[90%]" size="xl" open={openEditModal?true:false} handler={() =>{
                setOpenEditModal(null)}
            }>
                <div className="absolute top-2 right-2" style={{cursor:'pointer'}} onClick={()=>{
                    setOpenEditModal(null);
                }}>
                    <XCircleIcon className="h-6 w-6 text-red-500 hover:text-gray-600" />
                </div>
                <DialogHeader className="mb-4 pb-2 px-0 border-b-2 border-gray-400">
                    Modifier Les Informations Du Service {openEditModal.title}
                </DialogHeader>
                <DialogBody className="px-0">
                    <div className="flex flex-col gap-4">
                        {
                            Object.keys(editDataState).filter(key=>key!='id').map((key)=>{
                                if(key==='Statut'){
                                    return(<div className="flex gap-2" key={key}>
                                        <Typography color="gray" className="font-medium">{key}:</Typography>
                                        <Typography color="gray" className="font-normal w-28">{editDataState[key]?'Actif':'Non Actif'}</Typography>
                                        <Switch key={key} checked={editDataState[key]} onChange={(e)=>{setEditDataState({...editDataState,[key]:e.target.checked})}} />
                                    </div>)
                                }
                                else if(key==='Catégorie'){
                                    const options =  categoriesArray.map((category)=>{
                                        return {value:category._id,label:category.title}
                                    })
                                    return(<div className="flex gap-2 items-center" key={key}>
                                        <Typography color="gray" className="font-medium">{key}:</Typography>
                                        <div className="flex flex-1">
                                            <Select required={true} placeholder={categoriesIndexed[editDataState[key]].title} defaultValue={editDataState[key]} className="flex-1" onChange={(e)=>{
                                                setEditDataState({...editDataState,[key]:e.value})}}
                                                options={options}
                                            />
                                        </div>
                                    </div>)
                                }
                                return <Input key={key} type={key==='Price' ?'number':'text'} label={key} value={editDataState[key]} onInput={(e)=>{setEditDataState({...editDataState,[key]:e.target.value})}} />
                            })
                        }
                        <Button onClick={async ()=>{
                            enableWaiting();
                            try{

                                const data = {
                                    title: editDataState['Titre'],
                                    description: editDataState['Description'],
                                    //price: editDataState['Prix'],
                                    category: editDataState['Catégorie'],
                                    isActive: editDataState['Statut']
                                }
                                // const categoryRes = await searchCategory(data.categoryId,token);
                                // if(categoryRes.status<300&&categoryRes.status>=200){
                                //     if(categoryRes.data.length>0){
                                //         console.log(categoryRes.data)
                                //         console.log(categoryRes.data[0]._id)
                                //         data.categoryId = categoryRes.data[0]._id;
                                //     }
                                //     else{
                                //         return;
                                //     }
                                // }

                                const res = await updateService(openEditModal._id,data,token)
                                if(res.status<300&&res.status>=200){
                                    const copy = [...services];
                                    for(let i = 0; i<copy.length; i++){
                                        if(copy[i]._id===editDataState['id']){
                                            copy[i] = {...copy[i], ...data}
                                            break;
                                        }
                                    }

                                    dispatch(setServices(copy));
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
            <ServicesTable setSelectedCategory={setSelectedCategory} setSelectedPrestataire={setSelectedPrestataire} prestatairesIndexed={prestatairesIndexed} categoriesIndexed={categoriesIndexed} setOpenEditModal={setOpenEditModal} title={"Services"} data={services.filter((el)=>{
                return searchBarValue==="" ||  el.title.toLowerCase().startsWith(searchBarValue.toLowerCase()) || el.description.toLowerCase().startsWith(searchBarValue.toLowerCase()) || (prestatairesIndexed[el.user]?.firstname + " " + prestatairesIndexed[el.user]?.lastname).toLowerCase().startsWith(searchBarValue.toLowerCase()) || (prestatairesIndexed[el.user]?.lastname + " " + prestatairesIndexed[el.user]?.firstname).toLowerCase().startsWith(searchBarValue.toLowerCase()) ;
            })} />
        </>)
}