import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import Checkbox from "@/widgets/layout/Checkbox";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { platformSettingsData, conversationsData, projectsData } from "@/data";
import { useSelector, useDispatch } from "react-redux";
import defaultIcon from "@/img/avatar.svg";
import useDefaultImage from "@/hooks/useDefaultImage";
import config from "@/configs/config.json";
import {useState, useEffect, Fragment} from "react";
import useWaiting from "@/hooks/useWaiting";
import { deleteBuyerPicture, updateBuyer } from "@/apiCalls/buyers";
import { setClients } from "@/store/slices/selectClients";
import {setUser} from "@/store/slices/auth"
const GENDERLABELS = {
  'MALE':"homme",
  'FEMALE':"femme"
}

export function Profile() {
  const user = useSelector((state) => state.auth.value.user);
  const [openEditModal,setOpenEditModal]=useState(null);
  const [editDataState,setEditDataState]=useState(null);
  const [waiting, enableWaiting, disableWaiting] = useWaiting();
  const [error, setError] = useState("");
  const token = useSelector((state) => state.auth.value.token);
  const buyers = useSelector((state) => state.selectClients.value.clients);
  const [profilePicture, setProfilePicture] = useState(null);
  const [deletePhotoChecked, setDeletePhotoChecked] = useState(false);

  const dispatch = useDispatch();
  useEffect(()=>{
    if (openEditModal){
      setEditDataState({
        'id':openEditModal._id,
        'Prénom':openEditModal.firstname,
        'Nom':openEditModal.lastname,
        'Numéro de Téléphone':openEditModal.phoneNumber,
        'Adresse':openEditModal.address,
        //'Gender':openEditModal.gender
      })
    }
    else {
      setEditDataState(null);
      setError("");
    }
  },[openEditModal])
  useDefaultImage(defaultIcon);
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
  return (
    <>
      {openEditModal && editDataState?
      <Dialog open={openEditModal?true:false} handler={handleClosingDialog} size="xl" className="px-2 sm:px-8 py-4 relative overflow-y-scroll max-h-[90%]">
        <DialogHeader className="mb-4 pb-2 px-0 border-b-2 border-gray-400">
          Modifier Les Données Du {openEditModal.firstname} {openEditModal.lastname}
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            {
              Object.keys(editDataState).filter(key=>key!='id').map((key)=>{
                return (<Fragment key={key}>
                  {key==="Gender"?<Select label={key} value={editDataState[key]} onInput={(e)=>{setEditDataState({...editDataState,[key]:e.target.value})}}>
                    <Option value="MALE">Homme</Option>
                    <Option value="FEMALE">Femme</Option>
                  </Select>
                  :
                  <Input type={key==='Numéro De Téléphone' || key ==="Numéro De Carte D'identité"?'number':'text'} label={key} value={editDataState[key]} onInput={(e)=>{
                    setEditDataState({...editDataState,[key]:e.target.value})
                  }} />}
                </Fragment>)
              })
            }
            <div className="flex gap-2 items-center">
              <Input id="profile-picture" accept="image/*" type="file" label="Profile Picture" onInput={(e)=>{
                setProfilePicture(e.target.files[0]);
                setDeletePhotoChecked(false);
              }} />
              {profilePicture && <XMarkIcon className="w-6 h-6 text-red-500 cursor-pointer" onClick={()=>{
                setProfilePicture(null);
                document.getElementById('profile-picture').value=null;
              }}/>}
            </div>
            <div className="flex items-center">
              <Typography color="gray" className="font-medium">Supprimer la photo de profile:</Typography>
              <Checkbox disabled={profilePicture} checked={deletePhotoChecked} color="blue" onChange={(e)=>{setDeletePhotoChecked(prev=>!prev)}} />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button style={{width:'fit-content'}} onClick={()=>{
              setError(null);
              enableWaiting();
              const formData = new FormData();
              const data = {
                firstname: editDataState['Prénom'],
                lastname: editDataState['Nom'],
                phoneNumber: editDataState['Numéro de Téléphone'],
                address:editDataState['Adresse'],
                //gender:editDataState['Gender'],
              }
              // add the profile picture to the form if not empty
              if (profilePicture){
                formData.append('avatar',profilePicture);
              }
              Object.keys(data).forEach(key=>{
                formData.append(key,data[key]);
              })

              const updatePromise = updateBuyer(openEditModal._id,formData,token);
              const promisesArray = [updatePromise];
              if(deletePhotoChecked){
                const deletePhotoPromise = deleteBuyerPicture(openEditModal._id,token);
                promisesArray.push(deletePhotoPromise);
              }
              Promise.all(promisesArray).then(arrayRes=>{
                const [res] = arrayRes;
                if(res.status>=200 && res.status <= 299){
                  const copy = [...buyers];
                  const index = copy.findIndex(client=>client._id===openEditModal._id);
                  copy[index] = {...copy[index],...data};
                  if(deletePhotoChecked){
                    copy[index].profileImage = null;
                  }
                  const newUser = {user:user.user,profile:{...user.profile,...data, profileImage:deletePhotoChecked?null:res.data.profileImage}};
                  localStorage.setItem('user',JSON.stringify(newUser));
                  dispatch(setUser(newUser));
                  dispatch(setClients(copy));
                  setOpenEditModal(null);
                }
                disableWaiting();
                handleClosingDialog();
              }).catch(err=>{
                console.error(err);
                setError(err.response.data.message);
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
          <div className="mb-10 flex items-center justify-between gap-6">
            <div className="flex items-center gap-6 w-full">
              <Avatar
                src={user.profile.profileImage?(config.wsUrl+"/public"+user.profile.profileImage):"/img/avatar.svg"}
                alt="avatar"
                size="xl"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {user.profile.firstname} {user.profile.lastname}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  Admin
                </Typography>
              </div>
              <PencilSquareIcon className="h-6 w-6 ml-auto mr-2 text-blue-500 cursor-pointer" onClick={()=>setOpenEditModal(user.profile)} />
            </div>
            {/* <div className="w-96">
              <Tabs value="app">
                <TabsHeader>
                  <Tab value="app">
                    <HomeIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    App
                  </Tab>
                  <Tab value="message">
                    <ChatBubbleLeftEllipsisIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />
                    Message
                  </Tab>
                  <Tab value="settings">
                    <Cog6ToothIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    Settings
                  </Tab>
                </TabsHeader>
              </Tabs>
            </div> */}
          </div>
          <div className="mb-12 gap-12 px-4">
{/*             <div>
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Platform Settings
              </Typography>
              <div className="flex flex-col gap-12">
                {platformSettingsData.map(({ title, options }) => (
                  <div key={title}>
                    <Typography className="mb-4 block text-xs font-semibold uppercase text-blue-gray-500">
                      {title}
                    </Typography>
                    <div className="flex flex-col gap-6">
                      {options.map(({ checked, label }) => (
                        <Switch
                          key={label}
                          id={label}
                          label={label}
                          defaultChecked={checked}
                          labelProps={{
                            className: "text-sm font-normal text-blue-gray-500",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
            <ProfileInfoCard
              title="Informations Sur Le Profil"
              //description="Hi, I'm Alec Thompson, Decisions: If you can't decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."
              details={{
                Nom: user.profile.firstname + " " + user.profile.lastname,
                'Numéro de téléphone': user.profile.phoneNumber,
                'Adresse Email': user.user.email,
                'Adresse': user.profile.address,
                'gender':GENDERLABELS[user.profile.gender] || 'Non disponible',
                'Date De Naissance':user.profile.dateOfBirth || 'Non disponible',
              }}
            />
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default Profile;
