import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
} from "react-native";

import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useIsFocused } from "@react-navigation/native";

export default function FavoritesScreen() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    const isFocused = useIsFocused();

    useEffect(() => {
        loadFavorites();
    }, [isFocused]); // reload when screen opens

    const loadFavorites = async() => {
        try {
            setLoading(true);

            const querySnapshot = await getDocs(collection(db, "favorites"));

            const list = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setFavorites(list);
        } catch (error) {
            console.log("LOAD ERROR:", error);
            alert("Error loading favorites");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
    }

    if (favorites.length === 0) {
        return (
            <View style={styles.center}>
                <Text style={styles.emptyText}>No favorites yet</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.text}>{item.description}</Text>
                    <Text style={styles.meta}>{item.difficulty} | {item.faction} | {item.level}</Text>
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#1e1e1e",
        padding: 15,
        margin: 10,
        borderRadius: 10,
    },
    title: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    text: {
        color: "#ccc",
        marginTop: 5,
    },
    meta: {
        color: "#888",
        marginTop: 5,
        fontSize: 12,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 18,
        color: "#999",
    },
});
