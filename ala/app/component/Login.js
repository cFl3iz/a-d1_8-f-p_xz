// 登陆界面
import React, {Component} from 'react';
import requestHelper from '../common/requestHelper';
var {CountDownText} = require('react-native-sk-countdown');
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TextInput,
    AlertIOS
} from 'react-native';

import Button      from "react-native-button";
import config      from '../common/config';

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = (
            {
                codeSent:false,
                loading:false,
                verifyCode:null
            }
        )
    }


    static defaultProps = {

    }

    //获取验证码
    _sendVerifyCode(){
        let that = this
        let phoneNumber = this.state.phoneNumber
        if(!phoneNumber){
            return AlertIOS.alert('号码不能为空!')
        }
        let body = {
            phoneNumber:phoneNumber
        }
        let url = config.api.base + config.api.signup
        requestHelper.post(url,body).then(
            (data)=>{
                if(data && data.success){
                    that._showVerifyCode()
                }
            }
        ).catch((error)=>{
            return AlertIOS.alert('获取验证码失败!')
        })

    }

    //显示验证码
    _showVerifyCode(){
        this.setState({
            codeSent:true
        })
    }


    render() {
        return (

                <View style={styles.container}>
                    <View style={styles.signupBox}>
                        <Text style={styles.signTitle}>快速登录</Text>
                        <TextInput
                            placeholder='输入手机号'
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            keyboardType={'number-pad'}
                            style={styles.inputField}
                            onChangeText={(text)=>{
                                this.setState({
                                    phoneNumber:text
                                })
                            }}
                        />

                        {
                            this.state.codeSent
                                ? <View>
                                     <TextInput
                                     placeholder='输入验证码'
                                     autoCapitalize={'none'}
                                     autoCorrect={false}
                                     keyboardType={'number-pad'}
                                     style={styles.inputField}
                                     onChangeText={(text)=>{
                                        this.setState({
                                            verifyCode:text
                                        })
                                     }}
                                     />
                                  </View>

                                : null
                        }



                        {
                            this.state.codeSent ?
                                <Button
                                    onPress={this._submit}
                                    style={styles.btn}
                                >登陆</Button>              :
                                <Button
                                    onPress={this._sendVerifyCode.bind(this)}
                                    style={styles.btn}
                                >获取验证码</Button>

                        }

                    </View>
                </View>

        )
    }


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:10,
        backgroundColor:'#f9f9f9',
    },
    signupBox:{
        marginTop:30
    },
    signTitle:{
        marginBottom:20,
        color:'#333',
        fontSize:20,
        textAlign:'center'
    },
    inputField:{
        height:40,
        padding:5,
        color:'#666',
        fontSize:16,
        backgroundColor:'#fff',
        borderRadius:4
    },
    btn:{
        padding:10,
        marginTop:10,
        backgroundColor:'transparent',
        borderColor:'#ee735c',
        borderWidth:1,
        borderRadius:4,
        color:'#ee735c'
    }

});