import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import TodoItem from "../components/TodoItem";
import firestore from '@react-native-firebase/firestore';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = [];
        const query = await firestore().collection("DATA").doc("TODOS").collection("LIST").get();
        query.forEach(doc => {
          list.push({ id: doc.id, context: doc.data().context });
        });
        setTodos(list);
      } catch (error) {
        console.error('Error fetching todos: ', error);
      }
    };

    fetchData();
  }, []);

  const getLastId = () => {
    if(todos.length>0){
      const last = todos[todos.length - 1];
      const splitted = last.id.split("_");
      return parseInt(splitted[splitted.length - 1]);
    }
    else{
      return 0
    }
  };

  useEffect(() => {
    console.log('Liste Güncellendi:', todos);
  }, [todos]);

  const addTodo = async () => {
    if (text.length > 0) {
      try {
        const new_index = getLastId() + 1;
        const docRef = firestore().collection('DATA').doc('TODOS').collection('LIST').doc(`todo_${new_index}`);
        const addingTodo = { context: text };
        await docRef.set(addingTodo);
        setTodos([...todos, { id: `todo_${new_index}`, context: text }]);
        setText('');
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteTodo = async (id) => {
    try {
      const docRef = firestore().collection('DATA').doc('TODOS').collection('LIST').doc(id);
      await docRef.delete();
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const editTodo = async (id, newContext) => {
    try {
      const docRef = firestore().collection('DATA').doc('TODOS').collection('LIST').doc(id);
      await docRef.set({ context: newContext });
      setTodos(todos.map(todo => (todo.id === id ? { ...todo, context: newContext } : todo)));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      <TextInput
        style={styles.input}
        placeholder="Yeni görev ekle"
        placeholderTextColor="#777"
        onChangeText={setText}
        value={text}
      />
      <TouchableOpacity style={styles.button} onPress={addTodo}>
        <Text style={styles.buttonText}>Ekle</Text>
      </TouchableOpacity>
      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <TodoItem item={item} onDelete={deleteTodo} onEdit={editTodo} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor:"white"
  },
  title: {
    color:"#000",
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  button:{
    backgroundColor:"#007bff",
    borderRadius:10,
    height:48,
    justifyContent:"center",
    alignItems:"center",
    marginBottom:10,
  },
  buttonText:{
    color:"white",
    fontSize:24,
  },
  input: {
    height: 50,
    marginBottom: 10,
    paddingLeft:10,
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 12,
    justifyContent:"center",
    fontSize:20,
    color:"black",
  },
});
