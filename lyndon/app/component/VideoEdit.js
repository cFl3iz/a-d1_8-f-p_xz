/**
 * 录像列表组件
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    View
} from 'react-native';


export default class VideoEdit extends Component {

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

                <View style={[styles.tabContent, {backgroundColor:'#783E33'}]}>
                    <Text style={styles.tabText}>开始发布一个视频.</Text>
                    <Text style={styles.tabText}>...</Text>
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