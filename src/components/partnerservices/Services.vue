<template>
  <div id="app">
    <v-app id="inspire">
        <!-- adicionar novo -->
        <v-container>
            <div class="text-left mb-2 mr-2">
                <v-btn color="dark" dark @click="editItem(serviceSelecionado)">
                    <v-icon dark>mdi-plus</v-icon>
                    Adicionar um serviço
                </v-btn>
            </div>

            <br>

            <!-- tabela reserva -->
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details></v-text-field>
            </v-card-title>
            <v-data-table :headers="headers" :items="services" :search="search">
              <template v-slot:item="row">
                <tr>
                    <td>{{row.item.title}}</td>
                    <td>{{row.item.serviceType}}</td>
                    <td>R$ {{row.item.value}}</td>
                    <td>
                      <v-icon small class="mr-2" @click="editItem(row.item)">mdi-pencil</v-icon>
                      <v-icon small @click="deleteItem(row.item)">mdi-delete</v-icon>
                    </td>
                </tr>
              </template>
            </v-data-table>

            <!-- delete dialog -->
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-center">
                  <v-icon x-large icon dark color="center yellow lighten-2">mdi-alert-outline</v-icon>
                  <br>
                  <h3>Você tem certeza que deseja deletar esse serviço?</h3>
                </v-card-title>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
                  <v-btn color="blue darken-1" text @click="remover(serviceSelecionado)">Sim</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>

          <v-dialog v-model="dialog" max-width="600px">
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="10" md="8" lg="6">
                    <v-text-field v-model="serviceSelecionado.title" label="Titulo" type="text" required></v-text-field>
                    <v-text-field v-model="serviceSelecionado.description" label="Descrição" type="text" required></v-text-field>
                    <v-text-field v-model.number="serviceSelecionado.value" label="Valor" type="number"></v-text-field>
                    <v-subheader>Tipo de Serviço</v-subheader>
                    <v-select v-model="serviceSelecionado.serviceType" :items="serviceType" :item-value="'key'" :item-text="'value'" filled dense></v-select>
                  </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Fechar
                </v-btn>
                <v-btn color="blue darken-1" text @click="salvar(serviceSelecionado)">
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
import register from '@/store/modules/services'
import Alert from '@/components/Alerts.js'
import enums from '../.././Enums.js'
export default {
  name: 'PageService',
  data () {
    return {
      service: {
          idService: '',
          title: '',
          description: '',
          serviceType: '',
          value: 0,
      },
      services: [],
      serviceSelecionado: {
          idService: '',
          title: '',
          description: '',
          serviceType: '',
          value: 0,
      },
      serviceDefault: {
          idService: '',
          title: '',
          description: '',
          serviceType: '',
          value: 0,
      },
      serviceType: enums.ServiceType,
      editedIndex: -1,
      errors: [],
      search: '',
      dialog: false,
      dialogDelete: false,
      admin: true,
      headers: [
        {
          text: 'Titulo',
          align: 'center',
          value: 'title',
        },
        { text: 'Tipo de Serviço', align: 'center', value: 'serviceType' },
        { text: 'Valor', align: 'center', value: 'value' },
        { text: 'Ações', align: 'center', value: 'actions', sortable: false }
      ],
    }
  },
  mounted(){
    this.listar()
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Cadastrar serviço' : 'Editar serviço'
    },
    // solicitorsFeesDisplay: {
    //   get: function() {
    //     return this.serviceSelecionado.value.toFixed(2)
    //   },
    //   set: function(newValue) {
    //     this.serviceSelecionado.value = newValue
    //   }
    // }
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
        register.getServices().then(response => {
        this.services = response.data.data
        console.log('listar services: ',this.services)
        console.log('listar ',this.services)
      }).catch(e => {
        console.log(e)
      })
    },
    listarServiceUser(){
        register.getServiceUser().then(response => {
        this.services = response.data
        console.log('listar services user: ',this.services)
        console.log('listar ',this.services)
      }).catch(e => {
        console.log(e)
      })
    },
    salvar(serviceSelecionado){
      if(!serviceSelecionado.id){
            register.postService(serviceSelecionado).then(response => {
              serviceSelecionado = {}
              console.log('postService: ', response.data.data)
              serviceSelecionado = this.serv
              this.listar()
              this.errors = {}
              this.ShowAlertSuccess('Serviço cadastrado com sucesso!')
            }).catch(e => {
              this.errors = e.response.data.data.errors
            })
          }else{
            register.putService(serviceSelecionado).then(response => {
              serviceSelecionado = this.serviceDefault
              this.errors = {}
              console.log('putService: ', response.data.data)
              this.listar()
              this.ShowAlertSuccess('Serviço cadastrado com sucesso!')
            }).catch(e => {
              this.errors = e.response.data.data.errors
            })
          }
      this.close()
    },
    editar(service){
      this.service = service
    },
    remover(service){
        // var result = Alert.ShowAlertAlert('Você tem certeza que quer deletar este serviço?')
        //if(result){
            register.deleteService(service.idService).then(response => {
            this.listar()
            this.errors = {}
            console.log('remover: ', response)
            Alert.ShowAlertSuccess('Serviço deletado com sucesso!')

        }).catch(e => {
          this.errors = e.response.data.errors
        })
    //}
      this.closeDelete()
    },
    editItem (item) {
    this.editedIndex = this.services.indexOf(item)
    this.serviceSelecionado = Object.assign({}, item)
    this.dialog = true
    },
    deleteItem (item) {
      this.editedIndex = this.services.indexOf(item)
      this.serviceSelecionado = Object.assign({}, item)
      this.dialogDelete = true
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.serviceSelecionado = {},
        this.editedIndex = -1
      })
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.serviceSelecionado = {},
        this.editedIndex = -1
      })
    },
    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.services[this.editedIndex], this.serviceSelecionado)
      } else {
        this.services.push(this.serviceSelecionado)
      }
      this.close()
    },
  }
}
</script>