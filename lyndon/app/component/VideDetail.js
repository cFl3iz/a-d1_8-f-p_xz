/**
 * 录像详情组件
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator
} from 'react-native';


export default class VideDetail extends Component {

    constructor(props) {
        super(props);
        this.state = (
            {

            }
        )
    }


    static defaultProps = {

    }




    render() {
        return (

                <View style={[styles.tabContent, {backgroundColor:'#21551C'}]}>
                    <ActivityIndicator style={styles.loadingMore} />
                </View>

        )
    }


}


const styles = StyleSheet.create({
    tabContent: {
        flex: 1,
        alignItems: 'center',
    },
    tabText: {
        color: 'white',
        margin: 50,
    },
});