import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FavList from '../screens/FavList';
import Main from '../screens/Main';
import Settings from '../screens/Settings';
import SearchStation from '../screens/SearchStation';
import SearchBus from '../screens/SearchBus';
import BusRoute from '../screens/BusRoute';
import Timer from '../screens/Timer';
import AjouList from '../screens/AjouList';
import History from '../screens/History';

import AppLoading from 'expo-app-loading';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const StackNavigation = () => {

    console.disableYellowBox = true;
    console.disableRedBox = true;

    
    return (
        <Stack.Navigator initialRouteName = "Home">
            <Stack.Screen name = "Main" component = {Main}/>
            <Stack.Screen name = "FavList" component = {FavList}/> 
            <Stack.Screen name = "SearchStation" component = {SearchStation}/>
            <Stack.Screen name = "SearchBus" component= {SearchBus}/>
            <Stack.Screen name = "Settings" component = {Settings}/>
            <Stack.Screen name = "BusRoute" component = {BusRoute}/>
            <Stack.Screen name = "Timer" component = {Timer}/>
            <Stack.Screen name = "AjouList" component = {AjouList}/>
            <Stack.Screen name = "History" component = {History}/>
        </Stack.Navigator>
    )
}

export default StackNavigation;