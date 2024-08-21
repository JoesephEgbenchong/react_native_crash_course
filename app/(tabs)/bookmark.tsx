import { View, Text, SafeAreaView, FlatList, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import { VideoCardProps } from '@/types';
import VideoCard from '@/components/VideoCard';
import SearchInput from '@/components/SearchInput';
import EmptyState from '@/components/EmptyState';
import useAppwrite from '@/lib/UseAppwrite';
import { getLikedVideos, getUserPosts } from '@/lib/appwrite';

const Bookmark = () => {

  const authContext = useGlobalContext();

  //const { data: posts } = useAppwrite(() => getUserPosts(authContext?.user?.$id as string))
  const { data: posts, isLoading, refetch } = useAppwrite(() =>getLikedVideos(authContext?.user?.$id as string));

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList 
        //data = {[]} 
        data={posts}
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
          <View className='my-12 px-4 w-full '>
            <Text className='font-pmedium text-2xl text-white'>Saved Videos</Text>

            <View className='mt-5 mb-5'>
              <SearchInput placeholderText='Search your saved videos' />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title='No saved videos found'
            subtitle='No saved videos found for this profile'
            showButton={false}
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  )
}

export default Bookmark