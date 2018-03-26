//ListView中的RenderRow 子组件

import React, {Component} from 'react'
import requestHelper from '../common/requestHelper';
import config from '../common/config';

import VideoDetail from './VideoDetail';

import {
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableHighlight,
    Image,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
    AlertIOS

} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';


//拿屏幕宽度
var width = Dimensions.get('window').width;

export default class ListRow extends React.Component {

    constructor(props){
        super(props);
        console.log('>>>>>>>props='+JSON.stringify(props))
        this.state = (
            {
                row:this.props.row,
                up:this.props.row.voted
            }
        )

    }

    _up(){

        var that = this
        var row = this.state.row
        var up = !this.state.up

        var url = config.api.base + config.api.up

        var body = {
            id:row._id,
            up:up ? true : false,
            accessToken:'abcd'
        }
        requestHelper.post(url,body).then(
            (data)=>{
                if(data && data.success){
                    that.setState(
                        {up:up
                        }
                    )
                }else{
                    AlertIOS.alert('请求失败')
                }
            }
        ).catch(function(err){
            AlertIOS.alert('错误:网络无法访问');
        })
    }


    doFatherMethod(){
        console.log('do father method ' + JSON.stringify(this.props));
        this.props.onSelectDetail();
    }


    render(){
        return (
            <TouchableHighlight onPress={this.doFatherMethod.bind(this)}>
                <View style={styles.item}>
                    <Text style={styles.title}>{this.state.row.title}</Text>
                    <Image source={{uri: this.state.row.thumb}}
                                     style={styles.thumb} >
                        <Icon name='ios-play'
                              size={28}
                              style={styles.play} />
                    </Image>

                    <View style={styles.itemFooter}>
                        <View style={styles.handleBox}>
                            <Icon name={this.state.up == true ? 'ios-heart' : 'ios-heart-outline'}
                                  size={28}
                                  style={[styles.up,this.state.up == true ? null : styles.down]}
                                  onPress={this._up.bind(this)}
                            />
                            <Text onPress={this._up.bind(this)} style={styles.handleText}>
                                喜欢
                            </Text>
                        </View>
                        <View style={styles.handleBox}>
                            <Icon name='ios-chatbubbles-outline'
                                  size={28}
                                  style={styles.commentIcon}
                            />
                            <Text style={styles.handleText}>
                                评论
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
       );
    }


}

const styles = StyleSheet.create({
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
            color: '#ed7b66'
        },
        down:{
            fontSize: 22,
            color: '#333'
        },
        commentIcon: {
            fontSize: 22,
            color: '#333'
        }


    }
)