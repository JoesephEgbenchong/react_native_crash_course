import { TouchableOpacity, Text } from 'react-native'
import React from 'react'
import { CustomButtonProps } from '@/types'

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }: CustomButtonProps) => {
  return (
    <TouchableOpacity 
        className={`bg-secondary rounded-xl p-2.5 justify-center items-center ${containerStyles}
        ${isLoading ? 'opacity-50' : ''}`} 
        onPress={handlePress}
        activeOpacity={0.7}
        disabled={isLoading}
    >
      <Text className={`text-lg text-primary font-psemibold ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton