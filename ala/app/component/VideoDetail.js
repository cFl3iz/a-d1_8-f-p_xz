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
    ScrollView,
    Image,
    View,
    ListView,
    ActivityIndicator,
    Dimensions,
    TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import requestHelper from '../common/requestHelper';
import config from '../common/config';
//拿屏幕宽度
var width = Dimensions.get('window').width;

var cachedResults = {
    nextPage: 1,
    items: [],
    total: 0
}

export default class VideoDetail extends React.Component {





    constructor(props) {

        super(props);

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });


        this.state = (
            {

                data: this.props.data,
                //Video State
                rate: 1.0,
                muted: false,
                resizeMode: 'contain',
                repeat: false,
                videoProgress:0.01,
                videoTotal:0,
                currentTime:0,
                videoLoaded:false,
                playing:false,
                paused:false,
                videoOk:true,
                playerEnd:false,

                //comments
                comments:null,
                dataSource:ds.cloneWithRows([]),
                isLoadingTail: false,
                isRefreshing:false

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
        if(!this.state.videoLoaded){
            this.setState({
                videoLoaded:!this.state.videoLoaded
            })
        }
        //总共时长
        var  duration = data.playableDuration
        //当前进度(时间)
        var  currentTime = data.currentTime
        //进度比例 总时间除当前时间再保留两位转数字
        var  percent   = Number(currentTime / duration).toFixed(2)

        var newState = {
            videoTotal:duration,
            currentTime:Number(currentTime.toFixed(2)),
            videoProgress:percent
        }

        // 如果视频状态没有准备就绪，此时将状态改为就绪
        if(!this.state.videoLoaded){
            newState.videoLoaded = true
        }
        // 如果视频播放状态不为true，此时将状态改为就绪
        if(!this.state.playing && !this.state.playerEnd ){
            newState.playing = true
        }


        this.setState(newState)

//        console.log(data)
    }
    //视频播放完毕
    _onEnd() {
        //视频播放完毕 进度条完整,playing状态变成假。
        this.setState({
            videoProgress:1,
            playing:false,
            playerEnd:true
        })
    }
    //视频出错时
    _videoError(e) {
        console.log(e)
        console.log('_videoError')
        this.setState({
            videoOk:false
        })
    }

    _onBuffer() {
        console.log('on buffer')
    }

    _onTimedMetadata() {
        console.log('_onTimedMetadata')
    }
    _setDuration(){
        console.log('onLoad')
    }
    //让视频重新播放
    _rePlay(){
        this.setState({
            paused:false,
            playing:true,
            playerEnd:false
        })
        this.refs.videoPlayer.seek(0);
    }

    //暂停方法
    _pause(){
        if(!this.state.paused){
            this.setState({
                paused:true,
                playing:false
            })
        }
    }
    //重新播放
    _resume(){
        if(this.state.paused) {
            this.setState({
                paused: false,
                playing:true,
                playerEnd:false
            })
        }
    }

    componentDidMount() {
        console.log('detail did mount')
        //是第一次加载

            this._fetchData(1)


    }


    _fetchData(page) {

        var that = this

                //正在读取状态
            that.setState({
                    isLoadingTail: true
            })

            var url  = config.api.base + config.api.comments
            requestHelper.get(url,
                {
                    accessToken: 'abc',
                    id:124,
                    page: page
                }
            ).then(
                (data) => {
                    if (data.success) {

                        var items = cachedResults.items.slice()


                            //直接追加
                            items = items.concat(data.comments)
                            cachedResults.nextPage += 1


                        cachedResults.items = items

                        cachedResults.total = data.total


                            that.setState(
                                {
                                    isLoadingTail: false,
                                    dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
                                }
                            )


                    }
                }
            ).catch((error) => {
                console.log('error='+JSON.stringify(error))

                    that.setState(
                        {
                            isLoadingTail: false
                        }
                    )


                console.error(error);
            });

    }




    //评论拉到底部时加载
    _renderFoot(){

        if (!this._haseMore() && cachedResults.total!==0) {
            return (
                <View style={styles.loadingMore}><Text style={styles.loadingText}>没有更多里</Text></View>
            )
        }else if (this._haseMore() && cachedResults.total!==0){
            return <ActivityIndicator style={styles.loadingMore} />

        }

    }

    //获取更多数据
    _fetchMoreData() {
        console.log('fetch more data this._haseMore()?'+this._haseMore())
        console.log('fetch more data this.state.isLoadingTail?'+this.state.isLoadingTail)
        if (!this._haseMore() || this.state.isLoadingTail == true) {
            return null
        }else{
            var page = cachedResults.nextPage
            this._fetchData(page)
        }


    }


    //是否还有更多的数据
    _haseMore() {
        return cachedResults.items.length !== cachedResults.total
    }


    // 渲染每一行
    _renderRow(row){
        return (
            <View key={row._id} style={styles.replyBox}>
                <Image style={styles.replyAvatra} source={{uri:row.replyBy.avatar}} />
                <View style={styles.reply}>
                    <Text style={styles.replyNickname} >{row.replyBy.nickName}</Text>
                    <Text style={styles.replyContent} >{row.replyBy.content}</Text>
                </View>
            </View>
        )
    }

    _renderHeader(){
        var data = this.state.data
        return(
            <View style={styles.infoBox}>
                <Image style={styles.avatar} source={{uri:data.author.avatar}} />
                <View style={styles.descBox}>
                    <Text style={styles.nickName} >{data.author.nickName}</Text>
                    <Text style={styles.descTitle} >{data.title}</Text>
                </View>
            </View>
        )
    }

    render() {
        var data = this.state.data
        return (

            <View style={[styles.tabContent]}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBox} onPress={this._backToList.bind(this)}>
                        <Icon name="ios-arrow-back" style={styles.backIcon} />
                        <Text style={styles.backText}>返回</Text>

                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        广场舞详情页面
                    </Text>
                </View>


                <View style={styles.videoBox}>

                    <Video
                        source={{uri: data.videoPath}}
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

                    {
                        !this.state.videoOk && <Text style={styles.failText}>视频出错!很抱歉无法播放</Text>
                    }


                    {
                        !this.state.videoLoaded &&
                        <ActivityIndicator   color="#ee735c" style={styles.loading}/>
                    }

                    {
                        this.state.videoLoaded  && !this.state.playing && this.state.playerEnd
                        ? <Icon size={48} name='ios-play' onPress={this._rePlay.bind(this)} style={styles.playIcon} />
                        : null
                    }

                    {
                        this.state.videoLoaded  && this.state.playing
                        ? <TouchableOpacity onPress={this._pause.bind(this)} style={styles.pauseBtn}>
                            {
                               this.state.paused
                                ? <Icon size={48} onPress={this._resume.bind(this)} name="ios-play" style={styles.resumeIcon}/>
                                : <Text></Text>
                            }
                          </TouchableOpacity>
                        :null
                    }

                    <View style={styles.progressBox}>
                        <View style={[styles.progressBar,{width: width * this.state.videoProgress}]}>
                        </View>
                    </View>
                </View>



                <ListView
                    removeClippedSubviews={false}
                    style={styles.authorScrollview}
                    renderHeader={()=>this._renderHeader()}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    onEndReachedThreshold={20}
                    renderFooter={()=>this._renderFoot()}
                    onEndReached={()=>this._fetchMoreData()}
                    enableEmptySections={true}
                    automaticallyAdjustContentInsets={false}
                    showsVerticalScrollIndicator={false}
                />
            </View>

        )
    }


}


const styles = StyleSheet.create({
    tabContent: {
        flex: 1,
        alignItems: 'center',
    },

    //头部样式
    header:{
      flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:width,
        height:64,
        paddingTop:20,
        paddingLeft:10,
        paddingRight:10,
        borderBottomWidth:1,
        borderColor:'transparent',
        backgroundColor:'#fff'
    },
    //返回的容器
    backBox:{
        position:'absolute',
        left:12,
        top:32,
        width:50,
        flexDirection:'row',
        alignItems:'center'
    },
    headerTitle:{
        width:width-120,
        textAlign:'center',

    },
    backIcon:{
        color:'#999',
        fontSize:20,
        marginRight:5
    },
    backText:{
        color:'#999'
    },



    tabText: {
        color: 'red',
        margin: 50,
    },
    videoBox: {
        zIndex:0,
        width: width,
        height: width * 0.56,
        backgroundColor: 'transparent'
    },
    video: {
        zIndex:2,
        width: width,
        height: width * 0.56,
        backgroundColor: '#000'
    },



    loading:{
        zIndex:2,
        position:'absolute',
        left:0,
        top:80,
        width:width,
        alignSelf:'center',
        backgroundColor:'transparent'
    },


    //进度条样式
    progressBox:{
        width:width,
        height:2,
        backgroundColor:'#ccc'
    },
    progressBar:{
        width:1,
        height:2,
        backgroundColor:'#ff6600'
    },

    //播放按钮
    playIcon: {
        zIndex:2,
        top:80,
        position: 'absolute',
        bottom: 14,
        left:width /2 - 30,
        width: 60,
        height: 60,
        paddingTop: 8,
        paddingLeft: 22,
        backgroundColor: 'transparent',
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 30,
        color: '#ed7b66'
    },

    //暂停按钮
    pauseBtn:{
        zIndex:2,
        width:width,
        height:90,
        position:'absolute',
        left:0,
        top:0,
        height: width * 0.56
    },
    //重新播放按钮
    resumeIcon: {
        zIndex:2,
        top:80,
        position: 'absolute',
        bottom: 14,
        left:width /2 - 30,
        width: 60,
        height: 60,
        paddingTop: 8,
        paddingLeft: 22,
        backgroundColor: 'transparent',
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 30,
        color: '#ed7b66'
    },
    //视频出错的文案样式
    failText:{
        zIndex:2,
        position:'absolute',
        left:0,
        top:90,
        width:width,
        textAlign:'center',
        color:'#fff',
        backgroundColor:'transparent'
    },

    //视频作者信息样式
    infoBox:{
        width:width,
        flexDirection:'row',
        justifyContent:'center',
        marginTop:10
    },
    avatar:{
        width:60,
        height:60,
        marginRight:10,
        marginLeft:10,
        borderRadius:30
    },
    descBox:{
        flex:1
    },
    nickName:{
        fontSize:18
    },
    descTitle:{
        marginTop:8,
        fontSize:16,
        color:'#666'
    },
    authorScrollview:{
        width:width,
        height:1280
    },

    // 评论区域
    replyBox:{
        flexDirection:'row',
        justifyContent:'flex-start',
        marginTop:10
    },
    replyAvatra:{
        width:40,
        height:40,
        marginRight:10,
        marginLeft:10,
        borderRadius:20
    },
    replyNickname:{
        color:'#666'
    },
    replyContent:{
        marginTop:4,
        color:'#666'
    },
    reply:{
        flex:1
    },
    loadingMore:{
        marginVertical:20
    },
    loadingText:{
        color:'#777',
        textAlign:'center'
    }
});