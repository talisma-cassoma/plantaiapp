// import { StatusBar } from 'expo-status-bar';
// import { useState } from 'react';
// import { View, Image, ActivityIndicator } from 'react-native';
// import { styles } from './styles';
// import { Button } from './components/button';
// import * as imagePicker from 'expo-image-picker';
// import * as tf from '@tensorflow/tfjs';
// import * as mobilenet from '@tensorflow-models/mobilenet';
// import { decodeJpeg } from '@tensorflow/tfjs-react-native';
// import * as FileSystem from 'expo-file-system';
// import { Classification, ClassificationProps } from './components/classification';

// export default function App() {
//   const [selectedImageUri, setSelectedImageUri] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [results, setResults] = useState<ClassificationProps[]>([])

//   const handleSelectedImage = async () => {
//     //console.log('Iniciando seleção de imagem...');
//     setIsLoading(true);

//     try {
//       const result = await imagePicker.launchImageLibraryAsync({
//         mediaTypes: ['images'],
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });

//       //console.log('Resultado da seleção:', result);

//       if (!result.canceled) {
//         const { uri } = result.assets[0];
//         //console.log('URI da imagem selecionada:', uri);
//         setSelectedImageUri(uri);
//         await imageClassification(uri);
//       } else {
//         console.log('Usuário cancelou a seleção de imagem.');
//       }
//     } catch (error) {
//       console.log('Erro ao selecionar imagem:', error);
//     } finally {
//       setIsLoading(false);
//       console.log('Seleção de imagem finalizada.');
//     }
//   };

//   const imageClassification = async (imageUri: string) => {
//     setResults([])
//     console.log('Iniciando classificação da imagem...');
//     await tf.ready();
//     console.log('tf.js carregado.');

//     try {
//       const model = await mobilenet.load();
//       //console.log('Modelo MobileNet carregado:', model);

//       const tensor = await createImageTensor(imageUri);
//       //console.log('Forma do tensor:', tensor.shape);
//       //console.log('DType do tensor:', tensor.dtype);

//       const classificationResult = await model.classify(tensor);
//       setResults(classificationResult);
//     } catch (error) {
//       console.log('Erro na classificação da imagem:', error);
//     }
//   };

//   const createImageTensor = async (imageUri: string) => {
//     const imgB64 = await FileSystem.readAsStringAsync(imageUri, {
//       encoding: FileSystem.EncodingType.Base64,
//     });
//     const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
//     const unit8 = new Uint8Array(imgBuffer);
//     return decodeJpeg(unit8);
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar style="light" backgroundColor="transparent" translucent />
//       <Image source={{ uri: selectedImageUri ? selectedImageUri : './teste.jpeg' }}
//         style={styles.image}
//       />

//       <View style={styles.results}>
//         {
//           results.map(result => (<Classification key={result.className} data={result} /> ))
//         }
//       </View>

//       {isLoading ? (
//         <ActivityIndicator color="#5F1BBF" />
//       ) : (
//         <Button title="Select an image, please" onPress={handleSelectedImage} />
//       )}
//     </View>
//   );
// }


import React from 'react';
import { styles } from './styles';
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { House, ListMagnifyingGlass, ChatsCircle } from 'phosphor-react-native';
import Svg, { Circle, SvgUri } from 'react-native-svg';
import plantNormal from './assets/plant-normal.jpg';
import TopBarMmenu from './assets/top-bar-menu.svg';

const { width } = Dimensions.get('window');

console.log('Largura da tela:', width);


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* <ImageBackground source={TopBarMmenu} resizeMode="cover"></ImageBackground> */}

      {/* Área de Imagem Dividida */}
      <View style={styles.imageContainer}>
        {/* <Image
          source={plantNormal}
          style={styles.leftImage}
          resizeMode="cover"
        />
        <Image
          source={plantNormal}
          style={styles.rightImage}
          resizeMode="cover"
        /> */}
      </View>

      {/* Botão de Escaneamento */}
      <View style={styles.scanButtonContainer}>
        <Svg height="80" width="80">
          <Circle cx="40" cy="40" r="40" fill="#CBE4B4" />
        </Svg>
        <TouchableOpacity style={styles.scanButton}>
          <ListMagnifyingGlass size={32} color="#333" weight="bold" />
        </TouchableOpacity>
      </View>

      {/* Menu Inferior */}
      <View style={styles.bottomMenu}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: 36 }}>
          <View style={{
            flex: 1,
            borderTopLeftRadius: 50,
            height: 36,
            backgroundColor: '#CBE4B4',
          }} ></View>
          <TopBarMmenu style={{ width: 131, height: 35, alignSelf: 'center' }} />
          <View style={{
            flex: 1,
            borderTopRightRadius: 50,
            height: 36,
            backgroundColor: '#CBE4B4',
          }}></View>
        </View>

        <View style={styles.menuComponent}>
          <TouchableOpacity style={styles.menuItem}>
            <House size={28} color="#7d7d7d" />
            <Text style={styles.menuText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCenterItem}>
            <Text style={styles.menuCenterText}>click to scan</Text>
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
