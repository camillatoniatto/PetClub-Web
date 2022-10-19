<template>
    <v-app>
        <v-card>
            <v-card-title>
            <span class="text-h5">Minha Conta</span>
            </v-card-title>
            <v-card-text>
            <v-container>
                <v-spacer></v-spacer>
                <v-row>
                <v-subheader class="text-h6">Dados Pessoais</v-subheader>

                <v-col  cols="12">
                    <v-text-field v-model="user.fullName" label="Nome" type="text" block required></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-text-field v-model="user.cpf" label="CPF" type="text" disabled></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-text-field v-model="user.email" label="Email" type="text"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field v-model="user.phoneNumber" label="Telefone" type="text"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field v-model="user.birthdate" label="Nascimento" type="date"></v-text-field>
                </v-col>

                <v-spacer></v-spacer>
                <v-divider></v-divider>

                <v-subheader class="text-h6">Dados Endereço</v-subheader>

                <v-col cols="12">
                    <v-text-field v-model="user.addressName" label="Endereço" type="text"></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-text-field v-model="user.number" label="Número" type="number"></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-text-field v-model="user.complement" label="Complemento" type="text"></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-text-field v-model="user.neighborhood" label="Bairro" type="text"></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-text-field v-model="user.city" label="Cidade" type="text"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field v-model="user.state" label="Estado" type="text"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field v-model="user.zipCode" label="CEP" type="text"></v-text-field>
                </v-col>

                </v-row>
            </v-container>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="salvar(user)">
                Salvar
            </v-btn>
            </v-card-actions>
        </v-card>
    </v-app>
</template>

<script>
import register from '@/store/modules/users'
import Alert from '../Alerts.js'
import moment from 'moment'

export default {
    name: 'PageUser',
    data () {
      return {
        id: localStorage.getItem('idUser'),
        user: {
            id: '',
            fullName:'',
            cpf: '',
            email: '',
            phoneNumber: '',
            birthdate: moment(Date.now()).format('yyyy-MM-DD'),
            image: '',
            isAdmin: false,
            isPartner: false,
            addressName: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            zipCode: '',
            isActive: true,
            writeDate:  ''
        },
      }
    },
    mounted(){
      this.meuUser(this.id)
    },
    methods:{
      async meuUser(id){
          console.log('MEU USUARIO ',id)
          await register.getUserId(id).then(response => {

          this.user = response.data.data
          this.user.birthdate = moment(this.user.birthdate, 'DD/MM/YYYY').format('yyyy-MM-DD')

          console.log('meuUser ',this.user)
        }).catch(e => {
          console.log(e)
        })
      },
      salvar(user){
        if(user.id == '') {
          register.postUsers(this.user).then(response => {
              user = {}
              this.errors = {}
              this.meuUser(user.id)
              console.log('salvar user', response)
              Alert.ShowAlertSuccess.Alert('Usuário cadastrado com sucesso!')
          }).catch(e => {
            this.errors = e.response.data.errors
          })
        }else{
          register.putUserPerfil(user).then(response => {
              this.user = {},
              this.errors = {}
              console.log('salvar erro', response)
              this.meuUser(user.id)
              Alert.ShowAlertSuccess.Alert('Usuário atualizado com sucesso!')
          }).catch(e => {
            this.errors = e.response.data.errors
          })
        }
      },
      editar(user){
        this.user = user
      },
    }
  }
</script>