/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';


import VideoEdit from './VideoEdit';
import VideoList from './VideoList';
import Me from './Me';
import Login from './Login';

import {
    Platform,
    StyleSheet,
    Text,
    TabBarIOS,
    View
} from 'react-native';

import {Navigator} from 'react-native-deprecated-custom-components';

import Icon from 'react-native-vector-icons/Ionicons';

export default class TabBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = (
            {
                selectedTab: 'VideoList',
                notifCount: 0,
                presses: 0
            }
        )
    }


    static defaultProps = {
        title: '<TabBarIOS>',
        description: 'Tab-based navigation.',
        base64Icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAQAAACSR7JhAAADtUlEQVR4Ac3YA2Bj6QLH0XPT1Fzbtm29tW3btm3bfLZtv7e2ObZnms7d8Uw098tuetPzrxv8wiISrtVudrG2JXQZ4VOv+qUfmqCGGl1mqLhoA52oZlb0mrjsnhKpgeUNEs91Z0pd1kvihA3ULGVHiQO2narKSHKkEMulm9VgUyE60s1aWoMQUbpZOWE+kaqs4eLEjdIlZTcFZB0ndc1+lhB1lZrIuk5P2aib1NBpZaL+JaOGIt0ls47SKzLC7CqrlGF6RZ09HGoNy1lYl2aRSWL5GuzqWU1KafRdoRp0iOQEiDzgZPnG6DbldcomadViflnl/cL93tOoVbsOLVM2jylvdWjXolWX1hmfZbGR/wjypDjFLSZIRov09BgYmtUqPQPlQrPapecLgTIy0jMgPKtTeob2zWtrGH3xvjUkPCtNg/tm1rjwrMa+mdUkPd3hWbH0jArPGiU9ufCsNNWFZ40wpwn+62/66R2RUtoso1OB34tnLOcy7YB1fUdc9e0q3yru8PGM773vXsuZ5YIZX+5xmHwHGVvlrGPN6ZSiP1smOsMMde40wKv2VmwPPVXNut4sVpUreZiLBHi0qln/VQeI/LTMYXpsJtFiclUN+5HVZazim+Ky+7sAvxWnvjXrJFneVtLWLyPJu9K3cXLWeOlbMTlrIelbMDlrLenrjEQOtIF+fuI9xRp9ZBFp6+b6WT8RrxEpdK64BuvHgDk+vUy+b5hYk6zfyfs051gRoNO1usU12WWRWL73/MMEy9pMi9qIrR4ZpV16Rrvduxazmy1FSvuFXRkqTnE7m2kdb5U8xGjLw/spRr1uTov4uOgQE+0N/DvFrG/Jt7i/FzwxbA9kDanhf2w+t4V97G8lrT7wc08aA2QNUkuTfW/KimT01wdlfK4yEw030VfT0RtZbzjeMprNq8m8tnSTASrTLti64oBNdpmMQm0eEwvfPwRbUBywG5TzjPCsdwk3IeAXjQblLCoXnDVeoAz6SfJNk5TTzytCNZk/POtTSV40NwOFWzw86wNJRpubpXsn60NJFlHeqlYRbslqZm2jnEZ3qcSKgm0kTli3zZVS7y/iivZTweYXJ26Y+RTbV1zh3hYkgyFGSTKPfRVbRqWWVReaxYeSLarYv1Qqsmh1s95S7G+eEWK0f3jYKTbV6bOwepjfhtafsvUsqrQvrGC8YhmnO9cSCk3yuY984F1vesdHYhWJ5FvASlacshUsajFt2mUM9pqzvKGcyNJW0arTKN1GGGzQlH0tXwLDgQTurS8eIQAAAABJRU5ErkJggg=='
    }

    _renderContent(color: string,pageText: string,num?: number) {
        return (

            <View style={[styles.tabContent, {backgroundColor: color}]}>
                <Text style={styles.tabText}>{pageText}</Text>
                <Text style={styles.tabText}>{num} re-renders of the {pageText}</Text>
            </View>
        );
    }


    render() {
        return (
            <TabBarIOS
                unselectedTintColor="yellow"
                tintColor="white"
                barTintColor="darkslateblue">
                <Icon.TabBarItem
                    title="Blue Tab"
                    iconName="ios-videocam-outline"
                    selectdIconName="ios-videocam"

                    selected={this.state.selectedTab === 'VideoList'}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'VideoList',
                            notifCount: this.state.notifCount + 1,
                        });
                    }}>
                    <Navigator

                               initialRoute={{params:{name:'VideoList'},component:VideoList}}
                               configureScene={(route)=>{
                                   return Navigator.SceneConfigs.FloatFromBottom;
                               }}
                               renderScene={
                                   (route,navigator) => {
                                       var Component = route.component;
                                       return <Component {...route.params} navigator={navigator} />
                                   }
                               }
                    />

                </Icon.TabBarItem>
                <Icon.TabBarItem
                    title="Blue Tab"
                    iconName="ios-recording-outline"
                    selectdIconName="ios-recording"
                    selected={this.state.selectedTab === 'VideoEdit'}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'VideoEdit',

                        });
                    }}>
                    {
                        <VideoEdit/>
                    }

                </Icon.TabBarItem>
                <Icon.TabBarItem
                    iconName="ios-more-outline"
                    selectdIconName="ios-more"
                    renderAsOriginal
                    title="Me"
                    selected={this.state.selectedTab === 'Me'}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'Me',
                            presses: this.state.presses + 1
                        });
                    }}>
                    {
                        <Login/>
                        //this._renderContent('#21551C', 'Green Tab', this.state.presses)
                    }
                </Icon.TabBarItem>
            </TabBarIOS>
        )
    }


}


const styles = StyleSheet.create({
    tabContent: {
        flex: 1,
        alignItems: 'center',
    },
    tabText: {
        color: 'white',
        margin: 50,
    },
});