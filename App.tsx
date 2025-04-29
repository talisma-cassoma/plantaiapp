import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { styles } from './styles';
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';

import { Button } from './components/button';
import * as imagePicker from 'expo-image-picker';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';
import { Classification, ClassificationProps } from './components/classification';

import React from 'react';
import { House, ListMagnifyingGlass, ChatsCircle } from 'phosphor-react-native';
import Svg, { Circle, SvgUri } from 'react-native-svg';
import plantNormal from './assets/plant-normal.jpg';
import TopBarMmenu from './assets/top-bar-menu.svg';

export default function App() {
  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ClassificationProps[]>([]);

  const handleSelectedImage = async () => {
    setIsLoading(true);
    try {
      const result = await imagePicker.launchImageLibraryAsync({
        mediaTypes: imagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const { uri } = result.assets[0];
        setSelectedImageUri(uri);
        await imageClassification(uri);
      }
    } catch (error) {
      console.log('Erro ao selecionar imagem:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const imageClassification = async (imageUri: string) => {
    setResults([]);
    await tf.ready();
    try {
      const model = await mobilenet.load();
      const tensor = await createImageTensor(imageUri);
      const classificationResult = await model.classify(tensor);
      setResults(classificationResult);
    } catch (error) {
      console.log('Erro na classificação da imagem:', error);
    }
  };

  const createImageTensor = async (imageUri: string) => {
    const imgB64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
    const uint8 = new Uint8Array(imgBuffer);
    return decodeJpeg(uint8);
  };

  return (
    <View style={styles.container}>
      {/* Imagem Selecionada */}
      {selectedImageUri ? (
        <Image source={{ uri: selectedImageUri }} style={styles.image} resizeMode="cover" />
      ) : null}

      {/* Resultados */}
      <View style={styles.results}>
        {results.map(result => (
          <Classification key={result.className} data={result} />
        ))}
      </View>

      {isLoading ? (
        <ActivityIndicator color="#5F1BBF" />
      ) : (
        <>
          {/* Botão de Escaneamento */}
          <View style={styles.scanButtonContainer}>
            <Svg height="80" width="80">
              <Circle cx="40" cy="40" r="40" fill="#CBE4B4" />
            </Svg>
            <TouchableOpacity style={styles.scanButton} onPress={handleSelectedImage}>
              <ListMagnifyingGlass size={32} color="#333" weight="bold" />
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Menu Inferior */}
      <View style={styles.bottomMenu}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: 36 }}>
          <View style={{ flex: 1, borderTopLeftRadius: 50, height: 36, backgroundColor: '#CBE4B4' }} />
          <TopBarMmenu style={{ width: 131, height: 35, alignSelf: 'center' }} />
          <View style={{ flex: 1, borderTopRightRadius: 50, height: 36, backgroundColor: '#CBE4B4' }} />
        </View>

        <View style={styles.menuComponent}>
          <TouchableOpacity style={styles.menuItem}>
            <House size={28} color="#7d7d7d" />
            <Text style={styles.menuText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCenterItem} onPress={handleSelectedImage}>
            {isLoading ? (
              <Text style={styles.menuCenterText}>analysing ...</Text>
            ) : (
              <Text style={styles.menuCenterText}>click to scan</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <ChatsCircle size={28} color="#7d7d7d" />
            <Text style={styles.menuText}>Consult</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}