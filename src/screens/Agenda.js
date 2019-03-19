//TO-DO
import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    FlatList,
    TouchableOpacity,
    Platform
} from 'react-native'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/en-gb' //é necessario apenas o estilo ser carregado
import commonStyles from '../commonStyles'
import Task from '../components/Task'
import Icon from 'react-native-vector-icons/FontAwesome'
import ActionButton from 'react-native-action-button'
import AddTask from './AddTask' //esta na pasta screen
import { server, showError } from '../common'
import todayImage from '../../assets/imgs/today.jpg'
import tomorrowImage from '../../assets/imgs/tomorrow.jpg'
import weekImage from '../../assets/imgs/week.jpg'
import monthImage from '../../assets/imgs/month.jpg'

export default class Agenda extends Component {
    state = {
        tasks: [], // **aqui nesse array ficam as tasks que vão aparecer na tela**
        visibleTasks: [],
        showDoneTasks: true,
        showAddTask: false,
    }

    addTask = async task => { //vem da função onSave
        try {
            await axios.post(`${server}/tasks`, {
                desc: task.desc,
                estimateAt: task.date
            }) //usando post para incluir uma task
            this.setState({ showAddTask: false }, this.loadTasks)
        } catch {
            showError(err)
        }
    }

    deleteTask = async id => {
        try {
            await axios.delete(`${server}/tasks/${id}`)
            await this.loadTasks()
        } catch (err) {
            showError(err)
        }
    }

    filterTasks = () => { // filtrando as tasks
        let visibleTasks = null
        if (this.state.showDoneTasks) {
            visibleTasks = [...this.state.tasks] //clonando as tasks e colocando como visible para serem exibidas
        } else { // se a expressao for falsa o item será excluido do array final
            const pending = task => task.doneAt === null
            visibleTasks = this.state.tasks.filter(pending)
        }
        this.setState({ visibleTasks })
    }

    toggleFilter = () => { // quando clica no icone ... depois chama a função de cima (filterTasks) para filtrar
        this.setState({ showDoneTasks: !this.state.showDoneTasks } // setState é uma função assincrona
            , this.filterTasks) // Então para que nao seja atualizada antes chamamos o filterTasks depois
    }

    componentDidMount = async () => { //chamando tasks do storage do aparelho
        this.loadTasks()
    }

    //Para marcar e desmarcar com os icones é feita a comunicação indireta
    //Ou seja quando função callback é feita no filho 
    //e quando o evento ocorre no filho ele comunica o pai atualizando-o

    toggleTask = async id => {
        try {
            await axios.put(`${server}/tasks/${id}/toggle`) //para alternar a task marcada ou nao
            await this.loadTasks()
        } catch (err) {
            showError(err)
        }
    }

    loadTasks = async () => { //// Lê as tasks e carrega
        try {
            const maxDate = moment().add({ days: this.props.daysAhead }).format('YYYY-MM-DD 23:59')
            const res = await axios.get(`${server}/tasks?date=${maxDate}`)
            this.setState({ tasks: res.data }, this.filterTasks) //após ter carregado todas as tasks aplica-se o filtro das tasks
        } catch (err) {
            showError(err)
        }
    }

    render() { // JSX
        let styleColor = null //inicializando as cores
        let image = null      //inicializando a imagem

        switch (this.props.daysAhead) {
            case 0:
                styleColor = commonStyles.colors.today
                image = todayImage
                break
            case 1:
                styleColor = commonStyles.colors.tomorrow
                image = tomorrowImage
                break
            case 7:
                styleColor = commonStyles.colors.week
                image = weekImage
                break
            default:
                styleColor = commonStyles.colors.month
                image = monthImage
                break
        }

        return (
            <View style={styles.container}>
                <AddTask isVisible={this.state.showAddTask}
                    onSave={this.addTask}
                    onCancel={() => this.setState({ showAddTask: false })} />
                <ImageBackground source={image} style={styles.background}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='bars' size={30} color={commonStyles.colors.secondary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon name={this.state.showDoneTasks ? 'eye' : 'eye-slash'}
                                size={30} color={commonStyles.colors.secondary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>{this.props.title}</Text>
                        <Text style={styles.subtitle}>
                            { moment().locale('en-gb').format('ddd, D [] MMMM') }
                        </Text>
                    </View>
                </ImageBackground>
                <View style={styles.tasksContainer}>
                    <FlatList data={this.state.visibleTasks} //Flatlist faz com que tenhamos o scroll rodando a tela para baixo
                        keyExtractor={item => `${item.id}`} //template string `` converte para string
                        renderItem={({ item }) =>
                            <Task {...item} onToggleTask={this.toggleTask}
                                onDelete={this.deleteTask} />} />
                </View>
                <ActionButton buttonColor={styleColor} //botao para adicionar as tasks
                    onPress={() => { this.setState({ showAddTask: true }) }} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 3,
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 10,
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30,
    },
    tasksContainer: {
        flex: 7,
    },
    iconBar: {
        marginTop: Platform.OS === 'ios' ? 30 : 10,
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between', //space-between para que os botoes fiquem um em cada lado.
    }
})