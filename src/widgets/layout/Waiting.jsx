
export default function Waiting({waiting}){
    if(waiting){
        return(
            <div className="fixed top-0 left-0 w-[100vw] h-[100vh] bg-blue-gray-900 bg-opacity-40" style={{zIndex: 100000}}>
                <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
                    <div className="lds-dual-ring"></div>
                </div>
            </div>
        )
    }
    else{
        return null;
    }
}