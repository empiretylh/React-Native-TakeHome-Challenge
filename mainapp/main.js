import * as React from 'react';
import {View,Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {useState, useEffect, useMemo} from 'react';
import Login from './auth/Login';
import { AuthContext } from './context/context';
const Stack = createStackNavigator();
const Main = ()=>{

    const [token, setToken] = useState(false); //I will use boolean instead of actual string token
    const TokenValue = useMemo(()=>({token,setToken}),[token,setToken])
    return (
        <AuthContext.Provider value={TokenValue}>    
            <NavigationContainer>
              <Stack.Navigator screenOptions={{headerShown: false}}>
                {token?null:
                 <Stack.Screen name="Login" component={Login} />              
                 }
              </Stack.Navigator>
            </NavigationContainer>
    
        </AuthContext.Provider>
    )
}

export default Main;