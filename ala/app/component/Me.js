/**
 * 我的账户页面
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
var Platform = require('react-native').Platform;
import   ImagePicker from 'react-native-image-picker';



import {
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
    AsyncStorage
} from 'react-native';

//拿屏幕宽度
var width = Dimensions.get('window').width;
var photoOptions = {
    title: '选择头像',
    customButtons: [
        {name: 'fb', title: 'Choose Photo from Facebook'},
    ],
    cancelButtonTitle:'取消',
    takePhotoButtonTitle:'拍一张',
    chooseFromLibraryButtonTitle:'从相册选择',
    quality:0.75,
    allowsEditing:true,
    noData:false,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};
export default class Me extends React.Component {

    constructor(props) {
        super(props);

        this.state = (
            {
                user:this.props.user || {}
            }
        )
    }


    static defaultProps = {

    }

    componentDidMount() {
        var that = this
        AsyncStorage.getItem('user').then(
            (data) => {
                let user
                if(data){
                    user = JSON.parse(data)
                }
                if(user && user.accessToken){
                    that.setState({
                        user:user
                    })
                }else{

                }



            }
        )
    }




    _pickPhoto(){

        var that = this

        ImagePicker.showImagePicker(photoOptions, (response) => {
            console.log('Response = ', response);

            var avatarData = 'data:image/jpeg;base64,' + response.data

            var user = that.state.user

            user.avatar = avatarData

            that.setState({
                user:user
            })

            if (response.didCancel) {
              return
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error)
            }

        })
    }


    render() {
        let user =  this.state.user
        return (

          <View style={styles.container}>

              <View style={styles.toolBar}>
                <Text style={styles.toolBarTitle}>我的账户</Text>
              </View>


              {
                  user.avatar
                  ?
                      <TouchableOpacity style={styles.avatarContainer} onPress={this._pickPhoto.bind(this)}>
                          <Image source={{uri:user.avatar}} style={styles.avatarContainer}>
                              <View style={styles.avatarBox}>

                                  <Image source={{uri:user.avatar}} style={styles.avatar} >

                                  </Image>
                              </View>
                              <Text style={styles.avatarTip}>点此处换头像</Text>
                          </Image>
                      </TouchableOpacity>
                  :
                      <View style={styles.avatarContainer}>
                          <Text style={styles.avatarTip}>添加头像</Text>
                          <TouchableOpacity style={styles.avatarBox} onPress={this._upload}>
                              <Icon name='ios-cloud-upload-outline' style={styles.plusIcon}/>
                          </TouchableOpacity>
                      </View>

              }







          </View>

        )
    }


}


const styles = StyleSheet.create({
    container:{
        flex:1
    },
    toolBar:{
        flexDirection:'row',
        paddingTop:25,
        paddingBottom:12,
        backgroundColor:'#ee735c'
    },
    toolBarTitle:{
        flex:1,
        fontSize:16,
        color:'#fff',
        textAlign:'center',
        fontWeight:'600'
    },
    avatarContainer:{
        width:width,
        height:140,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#666'
    },
    avatarTip:{
        color:'#fff',
        backgroundColor:'transparent',
        fontSize:14
    },
    avatarBox:{
        marginTop:15,
        alignItems:'center',
        justifyContent:'center'
    },
    plusIcon:{
        padding:20,
        paddingLeft:25,
        paddingRight:25,
        color:'#999',
        fontSize:25,
        backgroundColor:'#fff',
        borderRadius:8
    },
    avatar:{
        marginBottom:15,
        width:width * 0.2,
        height:width * 0.2,
        resizeMode:'cover',
        borderRadius: width * 0.1,

    }
});