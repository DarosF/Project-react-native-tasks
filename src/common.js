import { Alert, Platform } from 'react-native' //se estiver na nuvem nao precisa saber a plataforma

const server = Platform.OS === 'ios' ?
    'http://localhost:3000' : 'http://10.0.2.2:3000' //endereço padrão usado para acessar a maquina 'Host'

function showError(err) {
    Alert.alert('Ops! An erro has ocurred!', `Message: ${err}`)
}

export { server, showError }