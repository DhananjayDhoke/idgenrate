import { Navigate } from "react-router-dom";

const ProtectdRoute = ({children}) => {
    
    const isLoggedIn = sessionStorage.getItem('sessionId')
    if(!isLoggedIn){
        return <Navigate to='/'  replace={true}></Navigate>
     }
     return children;
}

export default ProtectdRoute