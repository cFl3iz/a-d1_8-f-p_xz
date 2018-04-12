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
    AlertIOS,
    Dimensions,
    AsyncStorage
} from 'react-native';

//拿屏幕宽度
import config      from '../common/config';
import requestHelper from '../common/requestHelper';
import sha1 from 'sha1';
import * as Progress from 'react-native-progress';

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
                avatarUploading: false
            }
        )
    }


    static defaultProps = {}

    avatar(id, type) {
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
                user.avatar = that.avatar(response.public_id, 'image')
                that.setState({
                    avatarUploading: false,
                    avatarProgress: 0,
                    user: user
                })
            }

        }

        if (xhr.upload) {
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    let parcent = Number((event.loaded / event.total).toFixed(2))
                    that.setState({
                        avatarProgress: parcent
                    })
                }
            }
        }

        xhr.send(body)
    }


    render() {
        let user = this.state.user
        return (

            <View style={styles.container}>

                <View style={styles.toolBar}>
                    <Text style={styles.toolBarTitle}>我的账户</Text>
                </View>


                {
                    user.avatar
                        ?
                        <TouchableOpacity style={styles.avatarContainer} onPress={this._pickPhoto.bind(this)}>
                            <Image source={{uri: user.avatar}} style={styles.avatarContainer}>
                                <View style={styles.avatarBox}>
                                    {
                                        this.state.avatarUploading
                                            ? <Progress.Circle
                                            showText={true}
                                            color={'#ee735c'}
                                            size={75}
                                            progress={this.state.avatarProgress}
                                        />
                                            : <Image source={{uri: user.avatar}} style={styles.avatar}>
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
                                        ? <Progress.Circle
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

    }
});