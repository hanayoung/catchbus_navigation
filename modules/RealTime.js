import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components/native';
import { DOMParser } from 'xmldom';
import PropTypes from 'prop-types';
import { TouchableOpacity, FlatList, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';

const Content_name = styled.Text`
flex: 1;
font-size: 14px;
`;

const Content_locate = styled.Text`
flex: 1;
font-size: 15px;
`;

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
    },
});


const RealTime = () => {

    const parameter = {"clicked": false, "endName": "원시역2번출구", "item": {"id": "200000177", "index": 5, "name": "광교중앙.경기도청.아주대역환승센터", "x": "127.0518833", "y": "37.2884833"}, "routeId": "200000037", "routeName": "11", "routeType": "일반형시내버스", "staOrder": "19", "startName": "수원시동부차고지"} 
    const stationId = parameter.item.id;
    const routeId = parameter.routeId;
    const staOrder = parameter.staOrder;

    const [result, setResult] = useState({});

    const [isRunning, setIsRunning] = useState(false);
    const [delay, setDelay] = useState(60000);


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

     // 여기서부터 버스 도착 정보 검색, (Input; stationID, Output: 노선 정보와 기타 도착 정보)
    const predictRealTime = async () => {
    //getBusArrivalList, input param : stationId (ID)
    try {
      var xhr = new XMLHttpRequest();
      const url = 'http://apis.data.go.kr/6410000/busarrivalservice/getBusArrivalItem'; 
      var queryParams = '?' + encodeURIComponent('serviceKey') + '='+'UkgvlYP2LDE6M%2Blz55Fb0XVdmswp%2Fh8uAUZEzUbby3OYNo80KGGV1wtqyFG5IY0uwwF0LtSDR%2FIwPGVRJCnPyw%3D%3D';
      queryParams += '&stationId=' + encodeURIComponent(stationId) + '&routeId=' + encodeURIComponent(routeId) + '&staOrder=' + encodeURIComponent(staOrder); // xhr.open('GET', url + queryParams); 
      xhr.open('GET', url + queryParams);
      xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
          setIsRunning(true);
          let xmlParser = new DOMParser();
          let xmlDoc = xmlParser.parseFromString(this.responseText, "text/xml");
            var tmpnode = new Object();
            tmpnode.predict1 = xmlDoc.getElementsByTagName("predictTime1")[0].textContent;
            tmpnode.loc1 = xmlDoc.getElementsByTagName("locationNo1")[0].textContent;
            tmpnode.remain1 = xmlDoc.getElementsByTagName("remainSeatCnt1")[0].textContent;
            tmpnode.predict2 = xmlDoc.getElementsByTagName("predictTime2")[0].textContent;
            tmpnode.loc2 = xmlDoc.getElementsByTagName("locationNo2")[0].textContent;
            tmpnode.remain2 = xmlDoc.getElementsByTagName("remainSeatCnt2")[0].textContent;
            tmpnode.staOrder = xmlDoc.getElementsByTagName("staOrder")[0].textContent;
            setResult(tmpnode);
          //  console.log("result", result);
          }
        }
        setIsRunning(false);
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

  useInterval(() => {
    predictRealTime()
    //console.log("this realtime", result);
    
  }, isRunning ? delay : null);

}


export default RealTime;