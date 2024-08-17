import { useEffect, useState } from "react";
import { Models } from "react-native-appwrite";
import { getAllPosts } from "./appwrite";
import { Alert } from "react-native";

const useAppwrite = (fn: (...args: any[]) => Promise<Models.Document[]>, ...args: any[]) => {
    const [data, setData] = useState<Models.Document[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);

        try {

            const response = await fn();

            setData(response);
            //console.log('fetched data');
            
        } catch (error) {
            Alert.alert('Error', (error as any).message);
        } finally {
            setIsLoading(false);
        }
    }
  
    useEffect(() => {
      fetchData();
    }, []);

    const refetch = () => fetchData();

    //console.log(data);
  
    return { data, isLoading, refetch };
}

export default useAppwrite;