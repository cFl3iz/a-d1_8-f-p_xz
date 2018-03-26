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
                repeat: false,
                videoReady:false
            }
        )
    }


    static defaultProps = {}


    //从导航返回上一层
    _backToList() {
        console.log('what the fuck?')
        this.props.navigator.pop();
    }


    // 所有Video的方法

    //当视频开始加载
    _loadStart() {
        console.log('onLoadStart')
    }

    //每个250毫秒会调用一次
    _onProgress(data) {
        //当资源ok了
        if(!this.state.videoReady){
            this.setState({
                videoReady:!this.state.videoReady
            })
        }
        console.log(data)
    }
    //视频播放完毕
    _onEnd() {

    }
    //视频出错时
    _videoError(e) {
        console.log(e)
        console.log('_videoError')
    }

    _onBuffer() {
        console.log('on buffer')
    }

    _onTimedMetadata() {
        console.log('_onTimedMetadata')
    }

    render() {
        var data = this.state.data
        return (

            <View style={[styles.tabContent]}>
                <Text style={styles.tabText} onPress={this._backToList.bind(this)}>Back</Text>
                <View style={styles.videoBox}>

                    <Video
                        source={{uri: data.videoPath}}
                        ref='videoPlayer'
                        rate={this.state.rate}
                        volume={0}
                        muted={this.state.muted}
                        paused={false}
                        resizeMode={this.state.resizeMode}
                        repeat={this.state.repeat}
                        playInBackground={false}
                        playWhenInactive={false}
                        ignoreSilentSwitch={"ignore"}
                        progressUpdateInterval={250.0}
                        onLoadStart={this._loadStart}
                        onLoad={this._setDuration}
                        onProgress={this._onProgress.bind(this)}
                        onEnd={this._onEnd}
                        onError={this._videoError}
                        onBuffer={this._onBuffer}
                        onTimedMetadata={this._onTimedMetadata}
                        style={styles.video}/>
                    {
                        !this.state.videoReady &&
                        <ActivityIndicator color="#ee735c" style={styles.loading}/>
                    }
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
    },



    loading:{
        position:'absolute',
        left:0,
        top:140,
        width:width,
        alignSelf:'center',
        backgroundColor:'transparent'
    }

});