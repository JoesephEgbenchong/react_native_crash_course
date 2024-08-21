import { ImageSourcePropType } from "react-native"
import { Models } from "react-native-appwrite";

export interface TabIconProps {
    icon: any;
    color: string;
    name: string;
    focused: boolean;
}

export interface CustomButtonProps {
    title: string;
    handlePress: () => void;
    containerStyles: string;
    textStyles?: string;
    isLoading: boolean;
}

export interface FormFieldProps {
    title: string;
    value: string;
    placeholder: string;
    handleChangeText: any;
    otherStyles: string;
    keyboardType?: string;
}

export interface Posts {
    id: string;
}

export interface TrendingProps {
    posts: Posts[];
}

export interface EmptyStateProps {
    title: string;
    subtitle: string;
    showButton?: boolean;
}

interface Creator {
    username: string;
    avatar: string;
}

interface VideoPost {
    title: string;
    thumbnail: string;
    video: string;
    creator: Creator;
    videoId?: string;
    userId?: string;
}

export interface VideoCardProps {
    videoPost: VideoPost
}

export interface UserDocument extends Models.Document {
    $id: string;
    username: string;
    email: string;
    avatar: string;
}

export interface Bookmark {
    userId: string;
    videoId: string;
}