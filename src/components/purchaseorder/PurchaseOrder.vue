<template>
  <div id="app">
    <v-app id="inspire">
      <!-- adicionar novo -->
      <v-container>
        <div class="text-left mb-2 mr-2">
          <v-btn color="dark" dark @click="createItem()">
            <v-icon dark>mdi-plus</v-icon>
            Criar nova venda
          </v-btn>
        </div>
        <br />

        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="purchaseOrders"
          :search="search"
        >
          <template v-slot:item="row">
            <tr>
              <td>
                <v-chip
                  dark
                  :color="getColorStatus(row.item.purchaseOrderSituation)"
                  class="align-center my-5 md-2 white-text"
                  >{{ row.item.purchaseOrderSituation }}</v-chip
                >
              </td>

              <td>{{ row.item.idPurchaseOrder }}</td>
              <td>{{ row.item.petName }}</td>
              <td>{{ row.item.fullName }}</td>
              <td>{{ row.item.cpf }}</td>
              <td>{{ row.item.paymentType }}</td>
              <td>R$ {{ row.item.totalValue }}</td>
              <td>{{ row.item.createDate }}</td>
              <td>
                <v-icon small @click="getItem(row.item.idPurchaseOrder)"
                  >mdi-eye-outline</v-icon
                >
                <v-icon
                  v-if="
                    row.item.idPurchaseOrder == null &&
                    row.item.idUserWriteOff == ''
                  "
                  medium
                  class="mr-2"
                  @click="writeOff(row.item.idPurchaseOrder)"
                  >mdi-cash-check</v-icon
                >
                <!-- <v-icon small class="mr-2" @click="editItem(row.item)">mdi-pencil</v-icon> -->
                <v-icon small @click="deleteItem(row.item)">mdi-delete</v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>

        <v-dialog v-model="details" max-width="40%">
          <v-container class="px-4 py-4">
            <v-data-iterator :items="purchaseOrderSelect" hide-default-footer>
              <template v-slot:header>
                <v-toolbar class="mb-2" color="indigo darken-5" dark flat>
                  <v-toolbar-title
                    >Itens da venda "{{
                      purchaseOrderSelect.id
                    }}"</v-toolbar-title
                  >
                </v-toolbar>
              </template>
              <template v-slot:default="props">
                <v-row>
                  <v-col
                    v-for="item in props.items"
                    :key="item.idPurchaseOrderItem"
                    cols="12"
                  >
                    <v-card>
                      <v-card-title class="subheading font-weight-bold">
                        {{ item.title }}
                      </v-card-title>
                      <v-divider></v-divider>
                      <v-list dense>
                        <v-list-item>
                          <v-list-item-content>Quantidade</v-list-item-content>
                          <v-list-item-content class="align-end">
                            {{ item.quantity }}
                          </v-list-item-content>
                        </v-list-item>

                        <v-list-item>
                          <v-list-item-content
                            >Valor Total:</v-list-item-content
                          >
                          <v-list-item-content class="align-end">
                            R$ {{ item.value * item.quantity }}
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-col>
                </v-row>
              </template>
            </v-data-iterator>
          </v-container>
        </v-dialog>

        <!--    <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-center">
                    <v-icon x-large icon dark color="center yellow lighten-2">mdi-alert-outline</v-icon>
                    <br>
                    <h3>Você tem certeza que deseja remover essa venda?</h3>
                  </v-card-title>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
                    <v-btn color="blue darken-1" text @click="remover(purchaseOrderSelect)">Sim</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog> -->

        <v-dialog v-model="dialogPost" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Cadastrar nova Venda</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-select
                      v-model="purchaseOrderSelect.idUser"
                      :items="clients"
                      :item-value="'idUser'"
                      :item-text="'userFullName'"
                      label="Cliente"
                      filled
                      dense
                    ></v-select>
                    <v-select
                      @click="listarPetUser(purchaseOrderSelect.idUser)"
                      v-model="purchaseOrderSelect.idPet"
                      label="Pet"
                      :items="pets"
                      :item-value="'idPet'"
                      :item-text="'name'"
                      filled
                      dense
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-subheader>Tipo de Pagamento</v-subheader>
                    <v-select
                      v-model="purchaseOrderSelect.idPaymentMethod"
                      :items="payments"
                      :item-value="'idPaymentMethod'"
                      :item-text="'paymentType'"
                      filled
                      dense
                    ></v-select>
                  </v-col>
                </v-row>

                <v-divider></v-divider>
                <v-subheader class="text-h6">Serviços da venda</v-subheader>

                <!-- <div v-model="servicesAdd"> -->
                <!-- <div v-for="service in services" v-bind:key="service.idService">
                  <v-container fluid>
                    <v-col cols="12">
                      <v-checkbox
                        v-model="service.idService"
                        hide-details
                        class="shrink mr-2 mt-0"
                        :label="`${service.title}`"
                      ></v-checkbox>
                      <v-text-field
                        v-if="service.idService"
                        v-model="purchaseOrderItem.quantity"
                        label="Quantidade"
                        type="number"
                      ></v-text-field>
                    </v-col>
                  </v-container>
                </div>
                <v-divider></v-divider> -->

                <div v-for="service in servicesQnty" v-bind:key="service">
                  <v-container fluid>
                    <v-row>
                      <v-col cols="6">
                        <v-select
                          v-model="servicesAdd.idService"
                          :items="services"
                          :item-value="'idService'"
                          :item-text="'title'"
                          label="Selecione..."
                          filled
                          dense
                        ></v-select>
                      </v-col>

                      <v-col cols="6">
                        <v-text-field
                          v-model="servicesAdd.quantity"
                          label="Quantidade"
                          type="number"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    
                  </v-container>
                </div>

                <v-btn color="dark" dark @click="servicesQnty++">
                  <v-icon dark>mdi-plus</v-icon>
                </v-btn>
                <v-divider></v-divider>
                <v-row>
                  <v-col cols="12" md="12">
                    <v-text-field
                      v-model="purchaseOrderSelect.launchValue"
                      label="Valor Total"
                      type="text"
                      disabled
                    ></v-text-field>
                  </v-col>

                  <v-spacer></v-spacer>
                  <v-divider></v-divider>
                  {{purchaseOrderSelect}}
                  {{servicesAdd}}

                  <v-col cols="12" md="12">
                    <v-textarea
                      v-model="purchaseOrderSelect.observations"
                      label="Observações"
                      type="text"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Fechar </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="criarVenda(purchaseOrderSelect, servicesAdd)"
              >
                Salvar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!--  <v-dialog v-model="dialog" max-width="600px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Edição - {{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                      <v-text-field v-model="purchaseOrderSelect.title" label="Titulo" type="text" required></v-text-field>
                      <v-text-field v-model="purchaseOrderSelect.description" label="Descrição" type="text" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-subheader>{{expirationDateTitle}}</v-subheader>
                        <v-text-field v-model="purchaseOrderSelect.expirationDate" type="Date" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-subheader>{{writeOffDateTitle}}</v-subheader>
                        <v-text-field v-model="purchaseOrderSelect.writeOffDate" type="Date" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                      <v-text-field v-model.number="purchaseOrderSelect.launchValue" label="Valor" type="number"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-subheader>Tipo de Pagamento</v-subheader>
                        <v-select v-model="purchaseOrderSelect.paymentType" :items="payments" :item-value="'idPaymentMethod'" :item-text="'paymentType'" filled dense></v-select>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Fechar
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="salvarConta(purchaseOrderSelect)">
                    Salvar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog> -->
      </v-container>
    </v-app>
  </div>
</template>

<script>
import register from "@/store/modules/purchaseorder";
import registerUser from "@/store/modules/users";
import registerPets from "@/store/modules/pets";
import registerServices from "@/store/modules/services";
import registerPayment from "@/store/modules/payment";
import Alert from "@/components/Alerts.js";
import enums from "../.././Enums.js";
export default {
  name: "PagePurchaseOrder",
  data() {
    return {
      purchaseOrder: {
        id: "",
        idPartner: "",
        idUser: "",
        idPet: "",
        idPaymentMethod: "",
        fullName: "",
        cpf: "",
        email: "",
        purchaseOrderSituation: 0,
        paymentSituation: 0,
        observations: "",
        writeDate: "",
        purchaseOrderItem: []
      },
      purchaseOrders: [],
      payments: [],
      clients: [],
      pets: [],
      services: [],
      servicesAdd: [],
      // servicesAdd: [{ idService: "", Quantity: 0 }],
      servicesQnty: 1,
      purchaseOrderSelect: {
        id: "",
        idPartner: "",
        idUser: "",
        idPet: "",
        idPaymentMethod: "",
        fullName: "",
        cpf: "",
        email: "",
        purchaseOrderSituation: 0,
        paymentSituation: 0,
        observations: "",
        writeDate: "",
        purchaseOrderItem: []
      },
      purchaseOrderItem: {
        id: "",
        idPurchaseOrder: "",
        purchaseOrder: "",
        idService: "",
        quantity: "",
        value: "",
        writeDate: "",
        delete: false,
      },
      purchaseOrderItens: [],
      paymentType: enums.PaymentType,
      editedIndex: -1,
      isOutflow: false,
      errors: [],
      search: "",
      dialog: false,
      dialogPost: false,
      dialogDelete: false,
      details: false,
      isApp: false,
      headers: [
        {
          text: "Situação",
          align: "center",
          value: "purchaseOrderSituation",
        },
        { text: "Identificador", align: "center", value: "idPurchaseOrder" },
        { text: "Animal", align: "center", value: "idPet" },
        { text: "Cliente", align: "center", value: "idUser" },
        { text: "CPF", align: "center", value: "cpf" },
        { text: "Pagamento", align: "center", value: "idPaymentMethod" },
        { text: "Valor Total", align: "center", value: "totalValue" },
        { text: "Data da Compra", align: "center", value: "createDate" },
        { text: "Ações", align: "center", value: "actions", sortable: false },
      ],
    };
  },
  mounted() {
    this.listar();
    this.listarPagamentos();
    this.listarClientes();
    this.listarServices();
    // this.listarPetUser()
  },
  computed: {},
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    servicesAddWatch() {
      this.servicesQnty;
    },
  },
  methods: {
    getColor(isOutflow) {
      return isOutflow ? "red" : "green";
    },
    getColorStatus(status) {
      switch (status) {
        case "Pago":
          return "light-green darken-3";
        case "Recebido":
          return "light-green darken-3";
        case "Pendente":
          return "yellow darken-3";
        case "Cancelado":
          return "red darken-3";
        case "Em atraso":
          return "orange accent-4";
        default:
          return "white";
      }
    },
    async listar() {
      await register
        .getPurchaseOrderUser(this.isApp)
        .then((response) => {
          this.purchaseOrders = response.data.data;
          console.log("listar purchaseOrders: ", this.purchaseOrders);
          console.log("listar ", this.purchaseOrders);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async listarPagamentos() {
      await registerPayment
        .getPaymentMethods()
        .then((response) => {
          this.payments = response.data.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async listarClientes() {
      await registerUser
        .getAllClients()
        .then((response) => {
          this.clients = response.data.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async listarPetUser(id) {
      await registerPets
        .getPetUser(id)
        .then((response) => {
          this.pets = response.data.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async listarServices() {
      await registerServices
        .getServices()
        .then((response) => {
          this.services = response.data.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async writeOff(id) {
      await register.writeOffBill(id).then(() => {
        this.purchaseOrderSelect = {};
        this.errors = {};
        this.listar();
        Alert.ShowAlertSuccess.Alert("Venda gerada com sucesso!");
      });
    },
    criarVenda(purchaseOrderSelect, servicesAdd) {
      purchaseOrderSelect.purchaseOrderItem.push(servicesAdd);
      this.servicesAdd = {};
      register
        .postPurchaseOrder(purchaseOrderSelect)
        .then(() => {
          this.purchaseOrderSelect = {};
          this.errors = {};
          this.listar(this.isApp);
          Alert.ShowAlertSuccess.Alert("Venda gerada com sucesso!");
        })
        .catch((e) => {
          this.errors = e.response.data.data.errors;
        });
      this.close();
    },
    salvarVenda(purchaseOrderSelect) {
      purchaseOrderSelect = this.purchaseOrderSelect;
      register
        .putPurchaseOrder(purchaseOrderSelect)
        .then(() => {
          (this.purchaseOrderSelect = {}), (this.errors = {});
          this.listar(this.isApp);
          Alert.ShowAlertSuccess.Alert("Venda atualizada com sucesso!");
        })
        .catch((e) => {
          this.errors = e.response.data.errors;
        });
      this.close();
    },
    editar(user) {
      this.user = user;
    },
    remover(purchaseOrder) {
      // var result = Alert.ShowAlertAlert('Você tem certeza que quer deletar esta venda?')
      //if(result){
      register
        .deletePurchaseOrder(purchaseOrder.idPurchaseOrder)
        .then((response) => {
          this.listar();
          this.errors = {};
          console.log("remover: ", response);
          Alert.ShowAlertSuccess("Serviço deletado com sucesso!");
        })
        .catch((e) => {
          this.errors = e.response.data.errors;
        });
      //}
      this.closeDelete();
    },
    async getItem(id) {
      await register
        .getPurchaseOrderId(id)
        .then((response) => {
          this.purchaseOrderSelect = response.data.data.purchaseOrderItem;
          this.purchaseOrderSelect.id = response.data.data.idPurchaseOrder;
          this.details = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    createItem() {
      this.dialogPost = true;
    },
    editItem(item) {
      this.editedIndex = this.purchaseOrders.indexOf(item);
      this.purchaseOrderSelect = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.purchaseOrders.indexOf(item);
      this.purchaseOrderSelect = Object.assign({}, item);
      this.dialogDelete = true;
    },
    close() {
      this.dialog = false;
      this.dialogPost = false;
      this.$nextTick(() => {
        (this.purchaseOrderSelect = {}), (this.editedIndex = -1);
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        (this.purchaseOrderSelect = {}), (this.editedIndex = -1);
      });
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(
          this.purchaseOrders[this.editedIndex],
          this.purchaseOrderSelect
        );
      } else {
        this.purchaseOrders.push(this.purchaseOrderSelect);
      }
      this.close();
    },
  },
};
</script>
