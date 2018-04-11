/**
 * Created by shenyinlin on 2018/2/26.
 */
'use strict'

module.exports = {
    header:{
        method:'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        }
    },
    api:{
        base:'http://rapapi.org/mockjs/31274/',
        creations:'api/videos',
        up:'api/up',
        comments:'api/comments',
        signup:'api/u/signup',
        login:'api/u/verify',
        signature:'api/signature'
    }
}