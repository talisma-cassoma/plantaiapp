import { StyleSheet, Dimensions } from "react-native"; 

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    // container: {
    //   flex: 1,
    //   backgroundColor: '#171717',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    //   padding: 32
    // },
    // image: {
    //   width: 250,
    //   height: 250,
    //   borderRadius: 7,
    // },
    // results:{
    //   marginTop:64,
    //   flex: 1,
    //   flexDirection: "row",
    //   flexWrap:"wrap",
    //   gap:16,
    //   justifyContent:"center"
    // }

    

    container: {
      flex: 1,
      position: 'relative',
    },
    imageContainer: {
      flexDirection: 'row',
      flex: 1,
    },
    leftImage: {
      width: width / 2,
      height: '100%',
    },
    rightImage: {
      width: width / 2,
      height: '100%',
    },

    image: {
      width: 250,
      height: 250,
      borderRadius: 7,
      alignSelf: 'center',
      marginTop: 32,
    },
    results:{
      marginTop:64,
      flex: 1,
      flexDirection: "row",
      flexWrap:"wrap",
      gap:16,
      justifyContent:"center"
    },

    scanButtonContainer: {
      position: 'absolute',
      bottom: 80,
      left: 0, 
      right: 0, 
      justifyContent: 'center',
      alignItems: 'center',
    },
    scanButton: {
      position: 'absolute',
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    bottomMenu: {
      flexDirection: 'column',
      alignItems: 'center',
      height: 'auto',
      padding:0,
      margin: 0,
      width: '100%',
    },
    menuComponent:{
      backgroundColor: '#CBE4B4',
      flexDirection:'row',
      justifyContent:'space-between',
      paddingHorizontal: 30,
      paddingVertical: 5,
      width: '100%',
      height: 70
    },
    menuItem: {
      alignItems: 'center',
      flex: 1,
    },
    menuCenterItem: {
      alignItems: 'center',
      flex: 2,
    },
    menuText: {
      fontSize: 12,
      marginBottom: 4,
      color: '#7d7d7d',
    },
    menuCenterText: {
      fontSize: 14,
      color: '#333',
      fontWeight: 'bold',
      marginBottom: 4,
      textAlign: 'center',
    },
  });
  