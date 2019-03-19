import React from 'react'
import {
    createSwitchNavigator,
    createAppContainer,
    createDrawerNavigator
} from 'react-navigation'
import Agenda from './screens/Agenda'
import Auth from './screens/Auth'
import commonStyles from './commonStyles'
import Menu from './screens/Menu'
import AuthOrApp from './screens/AuthOrApp'

//*obs: DrawerNavigator faz ter aquela aba quando puxa do canto esquerdo da tela.
//     SwitchNavigator alterna entre as telas.

const MenuRoutes = {
    Today: {
        name: 'Today',
        screen: props =>
            <Agenda title='Today' daysAhead={0} {...props} />,
        navigationOptions: { //titulo do menu
            title: 'Today'
        }
    },
    Tomorrow: {
        name: 'Tomorrow',
        screen: props =>
            <Agenda title='Tomorrow' daysAhead={1} {...props} />,
        navigationOptions: { //titulo do menu
            title: 'Tomorrow'
        }
    },
    Week: {
        name: 'Week',
        screen: props =>
            <Agenda title='Week' daysAhead={7} {...props} />,
        navigationOptions: { //titulo do menu
            title: 'Week'
        }
    },
    Month: {
        name: 'Month',
        screen: props =>
            <Agenda title='Month' daysAhead={30} {...props} />,
        navigationOptions: { //titulo do menu
            title: 'Month'
        }
    }
}

const MenuConfig = {
    initialRouteName: 'Today',
    contentComponent: Menu,
    contentOptions: {
        labelStyle: {
            fontFamily: commonStyles.fontFamily,
            fontWeight: 'normal',
            fontSize: 20
        },
        activeLabelStyle: { //cor do menu selecionado
            color: '#080'  //green
        }
    }
}

const MenuNavigator = createDrawerNavigator(MenuRoutes, MenuConfig) //responsável pela criação efetiva do menu.

const MainRoutes = {
    Loading: {
        name: 'Loading',
        screen: AuthOrApp
    },
    Auth: {
        name: 'Auth',
        screen: Auth
    },
    Home: {
        name: 'Home',
        screen: MenuNavigator //responsável por mostrar a agenda de 4 formas diferentes
    }
}

const MainNavigator = createSwitchNavigator(MainRoutes, {
    initialRouteName: 'Loading'
})

export default createAppContainer(MainNavigator)

// a forma de chamada do navigator versao 2 para 3 mudou...
// neste caso está se utilizando a v3 e com isso é obrigado
// a passar no export default a chamada do createAppContainer com o (MainNavigator)