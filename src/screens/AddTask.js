import React, { Component } from 'react'
import {
    Modal,
    View,
    Text,
    TextInput,
    DatePickerIOS, // especifico do IOS
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Alert,
    DatePickerAndroid,
    Platform
} from 'react-native'
import moment from 'moment'
import commonStyles from '../commonStyles'

export default class AddTask extends Component {

    constructor(props) {
        super(props)
        this.state = this.getInitialState()
    }

    getInitialState = () => { // para que o estado inicial seja atualizado
        return {              //  corretamente com dia atual
            desc: '',
            date: new Date()
        }
    }
    

    save = () => { //podera ser aplicado nos tasks da agenda
        if (!this.state.desc.trim()) { //Só permite inserir dados validos sem espaços (trim)
            Alert.alert('Invalid data!', 'Input a descrition for the task...')
            return //barra o resto da execução
        }

        const data = { ...this.state } //clonando o estado atual tambem
        this.props.onSave(data) // espero receber uma função no momento do onSave (botao de salvar)
       
    }

    handleDateAndroidChanged = () => { // função para verificar a plataforma 
        DatePickerAndroid.open({
            date: this.state.date
        }).then(e => {
            if (e.action !== DatePickerAndroid.dismissedAction) {
                const momentDate = moment(this.state.date) //transformar data do js para data do moment
                momentDate.date(e.day) //day serve para o dia da semana e date para mes
                momentDate.month(e.month)
                momentDate.year(e.year)
                this.setState({ date: momentDate.toDate() })
            }
        })
    }

    render() { // renderizando...
        let datePicker = null
        if (Platform.OS === 'ios') {
            date.Picker = <DatePickerIOS mode='date' date={this.state.date}
                onDateChange={date => this.setState({ date })} />
        } else {
            datePicker = (
                <TouchableOpacity onPress={this.handleDateAndroidChanged}>
                    <Text style={styles.date}>
                        {moment(this.state.date).format('ddd, D [] MMMM [] YYYY')}
                    </Text>
                </TouchableOpacity>
            )
        }
        return (
            <Modal onRequestClose={this.props.onCancel}
                visible={this.props.isVisible}
                animationType='slide' transparent={true}
                onShow={() => this.setState({ ...this.getInitialState() })}>
                <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    <View style={styles.offSet}></View>
                </TouchableWithoutFeedback>
                <View style={styles.container}>
                    <Text style={styles.header}>New Task</Text>
                    <TextInput placeholder="Descrition..." style={styles.input}
                        onChangeText={desc => this.setState({ desc })}
                        value={this.state.desc} />
                        {datePicker}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                    }}>
                        <TouchableOpacity onPress={this.props.onCancel}>
                            <Text style={styles.button}> Cancel </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.save}>
                            <Text style={styles.button}> Save </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    <View style={styles.offSet}></View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        justifyContent: 'space-between',
    },
    offSet: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    button: {
        margin: 20,
        marginRight: 30,
        color: commonStyles.colors.default,
    },
    header: {
        fontFamily: commonStyles.fontFamily,
        backgroundColor: commonStyles.colors.default,
        color: commonStyles.colors.secondary,
        textAlign: 'center',
        padding: 15,
        fontSize: 18,
    },
    input: { // caixa de texto
        fontFamily: commonStyles.fontFamily,
        width: '90%',
        height: 40,
        marginTop: 10,
        marginLeft: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e3e3e3',
        borderRadius: 6,
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        marginLeft: 10,
        marginTop: 10,
        textAlign: 'center',
    }
})