import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#292728",
    flexDirection: "row",
    borderRadius: 7,
    overflow: "hidden",
  },
  probability: {
    backgroundColor: "grey",
    padding: 12,
    color: "#FFF"
  },
  className: {
    padding: 12,
    color: "#FFF"
  },
  highlightContainer: {
    backgroundColor: '#DDF4E4',
    borderColor: '#2BA84A',
    borderWidth: 2,
    borderRadius: 8,
  },

  highlightProbability: {
    backgroundColor: 'green',
    fontWeight: 'bold',
  },

  highlightClassName: {
    color: '#2BA84A',
    fontWeight: 'bold',
  },
  results: {
    marginTop: 64,
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center"
  },

});

