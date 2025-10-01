import { Platform, StyleSheet, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Searchbar } from '@/components/SearchBar';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Checkbox } from 'react-native-paper';
import uuid from 'react-native-uuid'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';


const getUUID = async() => {
	try{
		let theUUID = await AsyncStorage.getItem('uuidkey');
		if (!theUUID) { theUUID = uuid.v4(); await AsyncStorage.setItem('uuidkey', theUUID) }
		console.log(theUUID)
		return theUUID;
	} catch(e) {console.error("illiterate", e)}

}

const createStyles = (colorScheme: 'light' | 'dark') => StyleSheet.create({
  switches: {
  },
  switchesview:{
    borderWidth:1,
    backgroundColor: Colors[colorScheme ?? 'light'].background, 
    color: Colors[colorScheme ?? 'light'].text,
    borderColor: Colors[colorScheme ?? 'light'].border,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 4,
    paddingBottom: 8,
    marginBottom: 5,
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  check: {
    marginBottom:15
  }
});

export default function TabTwoScreen(){
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme ?? 'light');

const [symptoms, setSymptoms] = useState({
    cough: false,
    fever: false,
    nausea: false,
    breathing: false,
    tiredness: false,
    mood: false,
    massloss: false,
    pain: false
});

useEffect(() => { sendit(); }, [symptoms]);

async function sendit(){
	const theUUID = await getUUID();

	const url = "http://192.168.0.248:8000/";
	try {
		let { status } = await Location.requestForegroundPermissionsAsync();
		let loc = await Location.getCurrentPositionAsync({});
		if (status !== 'granted') { setErrorMsg('loc perm denied'); return; }
	    const tosend = {
    	symptoms: Object.values(symptoms),
    	location: loc,
    	theUUID: theUUID
    	}
    	console.log("Sending data to server:", tosend);

		const response = await fetch( url, { method: "POST", body: JSON.stringify(tosend) } );
		if (!response.ok){
			throw new Error(`Response status: ${response.status}`);
		}
		const result = await response.json();
		console.log(result);		
	} catch (error) {
		console.error(error.message);
	}
    
}

const toggleSymptom = (symptomKey: keyof typeof symptoms) => {
    setSymptoms(prevSymptoms => ({ ...prevSymptoms, [symptomKey]: !prevSymptoms[symptomKey]
    }));
};

  return (
    <View>
      <Searchbar/>
      <ThemedText type="title" style={{ marginTop:10, marginBottom:10, marginLeft:50, marginRight:20 }}>Symptoms</ThemedText>

      <View style={styles.switchesview}>
        <ThemedText style={styles.switches}>Cough</ThemedText>
        <Checkbox
          style={styles.check}
          status={symptoms.cough ? 'checked' : 'unchecked'}
          onPress={() => toggleSymptom('cough')}
        />
      </View>
      
      <View style={styles.switchesview}>
        <ThemedText style={styles.switches}>Fever</ThemedText>
        <Checkbox
          style={styles.check}
          status={symptoms.fever ? 'checked' : 'unchecked'}
          onPress={() => toggleSymptom('fever')}
        />
      </View>

      <View style={styles.switchesview}>
        <ThemedText style={styles.switches}>Nausea</ThemedText>
        <Checkbox
          style={styles.check}
          status={symptoms.nausea ? 'checked' : 'unchecked'}
          onPress={() => toggleSymptom('nausea')}
        />
      </View>

      <View style={styles.switchesview}>
        <ThemedText style={styles.switches}>Breathing hardship</ThemedText>
        <Checkbox
          style={styles.check}
          status={symptoms.breathing ? 'checked' : 'unchecked'}
          onPress={() => toggleSymptom('breathing')}
        />
      </View>

      <View style={styles.switchesview}>
        <ThemedText style={styles.switches}>Tiredness</ThemedText>
        <Checkbox
          style={styles.check}
          status={symptoms.tiredness ? 'checked' : 'unchecked'}
          onPress={() => toggleSymptom('tiredness')}
        />
      </View>

      <View style={styles.switchesview}>
        <ThemedText style={styles.switches}>Mood instability</ThemedText>
        <Checkbox
          style={styles.check}
          status={symptoms.mood ? 'checked' : 'unchecked'}
          onPress={() => toggleSymptom('mood')}
        />
      </View>

      <View style={styles.switchesview}>
        <ThemedText style={styles.switches}>Unexplained Massloss</ThemedText>
        <Checkbox
          style={styles.check}
          status={symptoms.massloss ? 'checked' : 'unchecked'}
          onPress={() => toggleSymptom('massloss')}
        />
      </View>

      <View style={styles.switchesview}>
        <ThemedText style={styles.switches}>Chronic Pain</ThemedText>
        <Checkbox
          style={styles.check}
          status={symptoms.pain ? 'checked' : 'unchecked'}
          onPress={() => toggleSymptom('pain')}
        />
      </View>

      <View style={styles.switchesview}>
        <ThemedText style={styles.switches}>Diagnosis</ThemedText>
      </View>
    </View>
  );
}
