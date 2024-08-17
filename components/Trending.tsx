import { View, Text, FlatList, TouchableOpacity, ImageBackground, Image } from 'react-native'
import React, { useState } from 'react'
import { TrendingProps } from '@/types'
import * as Animatable  from 'react-native-animatable';
import { icons } from '@/constants';
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';


const zoomIn: Animatable.CustomAnimation = {
  0: {
    transform: [{ scale: 0.8 }],
  },
  1: {
    transform: [{ scale: 1 }],
  }
};

const zoomOut: Animatable.CustomAnimation = {
  0: {
    transform: [{ scale: 1 }],
  },
  1: {
    transform: [{ scale: 0.8 }],
  }
};

const TrendingItem = ({ activeItem, item }: any) => {
  const [play, setPlay] = useState(false);
  //console.log(item.video as any);

  return (
    <Animatable.View
      className='mr-5'
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      { play ? (
        <Video
          source={{ uri: item.video }}
          className='w-52 h-72 rounded-[35px] mt-3 bg-white/10' 
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay={play}
          onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
            if(status.isLoaded && !status.isBuffering && status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ): (
        <TouchableOpacity 
          className='relative justify-center items-center'
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground 
            source={{
              uri: item.thumbnail
            }}
            className='w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40'
            resizeMode='cover'
          />

          <Image 
            source={ icons.play as any}
            className='w-12 h-12 absolute'
            resizeMode='contain'
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  )
}

const Trending = ({ latestPosts }: any) => {
  const [activeItem, setActiveItem] = useState(latestPosts[0]);

  const viewableItemsChanged = ({ viewableItems }: any) => {
    if(viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key)
    }
  }

  return (
    <FlatList 
        data={latestPosts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
            <TrendingItem activeItem={activeItem} item={item}/>
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 70
        }}
        contentOffset={{ x: 170, y: 0 }}
        horizontal
    />
  )
}

export default Trending