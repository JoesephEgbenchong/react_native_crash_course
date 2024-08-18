import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import FormField from '@/components/FormField'
import { ResizeMode, Video } from 'expo-av';
import { icons } from '@/constants';
import CustomButton from '@/components/CustomButton';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import { createVideo } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';


const Create = () => {

  const authContext = useGlobalContext();

  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    video: null,
    thumbnail: null,
    prompt: ''
  });

  const submit = async () => {
    if(!form.prompt || !form.title || !form.thumbnail || !form.video){
      return Alert.alert('Please fill in all fields');
    }

    setUploading(true);

    try {

      await createVideo({
        ...form, userId: authContext?.user?.$id
      })

      Alert.alert('Success', 'Post uploaded successfully');
      router.push('/home');
    } catch (error) {
      Alert.alert('Error', (error as any).message)
    } finally {
      setForm({
        title: '',
        video: null,
        thumbnail: null,
        prompt: ''
      });

      setUploading(false);
    }
  }

  const openPicker = async (selectType: any) => {

    const result = await DocumentPicker.getDocumentAsync({
      type: selectType === 'image'
      ? ['image/png', 'image/jpg', 'image/JPG']
      : ['video/mp4', 'video/gif']
    });

    if (!result.canceled) {
      if (selectType === 'image' ) {
        setForm({ ...form, thumbnail: result.assets[0] as any})
      }

      if (selectType === 'video' ) {
        setForm({ ...form, video: result.assets[0] as any})
      }
    } 
    
    
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView className='px-4 my-12'>
        <Text className='text-2xl text-white font-psemibold'>Upload Video</Text>

        <FormField 
          title='Video Title'
          placeholder='Give your video a catchy title...'
          value={form.title}
          handleChangeText={(e: any) => setForm({...form, title: e})}
          otherStyles='mt-10'
        />

        <View className='mt-7 space-y-2'>
          <Text className='text-base text-gray-100 font-pmedium'>Upload video</Text>
          <TouchableOpacity onPress={() => openPicker('video')}>
            { form.video ? (
              <Video 
                source={{ uri: (form.video as any).uri }}
                className='w-full h-64 rounded-2xl'
                resizeMode={ResizeMode.COVER}
              />
            ) : (
              <View className='w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center'>
                <View className='w-14 h-14 border border-dashed border-secondary-100 justify-center items-center'>
                  <Image 
                    source={icons.upload as any}
                    resizeMode='contain'
                    className='w-1/2 h-1/2'
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className='mt-7 space-y-2'>
          <Text className='text-base text-gray-100 font-pmedium'>Thumbnail Image</Text>

          <TouchableOpacity onPress={() => openPicker('image')}>
            { form.thumbnail ? (
              <Image 
                source={{ uri: (form.thumbnail as any).uri }}
                resizeMode='cover'
                className='w-full h-64 rounded-2xl'
              />
            ) : (
              <View className='w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2'>
                <Image 
                  source={icons.upload as any}
                  resizeMode='contain'
                  className='w-5 h-5'
                />
                <Text className='text-sm text-gray-100 font-pmedium'>Choose a file</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField 
          title='AI Prompt'
          placeholder='The prompt of your AI video...'
          value={form.prompt}
          handleChangeText={(e: any) => setForm({...form, prompt: e})}
          otherStyles='mt-7'
        />

        <CustomButton 
          title="Submit & Publish"
          handlePress={submit}
          containerStyles='mt-7'
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create