import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';

import { ImageUriProvider, useImageUri } from './context/ImageUriContext';
import { Classification } from './components/classification';
import * as imagePicker from 'expo-image-picker';


import Svg, { Circle } from 'react-native-svg';
import TopBarMmenu from './assets/top-bar-menu.svg';
import { House, ListMagnifyingGlass, ChatsCircle } from 'phosphor-react-native';

import { styles } from './styles';
import { theme } from './globals/styles/theme';

import Segmentation from './components/segmentation';

 const AppContent = () => {

  const { selectedImageUri, setSelectedImageUri,isLoading, setIsLoading } = useImageUri();
  
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
        //await runSegmentation(uri); // Chame a função de segmentação aqui
      }
    } catch (error) {
      console.log('Erro ao selecionar imagem:', error);
    } 
  };

  return (
    <View style={styles.container}>
      {/* Imagem Selecionada */}

      <Segmentation />

      {/* Resultados */}
      <View style={styles.results}>
        <Classification />
      </View>

      {isLoading ? (
        <ActivityIndicator color="#5F1BBF" />
      ) : (
        <>
          {/* Botão de Escaneamento */}
          <View style={styles.scanButtonContainer}>
            <Svg height="80" width="80">
              <Circle cx="40" cy="40" r="40" fill={theme.colors.green} />
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
          <View style={{ flex: 1, borderTopLeftRadius: 50, height: 36, backgroundColor: theme.colors.green }} />
          <TopBarMmenu style={{ width: 131, height: 35, alignSelf: 'center' }} />
          <View style={{ flex: 1, borderTopRightRadius: 50, height: 36, backgroundColor: theme.colors.green }} />
        </View>

        <View style={styles.menuComponent}>
          <TouchableOpacity style={styles.menuItem}>
            <House size={32} color="#7d7d7d" />
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
            <ChatsCircle size={32} color="#7d7d7d" />
            <Text style={styles.menuText}>Consult</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <ImageUriProvider>
      <AppContent />
    </ImageUriProvider>
  );
}