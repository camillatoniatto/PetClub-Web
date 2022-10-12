import Vue from 'vue'
import Vuex from 'vuex'
import services from '@/store/modules/users'

Vue.use(Vuex)

const state = {
    responseLogin: {
        accessToken: `${window.localStorage.getItem('accessToken')}`,
        refreshToken: '',
        expiresIn: '',
        user: {
          idUser: `${window.localStorage.getItem('idUser')}`,
          fullName: `${window.localStorage.getItem('fullName')}`,
          cpf: `${window.localStorage.getItem('cpf')}`,
          email: '',
          birthdate: '',
          lastNumberCard: '',
          nameCard: '',
          phoneNumber: '',
          image: '',
          userPerfil: '',
          isAdmin: `${window.localStorage.getItem('isAdmin')}`,
          isPartner: `${window.localStorage.getItem('isPartner')}`,
        },
      },
}

const getters = {
    mensagemBoasVindas: state => `Olá ${state.responseLogin.user.fullName}`,
    userToken: state => state.user.token
}

const actions = {
    logar: async ({commit}, user) => {
        try {
            const response = await services.loginUser(user)
            commit('logar', { user: response.data })
        } catch(erro){
            commit('setError', {erro: erro})
        }
    },
}

const mutations = {
    logar: (state, usuario) => {
        state.usuario = usuario
    },
    setError: (state, {erro}) => {
        state.erro = erro
    }
}

export default new Vuex.Store({
    // strict: true,
    state,
    getters,
    actions,
    mutations,
    // modules,
})
