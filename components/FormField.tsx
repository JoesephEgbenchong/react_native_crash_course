import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { FormFieldProps } from '@/types'

import { icons } from '@/constants'

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }: FormFieldProps) => {

    const [showPassword, setShowPassword] = useState(false)

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-base text-gray-100 font-pmedium'>{title}</Text>

      <View className='border-2 border-black-200 w-full py-4 px-2 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row'>
        <TextInput 
            className='flex-1 text-white font-psemibold text-base'
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#7b7b8b"
            onChangeText={handleChangeText}
            secureTextEntry={title === 'Password' && !showPassword}
        />

        { title === 'Password' && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Image 
                    source={!showPassword ? icons.eye as any : icons.eyeHide as any}
                    className='w-6 h-6'
                    resizeMode='contain'
                />
            </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField