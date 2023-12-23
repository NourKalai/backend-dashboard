import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Chip,
  Dialog,
  DialogBody,
  DialogHeader, IconButton, Input, Switch,
  Typography,
} from "@material-tailwind/react";
import Checkbox from "@/widgets/layout/Checkbox";
import { ProfileInfoCard } from "@/widgets/cards/index.js";
import List from "@/widgets/layout/List.jsx";
import React, { useEffect, useMemo, useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import useDefaultImage from "@/hooks/useDefaultImage";
import defaultIcon from '@/img/avatar.svg';
import config from "@/configs/config.json"
import { updateBuyer } from "@/apiCalls/buyers.js";
import { setClients } from "@/store/slices/selectClients.js";
import { setPrestataires } from "@/store/slices/selectPrestataires.js";
import useWaiting from "@/hooks/useWaiting.js";
import { PencilSquareIcon } from "@heroicons/react/20/solid/index.js";
import { deleteSellerPicture, updateSeller } from "@/apiCalls/sellers.js";
import { Calendar } from "react-date-range";
import { XMarkIcon } from "@heroicons/react/24/solid";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
function isNumeric(num){
  return !isNaN(num)
}
export default function Seller(){
  const {id}=useParams();
  const sellers=useSelector(state => state.selectPrestataires.value.prestataires);
  const seller=useMemo(()=>sellers?.find((el)=>el._id===id),[id,sellers]);
  const allServices=useSelector(state=>state.selectServices.value.services)
  const [selectedService,setSelectedService] = useState(null);
  const allCategories=useSelector(state=>state.selectCategories.value.categories);
  const [openEditModal,setOpenEditModal]=useState(null);
  const [editDataState,setEditDataState]=useState(null);
  const [waiting,enableWaiting,disableWaiting]=useWaiting();
  const [error, setError] = useState(null);
  const token=useSelector(state => state.auth.value.token);
  const [profilePicture, setProfilePicture] = useState(null);
  const [deletePhotoChecked, setDeletePhotoChecked] = useState(false);
  const dispatch=useDispatch();
  useDefaultImage(defaultIcon);
  useEffect(()=>{
    if (openEditModal){
      setEditDataState({
        'id':openEditModal._id,
        'Prénom':openEditModal.firstname,
        'Nom':openEditModal.lastname,
        'Date de Naissance':new Date(openEditModal.dateBirth).toLocaleDateString() !== 'Invalid Date'? new Date(openEditModal.dateBirth) : new Date(),
        "Numéro de Carte D'identité":openEditModal.cin,
        'Numéro de Téléphone':openEditModal.phoneNumber,
        'Statut':openEditModal.isApproved,
        'Adresse':openEditModal.address,

      })
    }
    else {
      setEditDataState(null);
      setError("");
    }
  },[openEditModal])
  useEffect(()=>{
    if(profilePicture){
      setDeletePhotoChecked(false);
    }
  },[profilePicture])
  const handleClosingDialog=()=>{
    setOpenEditModal(null);
    setProfilePicture(null);
    setError(null);
    setDeletePhotoChecked(false);
  }
  return (<>
    {openEditModal && editDataState?
      <Dialog open={openEditModal?true:false} handler={handleClosingDialog} size="xl" className="px-2 sm:px-8 py-4 relative overflow-y-scroll max-h-[90%]">
        <DialogHeader className="mb-4 pb-2 px-0 border-b-2 border-gray-400">
          Modifier Les Données Du {openEditModal.firstname} {openEditModal.lastname}
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            {
              Object.keys(editDataState).filter(key=>key!='id').map((key)=>{
                if (key=='Statut'){
                  return(<div className="flex gap-2" key={key}>
                    <Typography color="gray" className="font-medium">{key}:</Typography>
                    <Typography color="gray" className="font-normal w-30">{editDataState[key]?'Approuvé(e)':'Non Approuvé(e)'}</Typography>
                    <Switch key={key} checked={editDataState[key]} onChange={(e)=>{setEditDataState({...editDataState,[key]:e.target.checked})}} />
                  </div>)
                }
                else if(key==='Date de Naissance'){
                   return (
                      <div className="flex flex-col gap-2" key={key}>
                        <Typography color="gray" className="font-medium">{key}:</Typography>
                        <Calendar className='scale-[0.75] origin-top-left sm:scale-100' date={editDataState[key] || new Date()}
                         onChange={(e) => {
                           if (Date.now() > e) {
                             setEditDataState({ ...editDataState, [key]: e })
                           }
                       }} />
                      </div>
                    )
                }

                return (
                  <Input key={key} type={key==='Numéro De Téléphone' || key ==="Numéro De Carte D'identité"?'number':'text'} label={key} value={editDataState[key]} onInput={(e)=>{
                    setEditDataState({...editDataState,[key]:e.target.value})
                  }} />
                )
              })
            }
            <div className="flex items-center gap-2">
              <Input id="profile-picture" type="file" accept="image/*" label="Photo de Profile" onInput={(e)=>{
                setProfilePicture(e.target.files[0])
                setDeletePhotoChecked(false);
              }} />
              {profilePicture&&<XMarkIcon className="h-6 w-6 text-red-500 cursor-pointer" onClick={()=>{
                setProfilePicture(null);
                document.getElementById('profile-picture').value='';
              }} />} 
            </div>
            <div className="flex items-center" style={{opacity:profilePicture!==null?'0.4':null}}>
              <Typography color="gray" className="font-medium">Supprimer la photo de profile:</Typography>
              <Checkbox disabled={profilePicture} checked={deletePhotoChecked} color="blue" onChange={(e)=>{setDeletePhotoChecked(prev=>!prev)}} />
            </div>
            {error&&<Typography color="red" className="text-center">{error}</Typography>}
            <Button style={{width:'fit-content'}} onClick={()=>{
              enableWaiting();
              setError(null);
              const formData = new FormData();
              const data = {
                firstname: editDataState['Prénom'],
                lastname: editDataState['Nom'],
                phoneNumber: editDataState['Numéro de Téléphone'],
                address:editDataState['Adresse'],
                dateBirth:editDataState['Date de Naissance'].toISOString(),
                cin:editDataState["Numéro de Carte D'identité"],
                isApproved: editDataState['Statut']
              }
              if(!isNumeric(data.phoneNumber)){
                setError('Numéro de téléphone invalide');
                disableWaiting();
                return;
              }
              // verify if all data is valid
              if(data.firstname.length===0 || data.lastname.length===0 || data.phoneNumber.length===0 || data.address.length===0 || data.cin.length===0){
                setError('Veuillez remplir tous les champs');
                disableWaiting();
                return;
              }
              // add the data to the form
              Object.keys(data).forEach(key=>{
                formData.append(key,data[key]);
              });

              // add the profile picture to the form if not empty
              if (profilePicture){
                formData.append('avatar',profilePicture);
              }
              const updatePromise = updateSeller(openEditModal._id,formData,token);
              const promisesArray = [updatePromise];
              if(deletePhotoChecked){
                const deletePromsie = deleteSellerPicture(openEditModal._id,token);
                promisesArray.push(deletePromsie);
              }
              Promise.all(promisesArray).then(arrayRes=>{
                const [res] = arrayRes;
                if(res.status>=200 && res.status <= 299){
                  const copy = [...sellers];
                  const index = copy.findIndex(seller=>seller._id===openEditModal._id);
                  copy[index] = {...copy[index],...data,profileImage:res.data.profileImage};
                  if(deletePhotoChecked){
                    copy[index].profileImage = null;
                    setDeletePhotoChecked(false);
                  }
                  dispatch(setPrestataires(copy));
                  handleClosingDialog();
                }
                disableWaiting();
              }).catch(err=>{
                setError(err.response.data.message)
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


      {selectedService&&<Dialog className="p-8" size="xl" open={selectedService?true:false} handler={() =>{setSelectedService(null)}}>
        <DialogHeader className="mb-4 pb-2 px-0 border-b-2 border-gray-400">
          {selectedService?.title}
        </DialogHeader>
        <DialogBody className="px-0">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Typography color="gray" className="font-medium">Description:</Typography>
              <Typography color="gray" className="font-normal">{selectedService?.description}</Typography>
            </div>
            <div className="flex gap-2">
              <Typography color="gray" className="font-medium">Prix:</Typography>
              <Typography color="gray" className="font-normal">{selectedService?.price || "Non Spécifié"}</Typography>
            </div>
            <div className="flex gap-2">
              <Typography color="gray" className="font-medium">Catégorie:</Typography>
              <Typography color="gray" className="font-normal">{allCategories?.find(el=>el._id===selectedService?.category).title}</Typography>
            </div>
            <div className="flex gap-2">
              <Typography color="gray" className="font-medium">Statut:</Typography>
              
              <Chip
                variant="gradient"
                color={selectedService?.isActive? "green" : "blue-gray"}
                value={selectedService?.isActive?'Actif':'Non Actif'}
                className="py-0.5 px-2 text-[11px] font-medium"
              />
            
            </div>
            <div className="flex gap-2">
             <Link to={`/dashboard/service/${selectedService?._id}`} className="focus-visible:outline-none" >
                <Typography variant="h6" className="text-cyan-800 underline underline-offset-1">
                    Plus De Détails
                </Typography>
             </Link>
            </div>
          </div>
        </DialogBody>
      </Dialog>}
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url(https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-blue-500/50" />
      </div>
      <Card className="mx-3 mt-16 mb-6 lg:mx-4">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src={seller?.profileImage?(config.wsUrl+"/public"+seller.profileImage) : "/img/avatar.svg"}
                alt="avatar"
                size="xl"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {seller.firstname} {seller.lastname}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  Prestataire
                </Typography>
              </div>
            </div>
            <PencilSquareIcon onClick={()=>setOpenEditModal(seller)} variant={"outlined"} className="w-[40px] h-[40px] text-blue-400 cursor-pointer hover:text-blue-600"  />
          </div>
          <div className="mb-12 gap-12 px-4">

            <ProfileInfoCard
              title="Informations Sur Le Profil"
              //description="Hi, I'm Alec Thompson, Decisions: If you can't decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."
              details={{
                "Nom Et Prénom": seller.firstname + " " + seller.lastname,
                "Numéro De Carte D'identité": seller.cin,
                'Numéro De Téléphone': seller.phoneNumber,
                Adresse: seller.address,
                'Date De Naissance':new Date(seller.dateBirth).toLocaleDateString()|| 'Non Spécifiée',
                "Services Offerts":(
                  <List 
                    array={
                      allServices.filter(el=>["639dd77508a04a1f258a6010","63a22db497c7cb479677a227","63a8814be54fc4b864ea2afc","63d148da50b9b0a5e76f1cf7"].includes(el._id))
                      .map(el=>{return {title:el.title,subtitle:el.description,key:el._id}})
                    }
                    action={(key)=>{ setSelectedService(allServices.find(el=>el._id===key)) }} 
                  />),
                  /*sellerServices.map((id_service,index)=>
                {const service=allServices.find(id=>id===id_service)
                  return (service.title + index!==sellerServices.length && ", ") })||'Non Disponibles',*/
                Statut: ( <Chip
                  variant="gradient"
                  color={seller.isApproved? "green" : "blue-gray"}
                  value={seller.isApproved?'Approuvé(e)':'Non Approuvé(e)'}
                  className="py-0.5 px-2 text-[11px] font-medium"
                />),
                "Date D'ajout":new Date(seller.date_added).toLocaleDateString() || "Non Spécifiée"
                // social: (
                //   <div className="flex items-center gap-4">
                //     <i className="fa-brands fa-facebook text-blue-700" />
                //     <i className="fa-brands fa-twitter text-blue-400" />
                //     <i className="fa-brands fa-instagram text-purple-500" />
                //   </div>
                // ),
              }}
            />

          </div>
        </CardBody>
      </Card>
    </>
  );
}