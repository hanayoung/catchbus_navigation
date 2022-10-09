
# catchbus initial navigation
</br> with stack navigation
</br>
![image](https://user-images.githubusercontent.com/52804557/189521534-58ca8c86-e4da-4f71-9d05-77e4593dd992.png)

# catchbus_navigation
</br> 은정이 url :</br> 노선 : const url = 'http://apis.data.go.kr/6410000/busrouteservice/getBusRouteInfoItem';
      var queryParams = `${url}?serviceKey=${API_KEY}&routeId=${routeId}`;
      xhr.open('GET', queryParams); </br> 버스 도착 : const url = 'http://apis.data.go.kr/6410000/busarrivalservice/getBusArrivalList'; /*URL*/
      var queryParams = `${url}?serviceKey=${API_KEY}&stationId=${ID}`;
      xhr.open('GET', queryParams); </br> 정류소 : const url = 'http://apis.data.go.kr/6410000/busarrivalservice/getBusArrivalList'; /*URL*/
      var queryParams = `${url}?serviceKey=${API_KEY}&stationId=${ID}`;
      xhr.open('GET', queryParams);
</br></br>gesture handler install!!!!!!!!!!!
<br/>Invariant Violation: requireNativeComponent: "RNSScreen" was not found
<br/>해결방법 추가설치 
<br/>npm install react-native-screens npm install react-native-reanimated @react-native-community/masked-view
