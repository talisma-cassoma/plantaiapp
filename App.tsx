import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import { Button } from './components/button';
import * as imagePicker from 'expo-image-picker';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';
import { Classification, ClassificationProps } from './components/Classification';

export default function App() {
  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ClassificationProps[]>([])

  const handleSelectedImage = async () => {
    //console.log('Iniciando seleção de imagem...');
    setIsLoading(true);

    try {
      const result = await imagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      //console.log('Resultado da seleção:', result);

      if (!result.canceled) {
        const { uri } = result.assets[0];
        console.log('URI da imagem selecionada:', uri);
        setSelectedImageUri(uri);
        await imageClassification(uri);
      } else {
        console.log('Usuário cancelou a seleção de imagem.');
      }
    } catch (error) {
      console.log('Erro ao selecionar imagem:', error);
    } finally {
      setIsLoading(false);
      console.log('Seleção de imagem finalizada.');
    }
  };

  const imageClassification = async (imageUri: string) => {
    setResults([])
    console.log('Iniciando classificação da imagem...');
    await tf.ready();
    console.log('tf.js carregado.');

    try {
      const model = await mobilenet.load();
      //console.log('Modelo MobileNet carregado:', model);

      const tensor = await createImageTensor(imageUri);
      console.log('Forma do tensor:', tensor.shape);
      console.log('DType do tensor:', tensor.dtype);

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
    const unit8 = new Uint8Array(imgBuffer);
    return decodeJpeg(unit8);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      <Image source={{ uri: selectedImageUri ? selectedImageUri : './teste.jpeg' }}
        style={styles.image}
      />

      <View style={styles.results}>
        {
          results.map(result => (<Classification key={result.className} data={result} /> ))
        }
      </View>

      {isLoading ? (
        <ActivityIndicator color="#5F1BBF" />
      ) : (
        <Button title="Select an image, please" onPress={handleSelectedImage} />
      )}
    </View>
  );
}
