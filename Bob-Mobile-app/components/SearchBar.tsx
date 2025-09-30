import React, {useRef, useState} from 'react';
import { Platform, StyleSheet, TextInput, View, TouchableOpacity} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';


export function Searchbar(props) {

const colorScheme = useColorScheme();
const [text, onChangeText] = React.useState('');
const search = useRef(null);

const styles = StyleSheet.create({
  topbar: {
    backgroundColor: Colors[colorScheme ?? 'light'].background, 
    color: Colors[colorScheme ?? 'light'].text,
    borderColor: Colors[colorScheme ?? 'light'].border,
    height: 60, 
    borderBottomWidth:1, 
    paddingTop:10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  txtinput:{
    backgroundColor: '#00000000',
    color: Colors[colorScheme ?? 'light'].text,
    flex: 1,
    fontSize: 16,
    marginLeft: 20,
    paddingTop: 15
  }
});

return(
<View style={styles.topbar}>
        <TextInput
          onChangeText={onChangeText}
          ref={search}
          value={text}
          style={styles.txtinput}
        />
        <FontAwesome6 name="magnifying-glass" size={24} color={Colors[colorScheme ?? 'light'].text} style={{marginRight:15, marginTop:15}} />
</View>
);
}
