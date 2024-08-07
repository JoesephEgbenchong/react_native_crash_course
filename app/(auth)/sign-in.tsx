import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '@/constants'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { getCurrentUser, signIn } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider'

const SignIn = () => {

  const authContext = useGlobalContext();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async () => {
    if(!form.email || !form.password){
      Alert.alert("Error", 'Please fill in all fields');
    }

    setIsSubmitting(true);

    try {

      await signIn(form.email, form.password);
      const result = await getCurrentUser();

      //set to global state
      authContext?.setUser(result!);
      authContext?.setIsLoggedIn(true);

      router.replace("/home");
      
    } catch (error) {
      Alert.alert('Error', (error as any).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[85vh] px-4 my-6'>
          <Image 
            source={images.logo as any}
            resizeMode='contain'
            className='w-[115px] h-[35px]'
          />

          <Text className='text-2xl text-white font-psemibold mt-10'>Log in to Aora</Text>

          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e: any) => setForm({...form, 
              email: e
            })}
            otherStyles="mt-7"
            keyboardType="email-address"
            placeholder=""
          />

          <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e: any) => setForm({...form, 
              password: e
            })}
            otherStyles="mt-7"
            placeholder=""
            keyboardType=''
          />

          <CustomButton 
            title='Sign In'
            handlePress={submitForm}
            containerStyles='mt-7'
            textStyles=''
            isLoading={isSubmitting}
          />

          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-gray-100 font-pregular'>Don't have an account?</Text>
            <Link href="/sign-up" className='text-lg font-psemibold text-secondary'>Sign up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn