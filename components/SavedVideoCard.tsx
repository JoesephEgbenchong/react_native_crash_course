import { View, Text, Image, TouchableOpacity, Alert, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import { VideoCardProps } from '@/types'
import { icons } from '@/constants'
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av'
import { addBookmark, checkIfSaved } from '@/lib/appwrite'

const SavedVideoCard= ({ videoPost: { title, thumbnail, video, creator: {username, avatar}, userId, videoId } }: VideoCardProps) => {
    const [play, setPlay] = useState(false);

    const [showMenu, setShowMenu] = useState(false);//for displaying dropdown menu to save and delete video
    

    //save bookmark or bookmark video
    const bookmarkVideo = async () => {
        try {

            await addBookmark(userId!, videoId!);

            Alert.alert('Success', 'Post Bookmarked Successfully')

            //todo: any action to be implemented here
            
        } catch (error) {
            Alert.alert('Error', (error as any).message);
        }
    }
    

  return (
    <View className='flex-col items-center px-4 mb-14'>
        <View className='flex-row gap-3 items-start'>
            <View className='justify-center items-center flex-row flex-1 relative'>
                <View className='w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5'>
                    <Image 
                        source={{ uri: avatar }}
                        className='w-full h-full rounded-lg'
                        resizeMode='cover'
                    />
                </View>

                <View className='justify-center flex-1 ml-3 gap-y-1'>
                    <Text className='text-white font-psemibold text-sm' numberOfLines={1}>
                        {title}
                    </Text>
                    <Text className='text-xs text-gray-100 font-pregular' numberOfLines={1}>{username}</Text>
                </View>
            </View>

        </View>

        {play ? (
            <Video
            source={{ uri: video }}
            className='w-full h-60 rounded-xl mt-3' 
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay={play}
            onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
              if(status.isLoaded && !status.isBuffering && status.didJustFinish) {
                setPlay(false);
              }
            }}
          />
        ) : (
            <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => setPlay(!play)}
            className='w-full h-60 mt-3 relative justify-center items-center'>
                <Image 
                    source={{ uri: thumbnail }}
                    className='w-full h-full rounded-xl mt-3'
                    resizeMode='cover'
                />
                <Image 
                    source={icons.play as any}
                    className='w-12 h-12 absolute'
                    resizeMode='contain'
                />
            </TouchableOpacity>
        )}

    </View>
  )
}

export default SavedVideoCard