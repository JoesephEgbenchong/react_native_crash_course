import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native'
import React, { SetStateAction, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '@/constants'
import { StatusBar } from 'expo-status-bar'
import SearchInput from '@/components/SearchInput'
import Trending from '@/components/Trending'
import EmptyState from '@/components/EmptyState'
import { getAllPosts, getLatestPosts } from '@/lib/appwrite'
import { Models } from 'react-native-appwrite'
import useAppwrite from '@/lib/UseAppwrite'
import VideoCard from '@/components/VideoCard'
import { VideoCardProps } from '@/types'

const Home = () => {

  const { data: posts, isLoading, refetch } = useAppwrite(getAllPosts);

  const { data: latestPosts } = useAppwrite(getLatestPosts);
  //console.log(latestPosts);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  //console.log(posts);

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
          <View className='my-6 px-4 space-y-6'>
            <View className='justify-between items-start flex-row mb-6'>
              <View>
                <Text className='font-pmedium text-sm text-gray-100'>
                  Welcome Back
                </Text>
                <Text className='text-2xl font-psemibold text-white'>
                  Joseph Joestar
                </Text>
              </View>

              <View className='mt-1.5'>
                <Image 
                  source={images.logoSmall as any}
                  className='w-9 h-10'
                  resizeMode='contain'
                />
              </View>
            </View>

            <SearchInput />

            <View className='w-full flex-1 pt-5 pb-8'>
              <Text className='text-lg text-gray-100 font-pregular mb-3'>Latest Videos</Text>

              <Trending latestPosts={ latestPosts ?? []}/>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title="No Videos Found"
            subtitle="Be the first to upload a video"
          />
        )}

        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  )
}

export default Home