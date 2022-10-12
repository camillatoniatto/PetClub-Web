<template>
    <div id="app">
      <v-app id="inspire">
          <!-- adicionar novo -->
          <v-container>
              <div class="text-left mb-2 mr-2">
                  <v-btn color="dark" dark @click="editItem(petSelecionado)">
                      <v-icon dark>mdi-plus</v-icon>
                      Cadastrar um pet
                  </v-btn>
              </div>

              <br>

              <!-- tabela reserva -->
              <v-card-title>
                  <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details></v-text-field>
              </v-card-title>
              <v-data-table :headers="headers" :items="pets" :search="search">
                <template v-slot:item="row">
                  <tr>
                      <!-- <td>{{row.item.idPet}}</td> -->
                      <td class="align-start">{{row.item.name}}</td>
                      <td>{{row.item.tutor}}</td>
                      <td>{{row.item.genre}}</td>
                      <td>{{row.item.specie}}</td>
                      <td>{{row.item.brand}}</td>
                      <td>{{row.item.birthdate}}</td>
                      <td>{{row.item.isAlive}}</td>
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
                    <h3>Você tem certeza que deseja deletar esse veículo?</h3>
                  </v-card-title>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
                    <v-btn color="blue darken-1" text @click="remover(petSelecionado)">Sim</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>

            <v-dialog v-model="dialog" max-width="500px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="petSelecionado.Nome" label="Nome" type="text" block required></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="petSelecionado.specie" label="Espécie" type="text" ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="petSelecionado.brand" label="Raça" type="text"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="petSelecionado.birthdate" label="Nascimento" type="date"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="petSelecionado.brand" label="Raça" type="text"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-select v-model="petSelecionado.genre" :items="['Masculino','Feminino']" label="Gênero" required></v-select>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Fechar
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="salvar(petSelecionado)">
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
import register from '@/store/modules/pets'
import Alert from '../Alerts.vue'

export default {
    name: 'PagePetUser',
    data () {
      return {
        pet: {
            idPet: '',
            idUser: '',
            tutor: '',
            name: '',
            genre: '',
            specie: '',
            brand: '',
            birthdate: Date.now(),
            isAlive: true
        },
        petSelecionado: {
            idPet: '',
            idUser: '',
            tutor: '',
            name: '',
            genre: '',
            specie: '',
            brand: '',
            birthdate: Date.now(),
            isAlive: true
        },
        pets: [],
        editedIndex: -1,
        errors: [],
        search: '',
        dialog: false,
        dialogDelete: false,
        admin: true,
        headers: [
          {
            text: 'Nome',
            align: 'start',
            filterable: false,
            value: 'name',
          },
          { text: 'Tutor', value: 'tutor' },
          { text: 'Gênero', value: 'genre' },
          { text: 'Espécie', value: 'specie' },
          { text: 'Raça', value: 'brand' },
          { text: 'Nascimento', value: 'birthdate' },
          { text: 'Vivo', value: 'isAlive' },
          { text: 'Ações', value: 'actions', sortable: false },
        ],
    }
  },
  mounted(){

    this.listar()

    // this.listarPetUser()

  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Cadastrar pet' : 'Editar pet'
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
        register.getPets().then(response => {
        this.pets = response.data.data
        console.log('listar pets: ',this.pets)
        console.log('listar ',this.pets)
      }).catch(e => {
        console.log(e)
      })
    },
    listarPetUser(){
        register.getPetUser().then(response => {
        this.pets = response.data.data
        console.log('listar pets: ',this.pets)
        console.log('listar ',this.pets)
      }).catch(e => {
        console.log(e)
      })
    },
    salvar(petSelecionado){
      if(petSelecionado.idPet == '') {
        register.postPet(this.petSelecionado).then(response => {
            petSelecionado = {}
            this.errors = {}
            this.listar()
            console.log('salvar pet', response)
            Alert.showAlertSuccess('Animal cadastrado com sucesso!')

        }).catch(e => {
          this.errors = e.response.data.errors
        })
      }else{
        register.putPet(petSelecionado).then(response => {
            this.petSelecionado = {},
            this.errors = {}
            console.log('salvar erro', response)
            this.listar()
            Alert.showAlertSuccess('Animal atualizado com sucesso!')

        }).catch(e => {
          this.errors = e.response.data.errors
        })
      }
      this.close()
    },
    editar(pet){
      this.pet = pet
    },
    remover(pet){
        var result = Alert.showAlertAlert('Você tem certeza que quer deletar este pet?')
        if(result){
            register.deletePet(pet.idPet).then(response => {
            this.listar()
            this.errors = {}
            console.log('remover', response)
            Alert.showAlertSuccess('Animal deletado com sucesso!')

        }).catch(e => {
          this.errors = e.response.data.errors
        })
    }
    //   this.closeDelete()
    },
    editItem (item) {
        this.editedIndex = this.pets.indexOf(item)
        this.petSelecionado = Object.assign({}, item)
        this.dialog = true
    },
    deleteItem (item) {
      this.editedIndex = this.pets.indexOf(item)
      this.petSelecionado = Object.assign({}, item)
      this.dialogDelete = true
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.petSelecionado = {},
        this.editedIndex = -1
      })
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.petSelecionado = {},
        this.editedIndex = -1
      })
    },
    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.pets[this.editedIndex], this.petSelecionado)
      } else {
        this.pets.push(this.petSelecionado)
      }
      this.close()
    },
  }
}
</script>