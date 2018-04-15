/**
 * 录像列表组件
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Dimensions
} from 'react-native';
import Video from "react-native-video";
//拿屏幕宽度
var width = Dimensions.get('window').width;

export default class VideoEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = (
            {
                previewVideo:false
            }
        )
    }


    static defaultProps = {

    }




    render() {
        return (

                <View style={styles.container}>
                    <View style={styles.toolBar}>
                        <Text style={styles.toolBarTitle}>
                            {this.state.previewVideo ? '点击按钮配音'
                            :'录制视频'}
                        </Text>
                        <Text style={styles.toolBarExtra}>更换视频</Text>
                    </View>

                    <View style={styles.page}>
                        {
                            this.state.previewVideo
                                ?
                                <View>
                                </View>
                                :
                                <TouchableOpacity
                                    style={styles.uploadContainer}
                                    onPress={this._pickVideo}>
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
        backgroundColor:'#fff'
    },
    uploadTitle:{
        marginBottom:10,
        textAlign:'center',
        fontSize:12
    },
    uploadIcon:{
        width:110,
        resizeMode:'contain'
    }
});