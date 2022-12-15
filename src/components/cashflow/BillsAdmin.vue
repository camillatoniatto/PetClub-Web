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
        <br />

        <v-card-title v-if="!loading">
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
          :items="allCashflow"
          :search="search"
          v-if="!loading"
        >
          <template v-slot:item="row">
            <tr>
              <td>
                <v-chip
                  dark
                  :color="getColor(row.item.isOutflow)"
                  class="align-center my-5 md-2 white-text"
                  >{{ movimentacao(row.item.isOutflow) }}</v-chip
                >
              </td>
              <td>{{ row.item.userCreateName }}</td>
              <td>{{ row.item.title }}</td>
              <td>{{ row.item.expirationDate }}</td>
              <td>{{ row.item.writeOffDate }}</td>
              <td>
                <v-chip
                  dark
                  :color="getColorStatus(row.item.status)"
                  class="align-center my-5 md-2 white-text"
                  >{{ row.item.status }}</v-chip
                >
              </td>
              <td>
                <v-icon
                  v-if="
                    (row.item.idPurchaseOrder == '' ||
                      row.item.idPurchaseOrder == null) &&
                    row.item.idUserWriteOff == ''
                  "
                  medium
                  class="mr-2"
                  @click="writeOff(row.item.id)"
                  >mdi-cash-check</v-icon
                >
                <v-icon small @click="deleteItem(row.item)"
                  >mdi-close-circle</v-icon
                >
              </td>
            </tr>
          </template>
        </v-data-table>

        <v-progress-circular
          v-else
          :size="100"
          indeterminate
          x-large
          color="teal darken-4"
        ></v-progress-circular>

        <!-- delete dialog -->
        <v-dialog v-model="dialogDelete" max-width="50%">
          <v-card>
            <v-alert dense outlined prominent type="error">
              <h3 class="text-h5">Atenção!</h3>
              <div>
                Você tem certeza que deseja remover essa movimentação de caixa?
                Essa ação não poderá ser desfeita.
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
                    @click="remover(cashflowSelect.id)"
                  >
                    Sim
                  </v-btn>
                </v-col>
              </v-row>
            </v-alert>
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
                  label="Saída de caixa"
                ></v-checkbox>
                <v-row>
                  <v-col cols="12">
                    <v-select
                      v-model="cashflowSelect.idUserCreate"
                      :items="users"
                      :item-value="'idUser'"
                      :item-text="'fullName'"
                      label="Parceiro Responsável"
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="cashflowSelect.title"
                      label="Titulo"
                      type="text"
                      required
                    ></v-text-field>
                    <v-textarea
                      v-model="cashflowSelect.description"
                      label="Descrição"
                      type="text"
                      required
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-subheader>{{ expirationDateTitle }}</v-subheader>
                    <v-text-field
                      v-model="cashflowSelect.expirationDate"
                      type="Date"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-subheader>{{ writeOffDateTitle }}</v-subheader>
                    <v-text-field
                      v-model="cashflowSelect.writeOffDate"
                      type="Date"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="cashflowSelect.launchValue"
                      label="Valor"
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="cashflowSelect.idPaymentMethod"
                      :items="payments"
                      :item-value="'idPaymentMethod'"
                      :item-text="'paymentType'"
                      label="Tipo de Pagamento"
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey darken-1" dark @click="close"> Fechar </v-btn>
              <v-btn
                color="green lighten-1"
                dark
                @click="criarConta(cashflowSelect)"
              >
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
                    <v-text-field
                      v-model="cashflowSelect.title"
                      label="Titulo"
                      type="text"
                      required
                      outlined
                    ></v-text-field>
                    <v-text-field
                      v-model="cashflowSelect.description"
                      label="Descrição"
                      type="text"
                      required
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-subheader>{{ expirationDateTitle }}</v-subheader>
                    <v-text-field
                      v-model="cashflowSelect.expirationDate"
                      type="Date"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-subheader>{{ writeOffDateTitle }}</v-subheader>
                    <v-text-field
                      v-model="cashflowSelect.writeOffDate"
                      type="Date"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="cashflowSelect.launchValue"
                      label="Valor"
                      type="number"
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-subheader>Tipo de Pagamento</v-subheader>
                    <v-select
                      v-model="cashflowSelect.paymentType"
                      :items="payments"
                      :item-value="'idPaymentMethod'"
                      :item-text="'paymentType'"
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey darken-1" dark @click="close"> Fechar </v-btn>
              <v-btn
                color="green lighten-1"
                dark
                @click="salvarConta(cashflowSelect)"
              >
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
import register from "@/store/modules/cashflow";
import registerPayment from "@/store/modules/payment";
import registerUser from "@/store/modules/users";
import enums from "../.././Enums.js";
export default {
  name: "PageCashflow",
  data() {
    return {
      cashflow: {
        id: "",
        title: "",
        description: "",
        idUserCreate: "",
        idPurchaseOrder: "",
        idPaymentMethod: "",
        launchValue: 0,
        netValue: 0,
        expirationDate: "",
        writeOffDate: "",
        idUserWriteOff: "",
        idUserInactivate: "",
        isOutflow: false,
        writeDate: "",
      },
      allCashflow: [],
      payments: [],
      users: [],
      cashflowSelect: {
        id: "",
        title: "",
        description: "",
        idUserCreate: "",
        idPurchaseOrder: "",
        idPaymentMethod: "",
        launchValue: 0,
        netValue: 0,
        expirationDate: "",
        writeOffDate: "",
        idUserWriteOff: "",
        idUserInactivate: "",
        isOutflow: false,
        writeDate: "",
      },
      cashflowEdit: {
        id: "",
        title: "",
        description: "",
        idUserCreate: "",
        idPurchaseOrder: "",
        idPaymentMethod: "",
        launchValue: 0,
        netValue: 0,
        expirationDate: "",
        writeOffDate: "",
        idUserWriteOff: "",
        idUserInactivate: "",
        isOutflow: false,
        writeDate: "",
      },
      paymentType: enums.PaymentType,
      editedIndex: -1,
      isOutflow: false,
      search: "",
      dialog: false,
      dialogPost: false,
      dialogDelete: false,
      loading: false,
      headers: [
        {
          text: "Tipo",
          align: "center",
          value: "isOutflow",
        },
        {
          text: "Responsável",
          align: "center",
          value: "userCreateName",
        },
        { text: "Titulo", align: "center", value: "title" },
        {
          text: "Data de Vencimento",
          align: "center",
          value: "expirationDate",
        },
        { text: "Data da Baixa", align: "center", value: "writeOffDate" },
        { text: "Status", align: "center", value: "status" },
        { text: "Ações", align: "center", value: "actions", sortable: false },
      ],
    };
  },
  mounted() {
    this.listar();
    this.listarPagamentos();
    this.listarUsers();
  },
  computed: {
    formTitle() {
      return !this.cashflowSelect.isOutflow
        ? "Entrada de Caixa"
        : "Saída de Caixa";
    },
    expirationDateTitle() {
      return !this.cashflowSelect.isOutflow
        ? "Previsão de Recebimento"
        : "Data de Vencimento";
    },
    writeOffDateTitle() {
      return !this.cashflowSelect.isOutflow
        ? "Data do Recebimento"
        : "Data de Baixa";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  methods: {
    formatPrice(value) {
      return Number(value.replace(",", "."));
    },
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
    async listarUsers() {
      await registerUser
        .getAllPartners()
        .then((response) => {
          this.users = response.data.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    movimentacao(isOutflow) {
      return isOutflow ? "Saída" : "Entrada";
    },
    async listar() {
      this.loading = true
      await register
        .getCashflow()
        .then((response) => {
          this.allCashflow = response.data.data;
          console.log("listar allCashflow: ", this.allCashflow);
          console.log("listar ", this.allCashflow);
        this.loading = false
        })
        .catch((e) => {
          console.log(e);
          this.loading = false
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
    async writeOff(id) {
      await register
        .writeOffBill(id)
        .then(() => {
          this.cashflowSelect = {};
          this.listar();
          this.showAlertSuccess("Baixa realizada com sucesso!");
        })
        .catch((e) => {
          this.showAlertError(e.response.data.errors[0].message);
        });
      this.close();
    },
    criarConta(cashflowSelect) {
      if (cashflowSelect.writeOffDate == "") {
        var minDate = new Date("0001-01-01T00:00:00Z");
        cashflowSelect.writeOffDate = minDate;
      }
      this.cashflowEdit.title = cashflowSelect.title;
      this.cashflowEdit.description = cashflowSelect.description;
      this.cashflowEdit.idUserCreate = cashflowSelect.idUserCreate;
      this.cashflowEdit.idPurchaseOrder = cashflowSelect.idPurchaseOrder;
      this.cashflowEdit.idPaymentMethod = cashflowSelect.idPaymentMethod;
      this.cashflowEdit.launchValue = cashflowSelect.launchValue;
      this.cashflowEdit.expirationDate = cashflowSelect.expirationDate;
      this.cashflowEdit.writeOffDate = cashflowSelect.writeOffDate;
      this.cashflowEdit.isOutflow = cashflowSelect.isOutflow;
      register
        .postCashflow(cashflowSelect)
        .then(() => {
          this.cashflowSelect = {};
          this.cashflowEdit = {};
          this.listar();
          this.showAlertSuccess("Movimentação registrada com sucesso!");
          this.close();
        })
        .catch((e) => {
          this.showAlertError(e.response.data.errors[0].message);
        });
    },
    salvarConta(cashflowSelect) {
      this.cashflowEdit.title = cashflowSelect.title;
      this.cashflowEdit.description = cashflowSelect.description;
      this.cashflowEdit.idUserCreate = cashflowSelect.idUserCreate;
      this.cashflowEdit.idPurchaseOrder = cashflowSelect.idPurchaseOrder;
      this.cashflowEdit.idPaymentMethod = cashflowSelect.idPaymentMethod;
      this.cashflowEdit.launchValue = cashflowSelect.launchValue;
      this.cashflowEdit.expirationDate = cashflowSelect.expirationDate;
      this.cashflowEdit.writeOffDate = cashflowSelect.writeOffDate;
      this.cashflowEdit.isOutflow = cashflowSelect.isOutflow;
      register
        .putCashflow(this.cashflowEdit)
        .then(() => {
          this.cashflowSelect = {};
          this.cashflowEdit = {};
          this.listar();
          this.showAlertSuccess("Movimentação atualizada com sucesso!");
          this.close();
        })
        .catch((e) => {
          this.showAlertError(e.response.data.errors[0].message);
        });
    },
    editar(user) {
      this.user = user;
    },
    remover(id) {
      register
        .deleteCashflow(id)
        .then((response) => {
          this.listar();
          console.log("remover: ", response);
          this.showAlertSuccess("Movimentação deletada com sucesso!");
          this.close();
        })
        .catch((e) => {
          this.showAlertError(e.response.data.errors[0].message);
        });
    },
    createItem() {
      this.dialogPost = true;
    },
    editItem(item) {
      this.editedIndex = this.allCashflow.indexOf(item);
      this.cashflowSelect = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.allCashflow.indexOf(item);
      this.cashflowSelect = Object.assign({}, item);
      this.dialogDelete = true;
    },
    close() {
      this.dialog = false;
      this.dialogPost = false;
      this.dialogDelete = false;

      this.$nextTick(() => {
        (this.cashflowSelect = {}), (this.editedIndex = -1);
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        (this.cashflowSelect = {}), (this.editedIndex = -1);
      });
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.allCashflow[this.editedIndex], this.cashflowSelect);
      } else {
        this.allCashflow.push(this.cashflowSelect);
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
