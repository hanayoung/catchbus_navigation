import React, { useState } from 'react';
import {Button} from 'react-native';
import styled from 'styled-components/native';
import SearchStationsrc from '../src/SearchStation';

/*정류소 검색*/
/*todo: (1) 검색창 보이고 입력되게 하기
(2) 검색어를 키워드로 하는 전체 정류소 목록 띄우기
(3) 해당 정류소를 중앙으로 하여 지도 보이게 하기
(4) 정류소 선택 시 버스 선택 화면으로 넘어가기
*/

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

const SearchStation = ({ navigation, item, setItem }) => {

    const stationToBus = (item) => {
        console.log("before bus search", item);
        setItem(item);
        navigation.navigate('SearchBus');
      }

    return(
        <Container>
            <SearchStationsrc stationToBus = {stationToBus}/>
        </Container>
    )
}

export default SearchStation;