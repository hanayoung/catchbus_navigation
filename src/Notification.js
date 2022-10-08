import { StyleSheet, Text, View,Button } from 'react-native';
import * as Notifications from 'expo-notifications';
import React,{ useState,useEffect,useRef } from 'react';
import * as Permissions from "expo-permissions";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

//useInterval을 계속해서 불러줘야 하는건가? 여기서만? 아니면 둘다? 아니면 searchBus에서만? 
// 둘 다 계속 useInterval을 통해 searchBus에서는 값을 계속해서 저장하고, Notification에서는 계속해서 값을 불러오기 
function GetNotification(time){
if (Platform.OS === "android") {
  Notifications.setNotificationChannelAsync("default", {
    name: "new chat",
    importance: Notifications.AndroidImportance.HIGH, //이것은 알람의 중요도를 설정합니다.
  });
}
const [expoPushToken, setExpoPushToken] = useState('');
const [notification, setNotification] = useState(false);
const notificationListener = useRef();
const responseListener = useRef();
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

return (
  <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
    }}>
    <Text>Your expo push token: {expoPushToken}</Text>
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text>Title: {notification && notification.request.content.title} </Text>
      <Text>Body: {notification && notification.request.content.body}</Text>
      <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
    </View>
    <Button
      title="Press to schedule a notification" //현재는 버튼을 눌렀을 때 알림이 울리도록 되어 있는데 이걸 값을 받아와서 값이 10분, 5분 전일 때 해당 함수 호출하게 ?
      onPress={async () => {
        await schedulePushNotification();
      }}
    />
  </View>
);


async function schedulePushNotification() {
  console.log("time",time);
  console.log("type",Number(time.time))
await Notifications.scheduleNotificationAsync({
  content: {
    title: "You've got mail! 📬",
    body: 'Here is the notification body',
    data: { data: 'goes here' },
  }, // 화면에 뜨는 내용
  trigger: { 
    seconds: Number(time.time), // 0은 안 먹히고 1도 한 5초? 후에 뜸
    channelId:'default', 
  },
});
}

async function registerForPushNotificationsAsync() {
let token;

if (Platform.OS === 'android') {
  await Notifications.setNotificationChannelAsync('default', { //여기 부분 좀 더 공부
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250], 
    lightColor: '#FF231F7C',
  });
}

if (Device.isDevice) { //여기도
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
  console.log(token);
} else {
  alert('Must use physical device for Push Notifications');
}

return token;
}

}

export default GetNotification;