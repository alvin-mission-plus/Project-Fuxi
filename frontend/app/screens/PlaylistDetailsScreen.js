import { Image, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import CustomGridLayout from './../components/CustomGridLayout';
import SlotPlayer from '../components/SlotPlayer';
import ToggleDialog from '../components/ToggleDialog';
import { getPlaylistById } from '../api/playlist';
import RenderListSong from '../components/RenderListSong';
import { secondsToTimeString, totalDurationTracks } from '../utils/AudioUtils';

const PlaylistDetailsScreen = () => {
    const navigation = useNavigation();
    const [heightItem, setHeightItem] = useState(0);
    const route = useRoute();
    const dataPlaylistDetail = route.params.dataPlaylistDetail;
    const [renderPlaylistDetail, setRenderPlaylistDetail] = useState([]);
    const [countTracks, setCountTracks] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);

    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [dialogProps, setDialogProps] = useState({});
    const statusLikeEnum = { Normal: '#137882', High: '#FFC857' };
    const statusDislikeEnum = { Normal: '#222C2D', High: '#C31E1E' };

    const listImages = dataPlaylistDetail.tracks.map((item, index) => (
        <Image key={index} source={{ uri: item.ImageURL }} style={{ width: heightItem / 2, height: heightItem / 2 }} />
    ));

    handleLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        setHeightItem(width);
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: '',
            headerTintColor: '#3C4647',
            headerLeft: () => (
                <TouchableOpacity style={styles.roundButtonHeader} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={'#3C4647'} />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View style={styles.bar}>
                    <TouchableOpacity style={styles.roundButtonHeader} onPress={() => navigation.navigate('SearchTrackScreen')}>
                        <Ionicons name="search" size={24} color={'#3C4647'} />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    async function getPlaylistDetail() {
        try {
            const response = await getPlaylistById(dataPlaylistDetail._id);
            const { code, message, data } = JSON.parse(response);
            if (code == 200) {
                setCountTracks(data.tracks.length);
                const playlistItems = data.tracks.map((dataItem, index) => (
                    <RenderListSong
                        key={index}
                        item={dataItem}
                        statusLikeEnum={statusLikeEnum}
                        statusDislikeEnum={statusDislikeEnum}
                        setIsDialogVisible={setIsDialogVisible}
                        setDialogProps={setDialogProps}
                        dataTracksOrigin={data.tracks}
                    />
                ));
                setRenderPlaylistDetail(playlistItems);
                setTotalDuration(await totalDurationTracks(data.tracks));
            } else {
                alert(message);
            }
        } catch (error) {
            alert(error.message);
            return;
        }
    }

    useEffect(() => {
        getPlaylistDetail();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={{ alignItems: 'center' }}>
                    <View style={{ borderRadius: 6, overflow: 'hidden', width: '70%' }} onLayout={this.handleLayout}>
                        <CustomGridLayout columns={2} data={listImages} />
                    </View>
                </View>
                <View style={styles.playListDetail}>
                    <Text style={styles.playListName}>{dataPlaylistDetail.namePlaylist}</Text>
                    <View style={styles.playListTracksAndTime}>
                        <Text style={styles.playListTotalName}>{countTracks} songs</Text>
                        <Ionicons name="ellipse" color="#E2E3E4" size={10} />
                        <Text style={styles.playListTotalName}>{secondsToTimeString(totalDuration)}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.buttonPlay} onPress={() => navigation.navigate('PlayMedia')}>
                    <Ionicons name="play" color="#fff" size={20} />
                    <Text style={styles.playText}>Play</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <View style={{ borderTopColor: '#ECEDEE', borderTopWidth: 1 }}></View>
                    <CustomGridLayout data={renderPlaylistDetail} columns={1} styleLayout={{}} />
                </View>
            </View>
            {/* <SlotPlayer /> */}

            <ToggleDialog
                visible={isDialogVisible}
                title={dialogProps.title}
                desc={dialogProps.desc}
                labelYes={dialogProps.labelYes}
                labelNo={dialogProps.labelNo}
                onPressYes={dialogProps.onPressYes}
                onPressNo={dialogProps.onPressNo}
                styleBtnYes={dialogProps.styleBtnYes}
            />
        </SafeAreaView>
    );
};

export default PlaylistDetailsScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50 + (Platform.OS === 'android' ? StatusBar.currentHeight : 0),
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        flexDirection: 'column',
        gap: 24,
    },
    playListDetail: {
        flexDirection: 'column',
        gap: 8,
    },
    playListName: {
        fontWeight: '600',
        fontSize: 24,
        lineHeight: 32,
        color: '#222C2D',
    },
    playListTracksAndTime: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    playListTotalName: {
        fontWeight: '500',
        fontSize: 12,
        lineHeight: 16,
        color: '#757575',
    },
    buttonPlay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#315F64',
        gap: 8,
        borderRadius: 100,
    },
    playText: {
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 24,
        color: '#fff',
        paddingVertical: 12,
    },

    rowItem: {
        flex: 1,
        paddingVertical: 6,
        marginVertical: 2,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    songImage: {
        height: 50,
        width: 50,
        borderRadius: 4,
    },
    rowItemText: {
        flex: 1,
        flexDirection: 'column',
    },
    titleText: {
        fontWeight: '500',
        fontSize: 15,
        lineHeight: 24,
        color: '#222C2D',
    },
    artistText: {
        fontWeight: '500',
        fontSize: 12,
        lineHeight: 16,
        color: '#757575',
    },
});
