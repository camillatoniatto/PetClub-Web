<template>
    <div id="app">
      <v-app id="inspire">
          <!-- adicionar novo -->
          <v-container>
              <div class="text-left mb-2 mr-2">
                  <v-btn color="dark" dark @click="createItem()">
                      <v-icon dark>mdi-plus</v-icon>
                      Gerar movimentação de caixa
                  </v-btn>
              </div>
              <br>

              <v-card-title>
                  <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details></v-text-field>
              </v-card-title>
              <v-data-table :headers="headers" :items="allCashflow" :search="search">
                <template v-slot:item="row">
                  <tr>
                      <td><v-chip dark :color="getColor(row.item.isOutflow)" class="align-center my-5 md-2 white-text">{{movimentacao(row.item.isOutflow)}}</v-chip></td>
                      <td>{{row.item.title}}</td>
                      <td>{{row.item.description}}</td>
                      <td>{{row.item.paymentMethod}}</td>
                      <!-- <td>{{row.item.userCreateName}}</td> -->
                      <td>R$ {{row.item.netValue}}</td>
                      <td>{{row.item.expirationDate}}</td>
                      <td>{{row.item.writeOffDate}}</td>
                      <td><v-chip dark :color="getColorStatus(row.item.status)" class="align-center my-5 md-2 white-text">{{row.item.status}}</v-chip></td>
                      <!-- <td>{{row.item.userWriteOffName}}</td> -->
                      <td>
                        <v-icon v-if="row.item.idPurchaseOrder == null && row.item.idUserWriteOff == '' " medium class="mr-2" @click="writeOff(row.item.id)">mdi-cash-check</v-icon>
                        <!-- <v-icon small class="mr-2" @click="editItem(row.item)">mdi-pencil</v-icon> -->
                        <v-icon small @click="deleteItem(row.item)">mdi-delete</v-icon>
                      </td>
                  </tr>
                </template>
              </v-data-table>

              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-center">
                    <v-icon x-large icon dark color="center yellow lighten-2">mdi-alert-outline</v-icon>
                    <br>
                    <h3>Você tem certeza que deseja remover essa movimentação de caixa?</h3>
                  </v-card-title>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
                    <v-btn color="blue darken-1" text @click="remover(cashflowSelect)">Sim</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>

            <v-dialog v-model="dialogPost" max-width="600px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Cadastro - {{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-checkbox
                      v-model="cashflowSelect.isOutflow"
                      label="Entrada de caixa"
                    ></v-checkbox>
                    <v-row>
                      <v-col cols="12">
                      <v-text-field v-model="cashflowSelect.title" label="Titulo" type="text" required></v-text-field>
                      <v-text-field v-model="cashflowSelect.description" label="Descrição" type="text" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-subheader>{{expirationDateTitle}}</v-subheader>
                        <v-text-field v-model="cashflowSelect.expirationDate" type="Date" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-subheader>{{writeOffDateTitle}}</v-subheader>
                        <v-text-field v-model="cashflowSelect.writeOffDate" type="Date" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                      <v-text-field v-model.number="cashflowSelect.launchValue" label="Valor" type="number"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-subheader>Tipo de Pagamento</v-subheader>
                        <v-select v-model="cashflowSelect.idPaymentMethod" :items="payments" :item-value="'idPaymentMethod'" :item-text="'paymentType'" filled dense></v-select>
                      </v-col>

                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Fechar
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="criarConta(cashflowSelect)">
                    Salvar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>


            <v-dialog v-model="dialog" max-width="600px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Edição - {{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                      <v-text-field v-model="cashflowSelect.title" label="Titulo" type="text" required></v-text-field>
                      <v-text-field v-model="cashflowSelect.description" label="Descrição" type="text" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-subheader>{{expirationDateTitle}}</v-subheader>
                        <v-text-field v-model="cashflowSelect.expirationDate" type="Date" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-subheader>{{writeOffDateTitle}}</v-subheader>
                        <v-text-field v-model="cashflowSelect.writeOffDate" type="Date" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                      <v-text-field v-model.number="cashflowSelect.launchValue" label="Valor" type="number"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-subheader>Tipo de Pagamento</v-subheader>
                        <v-select v-model="cashflowSelect.paymentType" :items="payments" :item-value="'idPaymentMethod'" :item-text="'paymentType'" filled dense></v-select>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Fechar
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="salvarConta(cashflowSelect)">
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
  import register from '@/store/modules/cashflow'
  import registerPayment from '@/store/modules/payment'
  import Alert from '@/components/Alerts.js'
  import enums from '../.././Enums.js'
  export default {
    name: 'PageCashflow',
    data () {
      return {
        cashflow: {
            id: '',
            title: '',
            description: '',
            idUserCreate: '',
            idPurchaseOrder: '',
            idPaymentMethod: '',
            launchValue: 0,
            netValue: 0,
            expirationDate: '',
            writeOffDate: '',
            idUserWriteOff: '',
            idUserInactivate: '',
            isOutflow: false,
            writeDate: '',
        },
        allCashflow: [],
        payments: [],
        cashflowSelect: {
            id: '',
            title: '',
            description: '',
            idUserCreate: '',
            idPurchaseOrder: '',
            idPaymentMethod: '',
            launchValue: 0,
            netValue: 0,
            expirationDate: '',
            writeOffDate: '',
            idUserWriteOff: '',
            idUserInactivate: '',
            isOutflow: false,
            writeDate: '',
        },
        paymentType: enums.PaymentType,
        editedIndex: -1,
        isOutflow: false,
        errors: [],
        search: '',
        dialog: false,
        dialogPost: false,
        dialogDelete: false,
        headers: [
          {
            text: 'Tipo',
            align: 'center',
            value: 'isOutflow',
          },
          { text: 'Titulo', align: 'center', value: 'title' },
          { text: 'Descrição', align: 'center', value: 'description' },
          { text: 'Tipo de Pagamento', align: 'center', value: 'paymentMethod' },
          //{ text: 'Criador', align: 'center', value: 'userCreateName' },
          { text: 'Valor líquido', align: 'center', value: 'netValue' },
          { text: 'Data de Vencimento', align: 'center', value: 'expirationDate' },
          { text: 'Data da Baixa', align: 'center', value: 'writeOffDate' },
          //{ text: 'Usuário da Baixa', align: 'center', value: 'userWriteOffName' },
          { text: 'Status', align: 'center', value: 'status' },
          { text: 'Ações', align: 'center', value: 'actions', sortable: false }
        ],
      }
    },
    mounted(){
      this.listar()
      this.listarPagamentos()
    },
    computed: {
      formTitle () {
        return this.cashflowSelect.isOutflow ? 'Entrada de Caixa' : 'Saída de Caixa'
      },
      expirationDateTitle(){
        return this.cashflowSelect.isOutflow ? 'Previsão de Recebimento' : 'Data de Vencimento'
      },
      writeOffDateTitle(){
        return this.cashflowSelect.isOutflow ? 'Data do Recebimento' : 'Data de Baixa'
      }
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
      getColor (isOutflow) {
        return isOutflow ? 'red' : 'green'
      },
      getColorStatus(status) {
        switch (status) {
          case 'Pago':
            return 'light-green darken-3';
          case 'Recebido':
            return 'light-green darken-3'
          case 'Pendente':
            return 'yellow darken-3'
          case 'Cancelado':
            return 'red darken-3'
          case 'Em atraso':
            return 'orange accent-4'
          default:
            return 'white'
        }
      },
      movimentacao (isOutflow) {
        return isOutflow ? 'Saída' : 'Entrada'
      },
      async listar(){
          await register.getCashflow().then(response => {
          this.allCashflow = response.data.data
          console.log('listar allCashflow: ',this.allCashflow)
          console.log('listar ',this.allCashflow)
        }).catch(e => {
          console.log(e)
        })
      },
      async listarPagamentos(){
        await registerPayment.getPaymentMethods().then(response => {
        this.payments = response.data.data
      }).catch(e => {
        console.log(e)
      })
      },
      async writeOff(id){
        await register.writeOffBill(id).then(() => {
            this.cashflowSelect = {}
            this.errors = {}
            this.listar()
            Alert.ShowAlertSuccess.Alert('Baixa realizada com sucesso!')
        })
      },
      criarConta(cashflowSelect){
        if(cashflowSelect.writeOffDate == ''){
            var minDate = new Date('0001-01-01T00:00:00Z')
            cashflowSelect.writeOffDate = minDate
        }
        register.postCashflow(cashflowSelect).then(() => {
            this.cashflowSelect = {}
            this.errors = {}
            this.listar()
            Alert.ShowAlertSuccess.Alert('Movimentação cadastrada com sucesso!')
        }).catch(e => {
          this.errors = e.response.data.data.errors
        })
        this.close()
      },
      salvarConta(cashflowSelect){
          cashflowSelect = this.cashflowSelect
          register.putCashflow(cashflowSelect)
          .then(() => {
              this.cashflowSelect = {},
              this.errors = {}
              this.listar()
              Alert.ShowAlertSuccess.Alert('Movimentação atualizada com sucesso!')
          }).catch(e => {
            this.errors = e.response.data.errors
          })
          this.close()
      },
      editar(user){
        this.user = user
      },
      remover(cashflow){
          // var result = Alert.ShowAlertAlert('Você tem certeza que quer deletar este serviço?')
          //if(result){
              register.deleteCashflow(cashflow.idCashflow).then(response => {
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
      createItem () {
      this.dialogPost = true
      },
      editItem (item) {
      this.editedIndex = this.allCashflow.indexOf(item)
      this.cashflowSelect = Object.assign({}, item)
      this.dialog = true
      },
      deleteItem (item) {
        this.editedIndex = this.allCashflow.indexOf(item)
        this.cashflowSelect = Object.assign({}, item)
        this.dialogDelete = true
      },
      close () {
        this.dialog = false
        this.dialogPost = false
        this.$nextTick(() => {
          this.cashflowSelect = {},
          this.editedIndex = -1
        })
      },
      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.cashflowSelect = {},
          this.editedIndex = -1
        })
      },
      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.allCashflow[this.editedIndex], this.cashflowSelect)
        } else {
          this.allCashflow.push(this.cashflowSelect)
        }
        this.close()
      },
    }
  }
  </script>