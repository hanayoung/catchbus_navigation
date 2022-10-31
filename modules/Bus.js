import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components/native';
import { DOMParser } from 'xmldom';
import { FlatList, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BusList from '../modules/BusList';

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

function Bus({ result, routeInfo, storage, setStorage }) {

  const [merge, setMerge] = useState([]); //두 배열 합치기

  const Merge = async () => {    //result, routeInfo 병합
    let array = [];
    let me = {};

    for (var i = 0; i < result.length; i++) {
      for (var j = 0; j < result.length; j++) {
        if (result[i].routeId == routeInfo[j].routeId)
          me = { ...result[i], ...routeInfo[j] };
      }
      array.push(me);
    }
    setMerge(array);
  };

  const _saveResults = async result => {
    try {
      await AsyncStorage.setItem('results', JSON.stringify(result));
      setStorage(result);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
      Merge();
  }, [routeInfo.length]);

  return (
   // console.log("merge", merge.length),
    <Container>
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
  );
}

const styles = StyleSheet.create({
  flatlist: {
    flex: 1,
    width: '100%',
  }
})

export default Bus;