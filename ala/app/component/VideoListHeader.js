/**
 * 录像列表组件-头部
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    View
} from 'react-native';


export default class VideoListHeader extends React.Component {

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

                <View style={[styles.tabContent]}>
                    <Text style={styles.tabText}>列表页面空空如也...</Text>
                    <Text style={styles.tabText}>只剩风在盘旋</Text>
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