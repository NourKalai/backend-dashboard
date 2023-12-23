import { useSelector, useDispatch } from 'react-redux';
import { setWaiting } from '@/store/slices/waiting';
export default function useWaiting(){
    const dispatch = useDispatch();
    const waiting = useSelector(state=>state.waiting.value);

    const enableWaiting = ()=>{
        dispatch(setWaiting(true));
    }
    const disableWaiting = ()=>{
        dispatch(setWaiting(false));
    }

    return [waiting, enableWaiting, disableWaiting]
}