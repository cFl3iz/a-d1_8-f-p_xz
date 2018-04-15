/**
 * 我的账户页面
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
var Platform = require('react-native').Platform;
import   ImagePicker from 'react-native-image-picker';

import Button      from "react-native-button";
import {
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    Modal,
    TouchableOpacity,
    AlertIOS,
    Dimensions,
    AsyncStorage,
    TextInput
} from 'react-native';

//拿屏幕宽度
import config      from '../common/config';
import requestHelper from '../common/requestHelper';
import sha1 from 'sha1';
import * as Progress from 'react-native-progress';
import {Circle} from 'react-native-progress'
var width = Dimensions.get('window').width;
var photoOptions = {
    title: '选择头像',
    customButtons: [
        {name: 'fb', title: 'Choose Photo from Facebook'},
    ],
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍一张',
    chooseFromLibraryButtonTitle: '从相册选择',
    quality: 0.75,
    allowsEditing: true,
    noData: false,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};


//图床的东西
var CLOUDINARY = {
    cloud_name: 'molidancing',
    api_key: '976315348331634',
    api_secret: 'ORU70_RV92bq-cFjVetmPZ-TUOI',
    base: 'http://res.cloudinary.com/molidancing',
    image: 'https://api.cloudinary.com/v1_1/molidancing/image/upload',
    video: 'https://api.cloudinary.com/v1_1/molidancing/video/upload',
    audio: 'https://api.cloudinary.com/v1_1/molidancing/raw/upload'

}

export default class Me extends React.Component {

    constructor(props) {
        super(props);

        this.state = (
            {
                user: this.props.user || {},
                avatarProgress: 0,
                avatarUploading: false,
                modalVisible:false
            }
        )
    }


    static defaultProps = {}


    //编辑,打开modal
    _edit(){
        this.setState({
            modalVisible:true
        })
    }
    //关闭模态框
    _closeModal(){
        this.setState({
            modalVisible:false
        })
    }
    //更新用户状态
    _changeUserState(key,value){
       let user =  this.state.user
        user[key] = value
        this.setState({
            user:user
        })
    }

    avatar(id, type) {
        if(id.indexOf('http') > -1){
            return id
        }
        if(id.indexOf('base64') > -1){
            return id
        }
        return CLOUDINARY.base + '/' + type + '/upload/' + id
    }

    componentDidMount() {
        var that = this
        AsyncStorage.getItem('user').then(
            (data) => {
                let user
                if (data) {
                    user = JSON.parse(data)
                }
                if (user && user.accessToken) {
                    that.setState({
                        user: user
                    })
                } else {

                }


            }
        )
    }


    _pickPhoto() {

        var that = this

        console.log('_pickPhoto = ' + that.state.user);
        ImagePicker.showImagePicker(photoOptions, (response) => {
            console.log('Response = ', response);

            var avatarData = 'data:image/jpeg;base64,' + response.data

            // var user = that.state.user
            //
            // user.avatar = avatarData
            //
            // that.setState({
            //     user:user
            // })

            if (response.didCancel) {
                return
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error)
            }


            let timestamp = Date.now()
            let tags = 'app.avatar'
            let folder = 'avatar'
            let signatureUrl = config.api.base + config.api.signature
            let accessToken = that.state.user.accessToken
            requestHelper.post(signatureUrl, {
                accessToken: accessToken,
                timestamp: timestamp,
                type: 'avatar'
            }).then(
                (data) => {
                    console.log('>>>>>>> data =' + data.success)
                    if (data && data.success) {
                        console.log('signatureUrl=' + data)
                        let signature = 'folder=' + folder + '&tags=' + tags + '&timestamp=' + timestamp + CLOUDINARY.api_secret
                        signature = sha1(signature)
                        let body = new FormData()
                        body.append('folder', folder)
                        body.append('timestamp', timestamp)
                        body.append('signature', signature)
                        body.append('tags', tags)
                        body.append('api_key', CLOUDINARY.api_key)
                        body.append('resource_type', 'image')
                        body.append('file', avatarData)
                        body.append('folder', folder)
                        that._upload(body)
                    }
                }
            )


        })
    }


    //同步更新用户信息
    _asyncUser(isAvatar){
        let that = this
        let user = this.state.user
        if(user && user.accessToken){
            let url = config.api.base + config.api.update
            console.log('async user = url = ' + url +'|user='+JSON.stringify(user))
            requestHelper.post(url,user).then(
                (data) =>
                {
                    console.log('async user = data = ' + JSON.stringify(data))
                    if(data && data.success){
                        if(isAvatar){
                            AlertIOS.alert('头像更新成功')
                        }
                        let user = data.data
                        that.setState(
                            {
                                user : user
                            }
                        )
                        AsyncStorage.setItem('user',JSON.stringify(user))
                        that._closeModal()
                    }
                }
            ).catch((err) => {
                console.log(err)
                AlertIOS.alert('更新失败,请稍后再试')
            })
        }
    }

    _upload(body) {

        let that = this

        let xhr = new XMLHttpRequest()

        let url = CLOUDINARY.image

        that.setState({
            avatarUploading: true,
            avatarProgress: 0
        })


        xhr.open('POST', url)
        xhr.onload = () => {
            if (xhr.status !== 200) {
                AlertIOS.alert('请求失败:' + xhr.responseText)
                return
            }

            if (!xhr.responseText) {
                AlertIOS.alert('请求失败:' + xhr.responseText)
                return
            }


            let response

            try {
                response = JSON.parse(xhr.response)
            } catch (e) {
                console.log(e)
            }

            if (response && response.public_id) {
                let user = that.state.user
                user.avatar = response.public_id
                that.setState({
                    avatarUploading: false,
                    avatarProgress: 0,
                    user: user
                })
                that._asyncUser(true)

            }

        }

        if (xhr.upload) {
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    let percent = Number((event.loaded / event.total).toFixed(2))

                    that.setState({
                        avatarProgress: percent
                    })
                }
            }
        }

        xhr.send(body)
    }


    //提交更新用户信息
    _submit(){
        this._asyncUser(false)
    }

    _logout(){
        this.props.logout()
    }


    render() {
        let user = this.state.user
        return (

            <View style={styles.container}>

                <View style={styles.toolBar}>
                    <Text style={styles.toolBarTitle}>我的账户</Text>
                    <Text style={styles.toolBarExtra} onPress={this._edit.bind(this)}>编辑</Text>
                </View>


                {
                    user.avatar
                        ?
                        <TouchableOpacity style={styles.avatarContainer} onPress={this._pickPhoto.bind(this)}>
                            <Image source={{uri: this.avatar(user.avatar,'image')}} style={styles.avatarContainer}>
                                <View style={styles.avatarBox}>
                                    {
                                        this.state.avatarUploading
                                            ? <Circle
                                            showText={true}
                                            color={'#ee735c'}
                                            size={75}
                                            progress={this.state.avatarProgress}
                                        />
                                            : <Image source={{uri:this.avatar(user.avatar,'image')}} style={styles.avatar}>
                                              </Image>
                                    }

                                </View>
                                <Text style={styles.avatarTip}>点此处换头像</Text>
                            </Image>
                        </TouchableOpacity>
                        :
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarTip}>添加头像</Text>
                            <TouchableOpacity style={styles.avatarBox} onPress={this._pickPhoto.bind(this)}>
                                {
                                    this.state.avatarUploading
                                        ? <Circle
                                        showText={true}
                                        color={'#ee735c'}
                                        size={75}
                                        progress={this.state.avatarProgress}
                                    />
                                        : <Icon name='ios-cloud-upload-outline' style={styles.plusIcon}/>
                                }

                            </TouchableOpacity>
                        </View>

                }


                <Modal
                    animationType={'fade'}
                    visible={this.state.modalVisible}>
                    <View style={styles.modalContainer}>
                        <Icon
                            name='ios-close-outline'
                            style={styles.closeIcon}
                            onPress={this._closeModal.bind(this)}
                        />
                        <View style={styles.fieldItem}>
                            <Text style={styles.label}>昵称</Text>
                            <TextInput
                                placeholder='输入您的名称'
                                style={styles.inputField}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                defaultValue={this.state.user.nickname}
                                onChangeText={(text) => {
                                                this._changeUserState('nickname',text)
                                             }}
                                />
                        </View>
                        <View style={styles.fieldItem}>
                            <Text style={styles.label}>年龄</Text>
                            <TextInput
                                placeholder='输入您年龄'
                                keyboardType={'number-pad'}
                                style={styles.inputField}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                defaultValue={this.state.user.age}
                                onChangeText={(text) => {
                                    this._changeUserState('age',text)
                                }}
                            />
                        </View>
                        <View style={styles.fieldItem}>
                            <Text style={styles.label}>性别</Text>
                            <Icon.Button
                                name="ios-paw"
                                onPress={()=>{
                                    this._changeUserState('gender','male')
                                }
                                }
                                style={[styles.gender,this.state.user.gender === 'male' && styles.genderChecked]}
                            >男</Icon.Button>
                            <Icon.Button
                                name="ios-paw-outline"
                                onPress={()=>{
                                    this._changeUserState('gender','female')
                                }
                                }
                                style={[styles.gender,this.state.user.gender === 'female' && styles.genderChecked]}
                            >女</Icon.Button>

                        </View>
                        <Button
                            onPress={this._submit.bind(this)}
                            style={styles.btn}
                        >保存</Button>
                    </View>




                </Modal>

                <Button
                    onPress={this._logout.bind(this)}
                    style={styles.btn}
                >注销账户</Button>
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
    btn:{
        padding:10,
        marginTop:25,
        marginLeft:10,
        marginRight:10,
        backgroundColor:'transparent',
        borderColor:'#ee735c',
        borderWidth:1,
        borderRadius:4,
        color:'#ee735c'
    },
    avatarContainer: {
        width: width,
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#666'
    },
    avatarTip: {
        color: '#fff',
        backgroundColor: 'transparent',
        fontSize: 14
    },
    avatarBox: {
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    plusIcon: {
        padding: 20,
        paddingLeft: 25,
        paddingRight: 25,
        color: '#999',
        fontSize: 25,
        backgroundColor: '#fff',
        borderRadius: 8
    },
    avatar: {
        marginBottom: 15,
        width: width * 0.2,
        height: width * 0.2,
        resizeMode: 'cover',
        borderRadius: width * 0.1,

    },
    modalContainer:{
        flex:1,
        paddingTop:50,
        backgroundColor:'#fff'
    },
    fieldItem:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        height:50,
        paddingLeft:15,
        paddingRight:15,
        borderColor:'#eee',
        borderBottomWidth:1
    },
    label:{
        color:'#ccc',
        marginRight:10
    },
    inputField:{
        flex:1,
        height:50,
        color:'#666',
        fontSize:14
    },
    closeIcon:{
        position:'absolute',
        width:40,
        height:40,
        fontSize:32,
        right:1,
        top:30,
        color:'#ee735c'
    },
    gender:{
        backgroundColor:'#ccc'
    },
    genderChecked:{
        backgroundColor:'#ee735c'
    }

});