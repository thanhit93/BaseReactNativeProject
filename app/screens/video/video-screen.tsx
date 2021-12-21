import React, { useEffect, FC, useState } from "react"
import { Platform, TextStyle, View, ViewStyle, ImageStyle, ActivityIndicator, ScrollView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Header, Screen, GradientBackground } from "../../components"
import { color, spacing } from "../../theme"
import { useStores } from "../../models"
import { NavigatorParamList } from "../../navigators"
import RtcEngine, { RtcLocalView, RtcRemoteView, VideoRenderMode } from 'react-native-agora'
import requestCameraAndAudioPermission from './permission'

const FULL: ViewStyle = {
    flex: 1,
}
const CONTAINER: ViewStyle = {
    backgroundColor: color.transparent,
}
const HEADER: TextStyle = {
    paddingBottom: spacing[5] - 1,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
}
const HEADER_TITLE: TextStyle = {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1.5,
    lineHeight: 15,
    textAlign: "center",
}
const REMOTE_CONTAINER: ViewStyle = {
    width: '100%',
    height: 150,
    position: 'absolute',
    top: 5
}
const REMOTE: ViewStyle = {
    width: 150,
    height: 150,
    marginHorizontal: 2.5
}
// ref: https://www.agora.io/en/blog/how-to-build-a-react-native-video-calling-app-using-agora/
export const VideoScreen: FC<StackScreenProps<NavigatorParamList, "videoScreen">> = observer(
    ({ navigation }) => {
        const goBack = () => navigation.goBack()
        // engine state
        const [engine, setEngine] = useState(undefined);
        const [peerIds, setPeerIds] = useState([])
        const [joinSucceed, setJoinSucceed] = useState(false)

        const { characterStore } = useStores()
        //const { characters, loading } = characterStore
        const appId = "6a6e334589344ae69ae7f476a8ee8d59"
        const channelName = "channel-x"
        const token = "0066a6e334589344ae69ae7f476a8ee8d59IADAITfp1BexpV0h1uM8lHxz8umcfJGoKf4M+7amRcuM8QJkFYoAAAAAEAA+DPg7cO6wYQEAAQBw7rBh"

        useEffect(() => {
            // variable used by cleanup function
            let isSubscribed = true;

            // create the function
            const createEngine = async () => {
                console.log("inside engine");
                try {
                    if (Platform.OS === 'android') {
                        // Request required permissions from Android
                        await requestCameraAndAudioPermission();
                    }
                    console.log("inside try");
                    const rtcEngine = await RtcEngine.create(appId);
                    await rtcEngine.enableVideo();

                    // need to prevent calls to setEngine after the component has unmounted
                    if (isSubscribed) {
                        setEngine(rtcEngine);
                    }
                } catch (e) {
                    console.log(e);
                }
            }

            // call the function
            if (!engine) createEngine();

            engine?.addListener('Warning', (warn) => {
                console.log('Warning', warn)
            })

            engine?.addListener('Error', (err) => {
                console.log('Error', err)
            })

            engine?.addListener('UserJoined', (uid, elapsed) => {
                console.log('UserJoined', uid, elapsed)
                // If new user
                if (peerIds.indexOf(uid) === -1) {
                    // Add peer ID to state array
                    setPeerIds([...peerIds, uid])
                }
            })

            engine?.addListener('UserOffline', (uid, reason) => {
                console.log('UserOffline', uid, reason)
                // Remove peer ID from state array
                setPeerIds(peerIds.filter(id => id !== uid))
            })

            // If Local user joins RTC channel
            engine?.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
                console.log('JoinChannelSuccess', channel, uid, elapsed)
                if (isSubscribed) {
                    // Set state variable to true
                    setJoinSucceed(true)
                }
            })

            startCall();

            // return a cleanup
            return () => {
                console.log('unmount')
                isSubscribed = false;
                console.log(engine)
                engine?.removeAllListeners();
                engine?.destroy();
            }

        },
            // will run once on component mount or if engine changes
            [engine]
        );

        const renderRemoteVideos = () => {
            return (
                <ScrollView
                    style={REMOTE_CONTAINER}
                    contentContainerStyle={{ paddingHorizontal: 2.5 }}
                    horizontal={true}>
                    {peerIds.map((value, index, array) => {
                        return (
                            <RtcRemoteView.SurfaceView
                                style={REMOTE}
                                uid={value}
                                channelId={channelName}
                                renderMode={VideoRenderMode.Hidden}
                                zOrderMediaOverlay={true} />
                        )
                    })}
                </ScrollView>
            )
        }

        /**
     * @name startCall
     * @description Function to start the call
     */
        const startCall = async () => {
            // Join Channel using null token and channel name
            await engine?.joinChannel(token, channelName, null, 0)
            console.log('startCall')
        }

        /**
         * @name endCall
         * @description Function to end the call
         */
        const endCall = async () => {
            setPeerIds([])
            setJoinSucceed(false)
            await engine?.leaveChannel()
        }

        return (
            <View testID="VideoScreen" style={FULL}>
                <GradientBackground colors={["#422443", "#281b34"]} />
                <Screen style={CONTAINER} preset="fixed" backgroundColor={color.transparent}>
                    <Header
                        headerTx="videoScreen.title"
                        leftIcon="back"
                        onLeftPress={goBack}
                        style={HEADER}
                        titleStyle={HEADER_TITLE}
                    />
                    <View style={{ flex: 1 }}>
                        {engine // check if we have an engine and not undefined
                            ?
                            <View style={{ flex: 1 }}>
                                {joinSucceed ? <RtcLocalView.SurfaceView
                                    style={{ flex: 1 }}
                                    channelId={channelName}
                                    renderMode={VideoRenderMode.Hidden} /> : null}
                                {renderRemoteVideos()}
                            </View> // if we know that we have an engine, we can do something with it
                            :
                            <ActivityIndicator /> // show a loading component while waiting for createEngine to finish 
                        }
                    </View>
                </Screen>
            </View>
        )

    },
)
