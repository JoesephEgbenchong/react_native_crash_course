import { View, Text, SafeAreaView, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import useAppwrite from '@/lib/UseAppwrite';
import { searchPosts } from '@/lib/appwrite';
import { VideoCardProps } from '@/types';
import VideoCard from '@/components/VideoCard';
import SearchInput from '@/components/SearchInput';
import EmptyState from '@/components/EmptyState';

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => searchPosts(query as string));//passing function and reference arguments separately

  //console.log(query, posts);

  useEffect(() => {
    refetch();
  }, [query])
  

  return (
    <SafeAreaView className='bg-primary h-full my-6'>
      <FlatList 
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
          }

          return <VideoCard videoPost={selectedAttributes} />
        }}
        ListHeaderComponent={() => (
          <View className='my-10 px-4'>
            <Text className='font-pmedium text-sm text-gray-100'>
              Search results
            </Text>
            <Text className='text-2xl font-psemibold text-white'>
              { query }
            </Text>

            <View className='mt-6 mb-8'>
              <SearchInput initialQuery={query as string} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title='No videos found'
            subtitle='No videos found for this search query'
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Search