import { View, Text, Image } from 'react-native'
import React from 'react'
import { EmptyStateProps } from '@/types'
import { images } from '@/constants'
import CustomButton from './CustomButton'
import { router } from 'expo-router'

const EmptyState = ({ title, subtitle }: EmptyStateProps) => {
  return (
    <View className='justify-center items-center px-4'>
      <Image 
        source={images.empty as any}
        className='w-[270px] h-[215px]'
        resizeMode='contain'
      />

      <Text className='text-xl text-white font-semibold text-center'>{title}</Text>
      <Text className='font-pmedium  text-sm text-gray-100 mt-2'>
        {subtitle}
      </Text>

      <CustomButton
        title='Create a Video'
        handlePress={() => router.push('/create')}
        containerStyles='w-full my-5'
        textStyles=''
        isLoading = {false}
      />
      
    </View>
  )
}

export default EmptyState