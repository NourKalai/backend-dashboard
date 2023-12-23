import { Routes, Route, Outlet } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
    Sidenav,
    DashboardNavbar,
    Configurator,
    Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import { useEffect , useState } from "react";
import {useSelector} from "react-redux";
import auth from "@/store/slices/auth";
import {Navigate} from "react-router-dom";
import { exemplePrestataires } from "../exemplePrestataires";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { config } from "../axios";
import { setPrestataires } from "../store/slices/selectPrestataires";
import { setClients } from "../store/slices/selectClients";
import {Typography} from "@material-tailwind/react";
import { getAllSellers } from "../apiCalls/sellers";
import { getAllBuyers } from "../apiCalls/buyers";
import {setCategories} from "@/store/slices/selectCategories.js";
import {getAllCategories} from "@/apiCalls/categories.js";
import {getAllServices} from "@/apiCalls/services.js";
import {setServices} from "@/store/slices/selectServices.js";
import { getAllOrders } from "@/apiCalls/orders";
import {setCommandes} from "@/store/slices/selectCommandes.js";
import { logout } from "@/store/slices/auth";
import { getAllStats } from "@/apiCalls/stats.js";
import { setStats } from "@/store/slices/selectStats.js";
import useWaiting from "@/hooks/useWaiting";
import Waiting from "@/widgets/layout/Waiting";
import Seller from "@/pages/dashboard/Seller.jsx";
import Buyer from "@/pages/dashboard/Buyer.jsx";
import Service from "@/pages/dashboard/Service";
import CreateAdmin from "@/pages/dashboard/CreateAdmin"
export function Dashboard() {

    const [waiting, enableWaiting, disableWaiting] = useWaiting();
    const [error, setError] = useState(null);
    function checkErrorAndRelogin(err){
        if(err.response.status === 401){
            reduxDispatch(logout());
            return <Navigate to="/login" />
        }
    }

    const [controller, dispatch] = useMaterialTailwindController();
    const { sidenavType } = controller;
    const {token} = useSelector(state => state.auth.value);
    const user = useSelector(state => state.auth.value.user?.user)
    const reduxDispatch = useDispatch();
    const [loaded , setLoaded] = useState(false);
    useEffect(()=>{
        Promise.all([
            getAllSellers(token).then((res)=>{
                reduxDispatch(setPrestataires(res.data));
            }),
            getAllBuyers(token).then((res)=>{
                reduxDispatch(setClients(res.data));
            }),
            getAllCategories(token).then((res)=>{
                reduxDispatch(setCategories(res.data));
            }),
            getAllServices(token).then((res)=>{
                reduxDispatch(setServices(res.data));
            }),
            getAllOrders(token).then((res)=>{
                reduxDispatch(setCommandes(res.data));
            }),
            getAllStats(token).then((res)=>{
                reduxDispatch(setStats(res.data));
            })
        ]).then(()=>{
            setLoaded(true);
        }).catch((err)=>{
            checkErrorAndRelogin(err);
            setError(err.response.data.message);
        });

    },[]);

    if(!token){
        return <Navigate to="/auth/sign-in" />
    }

    if(user.role !== "admin" && user.role !== "super_admin"){
        reduxDispatch(logout());
        return <Navigate to="/auth/sign-in" />
    }


    if(!loaded){
        return <Typography color="blue" style={{textAlign: "center"}} className="bold mt-12">Chargement...</Typography>
    }
    if(error){
        return <Typography color="red" style={{textAlign: "center"}} className="bold mt-12">{error}</Typography>
    }
    return (
        <div className="min-h-screen bg-blue-gray-50/50">
            <Waiting waiting={waiting} />
            <Sidenav
                routes={routes}
                brandImg={
                    sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
                }
                brandName="Homejek Dashboard"
            />
            <div className="p-4 xl:ml-80">
                <DashboardNavbar />
                <Configurator />
                <IconButton
                    size="lg"
                    color="white"
                    className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
                    ripple={false}
                    onClick={() => setOpenConfigurator(dispatch, true)}
                >
                    <Cog6ToothIcon className="h-5 w-5" />
                </IconButton>
                <Routes>
                    {routes.map(
                        ({ layout, pages }) =>
                            layout === "dashboard" &&
                            pages.map(({ path, element }) => <Route exact path={path} element={element} />
                        )
                    )}
                    {user.role === "super_admin" &&
                        <Route exact path="create-admin" element={<CreateAdmin />} />
                    }
                    <Route exact path="seller/:id" element={<Seller/>}/>
                    <Route exact path="buyer/:id" element={<Buyer/>}/>
                    <Route exact path="service/:id" element={<Service/>}/>
                    <Route exact path="*" element={<Navigate to="/home" />} />

                </Routes>
{/*                 <div className="text-blue-gray-600">
                    <Footer />
                </div> */}
            </div>

        </div>
    );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;