import { UserDocument } from "@/types";
import { Account, Avatars, Client, Databases, ID, ImageGravity, Query, Storage } from "react-native-appwrite"

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.aurora.aora',
    projectId: '66b11fb3000e6617885d',
    databaseId: '66b1222000094330f309',
    userCollectionId: '66b1228b00031edc9b85',
    videoCollectionId: '66b122ca0035f01cd5f5',
    storageId: '66b12510003428044def'
}

//Init react native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Register User
export const createUser = async (email: string, password: string, username: string) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if(!newAccount) throw Error;
        
        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )

        return newUser as UserDocument;

    } catch (error) {
       console.log(error);
       throw new Error(error as any); 
    }
}

export const signIn = async (email: string, password: string) => {

    try {
        const session = await account.createEmailPasswordSession(email, password);

        return session;
    } catch (error) {
        console.log(error);
        throw new Error(error as any);
    }
}

export const getCurrentUser = async (): Promise<UserDocument | undefined> => {
    try {
        const currentAccount = await account.get();
        

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if(!currentUser) throw Error;

        
        return currentUser.documents[0] as UserDocument;
    } catch (error) {
        console.log(error);
    }
}

export const getAllPosts = async () => {
    try {

        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.orderDesc('$createdAt')]
        );

        return posts.documents;
        
    } catch (error) {
        throw new Error(error as any);
    }
}

export  const getLatestPosts = async () => {
    try {

        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [
                Query.orderDesc('$createdAt'),
                Query.limit(7),
            ],
        );

        return posts.documents;
        
    } catch (error) {
        throw new Error(error as any)
    }
}

export const searchPosts = async (query: string) => {

    //console.log(query);

    if (!query || typeof query !== 'string') {
        throw new Error('Invalid query string');
      }
    
    try {
        
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [
                Query.search('title', query)
            ]
        );

        return posts.documents;


    } catch (error) {
        //console.log(error as string)
        throw new Error(error as any);
    }
}

export const getUserPosts = async (userId: string) => {

    try {
        
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [
                Query.equal('creator', userId),
                Query.orderDesc('$createdAt'),
            ]
        );

        return posts.documents;


    } catch (error) {
        throw new Error(error as any)
    }
}

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');

        return session;
    } catch (error) {
        throw new Error(error as any)
    }
}

export const getFilePreview = async (fileId: any, type: any) => {
    let fileUrl;

    try {
        if (type === 'video') {
            fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
        } else if ( type === 'image') {
            fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId, 2000, 2000, 'top' as ImageGravity, 100);
        } else {
            throw new Error('Invalid file type');
        }

        if(!fileUrl) throw new Error;

        return fileUrl;
    } catch (error) {
        throw new Error(error as any);
    }
}

export const uploadFile = async (file: any, type: any) => {
    if(!file) return;

    const { mimeType, ...rest } = file;
    const asset = { type: mimeType, ...rest }

    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            asset
        );

        const fileUrl = await getFilePreview(uploadedFile.$id, type);

        return fileUrl;
    } catch (error) {
        throw new Error(error as any);
    }
}

export const createVideo = async (form: any) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video'),
        ])

        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                prompt: form.prompt,
                video: videoUrl,
                creator: form.userId
            }
        )

        return newPost;
    } catch (error) {
        throw new Error(error as any)
    }
}