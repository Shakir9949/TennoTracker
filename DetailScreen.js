import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Button,
    StyleSheet,
    ScrollView,
} from "react-native";

import { db } from "../firebase";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";

export default function DetailScreen({ route }) {
    const { item } = route.params;
    const [alreadySaved, setAlreadySaved] = useState(false);

    // Check if already in Firestore
    useEffect(() => {
        checkIfSaved();
    }, []);

    const checkIfSaved = async() => {
        try {
            const q = query(
                collection(db, "favorites"),
                where("id", "==", item.id)
            );

            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                setAlreadySaved(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Save to Firestore
    const saveFavorite = async() => {
        if (alreadySaved) {
            alert("Already in favorites!");
            return;
        }

        try {
            await addDoc(collection(db, "favorites"), item);
            setAlreadySaved(true);
            alert("Saved to favorites!");
        } catch (error) {
            console.log(error);
            alert("Error saving favorite");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>{item.name}</Text>

                <Text style={styles.label}>Description:</Text>
                <Text style={styles.text}>{item.description}</Text>

                <Text style={styles.label}>Difficulty:</Text>
                <Text style={styles.text}>{item.difficulty}</Text>

                <Text style={styles.label}>Faction:</Text>
                <Text style={styles.text}>{item.faction}</Text>

                <Text style={styles.label}>Level Range:</Text>
                <Text style={styles.text}>{item.level}</Text>

                <Text style={styles.label}>Reward:</Text>
                <Text style={styles.text}>{item.reward}</Text>

                <View style={styles.buttonContainer}>
                    <Button
                        title={alreadySaved ? "Already Saved" : "Save to Favorites"}
                        onPress={saveFavorite}
                    />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        padding: 15,
    },
    card: {
        backgroundColor: "#1e1e1e",
        padding: 20,
        borderRadius: 10,
    },
    title: {
        fontSize: 22,
        color: "#ffffff",
        fontWeight: "bold",
        marginBottom: 15,
    },
    label: {
        color: "#aaaaaa",
        fontSize: 14,
        marginTop: 10,
    },
    text: {
        color: "#ffffff",
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 20,
    },
});
