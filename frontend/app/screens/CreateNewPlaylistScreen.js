import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CustomGridLayout from '../components/CustomGridLayout';
import { searchTrack } from './../api/track';
import CustomAnimatedLoader from '../components/CustomAnimatedLoader';
import { getStoreData } from '../utils/AsyncStorage';
import { createPlaylist } from '../api/playlist';
import RenderItemSong from '../components/RenderItemSong';
import ToggleButton from '../components/ToggleButton';

const CreateNewPlaylistScreen = () => {
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const [namePlaylistText, setNamePlaylistText] = useState('');
    const [isSelected, setIsSelected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [renderTracks, setRenderTracks] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: '',
            headerTintColor: '#3C4647',
            headerLeft: () => (
                <TouchableOpacity style={styles.roundButtonHeader} onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color={'#3C4647'} style={{ paddingVertical: 10 }} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const toggleItem = (item) => {
        setSelectedItems((prevSelectedItems) => {
            if (prevSelectedItems.includes(item)) {
                return prevSelectedItems.filter((selected) => selected !== item);
            } else {
                return [...prevSelectedItems, item];
            }
        });
    };

    const RenderItem = ({ item }) => {
        const isSelected = selectedItems.some((selectedItem) => selectedItem === item._id);
        const [select, setSelect] = useState(isSelected);
        const renderIconRight = (item) => {
            return (
                <TouchableOpacity
                    onPress={() => {
                        toggleItem(item._id);
                        setSelect(!select);
                    }}
                >
                    {select ? (
                        <Text style={styles.removeText}>Remove</Text>
                    ) : (
                        <Ionicons name="add" color="#757575" size={30} style={{ padding: 6, paddingRight: 0 }} />
                    )}
                </TouchableOpacity>
            );
        };
        return <RenderItemSong item={item} iconRight={renderIconRight(item)} />;
    };

    const handleTextChange = async (newText) => {
        setSearchText(newText);
        if (newText !== '') {
            try {
                const response = await searchTrack(newText, 1);
                const { code, data, message } = JSON.parse(response);

                if (code == 200) {
                    setRenderTracks(data.map((item, index) => <RenderItem item={item} key={index} />));
                } else {
                    alert(message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert(error.message);
                return;
            }
        } else {
            setRenderTracks([]);
        }
    };

    const handleSubmit = async () => {
        const json = await getStoreData('userInfo');
        const userInfo = JSON.parse(json);

        try {
            setLoading(true);
            const response = await createPlaylist(userInfo.id, namePlaylistText, selectedItems);
            const { code, message, data } = JSON.parse(response);

            if (code == 201) {
                navigation.navigate('TabNavigator');
            } else {
                alert(message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
            return;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log(selectedItems);
        if (selectedItems.length < 1 || namePlaylistText === '') {
            setIsSelected(false);
        } else {
            setIsSelected(true);
        }
    }, [selectedItems, namePlaylistText]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <CustomAnimatedLoader visible={loading} source={require('../assets/loader/cat-loader.json')} />
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Create new playlist</Text>
                    <Text style={styles.playlistName}>Playlist name</Text>
                    <TextInput
                        placeholder="Enter the name of the playlist"
                        style={styles.inputNamePlaylist}
                        onChangeText={(text) => setNamePlaylistText(text)}
                        value={namePlaylistText}
                    />
                </View>
                <View style={styles.addPlaylist}>
                    <View style={styles.addPlaylistHeader}>
                        <Text style={styles.addToPlaylistText}>Add to playlist</Text>
                        <Text style={styles.selectedText}>{selectedItems.length} selected</Text>
                    </View>
                    <View style={styles.searchView}>
                        <View style={styles.headerSearch}>
                            <View style={styles.search}>
                                <Ionicons name="search" color="#757575" size={24} style={{ padding: 10 }} />
                                <TextInput
                                    placeholder="Search"
                                    style={styles.inputStyle}
                                    onChangeText={handleTextChange}
                                    value={searchText}
                                />
                                {searchText !== '' ? (
                                    <Ionicons
                                        name="close"
                                        size={24}
                                        style={{ padding: 10 }}
                                        onPress={() => handleTextChange('')}
                                    />
                                ) : (
                                    ''
                                )}
                            </View>
                        </View>
                    </View>
                    <View style={styles.contentSearch}>
                        {renderTracks.length !== 0 ? (
                            <CustomGridLayout data={renderTracks} columns={1} styleLayout={{}} />
                        ) : (
                            <View style={styles.emptyView}>
                                <Text style={styles.emptyText}>No songs found</Text>
                            </View>
                        )}
                    </View>
                </View>
                <ToggleButton
                    isDisabled={isSelected}
                    onPress={handleSubmit}
                    lable="Done"
                    backgroundColorActive="#315F64"
                    backgroundColorInactive="#EFEFF1"
                    colorActive="#fff"
                    colorInactive="#CACECE"
                    styleButton={{
                        marginTop: 'auto',
                        marginBottom: 24,
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

export default CreateNewPlaylistScreen;

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
    header: {
        borderBottomWidth: 1,
        borderBottomColor: '#DFE0E2',
    },
    headerText: {
        fontWeight: '600',
        fontSize: 24,
        lineHeight: 32,
        color: '#222C2D',
        marginBottom: 16,
    },
    playlistName: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        color: '#757575',
    },
    inputNamePlaylist: {
        height: 36,
        fontSize: 16,
        lineHeight: 24,
    },
    addPlaylist: {
        flex: 1,
        flexDirection: 'column',
        gap: 12,
    },
    addPlaylistHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addToPlaylistText: {
        fontWeight: '600',
        fontSize: 18,
        lineHeight: 28,
        color: '#222C2D',
    },
    selectedText: {
        fontWeight: '500',
        fontSize: 18,
        lineHeight: 28,
        color: '#757575',
    },
    searchView: {},
    searchInput: {},

    headerSearch: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
    },
    search: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DFE0E2',
        borderRadius: 4,
        height: '100%',
        overflow: 'hidden',
    },
    inputStyle: {
        flex: 1,
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        color: '#3C4647',
    },

    contentSearch: {
        flex: 1,
    },
    removeText: {
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 20,
        color: '#C31E1E',
        padding: 6,
        paddingRight: 0,
    },

    emptyView: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginBottom: '50%',
    },
    emptyText: {
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 24,
        color: '#757575',
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
});
