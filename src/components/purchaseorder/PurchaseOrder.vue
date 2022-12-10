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
                <v-icon
                  small
                  v-if="showCancelOrder(row.item.purchaseOrderSituation)"
                  @click="deleteItem(row.item)"
                  >mdi-close-circle</v-icon
                >
              </td>
            </tr>
          </template>
        </v-data-table>

        <v-dialog v-model="details" max-width="40%">
          <v-container class="px-4 py-4">
            <v-data-iterator :items="purchaseOrderSelect" hide-default-footer>
              <template v-slot:header>
                <v-toolbar class="mb-2" color="teal darken-4" dark flat>
                  <v-toolbar-title
                    >Serviços da venda "{{
                      purchaseOrderSelect.id
                    }}"</v-toolbar-title
                  >
                </v-toolbar>
              </template>
              <template v-slot:default="props">
                <v-row>
                  <v-col
                    v-for="item in props.items"
                    :key="item.purchaseOrderItem"
                    cols="12"
                  >
                    <v-card>
                      <v-card-title class="subheading font-weight-bold">
                        Serviço: {{ item.title }}
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
                  <v-col v-if="purchaseOrderSelect.observations">
                    <v-card>
                      Obervações da venda:
                      {{ purchaseOrderSelect.observations }}
                    </v-card>
                  </v-col>
                </v-row>
              </template>
            </v-data-iterator>
          </v-container>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="50%">
          <v-card>
            <v-alert dense outlined prominent type="error">
              <h3 class="text-h5">Atenção!</h3>
              <div>
                Você tem certeza que deseja cancelar essa venda? Essa ação não
                poderá ser desfeita.
              </div>
              <v-divider class="my-4 info" style="opacity: 0.22"></v-divider>
              <v-row align="center" no-gutters>
                <v-col>
                  <v-btn color="blue-grey darken-2" dark @click="closeDelete"
                    >Não</v-btn
                  >
                </v-col>
                <v-col>
                  <v-btn
                    color="red accent-3"
                    dark
                    @click="remover(purchaseOrderSelect)"
                  >
                    Sim
                  </v-btn>
                </v-col>
              </v-row>
            </v-alert>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogPost" max-width="600px">
          <div @click="getValue(purchaseOrderSelect.purchaseOrderItens)">
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
                        @click="listarPetUser(purchaseOrderSelect.idUser)"
                        :items="clients"
                        :item-value="'idUser'"
                        :item-text="'userFullName'"
                        label="Cliente"
                        outlined
                        dense
                      ></v-select>
                      <v-select
                        @click="listarPetUser(purchaseOrderSelect.idUser)"
                        v-model="purchaseOrderSelect.idPet"
                        label="Pet"
                        :items="pets"
                        :item-value="'idPet'"
                        :item-text="'name'"
                        outlined
                        dense
                      ></v-select>
                      <v-select
                        v-model="purchaseOrderSelect.idPaymentMethod"
                        :items="payments"
                        :item-value="'idPaymentMethod'"
                        :item-text="'paymentType'"
                        label="Tipo de Pagamento"
                        outlined
                        dense
                      ></v-select>
                    </v-col>
                  </v-row>

                  <v-divider></v-divider>
                  <v-subheader class="text-h6">Serviços</v-subheader>
                  <div
                    v-for="(
                      service, index
                    ) in purchaseOrderSelect.purchaseOrderItens"
                    v-bind:key="index"
                  >
                    <v-container fluid>
                      <v-row>
                        <v-col cols="6">
                          <v-select
                            v-model="service.idService"
                            :items="services"
                            :item-value="'idService'"
                            :item-text="'title'"
                            label="Selecione..."
                            outlined
                            dense
                          ></v-select>
                        </v-col>

                        <v-col cols="6">
                          <v-text-field
                            v-model="service.quantity"
                            label="Quantidade"
                            type="number"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </div>
                  <div class="d-flex justify-end mb-6">
                    <v-btn
                      color="dark"
                      dark
                      @click="
                        purchaseOrderSelect.purchaseOrderItens.push({
                          idService: '',
                          quantity: 0,
                        })
                      "
                    >
                      <v-icon dark>mdi-plus</v-icon>
                    </v-btn>
                  </div>

                  <v-card
                    class="d-flex justify-space-between mb-6"
                    outlined
                    tile
                  >
                    <v-list-item-title bold class="text-h6 mb-1">
                      Valor Total: R$ {{ value }}
                    </v-list-item-title>
                  </v-card>
                  <v-row>
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
                <v-btn color="grey darken-1" dark @click="close">
                  Fechar
                </v-btn>
                <v-btn
                  color="green lighten-1"
                  dark
                  @click="criarVenda(purchaseOrderSelect)"
                >
                  Salvar
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-dialog>
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
        purchaseOrderItens: [],
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
        purchaseOrderItens: [],
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
      paymentType: enums.PaymentType,
      editedIndex: -1,
      isOutflow: false,
      search: "",
      dialog: false,
      dialogPost: false,
      dialogDelete: false,
      details: false,
      isApp: false,
      value: 0,
      headers: [
        {
          text: "Situação",
          align: "center",
          value: "purchaseOrderSituation",
        },
        { text: "Identificador", align: "center", value: "idPurchaseOrder" },
        { text: "Animal", align: "center", value: "petName" },
        { text: "Cliente", align: "center", value: "fullName" },
        { text: "CPF", align: "center", value: "cpf" },
        { text: "Pagamento", align: "center", value: "paymentType" },
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
    valueWatch() {
      console.log("watch value", this.value);
      if (
        this.purchaseOrderSelect.purchaseOrderItens &&
        this.purchaseOrderSelect.purchaseOrderItens.lenght > 0
      ) {
        this.getValue(this.purchaseOrderSelect.purchaseOrderItens);
      }
      console.log("watch value 2", this.value);
    },
  },
  methods: {
    showCancelOrder(purchaseOrderSituation) {
      if (purchaseOrderSituation != "Cancelado") {
        return true;
      }
    },
    async getValue(services) {
      await register
        .getValueItens(services)
        .then((response) => {
          this.value = response.data.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getColor(isOutflow) {
      return isOutflow ? "red" : "green";
    },
    getColorStatus(status) {
      switch (status) {
        case "Pago":
          return "light-green darken-3";
        case "Concluido":
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
    criarVenda(purchaseOrderSelect) {
      register
        .postPurchaseOrder(purchaseOrderSelect)
        .then(() => {
          this.purchaseOrderSelect = {};
          this.listar(this.isApp);
          this.showAlertSuccess("Venda gerada com sucesso!");
          this.close();
        })
        .catch((e) => {
          this.showAlertError(e.response.data.errors[0].message);
        });
    },
    salvarVenda(purchaseOrderSelect) {
      purchaseOrderSelect = this.purchaseOrderSelect;
      register
        .putPurchaseOrder(purchaseOrderSelect)
        .then(() => {
          this.purchaseOrderSelect = {};
          this.listar(this.isApp);
          this.showAlertSuccess("Venda atalizada com sucesso!");
          this.close();
        })
        .catch((e) => {
          this.showAlertError(e.response.data.errors[0].message);
        });
    },
    editar(user) {
      this.user = user;
    },
    remover(purchaseOrder) {
      register
        .deletePurchaseOrder(purchaseOrder.idPurchaseOrder)
        .then((response) => {
          this.listar();
          console.log("remover: ", response);
          this.showAlertSuccess("Venda deletada com sucesso!");
          this.closeDelete();
        })
        .catch((e) => {
          this.showAlertError(e.response.data.errors[0].message);
        });
    },
    async getItem(id) {
      await register
        .getPurchaseOrderId(id)
        .then((response) => {
          this.purchaseOrderSelect = response.data.data.purchaseOrderItem;
          this.purchaseOrderSelect.id = response.data.data.idPurchaseOrder;
          this.purchaseOrderSelect.observations =
            response.data.data.observations;
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
    showAlertSuccess(message) {
      this.$swal("Sucesso", message, "success");
    },
    showAlertError(message) {
      this.$swal("Oops...", message, "error");
    },
  },
};
</script>
