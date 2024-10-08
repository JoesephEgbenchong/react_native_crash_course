import { getCurrentUser } from "@/lib/appwrite";
import { UserDocument } from "@/types";
import { createContext, useContext, useState, useEffect, FC, ReactNode, Dispatch, SetStateAction } from "react";
import { Models } from "react-native-appwrite";

interface User {
    $id: string;
    
}

interface GlobalContextType {

    user: UserDocument | null;
    setUser: Dispatch<SetStateAction<UserDocument | null>>;
    isLoading: boolean;
    isLoggedIn: boolean;
    setIsLoggedIn:Dispatch<SetStateAction<boolean>>;
    
}


const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<UserDocument | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCurrentUser()
            .then((res) => {
                if(res) {
                    //console.log(res[0].avatar);
                    setIsLoggedIn(true);
                    setUser(res);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, []);
    
    
    return (
        <GlobalContext.Provider value={{
            isLoggedIn,
            setIsLoggedIn,
            user,
            setUser,
            isLoading
        }}>
            {children}
        </GlobalContext.Provider>
    );
}
