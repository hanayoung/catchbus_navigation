import React from 'react';
import styled from'styled-components/native';
import PropTypes from 'prop-types';
import {TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
// 1. src/searchStation의 자식

const Content_name = styled.Text`
flex: 1;
font-size: 14px;
`;

const Content_locate = styled.Text`
flex: 1;
font-size: 15px;
`;

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        borderRadius: 10,
        borderWidth: 1,
        padding: 5,
        margin: 3,
        width: Dimensions.get('window').width-40,
    },
});

const StationList = ({ item, goBus}) => {

    var choice = new Object();

    return (
        <TouchableOpacity
        onPressOut = {() => {
            console.log("item clicked", item.id, item.name);
            goBus(item);
        }}
        style = {styles.button}
        >
            <Content_name>{item.name}</Content_name>
            <Content_locate>{item.id}</Content_locate>
        </TouchableOpacity>
    );
};

StationList.defaultProps = {
    onPressOut: () => {},
};

StationList.propTypes = {
    item: PropTypes.object.isRequired,
    onPressOut : PropTypes.func,
};

export default StationList;