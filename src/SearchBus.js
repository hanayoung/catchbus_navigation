import React, {useState, useEffect, useMemo} from 'react'
import styled from 'styled-components/native';
import { DOMParser } from 'xmldom';
import Notification from './Notification';
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

function SearchBus({ ID }) {
    //1. screens/SearchBus의 자식, screens/SearchBus로부터 stationID 받음

    const [result, setResult] = useState([]); //도착정보 저장
    const [routeInfo, setRouteInfo] = useState([]); //노선정보 저장
    const [tmp,setTmp]=useState([]);//임시로 잠깐 사용

    const handleRouteInfo = (item) => {
        setRouteInfo(routeInfo => [...routeInfo, item]);
        console.log(routeInfo);
    }

    // 여기서부터 루트아이디 핸들링, 검색, Input : routeId (from busSearch), Output: 노선 번호/유형/종점정보
    const searchRouteName = async (routeId) => {
        try {
            var xhr = new XMLHttpRequest();
            const url = 'http://apis.data.go.kr/6410000/busrouteservice/getBusRouteInfoItem'; /*URL*/
            var queryParams = '?' + encodeURIComponent('serviceKey') + '='+'UkgvlYP2LDE6M%2Blz55Fb0XVdmswp%2Fh8uAUZEzUbby3OYNo80KGGV1wtqyFG5IY0uwwF0LtSDR%2FIwPGVRJCnPyw%3D%3D'; /*Service Key*/
            queryParams += '&' + encodeURIComponent('routeId') + '=' + encodeURIComponent(routeId); /**/
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
          const API_KEY = 'UkgvlYP2LDE6M%2Blz55Fb0XVdmswp%2Fh8uAUZEzUbby3OYNo80KGGV1wtqyFG5IY0uwwF0LtSDR%2FIwPGVRJCnPyw%3D%3D';
          const url = 'http://apis.data.go.kr/6410000/busarrivalservice/getBusArrivalList'; /*URL*/
          var queryParams = '?' + encodeURIComponent('serviceKey') + '='+'UkgvlYP2LDE6M%2Blz55Fb0XVdmswp%2Fh8uAUZEzUbby3OYNo80KGGV1wtqyFG5IY0uwwF0LtSDR%2FIwPGVRJCnPyw%3D%3D'; /*Service Key*/
          queryParams += '&' + encodeURIComponent('stationId') + '=' + encodeURIComponent(ID); /**/
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
                console.log("this", tmpnode.routeId);
                tmpnode.predict1 = xmlDoc.getElementsByTagName("predictTime1")[i].textContent;
                tmpnode.loc1 = xmlDoc.getElementsByTagName("locationNo1")[i].textContent;
                tmpnode.remain1 = xmlDoc.getElementsByTagName("remainSeatCnt1")[i].textContent;
                tmpnode.predict2 = xmlDoc.getElementsByTagName("predictTime2")[i].textContent;
                tmpnode.loc2 = xmlDoc.getElementsByTagName("locationNo2")[i].textContent;
                tmpnode.remain2 = xmlDoc.getElementsByTagName("remainSeatCnt2")[i].textContent;
                tmpnode.staOrder = xmlDoc.getElementsByTagName("staOrder")[i].textContent;
                array.push(tmpnode);
                i++;
                if (xmlDoc.getElementsByTagName("routeId")[i] == undefined) break;
              }
              setResult(array);
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
 /*     for (var i in result){
        console.log("result[i]",result[i].predict1);
        if(result[i].predict1<10){
        console.log("innnnn");
          setTmp(result[i].predict1)
        }
      }*/
      let tmp_array=[];
      for (var i=0;i<10;i++){
        tmp_array.push((i+1)*10)
      }
      setTmp(tmp_array)
        searchBus();
        
      }, []);
      
    return(
      /*console.log(result),
      console.log(routeInfo),*/
        <Container>
          {tmp.map(item=>{
            return(
              <Notification time={tmp[item]}/>
            );
          })} 
          {console.log("console",tmp)}
        </Container>
        // Notification에 하나씩 보내는 게 맞을 듯,,? 그러면 훅을 어디서 쓰지
        // predict1만 계속 넘기면 될 듯
        )
}

export default SearchBus;