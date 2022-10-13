import React from 'react';
import {Button} from 'react-native';
import styled from 'styled-components/native';

/*즐겨찾기*/
/*todo: (1) 즐겨찾기에 등록된 목록 띄우기
(2) 눌러서 상위로 올리면 별도의 변수로 지정하기
(3) + 누르면 정류장 검색으로 넘어가기
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

const FavList = ({ navigation }) => {
    return(
        <Container>
            <StyledText>즐겨찾기</StyledText>
            <DetailText>Todo: 1. 즐겨찾기 목록 전부 보이기</DetailText>
            <DetailText>2. 끌어올리면 별도의 변수로 저장, 메인페이지 띄우기</DetailText>
            <DetailText>3. + 누르면 정류장검색으로 넘기기</DetailText>
            <Button 
            title = "+" 
            onPress = {()=> navigation.navigate('SearchStation')}/>
            <Button
            title = "메인페이지"
            onPress = {()=> navigation.navigate('Main')}/>
    
        </Container>
    )
}

export default FavList;