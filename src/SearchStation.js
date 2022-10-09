import React, { useEffect } from 'react'
import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, FlatList, StatusBar, SafeAreaView } from 'react-native';
import { DOMParser } from 'xmldom';
import ReactDOM, { render } from 'react-dom';
import styled from 'styled-components/native';
import StationList from '../modules/StationList';
import MapView, { Marker } from 'react-native-maps';
import * as Location from "expo-location";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';

// 2. screens/SearchStation의 자식

const List = styled.ScrollView`
flex: 1;
width: ${({ width }) => width - 40}px;
`;

function SearchStation({stationToBus})
 {
  const [station, setStation] = useState('');
  const [result, setResult] = useState([]);
  const [initialRegion, setinitialRegion] = useState();
  const [isReady, setIsReady] = useState(false);
  const [storage, setStorage] = useState({});
  //함수형 컴포넌트 const -> useEffect로 해결
 
  const goBus = (item) => {
    stationToBus(item);
  }

  const ask = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 }); //coords를 통해 현재 위치의 좌표 받기
    setinitialRegion({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02
    })
  };

  const handleStation = text => {
    setStation(text);
  }

  const _saveResults = async result => {
    try {
      await AsyncStorage.setItem('results', JSON.stringify(result));
      setStorage(result);
      console.log('Storage', storage);
    } catch (e) {
      console.error(e);
    }
  };

  const _loadResult = async () => {
    const loadedResult = await AsyncStorage.getItem('results');
    setStorage(JSON.parse(loadedResult));
  };


  const searchStation = async () => {
    console.log("working");
    try {
      var xhr = new XMLHttpRequest();
      const API_KEY = 'UkgvlYP2LDE6M%2Blz55Fb0XVdmswp%2Fh8uAUZEzUbby3OYNo80KGGV1wtqyFG5IY0uwwF0LtSDR%2FIwPGVRJCnPyw%3D%3D';
      const url = 'http://apis.data.go.kr/6410000/busstationservice/getBusStationList'; /*URL*/
      var queryParams = '?' + encodeURIComponent('serviceKey') + '='+'UkgvlYP2LDE6M%2Blz55Fb0XVdmswp%2Fh8uAUZEzUbby3OYNo80KGGV1wtqyFG5IY0uwwF0LtSDR%2FIwPGVRJCnPyw%3D%3D'; /*Service Key*/
      queryParams += '&' + encodeURIComponent('keyword') + '=' + encodeURIComponent(station); /**/
      xhr.open('GET', url + queryParams);
      xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
          let xmlParser = new DOMParser();
          let xmlDoc = xmlParser.parseFromString(this.responseText, "text/xml");
          let i = 0;
          let array = [];
          while (1) {
            var tmpnode = new Object();
            tmpnode.index = i;
            tmpnode.id = xmlDoc.getElementsByTagName("stationId")[i].textContent;
            tmpnode.name = xmlDoc.getElementsByTagName("stationName")[i].textContent;
            tmpnode.x = xmlDoc.getElementsByTagName("x")[i].textContent;
            tmpnode.y = xmlDoc.getElementsByTagName("y")[i].textContent;
            tmpnode.clicked = false;
            array.push(tmpnode);
            for (var id in storage) {
              if (tmpnode.id == id)
                tmpnode.clicked = true;
            }
            i++;
            if (xmlDoc.getElementsByTagName("stationId")[i] == undefined) break;
          }
          setResult(array);
          setinitialRegion({
            latitude: Number(array[0].y),
            longitude: Number(array[0].x),
            latitudeDelta: 0.02,
            longitudeDelta: 0.02
          })
        }
      }
      xhr.send();
    }
    catch (err) {
      alert(err);
    }
    if (result.length == 0) {
      console.log("result is empty");
    }
  };

  useEffect(() => {
    ask();
    searchStation();
  }, []);

  return isReady ? (
    <View style={styles.container}>
      <Text style={styles.title}>CatchBus</Text>
      <TextInput
        style={styles.input}
        placeholder='정류장 이름을 입력하세요'
        autoCorrect={false}
        value={station}
        onChangeText={handleStation}
        onSubmitEditing={() => searchStation()}
        multiline={false}
        returnKeyType="search"
      />
      <MapView
        region={initialRegion}
        style={[styles.map]}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {result && result.map((item) => {
          return (
            <Marker
              key={item.id}
              title={item.name}
              coordinate={{
                latitude: Number(item.y),
                longitude: Number(item.x),//리턴 해줘야지 마커 뜸
              }}
            />
          );
        }
        )}
      </MapView>
      <FlatList
        keyExtractor={item => item.id}
        data={result}
        style={[styles.flatlist]}
        renderItem={({ item }) => (
          <StationList
            item={item}
            saveResult={_saveResults}
            storage={storage}
            goBus={goBus}
          />
        )}
        windowSize={3}
      />
    </View>
  ) : (
    <AppLoading
      startAsync={_loadResult}
      onFinish={() => setIsReady(true)}
      onError={console.error}
    />
  );

}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center'
  },
  text: {
    fontsize: 10,
    alignItems: 'center'
  },
  title: {
    margin: 10,
    fontsize: 10
  },
  map: {
    flex: 1,
    width: 500,
    height: 500
  },
  flatlist: {
    flex: 1,
    width: '100%',
  }
});


export default SearchStation;