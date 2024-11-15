import { createContext, useEffect, useState } from "react";

export const AppContext = createContext()

const UserContext = ({children}) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")))
    
    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser))
    }, [currentUser])

    return <AppContext.Provider value = {{currentUser, setCurrentUser}}>{children}</AppContext.Provider>
}

export default UserContext;