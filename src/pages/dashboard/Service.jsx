import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody, CardHeader,
  Chip,
  Dialog,
  DialogBody,
  DialogHeader, IconButton, Input, Switch,
  Typography
} from "@material-tailwind/react";
import { ProfileInfoCard } from "@/widgets/cards/index.js";
import List from "@/widgets/layout/List.jsx";
import React, { useEffect, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/20/solid/index.js";
import { updateService } from "@/apiCalls/services.js";
import { setServices } from "@/store/slices/selectServices.js";
import useWaiting from "@/hooks/useWaiting.js";
import * as PropTypes from "prop-types";
import Select from "react-select";

function EditIcon(props) {
  return null;
}

EditIcon.propTypes = { onClick: PropTypes.func };

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}


export default function Service(){

  const {id}=useParams();
  const allServices=useSelector(state=>state.selectServices.value.services)
  const service=useMemo(() => allServices?.find(el=>el._id===id),[allServices,id]);
  const [selectedOrder,setSelectedOrder] = useState(null);
  const allClients=useSelector(state => state.selectClients.value.clients)
  const allSellers=useSelector(state=>state.selectPrestataires.value.prestataires)
  const allOrders=useSelector(state=>state.selectCommandes.value.commandes)
  const allCategories=useSelector(state=>state.selectCategories.value.categories)
  const [openEditModal,setOpenEditModal] = useState(null);
  const [editDataState,setEditDataState] = useState(null);
  const token=useSelector(state => state.auth.value.token);
  const [waiting, enableWaiting, disableWaiting] = useWaiting();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  useEffect(()=>{
    if(openEditModal){
      setEditDataState({
        'id': openEditModal._id,
        'Titre': openEditModal.title,
        'Description': openEditModal.description,
        'Statut': openEditModal.isActive,
      });
    }
    else{
      setEditDataState(null);
      setError("");
    }
  },[openEditModal]);

  const orderListItem = "flex gap-2 items-center";


  return (
    <>
      {selectedOrder&&<Dialog className="p-2" size="xl" open={selectedOrder?true:false} handler={() =>{setSelectedOrder(null)}}>
        <DialogHeader className="mb-4 pb-2 px-0 border-b-2 border-gray-400">
          {selectedOrder?.title}
        </DialogHeader>
        <DialogBody className="px-0">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Typography color="gray" className="font-medium">Description:</Typography>
              <Typography color="gray" className="font-normal">{selectedOrder?.description}</Typography>
            </div>
            <div className="flex gap-2">
              <Typography color="gray" className="font-medium">Statut:</Typography>
              <Chip
                variant="gradient"
                color={selectedOrder?.status==='IN_PROGRESS'? "yellow" : selectedOrder?.status==='CANCELLED'?'red':'green'}
                value={selectedOrder?.status==='IN_PROGRESS'?"En Cours":selectedOrder?.status==='CANCELLED'?'Annuléé':"Livrée"}
                className="py-0.5 px-2 text-[11px] font-medium w-20 text-center"
              />
            </div>
            <div className={orderListItem}>
              <Typography color="gray" className="font-medium">Total:</Typography>
              <Typography color="gray" className="font-normal">{selectedOrder?.total}</Typography>
            </div>
            <div className={orderListItem}>
              <Typography color="gray" className="font-medium">Date De Livraison:</Typography>
              <Typography color="gray" className="font-normal">{new Date(selectedOrder?.deliveryDate).toLocaleDateString()}</Typography>
            </div>
            <div className={orderListItem}>
              <Typography color="gray" className="font-medium">Infos Sur La Livraison:</Typography>
              <Typography color="gray" className="font-normal">{selectedOrder?.deliveryDescription || 'Aucune'}</Typography>
            </div>
            <div className={orderListItem}>
              <Typography color="gray" className="font-medium">Client:</Typography>
              <Link to={`/dashboard/buyer/${selectedOrder?.buyer}`} className="focus-visible:outline-none">
               <Typography className="text-xs font-semibold text-blue-300 underline underline-offset-2 cursor-pointer hover:text-blue-500">
                {allClients?.find(el=>selectedOrder?.buyer===el._id)?(allClients?.find(el=>selectedOrder?.buyer===el._id))?.firstname+ " "+(allClients?.find(el=>selectedOrder?.buyer===el._id))?.lastname:"Non Spécifié"}
               </Typography>
              </Link>
            </div>

          </div>
        </DialogBody>
      </Dialog>}
      {openEditModal && editDataState?
        <Dialog open={openEditModal?true:false} handler={()=>setOpenEditModal(null)} size="xl" className="p-2 overflow-y-auto sm:p-6">
          <DialogHeader className="flex items-center gap-8 border-b-2 pb-4 mb-6 border-gray-400 sm:pb-8">
            Modifier Le Service {openEditModal.title}
          </DialogHeader>
          <DialogBody>
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
                    const options =  allCategories.map((category)=>{
                      return {value:category._id,label:category.title}
                    })
                    return(<div className="flex gap-2 items-center" key={key}>
                      <Typography color="gray" className="font-medium">{key}:</Typography>
                      <div className="flex flex-1">
                        <Select required={true} placeholder={allCategories?.find(category=>category._id===editDataState[key]).title} defaultValue={editDataState[key]} className="flex-1" onChange={(e)=>{
                          setEditDataState({...editDataState,[key]:e.value})}}
                                options={options}
                        />
                      </div>
                    </div>)
                  }


                  return <Input key={key} type={key==='Prix' ?'number':'text'} label={key} value={editDataState[key]} onInput={(e)=>{setEditDataState({...editDataState,[key]:e.target.value})}} />
                })
              }
              {error&&<Typography color="red" className="">{error}</Typography>}
              <Button onClick={()=>{
                const data = {
                  title: editDataState['Titre'],
                  description: editDataState['Description'],
                  category: editDataState['Catégorie'],
                  isActive:editDataState['Statut'],
                  price:editDataState['Prix'],
                  rating:editDataState['Note'],
                }
                enableWaiting();
                updateService(openEditModal._id,data,token).then(res=>{
                  if(res.status>=200 && res.status <= 299){
                    const copy = [...allServices];
                    const index = copy.findIndex(service=>service._id===openEditModal._id);
                    copy[index] = {...copy[index],...data};
                    dispatch(setServices(copy));
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

      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url(https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-blue-500/50" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4">
        <CardBody className="p-4">

          <div className="flex items-center py-6 px-4 mb-8">
            <div className="flex flex-col">
              <Typography variant="h3" color="black">
                {service?.title.capitalize()}
              </Typography>
              <Typography variant="h5">
                Service
              </Typography>
            </div>
            <div className="ml-auto">
              <PencilSquareIcon onClick={()=>setOpenEditModal(service)} variant={"outlined"} className="w-[30px] h-[30px] text-blue-400 cursor-pointer hover:text-blue-600"  />
            </div>
          </div>


          <div className="mb-12 gap-12 px-4">

            <ProfileInfoCard
              title="Informations Relatives Au Service"
              details={{
                Titre: service?.title,
                Description: service?.description,
                Prix:service.price || "Non Spécifié",
                Note:service.rating || "Non Spécifié",
                'Gain Total':service.totalEarnings || "Non Spécifié",
                Statut: ( <Chip
                  variant="gradient"
                  color={service?.isActive? "green" : "blue-gray"}
                  value={service?.isActive?'Actif':'Non Actif'}
                  className="py-0.5 px-2 text-[11px] text-center font-medium max-w-[80px]"
                />),
                Catégorie:allCategories?.find(el=>el._id===service?.category)?.title,
                Prestataire:(
                  allSellers?.find(el=>el._id===service.user)?
                  <Link to={`/dashboard/seller/${service.user}`}>
                    <Typography className="text-xs font-semibold text-blue-300 underline underline-offset-2 cursor-pointer hover:text-blue-500">
                      { allSellers?.find(el=>el._id===service.user).firstname +" "+allSellers?.find(el=>el._id===service.user).lastname }
                    </Typography>
                  </Link>:"Non Spécifié" ),
                Commandes:(
                  <List
                    array={
                      allOrders.filter(el=>service.orders.includes(el._id))
                      .map(el=>{return {title:el.title,subtitle:el.description,key:el._id}})
                    }
                    action={(key)=>{ setSelectedOrder(allOrders.find(el=>el._id===key)) }}
                  />),

              }}
            />

          </div>

        </CardBody>
      </Card>
    </>
  );
}
