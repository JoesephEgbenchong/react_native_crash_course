import { View, Text, Image, TouchableOpacity, Alert, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import { VideoCardProps } from '@/types'
import { icons } from '@/constants'
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av'
import { addBookmark, checkIfSaved } from '@/lib/appwrite'

const VideoCard= ({ videoPost: { title, thumbnail, video, creator: {username, avatar}, userId, videoId } }: VideoCardProps) => {
    const [play, setPlay] = useState(false);

    const [showMenu, setShowMenu] = useState(false);//for displaying dropdown menu to save and delete video
    const [isSaved, setIsSaved] = useState(false);//checking wether a video is saved or not.
    

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

    //handle touches outside save and delete view
    const handleOutsidePress = () => {
        setShowMenu(false);
    }

    //For verifying if video is actually saved and updating save state in case video is saved.
    useEffect(() => {
      const verifySavedState = async () => {
        try {

            const savedState = await checkIfSaved(userId!, videoId!);//await result of the promise
            setIsSaved(!!savedState);
            
        } catch (error) {
            console.error('Error checking if video is saved:', error);
        }
      }

      verifySavedState();
    }, [userId, videoId])
    

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

                
                { showMenu && (
                    <TouchableWithoutFeedback onPress={handleOutsidePress}>
                        <View className='absolute flex-col bg-black-200 space-y-4 px-6 py-4 justify-center items-start rounded-xl -right-10 -bottom-20 z-10'>
                            <TouchableOpacity 
                                className='flex-row items-center justify-center space-x-2'
                                onPress={bookmarkVideo}
                                disabled={isSaved}
                            >
                                {!isSaved && (
                                    <Image 
                                        source={icons.bookmark as any}
                                        className='w-4 h-4'
                                        resizeMode='contain'
                                    />
                                )}

                                <Text className={`text-sm font-pmedium ${isSaved ? 'text-green-700' : 'text-gray-100'}`}>{isSaved ? 'Saved' : 'Save'}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity className='flex-row items-center justify-center space-x-2'>
                                <Image 
                                    source={icons.deleteIcon as any}
                                    className='w-4 h-4'
                                    resizeMode='contain'
                                />

                                <Text className='text-sm font-pmedium text-gray-100 '>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                )}
            </View>

            <View className='pt-2'>
                <TouchableOpacity 
                    onPress={() => setShowMenu(!showMenu)}
                >
                    <Image 
                        source={icons.menu as any}
                        className='w-5 h-5'
                        resizeMode='contain'
                    />
                </TouchableOpacity>
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

export default VideoCard