import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, FlatList } from 'react-native';
import { Text, Image, Header, Tooltip, ListItem, Avatar} from 'react-native-elements';
import * as Speech from 'expo-speech';

export default function Weather({ route }) {
  const {address} = route.params;
  const [temp, setTemp] = useState(0);
  const [tempA, setTempA] = useState(0);
  const [icon, setIcon] = useState("");
  const [country, setCountry] = useState("");
  const [wind, setWind] = useState(0);
  const [desc, setDesc] = useState("");
  const [clouds, setClouds] = useState(0);
  const [dt, setDt] = useState(0);
  const [timezone, setTimezone] = useState(0);
  const [list, setList] = useState([]);

  const myDate = new Date((dt + timezone )* 1000 );
  const currentDate = myDate.toGMTString().split('GMT');

  useEffect(() => {
    getOpenWeather();
    getWeeksWeather();
    Speech.speak('opened ' + address)
  }, []);

  //current weather
  const getOpenWeather =() => {
    const url = 'http://api.openweathermap.org/data/2.5/weather?q=' + address + '&APPID=6cb8eaa6807d559df0b8a3f0623046e3';
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => { 
      setTemp(responseJson.main.temp);
      setTempA(responseJson.main.feels_like);
      setIcon(responseJson.weather[0].icon);
      setDesc(responseJson.weather[0].description);
      setWind(responseJson.wind.speed);
      setClouds(responseJson.clouds.all);
      setCountry(responseJson.sys.country);
      setDt(responseJson.dt);
      setTimezone(responseJson.timezone);
    })
    .catch((error) => { 
      Alert.alert('Error' , error); 
    });
  }
  
  //5 day 3h forecast
  const getWeeksWeather =() => {
    const url = 'http://api.openweathermap.org/data/2.5/forecast?q='+ address +'&appid=6cb8eaa6807d559df0b8a3f0623046e3';
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => { 
      setList(responseJson.list);
    })
    .catch((error) => { 
      Alert.alert('Error' , error); 
    });
  }

  renderItem = ({ item }) => (
    <ListItem
      title={new Date((item.dt +timezone) * 1000).toGMTString().split('2020 ')[0] + new Date((item.dt + timezone) * 1000).toGMTString().split('2020 ')[1].split(':00 G')[0]}
      rightTitle={(parseInt(item.main.temp) -273.15).toFixed(0) + '°C'}
      titleStyle={{color: '#fff'}}
      rightAvatar={<Avatar
        size='small'
        overlayContainerStyle={{backgroundColor: '#00bfff'}}
        source={{uri: 'http://openweathermap.org/img/wn/'+ item.weather[0].icon +'@2x.png'}}
      />}
      rightTitleStyle={{color: '#fff'}}
      containerStyle={{
        backgroundColor: '#00bfff',
      }}
      />
    )

  const readDesc = () => {
    var text1 = address + ',' + desc;
    var text2 = 'Temperature,' + (parseInt(temp) -273.15).toFixed(0) + '°C';
    var text3 = 'Feels like,' + (parseInt(tempA) -273.15).toFixed(0) + '°C';
    var text4 = 'Wind speed,' + parseInt(wind).toFixed(1) + 'meters per second';
    var text5 = 'Clouds,' + clouds + '%';
    Speech.speak(
      text1 + ', '+
      text2 + ', '+
      text3 + ', '+
      text4 + ', '+
      text5 + ', '
      )
  }
  
  return (
    <ScrollView>
    <View style={{backgroundColor: '#00bfff'}}>
    <View style={styles.container}>
      <Header 
      containerStyle={{
        backgroundColor: '#00bfff',
        height: 40, 
        justifyContent: 'space-around'
      }}
      centerComponent={{ text: address + ', ' + country , style: { color: '#fff', height: 40, fontSize: 20 }}}
      />
      <Text style={{color: '#fff',}}>Updated: {currentDate}</Text>
      <Tooltip onOpen={readDesc} onClose={Speech.stop} withPointer={false} popover={<Text>Reading description</Text>}>
      <View style={styles.text}>
        <Image style={{width:140, height: 140}} source={{uri: 'http://openweathermap.org/img/wn/'+ icon +'@2x.png'}}/>
          <Text style={{color: '#fff'}}>{desc.toUpperCase()}</Text>
          <Text style={styles.text}>Temperature {(parseInt(temp) -273.15).toFixed(1)} °C</Text>
          <Text style={styles.text}>Feels like {(parseInt(tempA) -273.15).toFixed(1)} °C</Text>
          <Text style={styles.text}>Wind speed {parseInt(wind).toFixed(1)} m/s</Text>
          <Text style={styles.text}>Clouds {parseInt(clouds).toFixed(0)}%</Text>
        </View>
      </Tooltip>
    </View>
        <View style={{ marginTop: 15 }}>
          <Text style={{color: '#fff', paddingLeft: 20}}>5 Day Forecast every 3 hours:</Text>
      <FlatList
      style={{paddingLeft: 20, paddingRight: 20, fontSize: 15}}
      keyExtractor={item => item}  
      renderItem={renderItem}
      data={list}
      />
      </View>
      </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00bfff',
    alignItems: 'center'
  },
  text: {
    color: '#fff',
    alignItems: 'center',
    fontSize: 17,
    padding: 10
  }
});
