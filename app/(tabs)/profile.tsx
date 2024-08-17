import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import useAppwrite from '@/lib/UseAppwrite';
import { getUserPosts, signOut } from '@/lib/appwrite';
import { VideoCardProps } from '@/types';
import VideoCard from '@/components/VideoCard';
import { icons } from '@/constants';
import InfoBox from '@/components/InfoBox';
import { router } from 'expo-router';

const Profile = () => {

  const authContext = useGlobalContext();
  //console.log(authContext?.user?.avatar);

  const { data: posts } = useAppwrite(() => getUserPosts(authContext?.user?.$id as string));

  const logout = async () => {

    await signOut();

    authContext?.setUser(null);
    authContext?.setIsLoggedIn(false);

    router.replace('/sign-in')
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList 
        data={posts}
        // data={[ ]}
        keyExtractor={(item) => item?.$id as string}
        renderItem={({ item }) => {
          const selectedAttributes: VideoCardProps['videoPost'] = {
            title: item.title,
            thumbnail: item.thumbnail,
            video: item.video,
            creator: {
              username: item.creator.username,
              avatar: item.creator.avatar
            },
          };

          return <VideoCard videoPost={selectedAttributes} />
        }}
        ListHeaderComponent={() => (
          <View className='w-full justify-center items-center mt-12 mb-12 px-4'>
            <TouchableOpacity
              className='w-full items-end mb-10'
              onPress={logout}
            >
              <Image 
                source={icons.logout as any}
                resizeMode='contain'
                className='w-6 h-6'
              />
            </TouchableOpacity>

            <View className='w-16 h-16 border border-secondary rounded-xl justify-center items-center'>
              <Image 
                source={{ uri: authContext?.user?.avatar }}
                className='w-[90%] h-[90%] rounded-lg'
                resizeMode='cover'
              />
            </View>

            <InfoBox 
              title={ authContext?.user?.username as string }
              containerStyles='mt-5'
              titleStyles='text-lg'
            />

            <View className='mt-5 flex-row'>
              <InfoBox 
                title={ (posts.length || 0) as unknown as string}
                subtitle='Posts'
                containerStyles='mr-10'
                titleStyles='text-xl'
              />

              <InfoBox 
                title="1.2k"
                subtitle='Posts'
                containerStyles='mr-10'
                titleStyles='text-xl'
              />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({})