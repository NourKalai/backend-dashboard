import {useSelector,useDispatch} from "react-redux";
import {CategoriesTable} from "@/widgets/layout/tables.jsx";
import {PlusIcon, XMarkIcon} from "@heroicons/react/24/solid";
import {useState,useEffect, Fragment} from "react";
import {addCategory, deleteCategoryImage} from "@/apiCalls/categories";
import {setCategories} from "@/store/slices/selectCategories";
import { updateCategory } from "@/apiCalls/categories";
import {Dialog, DialogHeader, DialogBody, Input, Switch, Button, Typography, Textarea} from '@material-tailwind/react';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { FormHelperText, TextField } from "@mui/material";
import { useCallback } from "react";
import useWaiting from "@/hooks/useWaiting";
import Waiting from "@/widgets/layout/Waiting";
import Checkbox from "@/widgets/layout/Checkbox";
import ListDialog from "@/widgets/layout/ListDialog";
export  function Categories(){
    const dispatch = useDispatch();
    const searchBarValue = useSelector(state => state.searchBarValue.value.searchBarValue);
    const categories = useSelector(state => state.selectCategories.value.categories);
    const token = useSelector(state => state.auth.value.token);
    const [displayedAddForm,setDisplayedAddForm]=useState(false);
    const [openEditModal, setOpenEditModal] = useState(null);
    const [editDataState,setEditDataState] = useState(null);
    const [error,setError] = useState({'Titre':null,'Description':null});
    const [waiting,enableWaiting,disableWaiting] = useWaiting();
    const [deletePhotoChecked, setDeletePhotoChecked] = useState(false);
    const [openSellersDialog, setOpenSellersDialog] = useState(null);
    const [openServicesDialog, setOpenServicesDialog] = useState(null);
    const sellers = useSelector(state => state.selectPrestataires.value.prestataires);
    const services = useSelector(state => state.selectServices.value.services);
    const [categoryDataInput,setCategoryDataInput]=useState({
        'Titre':"",
        'Description':"",
        "Image de la catégorie":null
    })

    function handleAddCategoryDisplayClick(){
        setDisplayedAddForm(prev=>!prev)
    }

    const checkInputValidity = useCallback((editDataState)=>{
        let newError = {...error}
        if(editDataState['Titre'].length<3 || editDataState['Description'].length < 10){
            if(editDataState['Titre'].length<3){
                newError = {...newError, 'Titre':"Le titre doit contenir au moins 3 caractéres"}
            }
            else{
                newError = {...newError, 'Titre':null}
            }
            if(editDataState['Description'].length < 10){
                newError = {...newError, 'Description':"La description doit contenir au moins 10 caractéres"}
            }
            else{
                newError = {...newError, 'Description':null}
            }
            setError(newError);
            return false;
        }
        return true;
    },[error])

    const [updateError, setUpdateError] = useState(null);
    const [addError, setAddError] = useState(null);

    useEffect(()=>{
        if(openEditModal){
            setEditDataState({
                'id' : openEditModal._id,
                'Titre': openEditModal.title,
                'Description': openEditModal.description,
                'Image de la catégorie':null
            });
        }
        else{
            setEditDataState(null);
            setError({'Titre':null,'Description':null});
            setUpdateError(null);
        }
    },[openEditModal, displayedAddForm]);

    useEffect(()=>{
        if(!categoryDataInput){
            setError({'Titre':null,'Description':null});
            setAddError(null);
        }
    },[categoryDataInput])
    

    if(!categories){
        return <h1>Chargement...</h1>
    }
    else{
        return(
            <>
            {
                openSellersDialog && <ListDialog header={"Prestataires de "+openSellersDialog.title} data={sellers.filter(el=>openSellersDialog.sellers.includes(el._id))} handler={()=>{setOpenSellersDialog(null)}} open={openSellersDialog} listItemTitle={["firstname","lastname"]} linkPath={"/dashboard/seller"}    />
            }
            {
                openServicesDialog && <ListDialog header={"Services de "+openServicesDialog.title} data={services.filter(el=>openServicesDialog.services.includes(el._id))} handler={()=>{setOpenServicesDialog(null)}} open={openServicesDialog} listItemTitle={["title"]} linkPath={"/dashboard/service"}    />
            }
            {openEditModal && editDataState && <Dialog className="px-8 py-4 relative overflow-y-scroll max-h-[90%]" size="xl" open={openEditModal?true:false} handler={() =>{
                    setOpenEditModal(null)}
                }>
                    <div className="absolute top-2 right-2" style={{cursor:'pointer'}} onClick={()=>{
                        setOpenEditModal(null);
                    }}>
                        <XCircleIcon className="h-6 w-6 text-red-500 hover:text-gray-600" />
                    </div>
                    <DialogHeader className="mb-4 pb-2 px-0 border-b-2 border-gray-400">
                        Edit &nbsp;{openEditModal.title}'s data
                    </DialogHeader>
                    <DialogBody className="px-0">
                        <div className="flex flex-col gap-4">
                            {
                                Object.keys(editDataState).filter(key=>key!=='id').map((key,idx)=>{
                                    return (<Fragment key={idx}>
                                        <div className="flex items-center">
                                            <Input value={key!=='Image de la catégorie'?editDataState[key]:undefined} accept={key==='Image de la catégorie' ? 'image/*' : null} key={key} id={key} type={key==='Price' ? 'number': key==='Image de la catégorie'?'file':'text'} label={key}
                                                onInput={
                                                    (e)=>{
                                                            const file = e.target.files? e.target.files[0] : null;
                                                            if(!file){
                                                                setEditDataState({...editDataState,[key]:e.target.value});
                                                            }
                                                            else{
                                                                setEditDataState({...editDataState,[key]:file});
                                                                setDeletePhotoChecked(false);
                                                            }
                                                    }
                                                }
                                            />
                                            {key==='Image de la catégorie' && editDataState[key] !== null && <XMarkIcon className="h-6 w-6 text-red-500 hover:text-gray-600" onClick={()=>{
                                                setEditDataState({...editDataState,[key]:null});
                                                document.getElementById(key).value = null;
                                            }}/>}
                                        </div>
                                        {error[key] && <Typography color="red" size="sm">{error[key]}</Typography>}
                                    </Fragment>)
                                })
                            }
                            <div className="flex items-center" style={{opacity:editDataState['Image de la catégorie']!==null?'0.4':null}}>
                                <Typography color="gray" className="font-medium">Supprimer la photo de profile:</Typography>
                                <Checkbox disabled={editDataState['Image de la catégorie']!==null} checked={deletePhotoChecked}  onChange={(e)=>{setDeletePhotoChecked(prev=>!prev)}} />
                            </div>
                            {updateError && <Typography color="red" size="sm">{updateError}</Typography>}
                            <Button style={{width:'fit-content'}} onClick={async ()=>{
                                if(!checkInputValidity(editDataState)) return;
                                setError({'Titre':null,'Description':null});
                                setUpdateError(null);
                                enableWaiting();
                                try{
                                    const data = new FormData();
                                    data.append('title', editDataState['Titre']);
                                    data.append('description', editDataState['Description']);
                                    if(editDataState['Image de la catégorie']!==null){
                                        data.append('categoryImage', editDataState['Image de la catégorie']);
                                    }
                                    const updatePromise = updateCategory(openEditModal._id,data,token);
                                    const promisesArray = [updatePromise];
                                    if(deletePhotoChecked){
                                        promisesArray.push(deleteCategoryImage(openEditModal._id,token));
                                    }
                                    const [res] = await Promise.all(promisesArray);
                                    if(res.status<300&&res.status>=200){
                                        const copy = [...categories];
                                        for(let i = 0; i<copy.length; i++){
                                            if(copy[i]._id===editDataState['id']){
                                                copy[i] = {...copy[i], ...res.data};
                                                if(deletePhotoChecked){
                                                    copy[i].imagePath = null;
                                                    setDeletePhotoChecked(false);
                                                }
                                                break;
                                            }
                                        }

                                        dispatch(setCategories(copy));
                                        setOpenEditModal(null);
                                    }
                                    disableWaiting();
                                }
                                catch(err){
                                    console.error(err);
                                    setUpdateError(err.response.data);
                                    disableWaiting();
                                }
                            }}>Save</Button>
                        </div>
                    </DialogBody>
                </Dialog>}
                <div className="my-12 flex flex-col gap-6 w-full px-4 justify-center">
                    {!displayedAddForm?
                    <Button variant="outlined" onClick={handleAddCategoryDisplayClick} className="flex items-center justify-center" style={{width:"fit-content"}}>
                        <PlusIcon className="w-6 h-6 mr-2"/> Ajouter une catégorie
                    </Button>:null}
                    {
                        displayedAddForm?
                        <>
                            <div className="flex flex-col gap-6 w-full sm:w-[50%]">
                                {
                                    Object.keys(categoryDataInput).map((key)=>{
                                        return (
                                            <div className="flex flex-col" key={key}>
                                                {key!=='Image de la catégorie'?<>
                                                    <Input key={key} type={key==='Price' ?'number':'text'} label={key} value={categoryDataInput[key]} onInput={(e)=>{setCategoryDataInput({...categoryDataInput,[key]:e.target.value})}} />
                                                    {error[key] && !openEditModal && <Typography color="red" size="sm">{error[key]}</Typography>}</>
                                                    :
                                                    <div className="flex items-center">
                                                        <Input id="add-category-image" key={key} type="file" label={key} accept="image/*" onInput={(e)=>{setCategoryDataInput({...categoryDataInput,[key]:e.target.files[0]})}} />
                                                        {categoryDataInput[key]&&<XMarkIcon className="h-6 w-6 text-red-500 hover:text-gray-600" onClick={()=>{
                                                            setCategoryDataInput({...categoryDataInput,[key]:null});
                                                            document.getElementById("add-category-image").value = null;
                                                        }}/>}
                                                    </div>
                                                }
                                            </div>
                                        )}
                                    )
                                }
                            </div>
                            {addError && <Typography color="red" size="sm">{addError}</Typography>}
                            <div className="flex gap-4">
                                <Button style={{width:'fit-content'}} onClick={()=>{
                                    if(!checkInputValidity(categoryDataInput)) return;
                                    setAddError(null);
                                    setError({'Titre':null,'Description':null});
                                    try{
                                        enableWaiting();
                                        const body = new FormData();
                                        body.append('title', categoryDataInput['Titre']),
                                        body.append('description', categoryDataInput['Description'])
                                        if(categoryDataInput['Image de la catégorie']!==null){
                                            body.append('categoryImage', categoryDataInput['Image de la catégorie']);
                                        }
                                        addCategory(body,token).then(res=>{
                                            if(res.status<300&&res.status>=200){
                                                dispatch(setCategories([...categories,res.data]))
                                                setCategoryDataInput({
                                                    'Titre':"",
                                                    'Description':"",
                                                    "Image de la catégorie":null
                                                });
                                                setDisplayedAddForm(false);
                                            }
                                            disableWaiting();
                                        });
                                    }
                                    catch(err){
                                        console.error(err);
                                        setAddError(err.response.data);
                                        disableWaiting();
                                    }
                                }}>Add</Button>
                                <Button variant="outlined" onClick={handleAddCategoryDisplayClick} className="flex items-center justify-center" style={{width:"fit-content"}}>Cancel</Button>
                            </div>
                        </>:null
                    }
                </div>
                <CategoriesTable setOpenSellersDialog={setOpenSellersDialog} setOpenServicesDialog={setOpenServicesDialog} setOpenEditModal={setOpenEditModal} name={"categories"} title={"Categories"} data={categories.filter((el)=>{
                    return searchBarValue=="" ||  el.title.toLowerCase().startsWith(searchBarValue.toLowerCase()) || el.description.toLowerCase().startsWith(searchBarValue.toLowerCase()) ;})} />
            </>
        )
    }
}