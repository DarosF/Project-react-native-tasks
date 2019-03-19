//Login Screen
import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    Alert,
    AsyncStorage
} from 'react-native'
import axios from 'axios'
import { server, showError } from '../common'
import AuthInput from '../components/AuthInput'
import commonStyles from '../commonStyles'
import backgroundImage from '../../assets/imgs/login.jpg'

export default class Auth extends Component { //tela serve tanto para cadastro do usuario quanto para o login do usuario
    state = {
        stageNew: false,
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    }

signin = async () => {
        try {
            const res = await axios.post(`${server}/signin`, {
                email: this.state.email,
                password: this.state.password
            })
            axios.defaults.headers.common['Authorization'] //qualquer requisição feita com o axios esse cabeçalho será passado junto com a requisição!
                = `bearer ${res.data.token}` //é o token recebido
                AsyncStorage.setItem('userData', JSON.stringify(res.data))//armazena as informacoes do ususario para uma secao
                this.props.navigation.navigate('Home', res.data) //Home é a tela principal chamada no navigator
        } catch (err) {
            Alert.alert('Login Failed!', 'E-mail or password incorrect!')
        }
    }

signup = async () => {
    try {
        await axios.post(`${server}/signup`, {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword
        })
        Alert.alert('Sucess! Registered user!')
        this.setState({ stageNew: false })
    } catch (err) {
        showError(err) //definido no common.js
    }
}

signinOrSignup = () => { //método await deve ser sempre async ()
    if (this.state.stageNew) { //stageNew = true (quero cadastrar usuario)
        this.signup()
    } else {
        this.signin()
    }
}

    render() {

        const validations = [] //array de validações da tela de login e cadastro
            validations.push(this.state.email && this.state.email.includes('@'))
            validations.push(this.state.password && this.state.password.length >= 6)
            
        if(this.state.stageNew) {
            validations.push(this.state.name && this.state.name.trim())
            validations.push(this.state.confirmPassword)
            validations.push(this.state.password === this.state.confirmPassword)//garante que as senhas estejam iguais
        }

        const validForm = validations.reduce(( all, v ) => all && v)

        return (
            <ImageBackground source={backgroundImage}
                style={styles.background}>
                <Text style={styles.title}>Tasks</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.subtitle}>
                        {this.state.stageNew ? 'Create your account' : 'Insert your informations'}
                    </Text>
                    {this.state.stageNew &&
                        <AuthInput icon='user' placeholder='Name' style={styles.input} // se a primeira parte do && for falsa nem analisa a segunda parte
                            value={this.state.name} // isso seria uma tecnica de renderização condicional ou seja se for false nem renderiza na tela a informação seguinte....
                            onChangeText={name => this.setState({ name })} />}
                    <AuthInput icon='at' placeholder='E-mail' style={styles.input}
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })} />
                    <AuthInput icon='lock'
                        secureTextEntry={true}
                        placeholder='Password' style={styles.input}
                        value={this.state.password}
                        onChangeText={password => this.setState({ password })} />
                    {this.state.stageNew &&
                        <AuthInput icon='asterisk'
                            secureTextEntry={true}
                            placeholder='Confirmation'
                            style={styles.input} value={this.state.confirmPassword}
                            onChangeText={confirmPassword => this.setState({ confirmPassword })} />}
                    <TouchableOpacity disabled={!validForm} //se as validacoes não forem atendidas o botao fica opaco
                        onPress={this.signinOrSignup}>
                        <View style={[styles.button, !validForm ? { backgroundColor: '#AAA' } : {}]}>
                            <Text style={styles.butonText}>
                                {this.state.stageNew ? 'Register' : 'Enter'}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ padding: 10 }}
                    onPress={() => this.setState({
                        stageNew: !this.state.stageNew
                    })}>
                    <Text style={styles.buttonText}>
                        {this.state.stageNew ? 'Do you have an account?' : 'Do not have an account yet?'}</Text>
                </TouchableOpacity>
            </ImageBackground>
        )
    }
}

//styles

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 70,
        marginBottom: 10,
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
    },
    formContainer: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 20,
        width: '90%'
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF'
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
    }
})