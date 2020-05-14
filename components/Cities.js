import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Alert, Text, Image, ScrollView } from 'react-native';
import { Input, ListItem, Button } from 'react-native-elements';
import * as SQLite from 'expo-sqlite';
import * as Speech from 'expo-speech';

const db = SQLite.openDatabase('addresses.db');

export default function Cities({navigation: { navigate }}) {
  const [address, setAddress] = useState('');
  const [list, setList] = React.useState([]);
  
  useEffect(() => {
    Speech.speak('opened saved locations')
  }, []);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists addresses (id integer primary key not null, address text);');
    });
    updateList();    
  }, []);

  // Save
  const saveItem = () => {
    if (address !== ""){
    db.transaction(tx => {
        tx.executeSql('insert into addresses (address) values (?);', [address]);    
      }, null, updateList
    )
    Speech.speak(address + " saved") 
    }
  }

  // Update
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from addresses;', [], (_, { rows }) =>
        setList(rows._array)
      ); 
    });
  }

  // Delete
  const deleteItem = (id, address) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from addresses where id = ?;`, [id]);
      }, null, updateList
    )
    Speech.speak(address + " deleted") 
  }

  keyExtractor = (item) => item.id.toString()

  renderItem = ({ item }) => (
    <ListItem
    title={item.address}
    badge={{value: 'delete', onPress: () => deleteItem(item.id, item.address), onLongPress: ()=>onSpeak('delete '+item.address), status:"error" }}
    onLongPress={()=>onSpeak(item.address)}
    onPress={()=>{navigate('Weather', {address: item.address})}}
    bottomDivider
    chevron
    />
  )

  const onSpeak = (text) => {
    Speech.speak(text,{
      language: 'en',
      pitch: 1,
      rate:1
    })
  }


  return (
    <ScrollView style={styles.scrollContainer}>
        <Input placeholder='City' label='CITY'
        onChangeText={text => setAddress(text)}
        value={address}
        />
        <Button onPress={saveItem} onLongPress={()=>onSpeak('save')}  buttonStyle={{backgroundColor: '#00bfff'}} title="SAVE"></Button>
        <View>
      <FlatList
        keyExtractor={keyExtractor}
        data={list}
        renderItem={renderItem}
      />
      </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft:10,
    paddingRight:10
  },
  scrollContainer: {
    backgroundColor: 'transparent',
  },
});
