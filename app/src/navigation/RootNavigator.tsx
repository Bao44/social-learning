import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import useAuth from '../../hooks/useAuth';
import Loading from '../components/Loading';
import AppNavigation from './AppNavigation';
import Welcome from '../screens/Welcome';
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import ForgotPassword from '../screens/auth/forgotPassword/ForgotPassword';
import NewPassword from '../screens/auth/forgotPassword/NewPassword';
import VerifyOTP from '../screens/auth/forgotPassword/VerifyOtp';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return user ? (
    <AppNavigation />
  ) : (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerifyOtp"
        component={VerifyOTP}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NewPassword"
        component={NewPassword}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
