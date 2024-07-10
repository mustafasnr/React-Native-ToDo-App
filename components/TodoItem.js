import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet,Text,Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const TodoItem = ({ item, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(item.context);

  const handleEdit = () => {
    if(newText.length>0){
      onEdit(item.id, newText);
      setIsEditing(false);
    }
  };

  return (
    <View style={styles.item}>
      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            autoFocus={true}
            style={styles.input}
            placeholder='Görev ekle'
            placeholderTextColor="#777"
            value={newText}
            onChangeText={setNewText}
          />
          <TouchableOpacity onPress={handleEdit} style={styles.iconButton}>
            <Icon name="checkmark-outline" size={32} color="green" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>{item.context}</Text>
          <View style={styles.buttons}>
            <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.iconButton}>
              <Icon name="create-outline" size={28} color="blue" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.iconButton}>
              <Icon name="trash-outline" size={28} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom:5,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  itemText: {
    flex:1,
    alignSelf: "stretch",
    alignItems: "center",
    fontSize: 18,
    color:"black",
  },
  input: {
    fontSize: 18,
    borderBottomWidth: 2,
    borderColor:"black",
    flex: 1,
    color:"black",
    marginRight: 10,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    paddingHorizontal: 5,
  },
  itemContainer:{
    flex:1,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
  },
});

export default TodoItem;
