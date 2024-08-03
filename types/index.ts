import { ImageSourcePropType } from "react-native"

export interface TabIconProps {
    icon: any,
    color: string,
    name: string,
    focused: boolean
}

export interface CustomButtonProps {
    title: string,
    handlePress: () => void,
    containerStyles: string,
    textStyles: string,
    isLoading: boolean,
}