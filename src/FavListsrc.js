import React from 'react'
import styled from 'styled-components/native';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import FavListModule from '../modules/FavListModule';
import { Dimensions } from 'react-native';

// 2. screens/SearchStation의 자식

const List = styled.ScrollView`
flex: 1;
width: ${({ width }) => width - 40}px;
`;

function FavListsrc({ storage, setStorage, choice, setChoice }) {
  //함수형 컴포넌트 const -> useEffect로 해결
  const width = Dimensions.get('window').width;

  return (storage != null) ? (
    console.log("storage", storage),
    <View style={styles.container}>
      <List width={width}>
        {Object.values(storage)
          .map(item => (
            <FavListModule
              key={item.id}
              item={item}
              storage={storage}
              setStorage={setStorage}
              choice={choice}
              setChoice={setChoice}
            />
          ))}
      </List>
    </View>
  ) : (
<Text></Text>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  flatlist: {
    flex: 1,
    width: '100%',
  }
});


export default FavListsrc;