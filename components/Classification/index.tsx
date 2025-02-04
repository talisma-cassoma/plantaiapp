import { Text, View } from "react-native";
import { styles } from "./style";

export type ClassificationProps={
probability: number;
className: string
}

type Props= {
    data: ClassificationProps
}

 export function Classification({data}: Props){
    return(
        <View style={styles.container}>
             <Text style={styles.probability}>
                {data.probability.toFixed(4)}
             </Text>
             <Text style={styles.className}>
                {data.className}
             </Text>
        </View>
    )
 }