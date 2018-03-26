/**
 * 录像列表组件
 * httpss://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';

import requestHelper from '../common/requestHelper';
import config from '../common/config';
import VideoListHeader from './VideoListHeader';
import ListRow  from './ListRow';
import VideoDetail from './VideoDetail';

import {
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableHighlight,
    Image,
    ImageBackground,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
    AlertIOS

} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';


//拿屏幕宽度
var width = Dimensions.get('window').width;

var cachedResults = {
    nextPage: 1,
    items: [],
    total: 0
}


export default class VideoList extends React.Component {


    constructor(props) {

        super(props);

        this._renderRow = this._renderRow.bind(this)

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });


        this.state = (
            {
                dataSource: ds.cloneWithRows(
                    [
                        {
                            "_id": "310000197707242340",
                            "thumb": "https://dummyimage.com/1280x720/b1e4b8)",
                            "title": "测试内容xj70",
                            "videoPath": "https://v3.mukewang.com/shizhan/59ec840ce520e5b3208b45cb/H.mp4"
                        },
                        {
                            "_id": "450000201801139171",
                            "thumb": "https://dummyimage.com/1280x720/c6997b)",
                            "title": "测试内容xj70",
                            "videoPath": "https://v3.mukewang.com/shizhan/59ec840ce520e5b3208b45cb/H.mp4"
                        }
                    ]
                ),
                isLoadingTail: false,
                isRefreshing:false
            }
        )



    }


    // static propTypes = {};

    componentDidMount() {

        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>componentDidMount')
        this._fetchData(1)
    }

    //底部加载数据
    _renderFoot(){

        if (!this._haseMore() && cachedResults.total!==0) {
            return (
                <View style={styles.loadingMore}><Text style={styles.loadingText}>没有更多里</Text></View>
            )
        }else if (this._haseMore() && cachedResults.total!==0){
            return <ActivityIndicator style={styles.loadingMore} />

        }

    }


    //Private Method Fetch data
    _fetchData(page) {

        var that = this
        setTimeout(function(){

        if(page!==0){
            //正在读取状态
            that.setState({
                isLoadingTail: true
            })
        }else{
            that.setState({
                isRefreshing: true
            })
        }

        requestHelper.get(config.api.base + config.api.creations,
            {
                accessToken: 'abc',
                page: page
            }
        ).then(
            (data) => {
                if (data.success) {

                    var items = cachedResults.items.slice()

                    if(page !== 0 ){
                        //直接追加
                        items = items.concat(data.videoList)
                        cachedResults.nextPage += 1

                    }else{
                        //直接追加
                        items = data.videoList.concat(items)
                    }


                    cachedResults.items = items

                    cachedResults.total = data.total

                        if(page !== 0){
                            that.setState(
                                {
                                    isLoadingTail: false,
                                    dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
                                }
                            )
                        }else {
                            that.setState(
                                {
                                    isRefreshing: false,
                                    dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
                                }
                            )
                        }

                }
            }
        ).catch((error) => {
            console.log('error='+JSON.stringify(error))
            if(page !== 0){
                that.setState(
                    {
                        isLoadingTail: false
                    }
                )
            }else{
                that.setState(
                    {
                        isRefreshing: false
                    }
                )
            }

            console.error(error);
        });
        },2000)
    }

    //获取更多数据
    _fetchMoreData() {

        if (!this._haseMore() || this.state.isLoadingTail) {
            return
        }

        var page = cachedResults.nextPage

         this._fetchData(page)
    }

    //是否还有更多的数据
    _haseMore() {
        return cachedResults.items.length !== cachedResults.total
    }


    _onRefresh() {

        if(this.state.isRefreshing || !this._haseMore()){
            return
        }else{
            console.log('this.state.isRefreshing='+this.state.isRefreshing)
            this._fetchData(0)
        }


    }

    loadPage(row){
        console.log('load page !')
        this.props.navigator.push(
            {
                name:'detail',
                component: VideoDetail,
                params:{
                    data:row
                }
            }
        )
    }

    _renderRow(row) {

           return <ListRow
               key={row._id}
               onSelectDetail={()=>this.loadPage(row)} row={row} arc="123" />
    }

//List中的 onEndReached:到达底部的时候执行。 onEndReachThreshold:20 在距离底部还有一定距离的时候提前执行onEndReached

    render() {
        return (

            <View style={[styles.tabContent]}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>列表页面</Text>
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    renderFooter={()=>this._renderFoot()}
                    onEndReached={()=>this._fetchMoreData()}

                    enableEmptySections={true}
                    automaticallyAdjustContentInsets={false}
                    showsVerticalScrollIndicator={false}
                     refreshControl={
                         <RefreshControl
                             refreshing={this.state.isRefreshing}
                             onRefresh={()=>this._onRefresh()}
                            tintColor="#ff6600"
                             title="正在加载"
                             titleColor="#00ff00"
                             colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor="#ffff00"
                         />
                     }
                />
            </View>

        )
    }


}


const styles = StyleSheet.create({
    loadingMore:{
      marginVertical:20
    },
    loadingText:{
        color:'#777',
        textAlign:'center'
    },
    tabContent: {
        flex: 1,
        backgroundColor: '#0000',
    },
    tabText: {
        color: 'white',
        margin: 50,
    },
    header: {
        paddingTop: 25,
        paddingBottom: 12,
        backgroundColor: '#ee735c'
    },
    headerTitle: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600'
    },
    item: {
        width: width,
        marginBottom: 10,
        backgroundColor: '#fff'
    },
    thumb: {
        width: width,
        height: width * 0.56
        //,resizeMode:'cover'
    },
    title: {
        padding: 10,
        fontSize: 18,
        color: '#333'
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#eee'
    },
    handleBox: {
        padding: 10,
        flexDirection: 'row',
        width: width / 2 - 0.5,
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    play: {
        position: 'absolute',
        bottom: 14,
        right: 14,
        width: 46,
        height: 46,
        paddingTop: 9,
        paddingLeft: 18,
        backgroundColor: 'transparent',
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 23,
        color: '#ed7b66'
    },
    handleText: {
        paddingLeft: 12,
        fontSize: 18,
        color: '#333'
    },
    up: {
        fontSize: 22,
        color: '#333'
    },
    commentIcon: {
        fontSize: 22,
        color: '#333'
    }

});