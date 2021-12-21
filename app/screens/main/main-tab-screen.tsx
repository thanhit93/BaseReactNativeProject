import React, { FC } from "react"
import { View, ViewStyle, TextStyle, ImageStyle, SafeAreaView, PixelRatio, useWindowDimensions } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

import { observer } from "mobx-react-lite"
import {
    Button,
    Header,
    Screen,
    Text,
    GradientBackground,
    AutoImage as Image,
} from "../../components"
import { color, spacing, typography } from "../../theme"
import { NavigatorParamList } from "../../navigators"
import { widthPercentageToDP, heightPercentageToDP, heightDP } from '../../utils/screen_util'
import { DemoListScreen, VideoScreen } from ".."

const bowserLogo = require("../welcome/bowser.png")

// format code //Shift + Option + F
const Tab = createMaterialBottomTabNavigator();

export const MainTabScreen: FC<StackScreenProps<NavigatorParamList, "mainTab">> = observer(
    ({ navigation }) => {
        // const nextScreen = () => navigation.navigate("demo")
        const { height, width } = useWindowDimensions();

        return (
            <Tab.Navigator
                initialRouteName="Home"
                activeColor="#fff"
            >
                <Tab.Screen
                    name="Home"
                    component={DemoListScreen}
                    options={{
                        tabBarLabel: 'Home',
                        tabBarColor: '#009387',
                        tabBarIcon: ({ color }) => (
                            <Image
                                style={{ width: 26, height: 26, tintColor: color }}
                                source={bowserLogo}
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Notifications"
                    component={VideoScreen}
                    options={{
                        tabBarLabel: 'Updates',
                        tabBarColor: '#1f65ff',
                        tabBarIcon: ({ color }) => (
                            <Image
                                style={{ width: 26, height: 26, tintColor: color }}
                                source={bowserLogo}
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={VideoScreen}
                    options={{
                        tabBarLabel: 'Profile',
                        tabBarColor: '#694fad',
                        tabBarIcon: ({ color }) => (
                            <Image
                                style={{ width: 26, height: 26, tintColor: color }}
                                source={bowserLogo}
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Explore"
                    component={DemoListScreen}
                    options={{
                        tabBarLabel: 'Explore',
                        tabBarColor: '#d02860',
                        tabBarIcon: ({ color }) => (
                            <Image
                                style={{ width: 26, height: 26, tintColor: color }}
                                source={bowserLogo}
                            />
                        ),
                    }}
                />
            </Tab.Navigator>
        )
    },
)
