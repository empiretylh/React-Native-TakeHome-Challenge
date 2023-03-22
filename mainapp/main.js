import * as React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useState, useEffect, useMemo } from 'react';
import Login from './auth/Login';
import { AuthContext } from './context/context';
import Home from './screen/home';
import {QueryClient, QueryClientProvider} from 'react-query';

const Stack = createStackNavigator();
const queryClient = new QueryClient();
const Main = () => {

    const [token, setToken] = useState(true); //I will use boolean instead of actual string token
    const TokenValue = useMemo(() => ({ token, setToken }), [token, setToken])
    return (
        <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={TokenValue}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {token ?
                    <>
                    <Stack.Screen name="Home" component={Home} />
                      </> :
                    <Stack.Screen name="Login" component={Login} />
                    }
                </Stack.Navigator>
            </NavigationContainer>

        </AuthContext.Provider>
        </QueryClientProvider>
    )
}

export default Main;