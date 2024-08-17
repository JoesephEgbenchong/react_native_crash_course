import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { FormFieldProps } from '@/types'

import { icons } from '@/constants'

const SearchInput = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }: FormFieldProps) => {

    

  return (

    <View className='border-2 border-black-200 w-full py-4 px-2 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4'>
        <TextInput 
            className='flex-1 text-white font-pregular mt-0.5 text-base'
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#7b7b8b"
            onChangeText={handleChangeText}
        />

        <TouchableOpacity>
            <Image 
                source={icons.search as any}
                className='w-5 h-5'
                resizeMode='contain'
            />
        </TouchableOpacity>
    </View>
  )
}

export default SearchInput