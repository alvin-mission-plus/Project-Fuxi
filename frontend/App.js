import React, { useState, useMemo, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";

import LandingScreen from "./app/screens/LandingScreen";

import LoginScreen from "./app/screens/LoginScreen";
import ManualPlayerScreen from "./app/screens/ManualPlayerScreen";
import SignupScreen from "./app/screens/SignupScreen";
import PlayerScreen from "./app/screens/PlayerScreen";
import PrePlayerScreen from "./app/screens/PrePlayerScreen";
import ShuffleManual from "./app/screens/ShuffleManual";
import YoutubeManual from "./app/screens/YoutubeManualPlayer";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PatientDashboard from "./app/screens/PatientDashboard";

import PatientRegistration from "./app/screens/PatientRegistration";
import PatientMusicForm from "./app/screens/PatientMusicForm";

import LoadingContext from "./app/store/LoadingContext";
import LoadingScreen from "./app/components/LoadingScreen";

import "./firebaseConfig";

const Stack = createNativeStackNavigator();

export default function App() {
    const [isLoading, setIsLoading] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const isLoadingContextValue = useMemo(
        () => ({ isLoading, setIsLoading }),
        [isLoading, setIsLoading]
    );

    useEffect(() => {
        if (isLoading) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    }, [isLoading, fadeAnim]);

    return (
        <View style={styles.container}>
            <LoadingContext.Provider value={isLoadingContextValue}>
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen
                            name="Landing"
                            component={LandingScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{ headerTitle: "", headerTransparent: true }}
                        />
                        <Stack.Screen
                            name="Signup"
                            component={SignupScreen}
                            options={{ headerTitle: "", headerTransparent: true }}
                        />
                        <Stack.Screen
                            name="Dashboard"
                            component={PatientDashboard}
                            options={{ headerTitle: "", headerTransparent: true }}
                        />
                        <Stack.Screen
                            name="PatientRegistration"
                            component={PatientRegistration}
                            options={{ headerTitle: "", headerTransparent: true }}
                        />
                        <Stack.Screen
                            name="PatientMusicForm"
                            component={PatientMusicForm}
                            options={{ headerTitle: "", headerTransparent: true }}
                        />
                        <Stack.Screen
                            name="Player"
                            component={PlayerScreen}
                            options={{ headerTitle: "", headerTransparent: true }}
                        />

                        <Stack.Screen
                            name="PrePlayer"
                            component={PrePlayerScreen}
                            options={{ headerTitle: "", headerTransparent: true }}
                        />
                        <Stack.Screen
                            name="ManualPlayer"
                            component={ManualPlayerScreen}
                            options={{ headerTitle: "", headerTransparent: true }}
                        />
                        <Stack.Screen
                            name="YoutubeManual"
                            component={YoutubeManual}
                            options={{ headerTitle: "", headerTransparent: true }}
                        />
                        <Stack.Screen
                            name="ShuffleManual"
                            component={ShuffleManual}
                            options={{ headerTitle: "", headerTransparent: true }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </LoadingContext.Provider>
            {isLoading && <LoadingScreen fadeAnim={fadeAnim} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
});
