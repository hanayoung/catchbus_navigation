import React from 'react';
import {Button} from 'react-native';
import styled from 'styled-components/native';
import FavListsrc from '../src/FavListsrc';
import {StyleSheet} from 'react-native';

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

const FavList = ({ navigation, storage, setStorage, choice, setChoice }) => {
    return(
        <Container>
            <Button
            title = "메인페이지"
            onPress = {()=> navigation.navigate('Main')}/>
            <FavListsrc storage={storage} setStorage={setStorage} choice={choice} setChoice={setChoice} style={[styles.favlistsrc]}></FavListsrc>
    
        </Container>
    )
}

const styles = StyleSheet.create({
    favlistsrc: {
      flex: 1,
      width: '100%',
    }
  })

export default FavList;