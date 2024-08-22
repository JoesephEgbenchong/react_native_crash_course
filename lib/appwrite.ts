import { Bookmark, UserDocument } from "@/types";
import { Account, AppwriteException, Avatars, Client, Databases, ID, ImageGravity, Query, Storage } from "react-native-appwrite"

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.aurora.aora',
    projectId: '66b11fb3000e6617885d',
    databaseId: '66b1222000094330f309',
    userCollectionId: '66b1228b00031edc9b85',
    videoCollectionId: '66b122ca0035f01cd5f5',
    bookmarkcollectionId: '66c61d2a0014a79632fe',
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

//Sign In user
export const signIn = async (email: string, password: string) => {

    try {
        const session = await account.createEmailPasswordSession(email, password);

        return session;
    } catch (error) {
        console.log(error);
        throw new Error(error as any);
    }
}

//Get current user
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

//Get all created videos
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

//Get latests videos
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

//Search posts
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

//Get posts or videos created by userId
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


//Sign out user
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

//Get file preview on create video form
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


//Create video upon filling form
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

//retrieve all videos liked by a userId
export const getLikedVideos = async (userId: string) => {
    try {

        //console.log(userId);
        if(!userId) {
            throw new Error('User Id is required');
        }

        const bookmarks = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.bookmarkcollectionId,
            [
                Query.equal('userId', userId)
            ]
        );

        //check if bookmarks were found
        if(bookmarks.documents.length === 0){
            console.log("No bookmarks found for this user");
            return [];
        }

        //extract videos from bookmarks
        const videosIds = bookmarks.documents.map(doc => doc.videoId.$id);
        console.log(videosIds)

        if(videosIds.length === 0) {
            throw new Error("No Video IDs found for this bookmark");
        }

        //Query the videos collection corresponding to these videosID
        const likedVideos = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [
                Query.equal('$id', videosIds)
            ]
        );

        return likedVideos.documents;

    } catch (error) {
        console.log((error as string))
        throw new Error(error as any);
        return [];
    }
}

//add or save a bookmark
export const addBookmark = async (userId: string, videoId: string): Promise<void> => {
    try {
        // validate inputs
        if(!userId || !videoId) {
            throw new Error('Both userId and videoID are required to add a bookmark');
        }

        //check if bookmark already exists
        const existingBookmarks = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.bookmarkcollectionId,
            [
                Query.equal('userId', userId),
                Query.equal('videoId', videoId)
            ]
        );

        if(existingBookmarks.documents.length > 0) {
            console.log('Bookmark already exists');
            return;
        }

        //create new bookmark
        const bookmark: Bookmark = {
            userId,
            videoId
        }

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.bookmarkcollectionId,
            ID.unique(),
            bookmark
        );

        console.log('Bookmark added successfully');


    } catch (error) {
        //handle specific Appwrite errors
        if (error instanceof AppwriteException) {
            console.error('Appwrite error:', error.message)
            // You can add specific handling for Appwrite errors here if needed
        } else {
            //General error handling
            console.error('Failed to add bookmark:', error);
        }

    }
}

//verify if video is saved for by a specific user
export const checkIfSaved = async (userId: string, videoId: string) => {
    try {

        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.bookmarkcollectionId,
            [
                Query.equal('userId', userId),
                Query.equal('videoId', videoId)
            ]
        );

        if(response.documents.length > 0){
            return true;//video is already saved
        }
        
    } catch (error) {
        throw new Error(error as any)
    }
}