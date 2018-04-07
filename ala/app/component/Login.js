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
                verifyCode:null,
                countingDone:false
            }
        )
    }


    static defaultProps = {

    }

    //真实登陆
    _login(){
        let that = this
        let phoneNumber = this.state.phoneNumber
        let verifyCode = this.state.verifyCode
        if(!phoneNumber || !verifyCode){
            return AlertIOS.alert('手机号或验证码不可为空!')
        }
        let body = {
            phoneNumber:phoneNumber,
            verifyCode:verifyCode
        }
        let url = config.api.base + config.api.login
        requestHelper.post(url,body).then(
            (data)=>{
                if(data && data.success){
                     console.log('Login Success ! data='+JSON.stringify(data))
                     that.props.afterLogin(data.data)
                }
            }
        ).catch((error)=>{
            return AlertIOS.alert('登陆失败!')
        })
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

    //倒计时结束可再次发送
    _countingDone(){
        this.setState({
            countingDone:true
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
                                ? <View style={styles.verifyCodeBox}>
                                     <TextInput
                                     placeholder='输入验证码'
                                     autoCapitalize={'none'}
                                     autoCorrect={false}
                                     keyboardType={'number-pad'}
                                     style={styles.inputVerifyCode}
                                     onChangeText={(text)=>{
                                        this.setState({
                                            verifyCode:text
                                        })
                                     }}
                                     />
                                    {
                                        this.state.countingDone ?
                                            <Button style={styles.countBtn} onPress={this._sendVerifyCode.bind(this)}>获取验证码
                                            </Button>
                                            : <CountDownText style={styles.countBtn}
                                                         countType='seconds'
                                                         auto={true}
                                                         afterEnd={this._countingDone.bind(this)}
                                                         timeLeft={60}
                                                         step={-1}
                                                         startText='获取验证码'
                                                         endText='获取验证码'
                                                         intervalText={(sec) => sec + '秒可重发'}

                                               />
                                    }
                                  </View>

                                : null
                        }



                        {
                            this.state.codeSent ?
                                <Button
                                    onPress={this._login.bind(this)}
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
    inputVerifyCode:{
        height:40,
        padding:5,
        width:150,
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
    },
    verifyCodeBox:{
        marginTop:10,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    countBtn:{
        width:110,
        height:40,
        padding:10,
        marginLeft:8,
        backgroundColor:'#ee735c',
        borderColor:'#33735c',
        color:'white',
        textAlign:'left',
        fontWeight:'600',
        fontSize:15,
        borderRadius:2
    }

});