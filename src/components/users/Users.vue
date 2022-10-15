<template>
    <div id="app">
      <v-app id="inspire">
          <!-- adicionar novo -->
          <v-container>
              <div class="text-left mb-2 mr-2">
                  <v-btn color="dark" dark @click="createItem(userSelecionado)">
                      <v-icon dark>mdi-plus</v-icon>
                      Cadastrar um usuário
                  </v-btn>
              </div>

              <br>

              <!-- tabela reserva -->
              <v-card-title>
                  <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details></v-text-field>
              </v-card-title>
              <v-data-table :headers="headers" :items="users" :search="search">
                <template v-slot:item="row">
                  <tr>
                      <!-- <td>{{row.item.idPet}}</td> -->
                      <td class="align-start">{{row.item.fullName}}</td>
                      <td>{{row.item.cpf}}</td>
                      <td>{{row.item.email}}</td>
                      <td>{{row.item.phoneNumber}}</td>
                      <td>{{row.item.birthdate}}</td>
                      <td>{{row.item.roles}}</td>
                      <td>
                        <v-icon small class="mr-2" @click="editItem(row.item)">mdi-pencil</v-icon>
                        <v-icon small @click="remover(row.item)">mdi-delete</v-icon>
                      </td>
                  </tr>
                </template>
              </v-data-table>

              <!-- delete dialog -->
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-center">
                    <v-icon x-large icon dark color="yellow lighten-2">mdi-alert-outline</v-icon>
                    <br>
                    <h3>Você tem certeza que deseja deletar esse usuário?</h3>
                  </v-card-title>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
                    <v-btn color="blue darken-1" text @click="remover(userSelecionado)">Sim</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>

            <v-dialog v-model="dialog" max-width="500px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Editar usuário</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-spacer></v-spacer>
                    <v-row>
                    <v-subheader class="text-h6">Dados Pessoais</v-subheader>
                      <v-col  cols="12">
                        <v-text-field v-model="userSelecionado.fullName" label="Nome" type="text" block required></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="userSelecionado.cpf" label="CPF" type="text" disabled></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="userSelecionado.email" label="Email" type="text"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="userSelecionado.phoneNumber" label="Telefone" type="text"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="userSelecionado.birthdate" label="Nascimento" type="date"></v-text-field>
                    </v-col>

                    <v-spacer></v-spacer>
                    <v-divider></v-divider>
                    <v-col cols="12">
                      <v-checkbox v-model="showAddress" label="Mostrar Endereço" value="showAddress"></v-checkbox>
                    </v-col>

                    <v-container v-if="showAddress">
                    <v-subheader class="text-h6">Dados Endereço</v-subheader>

                    <v-col cols="12">
                        <v-text-field v-model="userSelecionado.addressName" label="Endereço" type="text"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="userSelecionado.number" label="Número" type="number"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="userSelecionado.complement" label="Complemento" type="text"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="userSelecionado.neighborhood" label="Bairro" type="text"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="userSelecionado.city" label="Cidade" type="text"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="userSelecionado.state" label="Estado" type="text"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="userSelecionado.zipCode" label="CEP" type="text"></v-text-field>
                    </v-col>
                    </v-container>

                    <v-spacer></v-spacer>
                    <v-divider></v-divider>
                    <v-subheader class="text-h6">Tipo de Usuário</v-subheader>
                    <v-col cols="12">
                    <p>{{ radios || 'null' }}</p>
                      <v-radio-group v-model="radios" mandatory>
                        <v-radio label="Cliente" value="isUser"></v-radio>
                        <v-radio label="Parceiro" value="isPartner"></v-radio>
                        <v-radio label="Administrador" value="isAdmin"></v-radio>
                      </v-radio-group>
                    </v-col>

                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Fechar
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="salvar(userSelecionado)">
                    Salvar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialogPost" max-width="500px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Cadastrar Usuário</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-spacer></v-spacer>
                    <v-row>
                    <v-subheader class="text-h6">Dados Pessoais</v-subheader>

                      <v-col  cols="12">
                        <v-text-field v-model="userSelecionado.fullName" label="Nome" type="text" block required></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="userSelecionado.cpf" label="CPF" type="text" ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="userSelecionado.email" label="Email" type="text"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="userSelecionado.phoneNumber" label="Telefone" type="text"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="userSelecionado.birthdate" label="Nascimento" type="date"></v-text-field>
                    </v-col>

                    <v-spacer></v-spacer>
                    <v-divider></v-divider>
                    <v-col cols="12">
                      <v-checkbox v-model="showAddress" label="Cadastrar Endereço" value="showAddress"></v-checkbox>
                    </v-col>

                    <v-container v-if="showAddress">
                    <v-subheader class="text-h6">Dados Endereço</v-subheader>

                    <v-col cols="12">
                        <v-text-field v-model="userSelecionado.addressName" label="Endereço" type="text"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="userSelecionado.number" label="Número" type="number"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="userSelecionado.complement" label="Complemento" type="text"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="userSelecionado.neighborhood" label="Bairro" type="text"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="userSelecionado.city" label="Cidade" type="text"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="userSelecionado.state" label="Estado" type="text"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="userSelecionado.zipCode" label="CEP" type="text"></v-text-field>
                    </v-col>
                    </v-container>

                    <v-spacer></v-spacer>
                    <v-divider></v-divider>
                    <v-subheader class="text-h6">Tipo de Usuário</v-subheader>
                    <v-col cols="12">
                    <p>{{ radios || 'null' }}</p>
                      <v-radio-group v-model="radios" mandatory>
                        <v-radio label="Cliente" value="isUser"></v-radio>
                        <v-radio label="Parceiro" value="isPartner"></v-radio>
                        <v-radio label="Administrador" value="isAdmin"></v-radio>
                      </v-radio-group>
                    </v-col>

                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Fechar
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="cadastrar(userSelecionado)">
                    Salvar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>


          </v-container>
      </v-app>
  </div>
</template>

<script>
import register from '@/store/modules/users'
import Alert from '../Alerts.js'
import moment from 'moment'

export default {
    name: 'PageUser',
    data () {
      return {
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
            password: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            zipCode: '',
            isActive: true,
            writeDate:  ''
        },
        userSelecionado: {
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
            password: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            zipCode: '',
            isActive: true,
            writeDate:  ''
        },
        users: [],
        editedIndex: -1,
        errors: [],
        showAddress: false,
        search: '',
        dialog: false,
        dialogDelete: false,
        dialogPost: false,
        admin: true,
        radios: '',
        headers: [
          {
            text: 'Nome',
            align: 'center',
            filterable: false,
            value: 'fullname',
          },
          { text: 'CPF', align: 'center',  value: 'cpf' },
          { text: 'Email', align: 'center',  value: 'email' },
          { text: 'Telefone', align: 'center',  value: 'phoneNumber' },
          { text: 'Nascimento', align: 'center',  value: 'birthdate' },
          { text: 'Tipo', align: 'center',  value: 'roles' },
          { text: 'Ações', align: 'center',  value: 'actions', sortable: false },
        ],
    }
  },
  mounted(){

    this.listar()

    // this.listarPetUser()

  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Cadastrar usuário' : 'Editar usuário'
    },
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },
  methods:{
    listar(){
        register.getAllUsers().then(response => {
        this.users = response.data.data
        console.log('listar users: ',this.users)
        console.log('listar ',this.users)
      }).catch(e => {
        console.log(e)
      })
    },
    setRole(){
      if(this.radios == 'isUser'){
          this.userSelecionado.isAdmin = false
          this.userSelecionado.isPartner = false
        }else if(this.radios == 'isPartner'){
          this.userSelecionado.isAdmin = false
          this.userSelecionado.isPartner = true
        }else if(this.radios == 'isAdmin'){
          this.userSelecionado.isAdmin = true
          this.userSelecionado.isPartner = false
        }
    },
    setRadios(){
      if(this.userSelecionado.isAdmin){
        this.radios = 'isAdmin'
      }else if(this.userSelecionado.isPartner){
        this.radios = 'isPartner'
      }else{
        this.radios = 'isUser'
      }
    },
    cadastrar(userSelecionado){
        this.setRole()
        register.postUsers(userSelecionado).then(response => {
            userSelecionado = {}
            this.errors = {}
            this.listar()
            console.log('salvar user', response)
            Alert.ShowAlertSuccess.Alert('Usuário cadastrado com sucesso!')
        }).catch(e => {
          this.errors = e.response.data.errors
        })
    },
    salvar(userSelecionado){
        this.setRole()
        register.putUserPerfil(userSelecionado)
        .then(register.putUserAdmin(userSelecionado).then(response => {
            this.userSelecionado = {},
            this.errors = {}
            console.log('salvar erro', response)
            this.listar()
            Alert.ShowAlertSuccess.Alert('Usuário atualizado com sucesso!')
        }).catch(e => {
          this.errors = e.response.data.errors
        }))
        this.close()
    },
    editar(user){
      this.user = user
    },
    remover(user){
        // var result = Alert.ShowAlertAlert.Alert('Você tem certeza que quer deletar este usuário?')
        // if(result){
            register.deleteUsers(user.id).then(response => {
            this.listar()
            this.errors = {}
            console.log('remover', response)
            Alert.ShowAlertSuccess.Alert('Usuário deletado com sucesso!')

        }).catch(e => {
          this.errors = e.response.data.errors
        })
    //}
    //   this.closeDelete()
    },
    editItem (item) {
        this.editedIndex = this.users.indexOf(item)
        this.userSelecionado = Object.assign({}, item)
        this.dialog = true
    },
    createItem (item) {
        this.editedIndex = this.users.indexOf(item)
        this.userSelecionado = Object.assign({}, item)
        this.dialogPost = true
    },
    deleteItem (item) {
      this.editedIndex = this.users.indexOf(item)
      this.userSelecionado = Object.assign({}, item)
      this.dialogDelete = true
    },
    close () {
      this.dialog = false
      this.dialogPost = false
      this.$nextTick(() => {
        this.userSelecionado = {},
        this.editedIndex = -1
      })
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.userSelecionado = {},
        this.editedIndex = -1
      })
    },
    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.users[this.editedIndex], this.userSelecionado)
      } else {
        this.users.push(this.userSelecionado)
      }
      this.close()
    },
  }
}
</script>