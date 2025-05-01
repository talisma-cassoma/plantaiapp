const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Configurações para lidar com arquivos SVG
config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");

// Ajuste para arquivos binários
config.resolver.assetExts.push("bin");

// Atualizando as extensões de asset e source
const assetExts = config.resolver.assetExts.filter(ext => ext !== "svg");
const sourceExts = [...config.resolver.sourceExts, "svg"];

config.resolver.assetExts = assetExts;
config.resolver.sourceExts = sourceExts;

module.exports = config;
