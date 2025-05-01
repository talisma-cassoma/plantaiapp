import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';

import * as imagePicker from 'expo-image-picker';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';

import { Classification, ClassificationProps } from './components/classification';

import Svg, { Circle } from 'react-native-svg';
import TopBarMmenu from './assets/top-bar-menu.svg';
import { House, ListMagnifyingGlass, ChatsCircle } from 'phosphor-react-native';

import { styles } from './styles';

export default function App() {

  const classNames = ["face", "pencil"];

  const modelJSON = require('./assets/models/model.json');
  const modelWeights = require('./assets/models/model.weights.bin');


  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ClassificationProps[]>([]);

  const handleSelectedImage = async () => {
    setIsLoading(true);
    try {
      const result = await imagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
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
      const model = await tf
        .loadLayersModel(bundleResourceIO(modelJSON, modelWeights))
        .catch((e) => {
          console.log('[LOADING ERROR] infosssss:', e);
        });

      if (!model) return;

      const tensor = await createImageTensor(imageUri);
      // Cast para any porque model.classify é do MobileNet, não tf.Model
      const prediction = await (model as any).predict(tensor);
      const data = await prediction.array(); // data = [[0.1, 0.9]]
      const mappedResults = data[0].map((prob: number, i: number) => ({
        className: classNames[i],
        probability: prob,
      }));
      setResults(mappedResults);
      console.log('Resultados interpretados:', mappedResults);


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

    // Decodificar a imagem
    const tensor = decodeJpeg(uint8);

    // Redimensionar a imagem para o tamanho esperado pelo modelo (por exemplo, 224x224 para MobileNet)
    const resizedTensor = tf.image.resizeBilinear(tensor, [224, 224]);

    // Normalizar os valores para [0, 1] (se necessário para o seu modelo)
    const normalizedTensor = resizedTensor.div(tf.scalar(255));

    // Adicionar uma dimensão extra para o batch size (passar para [1, 224, 224, 3])
    const batchedTensor = normalizedTensor.expandDims(0);

    return batchedTensor;
  };


  return (
    <View style={styles.container}>
      {/* Imagem Selecionada */}
      {selectedImageUri ? (
        <Image source={{ uri: selectedImageUri }} style={styles.image} resizeMode="cover" />
      ) : null}

      {/* Resultados */}
      <View style={styles.results}>
        {results.map((result) => (
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
            <House size={32} color="#CBE4B4" />
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
            <ChatsCircle size={32} color="#CBE4B4" />
            <Text style={styles.menuText}>Consult</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
