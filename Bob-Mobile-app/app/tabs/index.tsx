import { Image } from 'expo-image';
import { Platform,StyleSheet,View,ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Medisymbol } from '@/components/Medisymbol';
import { Searchbar } from '@/components/SearchBar';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState, useEffect } from "react";


export default function HomeScreen() {

async function getit(){
	try {
		const response = await fetch("http://192.168.0.248:8000/content");
		if (!response.ok){ throw new Error(`Response status: ${response.status}`); }
		const result = await response.json();
		console.log(result);
		return result;
	} catch (error) {console.error(error.message); return null; }
}

const [content, setContent] = useState(null);
useEffect(() => { getit().then(setContent);}, [] );

const colorScheme = useColorScheme();
const styles = StyleSheet.create({
  content: {
    backgroundColor: Colors[colorScheme ?? 'light'].background, 
    color: Colors[colorScheme ?? 'light'].text,
	borderColor:Colors[colorScheme ?? 'light'].border, 
	borderWidth:1, 
	borderRadius:20, 
	marginLeft:0, 
	marginRight: 0, 
	marginTop:0
  },
});

  return (
		<View style={{flex:1}}>
		<Searchbar/>
		<Medisymbol style={{marginLeft:30, marginTop:30, maxHeight:220}}/>
        <ThemedText type="title" style={{ marginTop:0, marginBottom:25, marginLeft:35}}>{content ? content.headingg: "waitt"}</ThemedText>
        <ScrollView style={styles.content}>
        <ThemedText type="paragraph" style={{ marginTop:10, marginBottom:10, marginLeft:35, marginRight:20 }}>{content ? content.paragraphs: "wait"}</ThemedText>
        </ScrollView>
        </View>
  );
}
