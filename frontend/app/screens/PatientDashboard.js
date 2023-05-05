import React, { useState, useEffect, useContext } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

import LoadingContext from "../store/LoadingContext.js";
import BackButton from "../components/BackButton.js";
import colours from "../config/colours.js";
import PatientItem from "../components/PatientItem.js";

import { getPatients } from  '../api/patients'; 
import { getInstitute } from "../api/institutes";

function PatientDashboard({ route, navigation }) {
    // const { institute } = route.params; // TEMP

    const { isLoading, setIsLoading } = useContext(LoadingContext);

    const [patientData, setPatientData] = useState();
    const [institute, setInstitute] = useState({email: ""}); 

    useEffect(() => {
        const loadPatients = async () => {
            setIsLoading(true);

            // const response = await fetch(
            //     `http://localhost:8080/institute/patients/${institute._id}`
            // );
            // const data = await response.json();
            // const patients = data.patients;

            const institute = await getInstitute();
            console.log("INSTITUTE:");
            console.log(institute);

            setInstitute (institute);

            const patients = await getPatients(); 

            console.log("PATIENTS:");
            patients.forEach((patient) => {
                console.log(patient.name);
            });

            setPatientData(patients);

            setIsLoading(false);
        };

        loadPatients();
    }, []);

    const selectPatient = (patientId) => {
        const patient = patientData.find((patient) => patient._id === patientId);
        console.log(patient);

        navigation.navigate("Player", { patient });
    };

    const addPatient = () => 
    {
        // navigation.navigate("PatientRegistration", { institute });
    }

    if (isLoading)
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} />
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Dashboard</Text>
                <Text style={styles.subtitleText}>{institute.email}</Text>
            </View>
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate("PatientRegistration")}
            >
                <FontAwesomeIcon icon={faPencilAlt} size={24} color="white" />
            </TouchableOpacity>
            <ScrollView style={styles.patientList}>
                {patientData && patientData.map((patient) => (
                    <TouchableOpacity
                        key={patient._id}
                        onPress={() => selectPatient(patient._id)}
                    >
                        <PatientItem patient={patient} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <TouchableOpacity
                style={styles.newButton}
                onPress={addPatient}
            >
                <Text style={styles.newText}>Add Patient</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colours.bg,
        alignItems: "center",
    },
    titleContainer: {
        paddingTop: 100,
        borderBottomWidth: 2,
        borderBottomColor: colours.primary,
        marginBottom: 20,
    },
    titleText: {
        fontSize: 32,
        color: colours.primaryText,
        paddingBottom: 10,
        fontWeight: "500",
    },
    subtitleText: {
        fontSize: 24,
        color: colours.primaryText,
        paddingBottom: 10,
        fontWeight: "500",
    },
    editButton: {
        position: "absolute",
        top: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colours.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    patientList: {
        width: "100%",
        paddingHorizontal: 30,
        flexGrow: 1,
    },
    newButton: {
        backgroundColor: colours.primary,
        borderRadius: 10,
        width: 130,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    newText: {
        color: colours.bg,
        textAlign: "center",
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 18,
        fontWeight: "450",
    },
});

export default PatientDashboard;
