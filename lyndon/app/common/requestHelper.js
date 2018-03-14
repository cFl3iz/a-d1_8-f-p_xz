/**
 * Created by shenyinlin on 2018/2/26.
 */

import queryString  from 'query-string';
import _ from 'lodash';
import config from './config';
import Mock from 'mockjs';
import React, {Component} from 'react';

var requestHelper = {}

    requestHelper.get=function(url,params){
    console.log('url='+url+'params='+JSON.stringify(params))
    if(params){
        url += '?' + queryString.stringify(params)
    }
    return fetch(url)
        .then((response) => response.json())
        .then((responseJson)=>  Mock.mock(responseJson) );
    }

requestHelper.post = function(url,body){
    var options = _.extend(config.header,{
        body: JSON.stringify({
            body
        })
    })
    return fetch(url,options)
        .then((response) => response.json())
        .then((responseJson) => Mock.mock(responseJson)
        ).catch((error) => {
            console.error(error);
        });
    }



module.exports = requestHelper

// fetch('http://rapapi.org/mockjs/31274/api/videos?accessToken=sadsadsad')
//     .then((response) => response.json())
//     .then((responseJson) => {
//         var data = Mock.mock(responseJson)
//         if(data.success){
//             console.log(data)
//             //Ìæ»»
//             this.setState(
//                 {
//                     dataSource:this.state.dataSource.cloneWithRows(data.videoList)
//                 }
//             )
//         }
//
//     })
//     .catch((error) => {
//         console.error(error);
//     });