import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, Image } from 'react-native';  
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, router } from 'expo-router'; 
 

import { images } from '../constants';
import CustomButton from '../components/CustomButton';

export default function App() {
  
  return (
    <SafeAreaView className=" h-full" backgroundColor="#000000"> 
      <ScrollView contentContainerStyle={{ height: '100%' }}>
      <View className="wfull justify-center items-center h-full px-4">
          
          <Image source={images.logo}
          className="max-w-[130px] h-[380px] "
           resizeMode='contain' 
           
           />
          
          <Image
            source={images.cards} 
            className="max-w-[380px] h-[300px] "
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Unete a el gimnasio {' '}
              <Text className="text-secondary-200">David & Goliath</Text>
            </Text>

            

            <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
              El único límite es el que te pones tu mismo. Entrena hoy para ser más fuerte mañana!
            </Text>

            <CustomButton 
            title="Continue with Email"
            handlePress={() => router.push('/sign-in')}
            containerStyles="w-full mt-7"
           />

          </View>
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#000000" style="light" />
    </SafeAreaView>
  );
}
