//import React from 'react' // se colocar um JSX precisara
import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import Agenda from './screens/Agenda'
import Auth from './screens/Auth'

const MainRoutes = {
    Auth: {
        name: 'Auth',
        screen: Auth
    },
    Home: {
        name: 'Home',
        screen: Agenda
    }
}
const MainNavigator = createSwitchNavigator (MainRoutes, {
    initialRouteName: 'Auth'
})
export default createAppContainer (MainNavigator)

// a forma de chamada do navigator versao 2 para 3 mudou...
// neste caso está se utilizando a v3 e com isso é obrigado
// a passar no export default a chamada do createAppContainer com o (MainNavigator)