import React, { useState, useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Constants from 'expo-constants'

import GenreToggleButton from "../components/GenreToggleButton";
import LoadingContext from "../store/LoadingContext";
import StyledButton from "../components/StyledButton";

import colours from "../config/colours.js";

import { getInstitute } from "../api/institutes";

function PatientMusicForm({ route, navigation }) 
{
    const { setIsLoading } = useContext(LoadingContext);

    const { name, age, ethnicity, birthdate, birthplace, language } = route.params;

    const genres = [
        "Cantonese",
        "Chinese",
        "Christian",
        "English",
        "Hainanese",
        "Hindi",
        "Hokkien",
        "Malay",
        "Mandarin",
        "TV",
        "Tamil",
    ]; // TODO: force to pick at least 3
    const [preferredGenres, setPreferredGenres] = useState(
        Array(11).fill(false)
    );

    const updatePreferences = (genreIndex) => {
        let newPreferredGenres = [...preferredGenres];
        newPreferredGenres[genreIndex] = !newPreferredGenres[genreIndex];
        setPreferredGenres(newPreferredGenres);
    };

    const submitHandler = async (evt) => {
        evt.preventDefault();

        // check if there are at least 3 genres selected
        const selectedGenreCount = preferredGenres.filter(
            (genre) => genre
        ).length;
        if (selectedGenreCount < 3) {
            alert("Please select at least 3 genres.");
            return;
        }

        const genreData = Object.assign(
            ...genres.map((k, i) => ({ [k]: preferredGenres[i] }))
        ); // construct object

        // Get list of genres by filtering out the false values
        const selectedGenres = Object.keys(genreData).filter(
            (key) => genreData[key]
        );

        setIsLoading (true);

        const institute = await getInstitute();

        const newPatientData = {
            name,
            age,
            ethnicity,
            birthdate,
            birthplace,
            language,
            genres: selectedGenres,
            instituteId: institute._id,
        };

        const response = await fetch(`https://project-fuxi-fsugt.ondigitalocean.app/patient/new`, {
            body: JSON.stringify(newPatientData),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        });
        const data = await response.json();

        if (data.status === "ERROR") 
        {
            setIsLoading(false);
        }
        else 
        {
			let res = await fetch(`https://project-fuxi-fsugt.ondigitalocean.app/track/initial`, {
				body: JSON.stringify({ patientId: data.patient._id }),
				headers: { "Content-Type": "application/json" },
				method: "POST",
			});
			let resData = await res.json();
		    if (resData.status === "ERROR") {
				console.log(resData.message)
			}

            setIsLoading(false);
            navigation.navigate("Dashboard");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Genres</Text>
            </View>
            <View style={styles.info}>
                <Text style={styles.info}>
                    What do you think the listener would have heard during their teen years?
                </Text>
            </View>
            <View style={styles.bodyContainer}>
                <View style={styles.rightContainer}>
                    {genres.map((genre, index) => (
                        <GenreToggleButton
                            genre={genre}
                            key={index}
                            updatePreferences={() => updatePreferences(index)}
                        />
                    ))}
                </View>
            </View>
            <StyledButton text="Submit" onPress={submitHandler} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colours.bg,
    },
    titleContainer: {
        marginTop: 20,
        alignItems: "center",
        marginBottom: 10,
    },
    bodyContainer: {
        flex: 0.7,
        width: "100%",
        alignItems: "center",
    },
    info: {
        fontSize: 18,
        color: colours.primaryText,
        textAlign: "center",
        marginBottom: 10,
        paddingRight: 20,
        paddingLeft: 20,
    },
    rightContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 20
    },    
    title: {
        color: colours.primaryText,
        fontSize: 32,
        fontWeight: "500",
        marginBottom: 10,
    }
});

export default PatientMusicForm;
