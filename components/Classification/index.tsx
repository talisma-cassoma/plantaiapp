import { Text, View } from "react-native";
import { styles } from "./style";

import React, { useEffect, useState, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';

import { useImageUri } from '../../context/ImageUriContext';

export type ClassificationProps = {
  probability: number;
  className: string;
  isTopResult?: boolean;
};

export function Classification() {
  const { selectedImageUri, setIsLoading } = useImageUri();

  const classificationlabelsFile = require('../../assets/models/classification/labels.json');
  const classificationClassNames = classificationlabelsFile.labels;

  const classificationModelJSON = require('../../assets/models/classification/model.json');
  const classificationModelWeights = require('../../assets/models/classification/model.weights.bin');

  const [results, setResults] = useState<ClassificationProps[]>([]);

  const classificationModelRef = useRef<tf.LayersModel | null>(null);

  const loadClassicationModel = async () => {
    if (!classificationModelRef.current) {
      console.log('Carregando o modelo de classificação...');
      await tf.ready();
      classificationModelRef.current = await tf.loadLayersModel(
        bundleResourceIO(classificationModelJSON, classificationModelWeights)
      );
    }
    return classificationModelRef.current;
  }
  const imageClassification = async (imageUri: string | null) => {
    if (!imageUri) return;
    setResults([]);
    await tf.ready();

    try {
      const model = await loadClassicationModel()

      const startPreprocess = global.performance.now();
      const tensor = await createImageTensor(imageUri);
      const endPreprocess = global.performance.now();
      console.log(`Tempo de pré-processamento: ${Math.round(endPreprocess - startPreprocess)} ms o equivalente a ${Math.round((endPreprocess - startPreprocess)/1000)} segundos`);

      if (!tensor) return;

      const startInference = global.performance.now();
      const prediction = await (model as any).predict(tensor);
      const data = await prediction.array();
      const endInference = global.performance.now();
      console.log(`Tempo de inferência: ${Math.round(endInference - startInference)} ms o equivalente a ${Math.round((endInference - startInference)/1000)} segundos`);

      const probs = data[0];

      const topClassIndex = tf.argMax(prediction, 1).dataSync()[0];
      const mappedResults = probs.map((prob: number, i: number) => ({
        className: classificationClassNames[i],
        probability: prob,
        isTopResult: i === topClassIndex,
      }));

      setResults(mappedResults);

    } catch (error) {
      console.log('Erro na classificação da imagem:', error);
    }
  };

  const createImageTensor = async (imageUri: string | null)/*: Promise<tf.Tensor4D | null> */ => {
    if (!imageUri) {
      console.error('URI da imagem é nulo.');
      return null;
    }

    try {
      const imgB64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
      const uint8 = new Uint8Array(imgBuffer);

      const tensor = decodeJpeg(uint8);
      const resizedTensor = tf.image.resizeBilinear(tensor, [224, 224]);
      const normalizedTensor = resizedTensor.div(tf.scalar(255));
      const batchedTensor = normalizedTensor.expandDims(0) /*as tf.Tensor4D*/;

      return batchedTensor;
    } catch (error) {
      console.error('Erro ao criar o tensor da imagem:', error);
      return null;
    }
  };

  //useEffect no corpo principal do componente
  useEffect(() => {
    const runClassification = async () => {
      if (selectedImageUri) {
        await imageClassification(selectedImageUri);
        setIsLoading(false);
      }
    };
    
    runClassification();
  }, [selectedImageUri]);


  return (
    <View style={styles.results}>
      {results.map((result) => (
        <View key={result.className} style={[styles.container, result.isTopResult && styles.highlightContainer]}>
          <Text style={[styles.probability, result.isTopResult && styles.highlightProbability]}>
            {result.probability.toFixed(3)}
          </Text>
          <Text style={[styles.className, result.isTopResult && styles.highlightClassName]}>
            {result.className}
          </Text>
        </View>
      ))}
    </View>
  );
}
