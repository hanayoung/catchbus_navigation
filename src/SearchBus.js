import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components/native';
import { DOMParser } from 'xmldom';
//import Notification from './Notification';
import { FlatList, StyleSheet} from 'react-native';
import Bus from '../modules/Bus';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
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

  function useInterval(callback, delay) {
    
    const savedCallback = useRef(); // 최근에 들어온 callback을 저장할 ref를 하나 만든다.

    useEffect(() => {
      savedCallback.current = callback; // callback이 바뀔 때마다 ref를 업데이트 해준다.
    }, [callback]);

    useEffect(() => {
      function tick() {
        savedCallback.current(); // tick이 실행되면 callback 함수를 실행시킨다.
      }
        let id = setInterval(tick, delay); // delay에 맞추어 interval을 새로 실행시킨다.
        return () => clearInterval(id); // unmount될 때 clearInterval을 해준다.
    }, [delay]); // delay가 바뀔 때마다 새로 실행된다.
  }


  const [result, setResult] = useState([]); //도착정보 저장
  const [routeInfo, setRouteInfo] = useState([]); //노선정보 저장
  const [isRunning, setIsRunning] = useState(false);
  const [delay, setDelay] = useState(10000);
  const [routearray, setRouteArray] = useState([]);
  const [ok, setOk] = useState(false);
  const [merge, setMerge]=useState([]);
  const [isReady,setIsReady]=useState(false);
  const [storage,setStorage]=useState({});


  const tmp_result={
    predict1:6,
    predict2:18,
    routeName:70
  }

  const handleRouteInfo = (item) => {
    setRouteInfo(routeInfo => [...routeInfo, item]);
  }

  const handleRouteArray = () => {
    const length = routearray.length;
    for(let i = 0; i < length; i++){
      console.log("passing before", routearray[i]);
      searchRouteName(routearray[i]);
      }
    }

  const Merge = async () => {    //result, routeInfo routeId를 키값으로 병합
    let buslist = [];
    for (var i = 0; i < result.length; i++) {
      let routeId = result[i].routeId;
      let route = routeInfo.find((r) => r.paramID == routeId)
      if(route != undefined){
        result[i].routeName = route.routeName;
        buslist.push(result[i]);
      }
    }
    setMerge(buslist);
    console.log("buslist",buslist);
  };

  const _saveResults = async result => {
    try {
      await AsyncStorage.setItem('results', JSON.stringify(result));
      setStorage(result);
      console.log('Storage', storage);
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
      const url = 'http://apis.data.go.kr/6410000/busrouteservice/getBusRouteInfoItem'; 
      var queryParams = '?' + encodeURIComponent('serviceKey') + '='+'UkgvlYP2LDE6M%2Blz55Fb0XVdmswp%2Fh8uAUZEzUbby3OYNo80KGGV1wtqyFG5IY0uwwF0LtSDR%2FIwPGVRJCnPyw%3D%3D';
      queryParams += '&' + encodeURIComponent('routeId') + '=' + encodeURIComponent(routeId); // xhr.open('GET', url + queryParams);    
      var result = await axios.get(url+queryParams);
      let xmlParser = new DOMParser();
      let xmlDoc = xmlParser.parseFromString(result.data, "text/xml");
      var route = new Object();
      route.paramID = routeId;
      route.routeName = xmlDoc.getElementsByTagName("routeName")[0].textContent;
      route.routeType = xmlDoc.getElementsByTagName("routeTypeName")[0].textContent;
      route.startName = xmlDoc.getElementsByTagName("startStationName")[0].textContent;
      route.endName = xmlDoc.getElementsByTagName("endStationName")[0].textContent;
      route.region = xmlDoc.getElementsByTagName("regionName")[0].textContent;
      handleRouteInfo(route);
    }
    catch (err) {
      alert(err);
    }
    if (routeInfo.length == 0) {
    //  console.log("routeInfo is empty");
    }

  }

  // 여기서부터 버스 도착 정보 검색, (Input; stationID, Output: 노선 정보와 기타 도착 정보)
  const searchBus = async () => {
    //getBusArrivalList, input param : stationId (ID)
    try {
      const url = 'http://apis.data.go.kr/6410000/busarrivalservice/getBusArrivalList'; 
      var queryParams = '?' + encodeURIComponent('serviceKey') + '='+'UkgvlYP2LDE6M%2Blz55Fb0XVdmswp%2Fh8uAUZEzUbby3OYNo80KGGV1wtqyFG5IY0uwwF0LtSDR%2FIwPGVRJCnPyw%3D%3D';
      queryParams += '&' + encodeURIComponent('stationId') + '=' + encodeURIComponent(item.id); // xhr.open('GET', url + queryParams); 
      var result = await axios.get(url+queryParams);
      let xmlParser = new DOMParser();
      let xmlDoc = xmlParser.parseFromString(result.data, "text/xml");    
      setIsRunning(true);
      let i = 0;
      let array = [];
      let routearray = [];
      while (1) {
        var tmpnode = new Object();
        tmpnode.routeId = xmlDoc.getElementsByTagName("routeId")[i].textContent;
        routearray.push(tmpnode.routeId);
        tmpnode.clicked = false;
        tmpnode.predict1 = xmlDoc.getElementsByTagName("predictTime1")[i].textContent;
        tmpnode.loc1 = xmlDoc.getElementsByTagName("locationNo1")[i].textContent;
        tmpnode.remain1 = xmlDoc.getElementsByTagName("remainSeatCnt1")[i].textContent;
        tmpnode.predict2 = xmlDoc.getElementsByTagName("predictTime2")[i].textContent;
        tmpnode.loc2 = xmlDoc.getElementsByTagName("locationNo2")[i].textContent;
        tmpnode.remain2 = xmlDoc.getElementsByTagName("remainSeatCnt2")[i].textContent;
        tmpnode.staOrder = xmlDoc.getElementsByTagName("staOrder")[i].textContent;
        array.push(tmpnode);
        for (var routeId in storage) {
          if (tmpnode.routeId == routeId)
            tmpnode.clicked = true;
        }
        i++;
        if (xmlDoc.getElementsByTagName("routeId")[i] == undefined) { 
          setRouteArray(routearray);
          break; 
        }
      }
      resultHandler(array);
      setOk(true);
    }
    catch (err) {
      alert(err);
    }
    if (result.length == 0) {
     // console.log("result is empty");
    }
  };
  // 렌더링 핸들링
  useEffect(() => {
    Merge();
  }, [result]);

  useInterval(() => {
    searchBus();
  }, isRunning ? delay : null);

  useEffect(()=>{
    handleRouteArray();
  }, [ok]);
  return isReady ? (
    <Container>
    <RealTime/>
      <Bus result={result} routeInfo={routeInfo} storage={storage} setStorage={setStorage}/>
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