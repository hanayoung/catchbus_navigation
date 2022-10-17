1017 현재 상황 </br>
1. searchbus 페이지에서 전 노선에 대하여 10초 간격의 실시간 정보 로드 가능</br>
api 핸들러 최적화 및 merge 함수 수정</br>
2. api 호출 시 기존 xhr에서 axios로 변경 (npm install axios)</br>
성능 개선에 도움, undefined 해결, 은정윤서 쿼리문제 해결 가능성 있음!, xhr 너무 옛날 방식</br>
</br>
앞으로 해야 할 일</br>
1. searchbus에는 한번만 실시간 정보 나오게 변형</br>
2. 은정이 컴포넌트와 연결해서 설정한 하나의 오브젝트에 대해서만 실시간 정보 반영</br>
3. 실시간 정보 휴리스틱 함수 작성</br>

# catchbus initial navigation
</br> with stack navigation
</br>
![image](https://user-images.githubusercontent.com/52804557/189521534-58ca8c86-e4da-4f71-9d05-77e4593dd992.png)

# catchbus_navigation
</br> 은정이 url :
노선 : 
const url = 'http://apis.data.go.kr/6410000/busrouteservice/getBusRouteInfoItem';
      var queryParams = `${url}?serviceKey=${API_KEY}&routeId=${routeId}`;
      xhr.open('GET', queryParams); 
      
버스 도착 : 
const url = 'http://apis.data.go.kr/6410000/busarrivalservice/getBusArrivalList'; /*URL*/
      var queryParams = `${url}?serviceKey=${API_KEY}&stationId=${ID}`;
      xhr.open('GET', queryParams);
정류소 : 
const url = 'http://apis.data.go.kr/6410000/busstationservice/getBusStationList'; /*URL*/
      var queryParams = `${url}?serviceKey=${API_KEY}&keyword=${station}`;
      xhr.open('GET', queryParams);


npm install react-native-gesture-handler
