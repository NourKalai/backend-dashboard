import { Link } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Input,
    Checkbox,
    Button,
    Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import axios from '../../axios';
import {useDispatch} from 'react-redux';
import {setToken,setUser} from '../../store/slices/auth';
import {useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom'
import useWaiting from "@/hooks/useWaiting";
export function SignIn() {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [rememberMe,setRememberMe] = useState(false);
    const dispatch = useDispatch();
    const token = useSelector(state=>state.auth.value.token);
    const [error,setError] = useState("");
    const [waiting, enableWaiting, disableWaiting] = useWaiting();
    if(token){
        return <Navigate to="/dashboard/home" replace />
    }
    return (
        <>
            <img
                src="https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
                className="absolute inset-0 z-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />
            <div className="container mx-auto p-4">
                <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
                    <CardHeader
                        variant="gradient"
                        color="blue"
                        className="mb-4 grid h-28 place-items-center"
                    >
                        <Typography variant="h3" color="white">
                            Sign In
                        </Typography>
                    </CardHeader>
                    <form id="sign-in" action="" method="">
                        <CardBody className="flex flex-col gap-4">
                            <Input type="email" label="Email" size="lg" value={email} onInput={(e)=>{
                                setEmail(e.target.value);
                            }} />
                            <Input type="password" label="Password" size="lg" value={password} onInput={(e)=>{
                                setPassword(e.target.value);
                            }} />
                            <div className="-ml-2.5">
                                <Checkbox label="Remember Me" value={rememberMe} onChange={()=>{
                                    setRememberMe(!rememberMe)
                                }} />
                            </div>
                        </CardBody>
                    </form>
                    <CardFooter className="pt-0">
                        <div className="flex justify-between items-center mb-4 pl-2">
                            <Typography color="red">{error}</Typography>
                        </div>
                        <Button variant="gradient" fullWidth onClick={(e)=>{
                            enableWaiting();
                            axios.post('/auth/admin/login',{
                                email,
                                password
                            }).then((res)=>{
                                if(res.data.admin.role !== "admin" && res.data.admin.role !== "super_admin"){
                                    setError("Utilisateur non autorisé");
                                    disableWaiting();
                                    return;
                                }
                                if(rememberMe){
                                    localStorage.setItem('token',res.data.token.access_token);
                                    localStorage.setItem('user',JSON.stringify({
                                        profile:res.data.profile,
                                        user:res.data.admin
                                    }));
                                }
                                dispatch(setUser(
                                    {
                                        user:res.data.admin,
                                        profile:res.data.profile
                                    }));
                                dispatch(setToken(res.data.token.access_token));
                                disableWaiting();
                            }).catch((err)=>{
                                setError(err.response.data.message);
                                disableWaiting();
                                console.log(err);
                            })
                        }}>
                            Sign In
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}

export default SignIn;