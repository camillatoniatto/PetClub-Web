<template>
    <div id="app">
      <v-app id="inspire">
          <!-- adicionar novo -->
          <v-container>
              <div class="text-left mb-2 mr-2">
                  <v-btn color="dark" dark @click="createClient(userSelecionado)">
                      <v-icon dark>mdi-plus</v-icon>
                      Adicionar um Cliente
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
                      </td>
                  </tr>
                </template>
              </v-data-table>

              <v-dialog v-model="dialogCpf" max-width="500px">
                <v-card>
                  <v-card-title>
                    <span class="text-h5">Cadastrar Usuário</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-spacer></v-spacer>
                      <v-row>
                      <v-subheader class="text-h6">Buscar por cpf</v-subheader>
                        <v-col cols="12">
                          <v-text-field v-model="userSelecionado.cpf" label="CPF" type="text" ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      Fechar
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="adicionarCliente(userSelecionado)">
                      Buscar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

            <v-dialog v-model="dialog" max-width="500px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Editar cliente</span>
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


            <!-- =============================== -->
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
        dialogCpf: false,
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
        register.getAllClients().then(response => {
        this.users = response.data.data
        console.log('listar users: ',this.users)
        console.log('listar ',this.users)
      }).catch(e => {
        console.log(e)
      })
    },
    adicionarCliente(userSelecionado){
      register.postClient(userSelecionado.cpf).then(response => {
            userSelecionado = {}
            this.errors = {}
            this.listar()
            console.log('salvar user', response)
            Alert.ShowAlertSuccess.Alert('Cliente cadastrado com sucesso!')
        }).catch(e => {
          this.errors = e.response.data.data.errors
        })
        this.close()
    },
    cadastrar(userSelecionado){
        this.setRole()
        register.postUsers(userSelecionado).then(response => {
            userSelecionado = {}
            this.errors = {}
            this.listar()
            console.log('salvar user', response)
            Alert.ShowAlertSuccess.Alert('Cliente cadastrado com sucesso!')
        }).catch(e => {
          this.errors = e.response.data.data.errors
        })
        this.close()
    },
    salvar(userSelecionado){
        this.setRole()
        userSelecionado = this.userSelecionado
        console.log('este usuario edit 2: ', userSelecionado)

        register.putUserPerfil(userSelecionado)
        .then(register.putUserAdmin(userSelecionado).then(response => {
            this.userSelecionado = {},
            this.errors = {}
            console.log('salvar erro', response)
            this.listar()
            Alert.ShowAlertSuccess.Alert('Cliente atualizado com sucesso!')
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
            Alert.ShowAlertSuccess.Alert('Cliente deletado com sucesso!')

        }).catch(e => {
          this.errors = e.response.data.errors
        })
    //}
    //   this.closeDelete()
    },
    editItem (item) {
        this.editedIndex = this.users.indexOf(item)
        this.userSelecionado = Object.assign({}, item)
        this.userSelecionado.birthdate = moment(this.userSelecionado.birthdate, 'DD/MM/YYYY').format('yyyy-MM-DD')
        console.log('este usuario edit 1: ', this.userSelecionado)
        this.dialog = true
    },
    createItem (item) {
      this.dialogCpf = false
        this.editedIndex = this.users.indexOf(item)
        this.userSelecionado = Object.assign({}, item)
        this.dialogPost = true
    },
    createClient (item) {
        this.dialogCpf = true
        this.userSelecionado = Object.assign({}, item)
        this.dialogPost = false
    },
    close () {
      this.dialog = false
      this.dialogPost = false
      this.dialogCpf = false
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