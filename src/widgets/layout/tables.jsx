import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
  Switch,
  Select,
  Option
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";

import {UserCircleIcon, TrashIcon} from "@heroicons/react/24/solid";
import { deleteCategory } from '@/apiCalls/categories';
import {deleteBuyer} from '@/apiCalls/buyers';
import { deleteSeller } from "@/apiCalls/sellers";
import {deleteService} from '@/apiCalls/services';
import { deleteOrder } from "@/apiCalls/orders";
import {useSelector,useDispatch} from 'react-redux';
import {setCategories} from '@/store/slices/selectCategories';
import { setPrestataires } from "@/store/slices/selectPrestataires";
import { setClients } from "@/store/slices/selectClients";
import {setServices} from '@/store/slices/selectServices';
import { TablePagination } from "@mui/material";
import { setCommandes } from "@/store/slices/selectCommandes";
import config from "@/configs/config.json";
import useWaiting from "@/hooks/useWaiting";
import { Link } from "react-router-dom";
import defaultIcon from "@/img/avatar.svg";
import useDefaultImage from "@/hooks/useDefaultImage";
import { useCallback } from "react";
import useSorting from "@/hooks/useSorting";
import { sellerSortingCriteria, profileSoringCriteria, servicesSortingCriteria, orderSortingCriteria } from "@/data/sortingCriteria";
import { ConfirmAction } from "./ConfirmAction";
import defaultCategoryIcon from "@/img/no-category.jpg";

const genders = {
  "MALE":"Homme",
  "FEMALE":"Femme",
}


export function Table({name,title,pdata,setOpenEditModal}) {
  const [waiting ,enableWaiting, disableWaiting] = useWaiting();
  const columns = name === "clients" ? ["Client", "Genre", "Numéro De Téléphone", "Date De Naissance", "Date d'ajout"] : name === "prestataires" ? ["Prestataire", "Genre", "CIN", "Numéro De Téléphone","Date De Naissance", "Date d'ajout", "Statut", "Gain total"] : null;
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.value.token);
  const prestataires = useSelector(state => state.selectPrestataires.value.prestataires);
  const clients = useSelector(state => state.selectClients.value.clients);
  const [page,setPage]=useState(0)
  const [rowsPerPage,setRowsPerPage]=useState(10)
  const [data, setData] = useState(pdata);	
  const [sorter, sortCriteria, setSortCriteria, inverse, setInverse] = useSorting();
  const [openDeleteModal, setOpenDeleteModal] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [filterVal, setFilterVal] = useState("all");
  const searchBarValue = useSelector(state=>state.searchBarValue.value.searchBarValue);
  const sortingCriterias = name === "prestataires"?sellerSortingCriteria:profileSoringCriteria;

  const statusFilter = useCallback((val)=>{
    if(val === "all"){
      setData(pdata);
      setFilterVal(val);
      return;
    }
    setData(pdata.filter(el=>{
      return (el.isApproved===undefined && val === "inactive") || el.isApproved === (val === "active")
    }));
    setFilterVal(val);
  },[pdata])

  useEffect(()=>{
    statusFilter(filterVal);
  },[searchBarValue])

  const handleChangePage=(event,newPage)=>{
    setPage(newPage)
  }
  const handleChangeRowsPerPage=(event)=>{
    setRowsPerPage(parseInt(event.target.value,10))
    setPage(0)
  }
  const handleDelete = (id) => {
    if(name === "clients"){
      enableWaiting();
      deleteCategory(id,token).then(res=>{
        dispatch(setClients(clients.filter(el=>el._id !== id)));
        setData([...data].filter(el=>el._id !== id));
        setOpenDeleteModal(null);
      }).catch(err=>{
        setErrorMessage(err.response.data.message);
      }).finally(()=>{
        disableWaiting();
      })
    }
    if(name === "prestataires"){
      enableWaiting();
      deleteSeller(id,token).then(res=>{
        dispatch(setPrestataires([...prestataires].filter(el=>el._id !== id)));
        setData([...data].filter(el=>el._id !== id));
        setOpenDeleteModal(null);
      }).catch(err=>{
        setErrorMessage(err.response.data.message);
      }).finally(()=>{
        disableWaiting();
      })
    }
  };

  useDefaultImage(defaultIcon);

  useEffect(()=>{
    if(!openDeleteModal){
      setErrorMessage(null);
    }
  },[openDeleteModal])

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <ConfirmAction action={()=>handleDelete(openDeleteModal)} open={openDeleteModal?true:false} handler={setOpenDeleteModal}
        description="Voulez-vous vraiment supprimer ce compte ?"
        errorMessage={errorMessage}
      />
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            {title||""}
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <div className="flex gap-2">
            {name === "prestataires" && <div className="max-w-[200px] px-4 py-4 text-sm">
              <Select label="Etat" onChange={statusFilter}>
                <Option value="all">Tous</Option>
                <Option value="active">Approuvé</Option>
                <Option value="inactive">Non approuvé</Option>
              </Select>
            </div>}
            <div className="max-w-[200px] px-4 py-4 text-sm flex gap-2">
              <Select value={sortCriteria?sortCriteria:""} label="Trier par" onChange={(e)=>setSortCriteria(e===""?null:e)}>
                {[{label:"Par défaut", value:""}].concat(sortingCriterias).map((el,idx)=><Option key={idx} value={el.value}>{el.label}</Option>)}
              </Select>
              <Select value={inverse?"desc":"asc"} disabled={sortCriteria === null} label="Ordre" onChange={(e)=>setInverse(e==="desc")}>
                <Option value="asc">Croissant</Option>
                <Option value="desc">Décroissant</Option>
              </Select>
            </div>
          </div>
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {columns.map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...data].sort(sorter).slice(rowsPerPage*page,rowsPerPage*page+rowsPerPage).map(
                (el, key) => {
                  const className = `py-3 px-6 ${
                    key === data.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;
                  return (
                    <tr key={key}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Avatar src={config.wsUrl+"/public"+el.profileImage} alt="avatar" className="h-8 w-8 text-blue-gray-500" />
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {el.firstname + " " + el.lastname}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {el.address}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-500">
                          {el.gender?genders[el.gender]:"Non spécifié"}
                        </Typography>
                      </td>
                      { name === "prestataires"?
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {el.cin}
                          </Typography>
                        </td>:null
                      }

                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-500">
                          {el.phoneNumber}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-500">
                          {new Date(el.dateBirth).toLocaleDateString()}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-500">
                          {new Date(el.date_added)?.toLocaleDateString() || "Non spécifié"}
                        </Typography>
                      </td>
                      {name === "prestataires"?
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={el.isApproved? "green" : "blue-gray"}
                          value={el.isApproved?'Approuvé(e)':'Non Approuvé(e)'}
                          className="py-0.5 px-2 text-[11px] font-medium"
                        />
                      </td>
                      :null}
                      {
                        name === "prestataires"&&
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {(el.totalEarnings?el.totalEarnings.toFixed(2):0)+"TND"}
                          </Typography>
                        </td>
                      }
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          <Link to={name==="prestataires" ? `/dashboard/seller/${el._id}`:`/dashboard/buyer/${el._id}`}>
                          Détails
                          </Link>
                        </Typography>
                      </td>
{/*                       <td className={className} onClick={()=>{
                        setOpenEditModal(el)
                      }}>
                        <Typography
                          as="a"
                          href="#"
                          className="text-xs font-semibold text-blue-gray-600"
                        >
                          Edit
                        </Typography>
                      </td> */}
                      <td className={className}>
                        <TrashIcon className="w-6 h-6 text-red-300 cursor-pointer hover:text-red-400" onClick={()=>{
                          setOpenDeleteModal(el._id)
                        }}/>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
          <TablePagination
            component="div"
            count={data.length}
            rowsPerPageOptions={[5,10,25]}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardBody>
      </Card>
    </div>
  );
}
export function ServicesTable({setSelectedCategory,setSelectedPrestataire,categoriesIndexed,prestatairesIndexed,title,data,setOpenEditModal}) {
  const columns = ["Service", "Description", "Prix" ,"Statut", "Nom de la Catégorie", "Prestataire" ] ;
  const token = useSelector(state => state.auth.value.token);
  const services = useSelector(state => state.selectServices.value.services);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [servicesPerPage, setServicesPerPage] = useState(5);
  const [waiting, enableWaiting, disableWaiting] = useWaiting();
  const [sorter, sortingCriteria, setSortCriteria, inverse, setInverse] = useSorting();
  const [filter, setFilter] = useState("all");
  const [openDeleteModal, setOpenDeleteModal] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(()=>{
    if(!openDeleteModal){
      setErrorMessage(null);
    }
  },[openDeleteModal])

  const handleChangePage =(event,newPage)=> {
    setPage(newPage);
  };
  const handleChangeServicesPerPage=(event)=> {
    setServicesPerPage(parseInt(event.target.value,10))
    setPage(0)
  }
  const handleDelete = (id) => {
    enableWaiting();
    deleteService(id,token).then(res=>{
      dispatch(setServices(services.filter(el=>el._id !== id)));
      setOpenDeleteModal(null);
    }).catch((err)=>{
      setErrorMessage(err.response.data.message);
      console.log(err);
    }).finally(()=>{
      disableWaiting();
    })
  }
  return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <ConfirmAction action={()=>handleDelete(openDeleteModal)} open={openDeleteModal?true:false} handler={setOpenDeleteModal}
          description="Voulez-vous vraiment supprimer ce service ?"
          errorMessage={errorMessage}
        />
        <Card>
          <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              {title}
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <div className="flex px-4 py-2 gap-2">
              <div className="max-w-[200px] text-sm">
                <Select label="Afficher" value={filter} onChange={(e)=>setFilter(e)}>
                  <Option value={"all"}>Tous</Option>
                  <Option value={"active"}>Actifs</Option>
                  <Option value={"inactive"}>Non Actifs</Option>
                </Select>
              </div>
              <div className="max-w-[200px] text-sm">
                <Select label="Trier par" value={sortingCriteria?sortingCriteria:""} onChange={(e)=>setSortCriteria(e===""?null:e)}>
                  {[{label:"par défaut",value:""}].concat(servicesSortingCriteria).map((el)=>(
                      <Option key={el.value} value={el.value}>{el.label}</Option>
                  ))}
                </Select>
              </div>
              <div className="max-w-[200px] text-sm">
                <Select label="Ordre" value={inverse?"desc":"asc"} onChange={(e)=>setInverse(e==="asc"?false:true)}>
                  <Option value={"asc"}>Croissant</Option>
                  <Option value={"desc"}>Décroissant</Option>
                </Select>
              </div>
            </div>
            <table className="w-full min-w-[640px] table-auto">
              <thead>
              <tr>
                {columns.map((el) => (
                    <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                          variant="small"
                          className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                ))}
              </tr>
              </thead>
              <tbody>
              {[...data].filter(el=>filter==="all"?1:filter==="active"?el.isActive:!el.isActive).sort(sorter).slice(page*servicesPerPage,servicesPerPage+page*servicesPerPage).map(
                  (el, key) => {
                    const className = `py-3 px-5 ${
                        key === data.length - 1
                            ? ""
                            : "border-b border-blue-gray-50"
                    }`;
                    return (
                        <tr key={key}>
                          <td className={className}>
                            <div className="flex items-center gap-4">
                              <div>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-semibold"
                                >
                                  {el.title}
                                </Typography>
                              </div>
                            </div>
                          </td>

                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-500">
                              {el.description}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-500">
                              {el.price || "Non Spécifié"}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Chip
                                variant="gradient"
                                color={el.isActive? "green" : "blue-gray"}
                                value={el.isActive?'Actif':'Non Actif'}
                                className="py-0.5 px-2 text-[11px] font-medium"
                            />
                          </td>

                          <td className={className} onClick={()=>{
                            setSelectedCategory(categoriesIndexed[el.category])
                          }}>
                            <Typography className="text-xs font-semibold text-blue-300 underline underline-offset-2 cursor-pointer hover:text-blue-500">
                              {categoriesIndexed[el.category]?.title||'Non Spécifié'}
                            </Typography>
                          </td>
                          <td className={className} onClick={()=>{
                            setSelectedPrestataire(prestatairesIndexed[el.user])
                          }}>
                            {prestatairesIndexed[el.user]?( <Typography className="text-xs font-semibold text-blue-300 underline underline-offset-2 cursor-pointer hover:text-blue-500">
                              {prestatairesIndexed[el.user].firstname + " " + prestatairesIndexed[el.user]?.lastname}
                            </Typography>):<Typography className="text-xs font-semibold">Non Spécifié</Typography>}
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              <Link to={`/dashboard/service/${el._id}`}>
                                Détails
                              </Link>
                            </Typography>
                          </td>
{/*                           <td className={className} onClick={()=>{
                            setOpenEditModal(el)
                          }}>
                            <Typography
                                as="a"
                                href="#"
                                className="text-xs font-semibold text-blue-gray-600 cursor-pointer"
                            >
                              Edit
                            </Typography>
                          </td> */}
                          <td className={className}>
                            <TrashIcon className="w-6 h-6 text-red-300 cursor-pointer hover:text-red-400" onClick={()=>{
                              setOpenDeleteModal(el._id)
                            }}/>
                          </td>
                        </tr>
                    );
                  }
              )}
              </tbody>
            </table>
            <TablePagination
              component="div"
              count={data.filter(el=>filter==="all"?1:filter==="active"?el.isActive:!el.isActive).length}
              rowsPerPageOptions={[5,10,25]}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={servicesPerPage}
              onRowsPerPageChange={handleChangeServicesPerPage}
            />
          </CardBody>
        </Card>
      </div>
  );
}
export function CategoriesTable({setOpenEditModal, name, title, data, setOpenServicesDialog, setOpenSellersDialog}){
  const token = useSelector(state => state.auth.value.token);
  const columns = ["Catégorie", "Description", "Gain Total", "Services", "Prestataires"];
  const categories = useSelector(state => state.selectCategories.value.categories);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [categoriesPerPage, setCategoriesPerPage] = useState(5);
  const [waiting, enableWaiting, disableWaiting] = useWaiting();
  const [openDeleteModal, setOpenDeleteModal] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const handleChangePage =(event,newPage)=> {
    setPage(newPage);
  };
  const handleChangeCategoriesPerPage=(event)=> {
    setCategoriesPerPage(parseInt(event.target.value, 10))
    setPage(0)
  };

  const handleDelete = (id)=>{
    enableWaiting();
    deleteCategory(id,token).then((res)=>{
      if(res.status>=200 && res.status<300){
        dispatch(setCategories(categories.filter((e)=>e._id!==id)))
      }
      setOpenDeleteModal(null);
    }).catch((err)=>{
      console.log(err)
    }).finally(()=>{
      disableWaiting();
    });
  }

  useEffect(()=>{
    if(!openDeleteModal){
      setErrorMessage(null);
    }
  },[openDeleteModal])
  
  useDefaultImage(defaultCategoryIcon);

  return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <ConfirmAction action={()=>handleDelete(openDeleteModal)} open={openDeleteModal?true:false} handler={setOpenDeleteModal}
            description="Voulez-vous vraiment supprimer cette catégorie ?"
            errorMessage={errorMessage}
          />
          <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              {title||""}

            </Typography>

          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>

                <tr>

                  {columns.map((el) => (
                      <th
                          key={el}
                          className="border-b border-blue-gray-50 py-3 px-5 text-left"
                      >
                        <Typography
                            variant="small"
                            className="text-[11px] font-bold uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                  ))}
                </tr>
              </thead>
              <tbody>

              {data.slice(page*categoriesPerPage,categoriesPerPage*page+categoriesPerPage).map(
                  (el, key) => {
                    const className = `py-3 px-5 ${
                        key === data.length - 1
                            ? ""
                            : "border-b border-blue-gray-50"
                    }`


                    return (
                        <tr key={key}>
                          <td className={className}>
                            <Avatar src={el.imagePath?config.wsUrl+"/public"+el.imagePath:defaultCategoryIcon} alt="avatar" className={"h-6 w-6"} />
                            <div className="flex items-center gap-4">
                              {el.title}
                            </div>
                          </td>

                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-500">
                              {el.description}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-500">
                              {el.totalEarnings || 0}TND
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className={el.services?.length>0?"text-xs font-semibold text-blue-500 cursor-pointer underline underline-offset-1":"text-xs font-semibold text-blue-gray-500"} onClick={()=>{
                              if(el.services?.length>0)
                                setOpenServicesDialog(el);
                            }}>
                              {el.services?.length>0?
                                "Voir "+el.services.length+" services"
                                :
                                "Aucun service"
                              }
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className={el.sellers?.length>0?"text-xs font-semibold text-blue-500 cursor-pointer underline underline-offset-1":"text-xs font-semibold text-blue-gray-500"} onClick={()=>{
                              if(el.sellers?.length>0)
                                setOpenSellersDialog(el);
                            }}>
                              {el.sellers?.length>0?
                                "Voir "+el.sellers.length+" prestataires"
                                :
                                "Aucun prestataire"
                              }
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography
                                as="a"
                                href="#"
                                className="text-xs font-semibold text-blue-gray-600"
                                onClick={()=>{
                                  setOpenEditModal(el)
                                }}
                            >
                              Edit
                            </Typography>
                          </td>
                          <td>
                            <TrashIcon className="w-6 h-6 text-red-300 cursor-pointer hover:text-red-400" onClick={()=>{
                              setOpenDeleteModal(el._id)
                            }} />
                          </td>
                        </tr>
                    );
                  }
              )}
              </tbody>
            </table>
            <TablePagination
              component="div"
              count={data.length}
              rowsPerPageOptions={[5,10,25]}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={categoriesPerPage}
              onRowsPerPageChange={handleChangeCategoriesPerPage}
            />
          </CardBody>
        </Card>
      </div>)
}

const statusMap = {
  "IN_PROGRESS": "En cours",
  "COMPLETED": "Livrée",
  "CANCELLED": "Annulée",
}
export function OrdersTable({setSelectedService,setSelectedClient,servicesIndexed,clientsIndexed,title,data,setOpenEditModal}) {
  const columns = ["Commande", "Description", "Statut", "Total", "Date de livraison", "Client", "Service" ] ;
  const token = useSelector(state => state.auth.value.token);
  const commandes = useSelector(state => state.selectCommandes.value.commandes);
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(0);
  const [ordersPerPage, setOrdersPerPage] = React.useState(5);
  const [waiting, enableWaiting, disableWaiting] = useWaiting();
  const [sorter, sortingCriteria, setSortingCriteria, inverse, setInverse] = useSorting();
  const [openDeleteModal, setOpenDeleteModal] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [filter, setFilter] = useState("all");
  const handleChangePage =(event,newPage)=> {
    setPage(newPage);
  };
  const handleChangeOrdersPerPage=(event)=> {
    setOrdersPerPage(parseInt(event.target.value,10))
    setPage(0)
  }
  const handleDelete = (id) => {
    enableWaiting();
    deleteOrder(id, token).then(res=>{
      dispatch(setCommandes(commandes.filter(el=>el._id !== id)));
      setOpenDeleteModal(null);
    }).catch(err=>{
      console.log(err)
    }).finally(()=>{
      disableWaiting();
    })
  }

  useEffect(()=>{
    if (!openDeleteModal) {
      setErrorMessage(null);
    }
  },[openDeleteModal])
  
  return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <ConfirmAction action={()=>handleDelete(openDeleteModal)} open={openDeleteModal?true:false} handler={setOpenDeleteModal}
          description="Voulez-vous vraiment supprimer cette commande ?"
          errorMessage={errorMessage}
        />
        <Card>
          <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              {title}
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <div className="flex px-4 py-2 gap-2">
              <div className="max-w-[200px] text-sm">
                <Select label="Afficher" value={filter} onChange={(e)=>setFilter(e)}>
                  <Option value={"all"}>Tous</Option>
                  <Option value={"IN_PROGRESS"}>En cours</Option>
                  <Option value={"CANCELLED"}>Annulées</Option>
                  <Option value={"COMPLETED"}>Livrées</Option>
                </Select>
              </div>
              <div className="max-w-[200px] text-sm">
                <Select label="Trier par" value={sortingCriteria?sortingCriteria:""} onChange={(e)=>setSortingCriteria(e===""?null:e)}>
                  {[{label:"par défaut",value:""}].concat(orderSortingCriteria).map((el)=>(
                      <Option key={el.value} value={el.value}>{el.label}</Option>
                  ))}
                </Select>
              </div>
              <div className="max-w-[200px] text-sm">
                <Select label="Ordre" value={inverse?"desc":"asc"} onChange={(e)=>setInverse(e==="asc"?false:true)}>
                  <Option value={"asc"}>Croissant</Option>
                  <Option value={"desc"}>Décroissant</Option>
                </Select>
              </div>
            </div>
            <table className="w-full min-w-[640px] table-auto">
              <thead>
              <tr>
                {columns.map((el) => (
                    <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                          variant="small"
                          className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                ))}
              </tr>
              </thead>
              <tbody>
              {[...data].filter(el=>filter==="all"?1:el.status===filter).sort(sorter).slice(page*ordersPerPage,ordersPerPage*page+ordersPerPage).map(
                  (el, key) => {
                    const className = `py-3 px-5 ${
                        key === data.length - 1
                            ? ""
                            : "border-b border-blue-gray-50"
                    }`;
                    return (
                        <tr key={key}>
                          <td className={className}>
                            <div className="flex items-center gap-4">
                              <div>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-semibold"
                                >
                                  {el.title}
                                </Typography>
                              </div>
                            </div>
                          </td>

                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-500">
                              {el.description}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Chip
                                variant="gradient"
                                color={el.status==='IN_PROGRESS'? "yellow" : el.status==='CANCELLED'?'red':'green'}
                                value={statusMap[el.status]}
                                className="py-0.5 px-2 text-[11px] font-medium w-20 text-center"
                            />
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-500">
                              {el.total}
                            </Typography>
                          </td>

                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-500">
                              {new Date(el.deliveryDate).toLocaleDateString()}
                            </Typography>
                          </td>

                          <td className={className} onClick={()=>{
                            setSelectedClient(clientsIndexed[el.buyer])
                          }}>
                            {clientsIndexed&&clientsIndexed[el.buyer]?( <Typography className="text-xs font-semibold text-blue-300 underline underline-offset-2 cursor-pointer hover:text-blue-500">
                              {clientsIndexed[el.buyer]?.firstname + ' ' + clientsIndexed[el.buyer]?.lastname}
                            </Typography>):<Typography className="text-xs font-semibold ">Non Spécifié</Typography>}
                          </td>
                          <td className={className} onClick={()=>{
                            setSelectedService(servicesIndexed[el.service])
                          }}>
                            <Typography className="text-xs font-semibold text-blue-300 underline underline-offset-2 cursor-pointer hover:text-blue-500">
                              {servicesIndexed&&servicesIndexed[el.service]?.title || 'undefined service'}
                            </Typography>
                          </td>
                          <td className={className} onClick={()=>{
                            setOpenEditModal(el)
                          }}>
                            <Typography
                                as="a"
                                href="#"
                                className="text-xs font-semibold text-blue-gray-600 cursor-pointer hover:text-blue-gray-800"
                            >
                              Edit
                            </Typography>
                          </td>
                          <td className={className}>
                            <TrashIcon className="w-6 h-6 text-red-300 cursor-pointer hover:text-red-400" onClick={()=>{
                              setOpenDeleteModal(el._id)
                            }}/>
                          </td>
                        </tr>
                    );
                  }
              )}
              </tbody>
            </table>
            <TablePagination
              component="div"
              count={data.filter(el=>filter==="all"?1:el.status===filter).length}
              rowsPerPageOptions={[5,10,25]}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={ordersPerPage}
              onRowsPerPageChange={handleChangeOrdersPerPage}
            />
          </CardBody>
        </Card>
      </div>
  );
}
