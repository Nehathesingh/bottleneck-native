import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Feather } from "@expo/vector-icons"
import { colors } from "../../colors"

import Tag from "./Tag"

const Tile = ({ name, difficulty }) => {
    return (<View style={styles.tile}>
        <View style={styles.line}>
            <Tag label={difficulty} />
        </View>
        <Text style={styles.name}>{name}</Text>
        <View style={{ ...styles.line, ...styles.linkBox }}>
            <TouchableOpacity style={styles.link}>
                <Feather name="external-link" size={15} color={colors.primary} />
            </TouchableOpacity>
        </View>
    </View>)
}

const styles = StyleSheet.create({
    tile: {
        width: '50%',
        height: 200,
        backgroundColor: colors.blue,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderLeftWidth: 0.7,
        borderRightWidth: 0.7,
        borderColor: colors.navy,
        justifyContent: 'space-between'
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
        paddingVertical: 10
    },
    line: {
        flexDirection: 'row',
        width: '100%'
    },
    link: {
        borderWidth: 0.5,
        borderRadius: 50,
        borderColor: colors.navy,
        padding: 5,
        backgroundColor: colors.navy
    },
    linkBox: {
        justifyContent: 'flex-end'
    }
})

export default Tile