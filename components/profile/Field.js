import { Feather, MaterialIcons } from '@expo/vector-icons';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { colors } from '../../colors';

import { useAsync } from '../../hooks/use-async';
import { useHttp } from '../../hooks/use-http';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../store/user-slice';


const data = [
    { labels: "First Name", value: "firstname" },
    { labels: "Last Name", value: "lastname" },
    { labels: "Email", value: "email" },
    { labels: "Phone Number", value: "phone" },
    { labels: "Designation", value: "designation" },
    { labels: "Organisation", value: "organization" }
]

const Fields = ({ label, DataType, iseditAble, value }) => {
    const catchAsync = useAsync()
    const dispatch = useDispatch()
    const [httpRequest, isLoading] = useHttp()
    const { user } = useSelector(state => state.user)

    const [editMode, seteditMode] = useState(false);
    const [fieldvalue, setfieldValue] = useState(value);
    const [selectedDate, setSelectedDate] = useState(new Date(value));

    const inputref = useRef();

    const handleDateChange = (date) => {
        setSelectedDate(date);
    }

    const handlefocus = () => {
        seteditMode(true)
    }
    const handleBlur = () => {
        seteditMode(false)
    }
    const handleSave = catchAsync(async () => {
        inputref.current.blur();
        seteditMode(false);
        const currentField = data.find(({ labels }) => labels === label);
        if (currentField) {
            const update = { [currentField.value]: fieldvalue }
            const { user: updatedUser } = await httpRequest(`/users/${user._id}`, 'put', { update })
            dispatch(userActions.changeUser({ ...user, ...updatedUser }))
        }
    })

    const handleCancel = () => {
        inputref.current.blur();
        seteditMode(false);
        setfieldValue(value);
    }

    return (
        <View style={styles.container}>
            {fieldvalue && <Text style={[styles.labelOnTop, editMode && styles.editModeinput]}>{label}</Text>}
            <TouchableOpacity style={[styles.fields, iseditAble && editMode && styles.editModeinput, !iseditAble && styles.noneditAble]}
                onPress={!editMode ? handlefocus : handleBlur} disabled={!iseditAble || editMode ? true : false}>

                <TextInput style={styles.inputField}
                    ref={inputref}
                    placeholder={label}
                    value={DataType === "date" ? selectedDate.toLocaleDateString() : fieldvalue}
                    onChangeText={(text) => setfieldValue(text)}
                    onFocus={handlefocus}
                    keyboardType={DataType === 'number' ? 'number-pad' : 'default'}
                    onBlur={handleBlur}
                    selectionColor={DataType === "date" ? colors.primary : '#ff00ff'}
                    editable={iseditAble}>
                </TextInput>
                {DataType === 'date' && editMode && (
                    <RNDateTimePicker
                        style={styles.inputField}
                        value={selectedDate}
                        onChange={(event, date) => {
                            seteditMode(false);
                            handleDateChange(date);
                            inputref.current.blur();
                        }}
                        editable={iseditAble}
                    />
                )}


                {iseditAble && editMode && DataType != 'date' && (
                    <View style={styles.action}>
                        <TouchableOpacity style={styles.save} onPress={handleSave}>
                            <Feather name="save" size={24} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancel} onPress={handleCancel}>
                            <MaterialIcons name="cancel" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                )
                }
            </TouchableOpacity>
            {!iseditAble && (
                <Text style={styles.warning}>*This field can't be edited.</Text>
            )}
        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        position: 'relative'
    },
    labelOnTop: {
        position: 'absolute',
        left: 40,
        zIndex: 1,
        color: colors.grey,
        backgroundColor: colors.smoke,
        padding: -5,
        borderRadius: 20
    },
    fields: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50,
        borderColor: colors.grey,
        borderWidth: 2,
        marginBottom: 10,
        paddingLeft: 8,
        fontSize: 20,
        width: 'auto',
        alignItems: 'center',
        borderRadius: 10,
        zIndex: 0,
        backgroundColor: colors.primary
    },
    inputField: {
        height: 40,
        width: 'auto',
        fontSize: 20,
        paddingLeft: 10
    },
    editModeinput: {
        borderColor: colors.black,
        color: colors.black
    },
    action: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        zIndex: 2
    },
    save: {
        padding: 5,
        paddingVertical: 10
    },
    cancel: {
        padding: 5,
        paddingVertical: 10
    },
    noneditAble: {
        color: colors.grey
    },
    warning: {
        color: colors.yellow,
        paddingLeft: 10
    }


});

export default Fields;