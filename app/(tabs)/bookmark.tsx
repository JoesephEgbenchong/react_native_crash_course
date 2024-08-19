import { View, Text, SafeAreaView, FlatList } from 'react-native'
import React from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import { VideoCardProps } from '@/types';
import VideoCard from '@/components/VideoCard';
import SearchInput from '@/components/SearchInput';
import EmptyState from '@/components/EmptyState';
import useAppwrite from '@/lib/UseAppwrite';
import { getUserPosts } from '@/lib/appwrite';

const Bookmark = () => {

  const authContext = useGlobalContext();

  //todo: This call here is to populate the flat list. Will have to replace this by querying all saved videos by the user
  const { data: posts } = useAppwrite(() => getUserPosts(authContext?.user?.$id as string))

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
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Bookmark