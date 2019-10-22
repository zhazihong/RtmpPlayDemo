/**
 * Created by JetBrains WebStorm.
 * Author: zhazihong
 * Date: 2019/10/16
 * Time: 11:54
 * Desc: 用NodePlayerView封装的能全屏播放的视频组件
 */
import {StatusBar, View, TouchableOpacity, Image, Dimensions, StyleSheet, ActivityIndicator} from "react-native";
import {NodePlayerView} from "react-native-nodemediaclient";
import React from "react";
import Orientation from 'react-native-orientation';

// 屏幕宽高
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

export default class RTMPPlay extends React.Component {

    constructor() {
        super();
        this.state = {
            fullScreen: false,
            loading: true,
        }
    }

    componentWillMount() {
        Orientation.lockToPortrait();
        StatusBar.setHidden(false);
    }

    componentWillUnmount() {
        this.vp.stop();
        Orientation.lockToPortrait();
        StatusBar.setHidden(false);
    }

    fullScreenClick = (fullFlag) => {
        console.log('fullFlag-----' + fullFlag);
        if (fullFlag) {
            Orientation.lockToLandscapeLeft();
            StatusBar.setHidden(true);
        } else {
            Orientation.lockToPortrait();
            StatusBar.setHidden(false);
        }
        this.setState({
            fullScreen: fullFlag
        })
    };

    /**
     * 视频播放回调状态说明
     * 1000 正在连接视频
     * 1001 视频连接成功
     * 1002 视频连接失败, 会进行自动重连.
     * 1003 视频开始重连
     * 1004 视频播放结束1005视频播放中网络异常, 会进行自动重连.
     * 1006 网络连接超时, 会进行自动重连.
     * 1100 播放缓冲区为空
     * 1101 播放缓冲区正在缓冲数据
     * 1102 播放缓冲区达到bufferTime设定值,开始播放
     * 1103 收到RTMP协议Stream EOF,或 NetStream.Play.UnpublishNotify, 会进行自动重连.
     * 1104 解码后得到视频高宽, 格式为 width x height
     **/
    onStatusChange(status, msg) {
        console.log(status + '---' + msg);
        // 1102 播放缓冲区达到bufferTime设定值,开始播放
        if (1102 === status || 1104 === status) {
            this.setState({
                loading: false
            })
        }
    }

    render() {
        console.log('render----');
        const videoWidth = this.state.fullScreen ? screenHeight : screenWidth;
        return (
            <View>
                <View style={{width: videoWidth, backgroundColor: '#000000'}}>
                    {/*全屏按鈕*/}
                    {
                        (!this.state.fullScreen) ?
                            <TouchableOpacity style={{
                                width: 45,
                                height: 45,
                                position: 'absolute',
                                top: 15,
                                right: 5,
                                zIndex: 100,
                            }}
                                              onPress={() => this.fullScreenClick(true)}>
                                <Image style={{width: 26, height: 26,}}
                                       source={require('./assets/full_screen.png')}/>
                            </TouchableOpacity> : null
                    }

                    {/*关闭全屏按鈕*/}
                    {
                        (this.state.fullScreen) ?
                            <TouchableOpacity style={{
                                width: 45,
                                height: 45,
                                position: 'absolute',
                                top: 15,
                                left: 15,
                                zIndex: 100,
                            }}
                                              onPress={() => this.fullScreenClick(false)}>
                                <Image style={{width: 26, height: 26,}}
                                       source={require('./assets/close_red.png')}/>
                            </TouchableOpacity> : null
                    }

                    {/*视频加载中*/}
                    {
                        (this.state.loading) ?
                            <ActivityIndicator size="large" color="#ffffff" style={{
                                position: 'absolute',
                                top: 90,
                                left: screenWidth / 2 - 18,
                                zIndex: 100
                            }}/>
                            : null
                    }

                    <NodePlayerView
                        style={{height: this.state.fullScreen ? screenWidth : 200}}
                        ref={(vp) => {
                            this.vp = vp
                        }}
                        inputUrl={"rtmp://58.200.131.2:1935/livetv/hunantv"}
                        scaleMode={"ScaleToFill"}
                        bufferTime={300}
                        maxBufferTime={1000}
                        autoplay={true}
                        onStatus={(status, msg) => this.onStatusChange(status, msg)}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    closeIcon: {
        width: 45,
        height: 45,
        position: 'absolute',
        top: 190,
        zIndex: 100,
        left: 15,
    },
});
