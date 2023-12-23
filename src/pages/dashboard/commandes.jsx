import { OrdersTable } from "@/widgets/layout/tables"
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import { Dialog, DialogBody, DialogHeader, Typography, Avatar, Chip, Select, Input, Option, Button } from "@material-tailwind/react";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/solid";
import { updateOrder } from "@/apiCalls/orders";
import { setCommandes } from "@/store/slices/selectCommandes";
import useWaiting from "@/hooks/useWaiting";
import { Link } from "react-router-dom";
import config from '@/configs/config.json'
import useDefaultImage from "@/hooks/useDefaultImage";
import defaultIcon from '@/img/avatar.svg'

export function Commandes(){
    const {token} = useSelector(state => state.auth.value);
    const {commandes} = useSelector(state => state.selectCommandes.value);
    const {services} = useSelector(state => state.selectServices.value);
    const {categories} = useSelector(state => state.selectCategories.value);
    const {prestataires} = useSelector(state => state.selectPrestataires.value);
    const {clients} = useSelector(state => state.selectClients.value);
    const dispatch = useDispatch();
    const [openEditModal,setOpenEditModal] = useState(false);
    const [editDataState,setEditDataState] = useState(null);
    const [selectedClient,setSelectedClient] = useState(null);
    const [selectedService,setSelectedService] = useState(null);
    const [servicesIndexed,setServicesIndexed] = useState(null);
    const [categoriesIndexed,setCategoriesIndexed] = useState(null);
    const [prestatairesIndexed,setPrestatairesIndexed] = useState(null);
    const [clientsIndexed,setClientsIndexed] = useState(null);
    const [waiting, enableWaiting, disableWaiting] = useWaiting();
    const [error, setError] = useState("");
    const searchBarValue = useSelector(state=>state.searchBarValue.value.searchBarValue);
    useDefaultImage(defaultIcon,[selectedClient]);
    useEffect(()=>{
        if(openEditModal){
            setEditDataState({
                'id': openEditModal._id,
                'Titre': openEditModal.title,
                'Description': openEditModal.description,
                'Total': openEditModal.total,
/*                 'Date de livraison': new Date(openEditModal.deliveryDate).toLocaleDateString(),
                'Status': openEditModal.status, */
            });
        }
        else{
            setEditDataState(null);
            setError("");
        }
    },[openEditModal]);

    useEffect(()=>{
        if(services){
            setServicesIndexed(services.reduce((acc, service) => {
                acc[service._id] = service;
                return acc;
            }, {}));
        }
    },[services])

    useEffect(()=>{
        if(categories){
            setCategoriesIndexed(categories.reduce((acc, categorie) => {
                acc[categorie._id] = categorie;
                return acc;
            }, {}));
        }
    },[categories])

    useEffect(()=>{
        if(prestataires){
            setPrestatairesIndexed(prestataires.reduce((acc, prestataire) => {
                acc[prestataire._id] = prestataire;
                return acc;
            }, {}));
        }
    },[prestataires])

    useEffect(()=>{
        if(clients){
            setClientsIndexed(clients.reduce((acc, client) => {
                acc[client._id] = client;
                return acc;
            }, {}));
        }
    },[clients])

    const gap = "gap-0 sm:gap-4";
    const dialogTypoLabelClassName = "font-medium text-gray-900 w-60";
    const dialogTypoClassName = "text-gray-800";

    return (
        <>
            {openEditModal && editDataState?
                <Dialog open={openEditModal?true:false} handler={()=>setOpenEditModal(null)} size="xl" className="p-2 overflow-y-auto sm:p-6">
                    <DialogHeader className="flex items-center gap-8 border-b-2 pb-4 mb-6 border-gray-400 sm:pb-8">
                        Modifier La Commande {openEditModal.title}
                    </DialogHeader>
                    <DialogBody>
                    <div className="flex flex-col gap-4">
                        {
                            Object.keys(editDataState).filter(key=>key!='id').map((key)=>{
                                {/* if(key==='Status'){
                                    return(
                                        <Select label="Selectionnez" value={editDataState[key]}>
                                            <Option value="IN_PROGRESS">En Cours</Option>
                                            <Option value="COMPLETED">Livrée</Option>
                                            <Option value="CANCELLED">Annulée</Option>
                                        </Select>
                                    )
                                } */}

                                return <Input key={key} type={key==='Price' ?'number':'text'} label={key} value={editDataState[key]} onInput={(e)=>{setEditDataState({...editDataState,[key]:e.target.value})}} />
                            })
                        }
                        {error && <div className="text-red-500">{error}</div>}
                        <Button onClick={()=>{
                            const data = {
                                title: editDataState['Titre'],
                                description: editDataState['Description'],
                                total: editDataState['Total']
                            }
                            enableWaiting();
                            updateOrder(openEditModal._id, token, data).then(res=>{
                                if(res.status>=200 && res.status <= 299){
                                    const copy = [...commandes];
                                    const index = copy.findIndex(order=>order._id===openEditModal._id);
                                    copy[index] = {...copy[index],...data};
                                    dispatch(setCommandes(copy));
                                    setOpenEditModal(null);
                                }
                                disableWaiting();
                            }).catch(err=>{
                                setError(err.response.data.message);
                                console.error(err);
                                disableWaiting();
                            });
                        }}>
                            Save
                        </Button>
                    </div>
                    </DialogBody>
                </Dialog>:null
            }
            {selectedService?
                <Dialog open={selectedService?true:false} handler={()=>setSelectedService(null)} size="xl" className="p-2 overflow-y-auto sm:p-6">
                    <DialogHeader className="flex items-center gap-8 border-b-2 pb-4 mb-6 border-gray-400 sm:pb-8">
                        <WrenchScrewdriverIcon className="w-10 h-10" />
                        <h2 className="text-lg font-medium text-gray-900">{selectedService.title}</h2>
                    </DialogHeader>
                    <DialogBody>
                        <div className="flex flex-col gap-4">
                            <div className={"flex flex-col "+gap + " sm:flex-row"}>
                                <Typography color="gray" className={dialogTypoLabelClassName}>
                                    Titre:
                                </Typography>
                                <Typography color="gray" className={dialogTypoClassName}>
                                    {selectedService.title}
                                </Typography>
                            </div>
                            <div className={"flex flex-col "+gap + " sm:flex-row"}>
                                <Typography color="gray" className={dialogTypoLabelClassName}>
                                    Description:
                                </Typography>
                                <Typography color="gray" className={dialogTypoClassName}>
                                    {selectedService.description}
                                </Typography>
                            </div>
                            <div className={"flex flex-col "+gap + " sm:flex-row"}>
                                <Typography color="gray" className={dialogTypoLabelClassName}>
                                    Catégorie:
                                </Typography>
                                <Typography color="gray" className={dialogTypoClassName}>
                                    {categoriesIndexed[selectedService.category].title}
                                </Typography>
                            </div>
                            <div className={"flex flex-col "+gap + " sm:flex-row"}>
                                <Typography color="gray" className={dialogTypoLabelClassName}>
                                    Prestataire:
                                </Typography>
                                <Typography color="gray" className={dialogTypoClassName}>
                                    {(prestatairesIndexed[selectedService.user]?.firstname + ' ' + prestatairesIndexed[selectedService.user]?.lastname) || 'undefined'}
                                </Typography>
                            </div>
                            <div className={"flex flex-col "+gap + " sm:flex-row"}>
                                <Typography color="gray" className={dialogTypoLabelClassName}>
                                    Prix:
                                </Typography>
                                <Typography color="gray" className={dialogTypoClassName}>
                                    {selectedService.price}
                                </Typography>
                            </div>
                            <div className={"flex flex-col "+gap + " sm:flex-row gap-0"}>
                                <Typography color="gray" className={dialogTypoLabelClassName}>
                                    Statut
                                </Typography>
                                <Chip
                                    variant="gradient"
                                    color={selectedService.isActive? "green" : "blue-gray"}
                                    value={selectedService.isActive?'active':'not active'}
                                    className="py-0.5 px-2 text-[11px] font-medium w-14 sm:w-auto"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Link to={`/dashboard/service/${selectedService?._id}`} className="focus-visible:outline-none" >
                                    <Typography variant="h5" className="text-cyan-800 underline underline-offset-1">
                                        Voir Service
                                    </Typography>
                                </Link>
                            </div>

                        </div>
                    </DialogBody>
                </Dialog>:null
            }
            {selectedClient?
                <Dialog open={selectedClient?true:false} handler={()=>setSelectedClient(null)} size="xl" className="p-6 overflow-y-auto">
                    <DialogHeader className="flex items-center gap-4 border-b-2 pb-8 mb-6 border-gray-400">
                        <Avatar alt="avatar" size="xl" className="mr-4 rounded-full" src={selectedClient?.profileImage?(config.wsUrl+selectedClient.profileImage) : "/img/avatar.svg"} />
                        <h2 className="text-xl font-medium text-gray-900">{selectedClient.firstname+" "+selectedClient.lastname}</h2>
                    </DialogHeader>
                    <DialogBody>
                        <div className="flex flex-col">
                            <div className={"flex flex-row "+gap}>
                                <Typography color="gray" className={dialogTypoLabelClassName}>
                                    Client:    
                                </Typography>
                                <Typography color="gray" className={dialogTypoClassName}>
                                    {selectedClient.firstname + " " + selectedClient.lastname}
                                </Typography>
                            </div>
                            <div className={"flex flex-row "+gap}>
                                <Typography color="gray" className={dialogTypoLabelClassName}>
                                    Numéro De Téléphone:
                                </Typography>
                                <Typography color="gray" className={dialogTypoClassName}>
                                    {selectedClient.phoneNumber}
                                </Typography>
                            </div>
                            <div className={"flex flex-row "+gap}>
                                <Typography color="gray" className={dialogTypoLabelClassName}>
                                    Adresse:
                                </Typography>
                                <Typography color="gray" className={dialogTypoClassName}>
                                    {selectedClient.address}
                                </Typography>   
                            </div>
                            <div className={"flex flex-row "+gap}>
                                <Typography color="gray" className={dialogTypoLabelClassName}>
                                    Date De Naissance:
                                </Typography>
                                <Typography color="gray" className={dialogTypoClassName}>
                                    {new Date(selectedClient.dateBirth).toLocaleDateString()}
                                </Typography>
                            </div>
                            <div className="flex gap-2">
                                <Link to={`/dashboard/buyer/${selectedClient?._id}`} className="focus-visible:outline-none" >
                                    <Typography variant="h5" className="text-cyan-800 underline underline-offset-1">
                                        Voir Profil
                                    </Typography>
                                </Link>
                            </div>
                        </div>
                    </DialogBody>
                </Dialog>:null}

            <OrdersTable 
                title="Commandes"
                setOpenEditModal={setOpenEditModal}
                setSelectedClient={setSelectedClient}
                setSelectedService={setSelectedService}
                data={commandes.filter((el)=>{
                    return (el.title.startsWith(searchBarValue) || el.description.startsWith(searchBarValue));
                })}
                servicesIndexed={servicesIndexed}
                clientsIndexed={clientsIndexed}
            />
        </>
    )
}