// screens/ProfileScreen.tsx
import React, { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import ProfileHeader from '../screens/user/components/ProfileHeader';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import Toast from 'react-native-toast-message';
import { LogOut, Menu, PlusSquare } from 'lucide-react-native';
import StoryHighlights from '../screens/user/components/StoryHighlights';
import ProfileTabs from '../screens/user/components/ProfileTabs';
import PhotoGrid from '../screens/user/components/PhotoGrid';

export default function ProfileScreen() {
  const [active, setActive] = useState<'posts' | 'saved' | 'tagged'>('posts');
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Xử lý sau khi đăng xuất

    Toast.show({
      type: 'success',
      text1: 'Đăng xuất thành công.',
      visibilityTime: 2000,
    });
    navigation.navigate('Welcome');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View className="flex justify-between items-center flex-row p-4">
        <Text className="text-3xl font-semibold">{user?.name}</Text>
        <View className="flex flex-row space-x-4">
          <TouchableOpacity className="" onPress={handleLogout}>
            <LogOut size={34} />
          </TouchableOpacity>
          <TouchableOpacity
            className="mx-6"
            onPress={() => navigation.navigate('Create')}
          >
            <PlusSquare size={34} />
          </TouchableOpacity>
          <TouchableOpacity
            className=""
            onPress={() => navigation.navigate('Options')}
          >
            <Menu size={34} />
          </TouchableOpacity>
        </View>
      </View>
      <ProfileHeader />
      <StoryHighlights />
      <ProfileTabs active={active} setActive={setActive} />
      <View style={{ flex: 1 }}>
        {active === 'posts' && <PhotoGrid />}
        {active === 'saved' && <View style={{ flex: 1 }}></View>}
        {active === 'tagged' && <View style={{ flex: 1 }}></View>}
      </View>
    </SafeAreaView>
  );
}
