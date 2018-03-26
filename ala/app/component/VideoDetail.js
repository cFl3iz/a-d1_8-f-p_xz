/**
 * 录像详情组件
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import Video from 'react-native-video'
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    Dimensions
} from 'react-native';



//拿屏幕宽度
var width = Dimensions.get('window').width;

export default class VideoDetail extends React.Component {

    player;

    constructor(props) {
        super(props);
        this.state = (
            {
                data: this.props.data,
                rate: 1,
                muted: false,
                resizeMode: 'contain',
                repeat: false
            }
        )
    }


    static defaultProps = {}

    _backToList() {
        console.log('what the fuck?')
        this.props.navigator.pop();
    }

    loadStart() {
        console.log('onLoadStart')
    }

    setDuration() {

    }

    _onProgress(data) {
        console.log('_onProgress')
    }

    onEnd() {

    }

    videoError(e) {
        console.log(e)
        console.log('_onProgress')
    }

    onBuffer() {

    }

    onTimedMetadata() {

    }

    render() {
        var data = this.state.data
        return (

            <View style={[styles.tabContent]}>
                <Text style={styles.tabText} onPress={this._backToList.bind(this)}>Back</Text>
                <View style={styles.videoBox}>

                    <Video
                        source={require('./cocosvideo.mp4')}
                        ref='videoPlayer'
                        rate={1}
                        volume={0}
                        muted={false}
                        paused={false}
                        resizeMode="cover"
                        repeat={true}
                        playInBackground={false}
                        playWhenInactive={false}
                        ignoreSilentSwitch={"ignore"}
                        progressUpdateInterval={250.0}
                        onLoadStart={this.loadStart}
                        onLoad={this.setDuration}
                        onProgress={this.setTime}
                        onEnd={this.onEnd}
                        onError={this.videoError}
                        onBuffer={this.onBuffer}
                        onTimedMetadata={this.onTimedMetadata}
                        style={styles.video}/>

                </View>
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
        color: 'red',
        margin: 50,
    },
    videoBox: {
        width: width,
        height: 360,
        backgroundColor: '#000'

    },
    video: {
        width: width,
        height: 360,
        backgroundColor: '#000'
    }

});