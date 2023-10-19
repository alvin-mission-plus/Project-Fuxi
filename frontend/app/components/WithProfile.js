import { StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import ChangeListenerScreen from '../screens/ChangeListenerScreen';

const WithProfile = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    return (
        <>
            <View style={styles.container}>
                <View style={styles.listener}>
                    <Text style={styles.listenerText}>Listener</Text>
                    <Text style={styles.nameListenerText}>Prairie Johnson</Text>
                </View>
                <TouchableOpacity onPress={() => setIsModalVisible(!isModalVisible)}>
                    <Ionicons name="sync" color={'#757575'} size={26} style={{ padding: 4, paddingRight: 0 }} />
                </TouchableOpacity>
            </View>
            <Modal visible={isModalVisible} transparent animationType="fade">
                <ChangeListenerScreen visible={() => setIsModalVisible(!isModalVisible)} />
            </Modal>
        </>
    );
};

export default WithProfile;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#ECEDEE',
        borderRadius: 6,
        borderWidth: 1,
        marginBottom: 20,
    },
    listener: {
        flex: 1,
        flexDirection: 'column',
        gap: 2,
    },
    listenerText: {
        fontWeight: '500',
        fontSize: 12,
        lineHeight: 16,
        color: '#757575',
    },
    nameListenerText: {
        fontWeight: '500',
        fontSize: 18,
        lineHeight: 28,
        color: '#222C2D',
    },
});
