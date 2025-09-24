import { useEffect, useState } from "react";
import { View, Text, Button, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

export default function Account({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [token, setToken] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function init() {
      try {
        const token = await SecureStore.getItemAsync("jwt"); // added await
        setToken(token);
        const res = await axios.get("http://10.225.197.90:5000/blog/MyPosts", {
          headers: { authorization: `${token}` },
        });
        setItems(res.data.result);
        console.log("All good!");
      } catch (e) {
        console.log(e);
        setError("Server error!");
      }
    }
    init();
  }, []);

  const LogOut = async () => {
    await SecureStore.deleteItemAsync("jwt");
    navigation.navigate("LogIn");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Account</Text>
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text> 
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Home")}>
            <Text style={styles.menuItemText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Account")}>
            <Text style={styles.menuItemText}>Account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={LogOut}>
            <Text style={[styles.menuItemText, { color: "red" }]}>Log Out</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.error}>{error}</Text>

        <FlatList
          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.postCard}>
              <Text style={styles.postUser}>{item.username}</Text>
              <Text style={styles.postContent}>{item.content}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  menuButton: {
    padding: 10,
  },
  menuIcon: {
    fontSize: 26,
  },
  dropdownMenu: {
    position: "absolute",
    top: 70,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    width: 180,
    zIndex: 10,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuItemText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  postCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  postUser: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  postContent: {
    fontSize: 14,
    color: "#333",
  },
});
