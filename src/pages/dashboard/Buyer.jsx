import { useDispatch, useSelector } from "react-redux";
import {
  Avatar, Button,
  Card,
  CardBody, Dialog,
  DialogBody,
  DialogHeader,
  Input,
  Switch,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import Checkbox from "@/widgets/layout/Checkbox";
import { ProfileInfoCard } from "@/widgets/cards/index.js";
import {useParams} from "react-router-dom";
import defaultIcon from '@/img/avatar.svg'
import useDefaultImage from "@/hooks/useDefaultImage";
import config from "@/configs/config.json"
import React, { useEffect, useMemo, useState } from "react";
import { setServices } from "@/store/slices/selectServices.js";
import { deleteBuyerPicture, updateBuyer } from "@/apiCalls/buyers.js";
import useWaiting from "@/hooks/useWaiting.js";
import { PencilSquareIcon } from "@heroicons/react/20/solid/index.js";
import { setClients } from "@/store/slices/selectClients.js";
import { Calendar } from "react-date-range";
import { XMarkIcon } from "@heroicons/react/24/solid";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
function isNumeric(num){
  return !isNaN(num)
}
export default function Buyer(){
  const {id}=useParams();
  const buyers=useSelector(state => state.selectClients.value.clients);
  const token=useSelector(state=>state.auth.value.token);
  const [openEditModal,setOpenEditModal]=useState(null);
  const [editDataState,setEditDataState]=useState(null);
  const buyer= useMemo(()=>buyers?.find((el)=> el._id===id),[buyers,id]);
  const [waiting,enableWaiting,disableWaiting]=useWaiting();
  const dispatch=useDispatch();
  const [error, setError] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [deletePhotoChecked, setDeletePhotoChecked] = useState(false);
  useDefaultImage(defaultIcon);
  useEffect(()=>{
    if (openEditModal){
      setEditDataState({
        'id':openEditModal._id,
        'Prénom':openEditModal.firstname,
        'Nom':openEditModal.lastname,
        'Numéro de Téléphone':openEditModal.phoneNumber,
        'Adresse':openEditModal.address,
        'Date De Naissance':new Date(openEditModal.dateBirth).toLocaleDateString()!== 'Invalid Date'? new Date(openEditModal.dateBirth) : new Date(),
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
          Modifier Les Données de {openEditModal.firstname} {openEditModal.lastname}
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            {
              Object.keys(editDataState).filter(key=>key!='id').map((key)=> {
                if (key==='Date De Naissance'){
                  return (
                    <div className="flex flex-col gap-2" key={key}>
                      <Typography color="gray" className="font-medium">{key}:</Typography>
                      <Calendar className='scale-[0.75] origin-top-left sm:scale-100' date={editDataState[key] || new Date()}
                        onChange={(e) => {
                          if (Date.now() > e) {
                            setEditDataState({ ...editDataState, [key]: e })
                          }
                        }}
                      />
                    </div>
                  )
                }

                return <Input key={key} type={key==='Numéro De Téléphone'?'number':'text'} label={key} value={editDataState[key]} onInput={(e)=>{setEditDataState({...editDataState,[key]:e.target.value})}} />
              })
            }
            <div className="flex items-center gap-2">
              <Input id="profile-picture" type="file" accept="image/*" label="Photo de Profile" onInput={(e)=>{
                setProfilePicture(e.target.files[0])
                setDeletePhotoChecked(false);
              }} />
              {profilePicture&&<XMarkIcon className="h-6 w-6 text-red-500 cursor-pointer" onClick={()=>{
                setProfilePicture(null);
                document.getElementById('profile-picture').value=null;
              }} />}
            </div>
            <div className="flex items-center">
              <Typography color="gray" className="font-medium">Supprimer la photo de profile:</Typography>
              <Checkbox disabled={profilePicture} checked={deletePhotoChecked} color="blue" onChange={(e)=>{setDeletePhotoChecked(prev=>!prev)}} />
            </div>
            {error && <Typography color="red">{error}</Typography>}
            <Button style={{width:'fit-content'}} onClick={()=>{
              setError(null);
              const formData = new FormData();
              const data = {
                firstname: editDataState['Prénom'],
                lastname: editDataState['Nom'],
                phoneNumber: editDataState['Numéro de Téléphone'],
                address:editDataState['Adresse'],
                dateBirth:editDataState['Date De Naissance'].toISOString()
              }
              if(!isNumeric(data.phoneNumber)){
                setError('Numéro de téléphone invalide');
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
                
              enableWaiting();
              const updatePromise = updateBuyer(openEditModal._id,formData,token);
              const promiseArray = [updatePromise];
              if(deletePhotoChecked){
                const deletePromise = deleteBuyerPicture(openEditModal._id,token);
                promiseArray.push(deletePromise);
              }
              Promise.all(promiseArray).then(arrayRes=>{
                const [res] = arrayRes;
                if(res.status>=200 && res.status <= 299){
                  const copy = [...buyers];
                  const index = copy.findIndex(buyer=>buyer._id===openEditModal._id);
                  copy[index] = {...copy[index],...data, profileImage:res.data.profileImage};
                  if(deletePhotoChecked){
                    copy[index].profileImage = null;
                  }
                  dispatch(setClients(copy));
                  handleClosingDialog();
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
    <Card className="mx-3 mt-16 mb-6 lg:mx-4">
      <CardBody className="p-4">
        <div className="mb-10 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Avatar
              src={buyer?.profileImage?(config.wsUrl+"/public"+buyer.profileImage) : "/img/avatar.svg"}
              alt="avatar"
              size="xl"
              className="rounded-lg shadow-lg shadow-blue-gray-500/40"
            />
            <div>
              <Typography variant="h5" color="blue-gray" className="mb-1">
                {buyer?.firstname} {buyer?.lastname}
              </Typography>
              <Typography
                variant="small"
                className="font-normal text-blue-gray-600"
              >
               Client
              </Typography>
            </div>
          </div>
          <PencilSquareIcon onClick={()=>setOpenEditModal(buyer)} variant={"outlined"} className="w-[40px] h-[40px] text-blue-400 cursor-pointer hover:text-blue-600"  />
        </div>
        <div className="mb-12 gap-12 px-4">
          <ProfileInfoCard
            title="Informations Sur Le Profil"
            //description="Hi, I'm Alec Thompson, Decisions: If you can't decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."
            details={{
              'Nom Et Prénom': buyer?.firstname + " " + buyer?.lastname,
              'Numéro De Téléphone' : buyer?.phoneNumber,
              //email: buyer.email,
              Adresse: buyer?.address,
              'Date De Naissance':new Date(buyer?.dateBirth).toLocaleDateString() || 'Non Spécifiée',
              "Date D'ajout":new Date(buyer.date_added).toLocaleDateString() || 'Non Spécifiée'
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
  </>);
}