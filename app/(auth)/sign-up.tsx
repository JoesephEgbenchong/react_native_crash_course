import { View, Text, SafeAreaView, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { images } from '@/constants'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { createUser } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider'

const SignUp = () => {

  const authContext = useGlobalContext();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  })

  const submitForm = async () => {
    if(!form.username || !form.email || !form.password){
      Alert.alert('Error', 'Please fill in all fields');
    }

    setIsSubmitting(true);

    try {
      const result= await createUser(form.email, form.password, form.username);

      //set to global state
      authContext?.setUser(result);
      authContext?.setIsLoggedIn(true);

      router.replace("/home");
    } catch (error) {
      Alert.alert('Error', (error as any).message)
    } finally {
      setIsSubmitting(false);
    }
  }

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <SafeAreaView className='h-full bg-primary'>
      <ScrollView>
        <View className='w-full justify-center min-h-[85vh] px-4 my-6'>
          <Image
            source={images.logo as any}
            resizeMode='contain'
            className='w-[115px] h-[35px] mt-5'
          />

          <Text className='text-2xl text-white font-psemibold mt-10'>Sign up</Text>

          <FormField 
            title='Username'
            value={form.username}
            handleChangeText={(e: any) => setForm({...form,
              username: e
            })}
            otherStyles='mt-10'
            keyboardType=''
            placeholder='Your unique username'
          />

          <FormField 
            title='Email'
            value={form.email}
            handleChangeText={(e: any) => setForm({...form, 
              email: e
            })}
            otherStyles='mt-7'
            keyboardType='email-address'
            placeholder=''
          />

          <FormField
            title='Password'
            value={form.password}
            handleChangeText={(e: any) => setForm({...form, 
              password: e
            })}
            otherStyles='mt-7'
            keyboardType=''
            placeholder=''
          />

          <CustomButton
            title='Sign Up'
            handlePress={submitForm}
            textStyles=''
            containerStyles='mt-7'
            isLoading={isSubmitting}
          />

          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-gray-100 font-pregular'>Already have an account?</Text>
            <Link href="/sign-in" className='text-lg font-psemibold text-secondary'>Login</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp