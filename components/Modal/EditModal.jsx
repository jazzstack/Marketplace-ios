import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";

const EditModal = ({
  modalVisible,
  setModalVisible,
  onChangeText,
  item,
  setitem,
  onsubmit
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Description</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter something..."
            value={item.desc}
            onChangeText={(e) =>
              setitem((prev) => ({
                ...prev,
                desc: e,
              }))
            }
          />
          <Text style={styles.modalTitle}>Name</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter something..."
            value={item.name}
            onChangeText={(e) =>
              setitem((prev) => ({
                ...prev,
                name: e,
              }))
            }
          />
          <Text style={styles.modalTitle}>Price</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter something..."
            value={item.price}
            onChangeText={(e) =>
              setitem((prev) => ({
                ...prev,
                price: e,
              }))
            }
            keyboardType="number-pad"
          />
          <TouchableOpacity
            style={styles.buttonClose}
            onPress={() =>onsubmit()}
          >
            <Text style={styles.textStyle}>Save Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonClose, { backgroundColor: "red" }]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.textStyle}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EditModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "600",
  },
  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  buttonClose: {
    backgroundColor: "green",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: "20",
  },
  textStyle: {
    color: "white",
    fontWeight: "600",
  },
});
