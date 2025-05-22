import React, { useState, useEffect, useRef } from 'react';
import { View, Image as SelectedImg } from 'react-native';
import { Canvas, Skia, Mask, ColorType, AlphaType, SkImage } from '@shopify/react-native-skia';
import { Image as SkiaImageComponent } from '@shopify/react-native-skia';

import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';

import { useImageUri } from '../../context/ImageUriContext';


import { styles } from './styles';

export default function Segmentation() {

    const { selectedImageUri: imageUri, setIsLoading } = useImageUri();
    const segmentationModelJson = require('../../assets/models/segmentation/model.json');
    const segmentationModelWeights = [
        require('../../assets/models/segmentation/group1-shard1of2.bin'),
        require('../../assets/models/segmentation/group1-shard2of2.bin'),
    ];

    const [originalImage, setOriginalImage] = useState<SkImage | null>(null);
    const [maskImage, setMaskImage] = useState<SkImage | null>(null);


    const segmentationModelRef = useRef<tf.LayersModel | null>(null);

    const loadSegmentationModel = async () => {
        if (!segmentationModelRef.current) {
             console.log('Carregando o modelo de segmentation...');
            await tf.ready();
            segmentationModelRef.current = await tf.loadLayersModel(
                bundleResourceIO(segmentationModelJson, segmentationModelWeights)
            )
        }
        return segmentationModelRef.current;
    }

    const imageSegmentation = async (imageUri: string) => {
        await tf.ready();
        const model = await loadSegmentationModel();
        const imgB64 = await FileSystem.readAsStringAsync(imageUri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
        const uint8 = new Uint8Array(imgBuffer);

        const skData = Skia.Data.fromBytes(uint8);
        const skiaImg = Skia.Image.MakeImageFromEncoded(skData);
        setOriginalImage(skiaImg);

        const tensor = decodeJpeg(uint8);
        const resized = tf.image.resizeBilinear(tensor, [224, 224]);
        const normalized = resized.div(tf.scalar(255));
        const input = normalized.expandDims(0);

        const prediction = model.predict(input) as tf.Tensor;
        const maskTensor = prediction.squeeze();
        const finalMask = maskTensor.shape.length === 3
            ? maskTensor.argMax(2)
            : maskTensor.greater(tf.scalar(0.1)).toInt();

        const maskData = (await finalMask.array()) as number[][];
        const createMaskImage = (data: number[][], width: number, height: number) => {
            const pixels = new Uint8Array(width * height * 4);
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const i = y * width + x;
                    const val = data[y][x];
                    pixels[i * 4 + 0] = 255;
                    pixels[i * 4 + 1] = 255;
                    pixels[i * 4 + 2] = 255;
                    pixels[i * 4 + 3] = val === 1 ? 255 : 0;
                }
            }
            const info = { width, height, colorType: ColorType.RGBA_8888, alphaType: AlphaType.Unpremul };
            const skMask = Skia.Data.fromBytes(pixels);
            return Skia.Image.MakeImage(info, skMask, width * 4);
        };

        const maskImg = createMaskImage(maskData, 128, 128);
        setMaskImage(maskImg);
    };

    useEffect(() => {
        const runSegmentation = async () => {
            if (imageUri) {
                await imageSegmentation(imageUri);
            }
        }
        runSegmentation();
    }, [imageUri]);

    return (
        <View style={{ alignItems: 'center', marginTop: 20 }}
        // style={styles.container}
        >
            {imageUri ? (
                <SelectedImg source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
            ) :
                <Canvas style={{ width: 300, height: 300 }}>
                    <Mask
                        mask={<SkiaImageComponent image={maskImage} x={0} y={0} width={300} height={300} />}
                        mode="alpha"
                    >
                        <SkiaImageComponent image={originalImage} x={0} y={0} width={300} height={300} />
                    </Mask>
                </Canvas>
            }
        </View>


    );
}