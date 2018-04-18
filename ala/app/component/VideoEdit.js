/**
 * 录像列表组件
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import _ from 'lodash'

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Dimensions
} from 'react-native';

import Video from "react-native-video";
import   ImagePicker from 'react-native-image-picker';

//拿屏幕宽度
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

const defaultState = {

    previewVideo:false,
    //Video State
    rate: 1.0,
    muted: false,
    resizeMode: 'contain',
    repeat: false,
    videoProgress: 0.01,
    videoTotal: 0,
    currentTime: 0,
    videoLoaded: false,
    playing: false,
    paused: false,
    videoOk: true,
    playerEnd: false,
}
const videoOptions = {
    title: '选择视频',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '录制视频',
    chooseFromLibraryButtonTitle: '选择已有视频',
    videoQuality: 'medium',
    mediaType: 'video',
    durationLimit: 15,
    noData: false,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
}

export default class VideoEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = _.clone(defaultState)
    }


    static defaultProps = {

    }

    _pickVideo() {

        var that = this

        that._pause()

        that.setState({
            previewVideo:false
        })

        ImagePicker.showImagePicker(videoOptions, (res) => {
            if (res.didCancel) {
                return
            }
            console.log('Response = ', res);

            let state = _.clone(defaultState)
            const uri = res.uri

            state.previewVideo = uri

            that.setState(state)


            // var avatarData = 'data:image/jpeg;base64,' + response.data
            //
            //
            //
            // if (response.didCancel) {
            //     return
            // }
            // else if (response.error) {
            //     console.log('ImagePicker Error: ', response.error)
            // }
            //
            //
            // let timestamp = Date.now()
            // let tags = 'app.avatar'
            // let folder = 'avatar'
            // let signatureUrl = config.api.base + config.api.signature
            // let accessToken = that.state.user.accessToken
            // requestHelper.post(signatureUrl, {
            //     accessToken: accessToken,
            //     timestamp: timestamp,
            //     type: 'avatar'
            // }).then(
            //     (data) => {
            //         console.log('>>>>>>> data =' + data.success)
            //         if (data && data.success) {
            //             console.log('signatureUrl=' + data)
            //             let signature = 'folder=' + folder + '&tags=' + tags + '&timestamp=' + timestamp + CLOUDINARY.api_secret
            //             signature = sha1(signature)
            //             let body = new FormData()
            //             body.append('folder', folder)
            //             body.append('timestamp', timestamp)
            //             body.append('signature', signature)
            //             body.append('tags', tags)
            //             body.append('api_key', CLOUDINARY.api_key)
            //             body.append('resource_type', 'image')
            //             body.append('file', avatarData)
            //             body.append('folder', folder)
            //             that._upload(body)
            //         }
            //     }
            // )


        })
    }


    // 所有Video的方法

    //当视频开始加载
    _loadStart() {
        console.log('onLoadStart')
    }

    //每个250毫秒会调用一次
    _onProgress(data) {
        //当资源ok了
        // if (!this.state.videoLoaded) {
        //     this.setState({
        //         videoLoaded: !this.state.videoLoaded
        //     })
        // }
        // //总共时长
        // var duration = data.playableDuration
        // //当前进度(时间)
        // var currentTime = data.currentTime
        // //进度比例 总时间除当前时间再保留两位转数字
        // var percent = Number(currentTime / duration).toFixed(2)
        //
        // var newState = {
        //     videoTotal: duration,
        //     currentTime: Number(currentTime.toFixed(2)),
        //     videoProgress: percent
        // }
        //
        // // 如果视频状态没有准备就绪，此时将状态改为就绪
        // if (!this.state.videoLoaded) {
        //     newState.videoLoaded = true
        // }
        // // 如果视频播放状态不为true，此时将状态改为就绪
        // if (!this.state.playing && !this.state.playerEnd) {
        //     newState.playing = true
        // }
        //
        //
        // this.setState(newState)

//        console.log(data)
    }

    //视频播放完毕
    _onEnd() {
        //视频播放完毕 进度条完整,playing状态变成假。
        this.setState({
            videoProgress: 1,
            playing: false,
            playerEnd: true
        })
    }

    //视频出错时
    _videoError(e) {
        console.log(e)
        console.log('_videoError')
        this.setState({
            videoOk: false
        })
    }

    _onBuffer() {
        console.log('on buffer')
    }

    _onTimedMetadata() {
        console.log('_onTimedMetadata')
    }

    _setDuration() {
        console.log('onLoad')
    }

    //让视频重新播放
    _rePlay() {
        this.setState({
            paused: false,
            playing: true,
            playerEnd: false
        })
        this.refs.videoPlayer.seek(0);
    }

    //暂停方法
    _pause() {
        console.log('on pause')
        if (!this.state.paused) {
            this.setState({
                paused: true,
                playing: false
            })
        }
    }

    //重新播放
    _resume() {
        if (this.state.paused) {
            this.setState({
                paused: false,
                playing: true,
                playerEnd: false
            })
        }
    }


    render() {
        return (

                <View style={styles.container}>
                    <View style={styles.toolBar}>
                        <Text style={styles.toolBarTitle}>
                            {this.state.previewVideo ? '点击按钮配音'
                            :'录制视频'}
                        </Text>
                        <Text style={styles.toolBarExtra} onPress={this._pickVideo.bind(this)}>更换视频</Text>
                    </View>

                    <View style={styles.page}>
                        {
                            this.state.previewVideo
                                ?
                                <View style={styles.videoContainer}>
                                    <View style={styles.videoBox}>
                                        <Video
                                            source={{uri: this.state.previewVideo}}
                                            ref='videoPlayer'
                                            rate={this.state.rate}
                                            volume={1.0}
                                            muted={this.state.muted}
                                            paused={this.state.paused}
                                            resizeMode={this.state.resizeMode}
                                            repeat={this.state.repeat}
                                            playInBackground={false}
                                            playWhenInactive={false}
                                            ignoreSilentSwitch={"ignore"}
                                            progressUpdateInterval={250.0}
                                            onLoadStart={this._loadStart}
                                            onLoad={this._setDuration}
                                            onProgress={this._onProgress.bind(this)}
                                            onEnd={this._onEnd.bind(this)}
                                            onError={this._videoError.bind(this)}
                                            onBuffer={this._onBuffer}
                                            onTimedMetadata={this._onTimedMetadata}
                                            style={styles.video}

                                        />
                                    </View>
                                </View>
                                :
                                <TouchableOpacity
                                    style={styles.uploadContainer}
                                    onPress={this._pickVideo.bind(this)}>
                                    <View style={styles.uploadBox}>
                                        <Image source={require('../assets/images/record.png')}
                                        />
                                        <Text style={styles.uploadTitle}>点我上传视频</Text>
                                        <Text style={styles.uploadDesc}>建议时长不超过九分钟</Text>
                                    </View>
                                </TouchableOpacity>
                        }
                    </View>
                </View>

        )
    }


}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    toolBar: {
        flexDirection: 'row',
        paddingTop: 25,
        paddingBottom: 12,
        backgroundColor: '#ee735c'
    },
    toolBarTitle: {
        flex: 1,
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        fontWeight: '600'
    },
    toolBarExtra:{
        position:'absolute',
        top:26,
        right:10,
        color:'#fff',
        textAlign:'right',
        fontWeight:'600',
        fontSize:14
    },
    page:{
        flex:1,
        alignItems:'center'
    },
    uploadContainer:{
        marginTop:90,
        width:width -40,
        paddingBottom:10,
        borderWidth:1,
        borderColor:'#ee735c',
        justifyContent:'center',
        borderRadius:6,
        backgroundColor:'#fff',
        height:250
    },
    uploadTitle:{
        marginBottom:10,
        textAlign:'center',
        fontSize:12
    },
    uploadIcon:{
        width:110,
        resizeMode:'contain'
    },
    uploadDesc:{
        color:'#999',
        textAlign:'center',
        fontSize:12
    },
    uploadBox:{
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    },
    videoContainer:{
        width:width,
        justifyContent:'center',
        alignItems:'flex-start'
    },
    videoBox:{
        width:width,
        height:height * 0.6
    },
    video:{
        width:width,
        height:height * 0.6,
        backgroundColor:'#333'
    }

});