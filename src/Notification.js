import { StyleSheet, Text, View,Button } from 'react-native';
import * as Notifications from 'expo-notifications';
import React,{ useState,useEffect,useRef } from 'react';
import * as Permissions from "expo-permissions";
import * as Device from 'expo-device';



Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false, 
    shouldSetBadge: false,
  }),
});

//useInterval을 계속해서 불러줘야 하는건가? 여기서만? 아니면 둘다? 아니면 searchBus에서만? 
// 둘 다 계속 useInterval을 통해 searchBus에서는 값을 계속해서 저장하고, Notification에서는 계속해서 값을 불러오기
// searchBus에서는 값을 하나씩만 넘겨야지 오류가 안 생길 듯, 단일 값 넘길 때는 문제 안 생기는 듯?
function GetNotification({result}){ //routeId를 같이 넘겨줄 수 있어야지 뭔지 알고 time 설정할 듯?
  //console.log("storage in Noti",storage.undefined.predict1);
  console.log("iiiin here in Notification");
  console.log("result",result);
  
const [time,setTime]=useState(0);
const [expoPushToken, setExpoPushToken] = useState('');
const [notification, setNotification] = useState(false);
const notificationListener = useRef();
const responseListener = useRef();

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
      savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
      function tick() {
      savedCallback.current();
  }
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
}, [delay]);
}

useEffect(() => {
  // Permission for iOS
  Permissions.getAsync(Permissions.NOTIFICATIONS)
    .then(statusObj => {
      // Check if we already have permission
      if (statusObj.status !== "granted") {
        // If permission is not there, ask for the same
        return Permissions.askAsync(Permissions.NOTIFICATIONS)
      }
      return statusObj
    })
    .then(statusObj => {
      // If permission is still not given throw error
      if (statusObj.status !== "granted") {
        throw new Error("Permission not granted")
      }
    })
    .catch(err => {
      return null
    })
}, []) //ios에서도 하려면 필요한 권한 설정 부분, 

useEffect(() => {
  registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

  notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    setNotification(notification);
  });

  responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    console.log(response);
  });

  return () => {
    Notifications.removeNotificationSubscription(notificationListener.current);
    Notifications.removeNotificationSubscription(responseListener.current);
  };
}, []);
useInterval(()=>{
  console.log("iiiiiinnnnnnnn");
    setTime(Number(result.predict1)*60);
   // setTime(Number(stor.predict1)*60) // 일단 원하는 분 이전일 때 바로 알림이 뜨는지 확인 (time =1 이런 게 먹히는지 확인해보기 )
    //console.log("result in Nottttti second",result)
    schedulePushNotification();
},60000);

/*useEffect(()=>{
  console.log("jjjjjjjj");
  setTime(Number(result.predict1)*60)
  console.log("result in Noti useEffect ",result);
  schedulePushNotification();
},[result]);*/

async function schedulePushNotification() {
 console.log("time",time)
 if(time<600){
await Notifications.scheduleNotificationAsync({
   // 화면에 뜨는 내용
   content:{
    title:"Bus is Coming!",
    body:`${(time/60)} 분 후에 도착 !`,
   },
   trigger: { 
    seconds: 1, // 0은 안 먹히고 1도 한 5초? 후에 뜸
    channelId:'default', 
  },
});
}
}

async function registerForPushNotificationsAsync() {
let token;

if (Platform.OS === 'android') {
  await Notifications.setNotificationChannelAsync('default', { 
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250], 
    lightColor: '#FF231F7C',
  });
}

if (Device.isDevice) { 
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }
  token = (await Notifications.getExpoPushTokenAsync()).data;
//  console.log(token);
} else {
  alert('Must use physical device for Push Notifications');
}

return token;
}

}
export default GetNotification;