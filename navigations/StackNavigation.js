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
    const [isReady, setIsReady] = useState(false);
    const [storage, setStorage] = useState([]);
    const [item, setItem] = useState([]);
    const [choice, setChoice] = useState({});

    const _loadResult = async () => {
        const loadedResult = await AsyncStorage.getItem('results');
        setStorage(JSON.parse(loadedResult));
    };

    return isReady ? (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Main" >
                {({ navigation }) => <Main navigation={navigation} />}
            </Stack.Screen>
            <Stack.Screen name="FavList">
                {({ navigation }) => <FavList navigation={navigation} storage={storage}  setStorage={setStorage} choice={choice} setChoice={setChoice}/>}
            </Stack.Screen>
            <Stack.Screen name="SearchStation">
                {({ navigation }) => <SearchStation navigation={navigation} item={item} setItem={setItem} />}
            </Stack.Screen>
            <Stack.Screen name="SearchBus">
                {({ navigation }) => <SearchBus storage={storage} setStorage={setStorage} navigation={navigation} item={item}/>}
            </Stack.Screen>
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="BusRoute" component={BusRoute} />
            <Stack.Screen name="Timer" component={Timer} />
            <Stack.Screen name="AjouList" component={AjouList} />
            <Stack.Screen name="History" component={History} />
        </Stack.Navigator>
    ) : (
        <AppLoading
            startAsync={_loadResult}
            onFinish={() => setIsReady(true)}
            onError={console.error}
        />
    )
}

export default StackNavigation;