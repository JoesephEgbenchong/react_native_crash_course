import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { FormFieldProps } from '@/types'

import { icons } from '@/constants'
import { router, usePathname } from 'expo-router'

const SearchInput = ({ initialQuery, placeholderText }: { initialQuery?: string, placeholderText?: string }) => {

  const pathname = usePathname();
  const [query, setQuery] = useState<string>(initialQuery || '');
    
  return (

    <View className='border-2 border-black-200 w-full py-4 px-2 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4'>
        <TextInput 
            className='flex-1 text-white font-pregular mt-0.5 text-base'
            value={query}
            placeholder= {!placeholderText ? "Search for a video topic": placeholderText }
            placeholderTextColor="#CDCDE0"
            onChangeText={(e) => setQuery(e)}
        />

        <TouchableOpacity
          onPress={() => {
            if(!query.trim()) {
              return Alert.alert('Missing query', "Please input something to search results across database!")
            }

            const encodedQuery = encodeURIComponent(query.trim());

            if(pathname.startsWith('/search')) {
              router.setParams({ query: encodedQuery });
            } 
            else {
              router.push(`/search/${encodedQuery}`);
            } 
          }
          }
        >
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