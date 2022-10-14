import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components/native';
import { DOMParser } from 'xmldom';
import Notification from './Notification';
import { FlatList, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import BusList from '../modules/BusList';
import RealTime from '../modules/RealTime';

const Container = styled.View`
flex : 1;
justify-content: center;
align-items: center;
`;
const StyledText = styled.Text`
font-size : 30px;
margin-bottom: 10px;
`;
const DetailText = styled.Text`
font-size : 15px;
margin-bottom : 10px;
`;

function SearchBus({ item }) {
  //1. screens/SearchBus의 자식, screens/SearchBus로부터 stationID 받음


  const [result, setResult] = useState([]); //도착정보 저장
  const [routeInfo, setRouteInfo] = useState([]); //노선정보 저장
  const [merge, setMerge] = useState([]); //두 배열 합치기
  const [isReady, setIsReady] = useState(false);
  const [storage, setStorage] = useState({});

  const handleRouteInfo = (item) => {
    setRouteInfo(routeInfo => [...routeInfo, item]);
  }

  const Merge = async () => {    //result, routeInfo 병합
    let array = [];
    let me = {};


    for (var i = 0; i < result.length; i++) {
      me = { ...result[i], ...routeInfo[i], ...item };
      array.push(me);
    }
    setMerge(array);
  };

  const _saveResults = async result => {
    try {
      await AsyncStorage.setItem('results', JSON.stringify(result));
      setStorage(result);
     // console.log('Storage', storage);
    } catch (e) {
      console.error(e);
    }
  };

  const resultHandler=(array)=>{
    setResult(array);
  }

  const _loadResult = async () => {
    const loadedResult = await AsyncStorage.getItem('results');
    setStorage(JSON.parse(loadedResult));
  };

  // 여기서부터 루트아이디 핸들링, 검색, Input : routeId (from busSearch), Output: 노선 번호/유형/종점정보
  const searchRouteName = async (routeId) => {
    try {
      var xhr = new XMLHttpRequest();
      const url = 'http://apis.data.go.kr/6410000/busrouteservice/getBusRouteInfoItem'; 
      var queryParams = '?' + encodeURIComponent('serviceKey') + '='+'UkgvlYP2LDE6M%2Blz55Fb0XVdmswp%2Fh8uAUZEzUbby3OYNo80KGGV1wtqyFG5IY0uwwF0LtSDR%2FIwPGVRJCnPyw%3D%3D';
      queryParams += '&' + encodeURIComponent('routeId') + '=' + encodeURIComponent(routeId); // xhr.open('GET', url + queryParams); 
      xhr.open('GET', url + queryParams);
      xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
          let xmlParser = new DOMParser();
          let xmlDoc = xmlParser.parseFromString(this.responseText, "text/xml");
          var route = new Object();
          route.routeId = xmlDoc.getElementsByTagName("routeId")[0].textContent;
          route.routeName = xmlDoc.getElementsByTagName("routeName")[0].textContent;
          route.routeType = xmlDoc.getElementsByTagName("routeTypeName")[0].textContent;
          route.startName = xmlDoc.getElementsByTagName("startStationName")[0].textContent;
          route.endName = xmlDoc.getElementsByTagName("endStationName")[0].textContent;
          route.region = xmlDoc.getElementsByTagName("regionName")[0].textContent;
          handleRouteInfo(route);
        }
      }
      xhr.send();
    }
    catch (err) {
      alert(err);
    }
    if (routeInfo.length == 0) {
      console.log("routeInfo is empty");
    }

  }

  // 여기서부터 버스 도착 정보 검색, (Input; stationID, Output: 노선 정보와 기타 도착 정보)
  const searchBus = async () => {
    //getBusArrivalList, input param : stationId (ID)
    try {
      var xhr = new XMLHttpRequest();
      const url = 'http://apis.data.go.kr/6410000/busarrivalservice/getBusArrivalList'; 
      var queryParams = '?' + encodeURIComponent('serviceKey') + '='+'UkgvlYP2LDE6M%2Blz55Fb0XVdmswp%2Fh8uAUZEzUbby3OYNo80KGGV1wtqyFG5IY0uwwF0LtSDR%2FIwPGVRJCnPyw%3D%3D';
      queryParams += '&' + encodeURIComponent('stationId') + '=' + encodeURIComponent(item.id); // xhr.open('GET', url + queryParams); 
      xhr.open('GET', url + queryParams);
      xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
          let xmlParser = new DOMParser();
          let xmlDoc = xmlParser.parseFromString(this.responseText, "text/xml");
          let i = 0;
          let array = [];
          while (1) {
            var tmpnode = new Object();
            tmpnode.routeId = xmlDoc.getElementsByTagName("routeId")[i].textContent;
            searchRouteName(tmpnode.routeId);
            tmpnode.clicked = false;
            array.push(tmpnode);
            for (var routeId in storage) {
              if (tmpnode.routeId == routeId)
                tmpnode.clicked = true;
            }
            i++;
            if (xmlDoc.getElementsByTagName("routeId")[i] == undefined) break;
          }
          resultHandler(array);
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
  //
  // 렌더링 핸들링
  useEffect(() => {
    searchBus();
  }, []);

  useEffect(() => {
    Merge();
  }, [routeInfo.length]);


  return isReady ? (
      <Container>
       <RealTime/>
      <FlatList
        keyExtractor={item => item.routeId}
        data={merge}
        style={[styles.flatlist]}
        renderItem={({ item }) => (
          <BusList
            item={item}
            saveResult={_saveResults}
            storage={storage}
          />
        )}
        windowSize={3}
      />
     
    </Container>
  ) : (
    <AppLoading
      startAsync={_loadResult}
      onFinish={() => setIsReady(true)}
      onError={console.error}
    />
  );
}

const styles = StyleSheet.create({
  flatlist: {
    flex: 1,
    width: '100%',
  }
})

export default SearchBus;