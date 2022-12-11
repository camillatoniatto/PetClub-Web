<template>
  <div id="app">
    <v-app id="inspire">
      <!-- adicionar novo -->
      <v-container>
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
          :items="purchaseOrders"
          :search="search"
          v-if="!loading"
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
              <td>{{ row.item.partnerName }}</td>
              <td>{{ row.item.petName }}</td>
              <td>{{ row.item.paymentType }}</td>
              <td>R$ {{ row.item.totalValue }}</td>
              <td>{{ row.item.createDate }}</td>
              <td>
                <v-icon small @click="getItem(row.item.idPurchaseOrder)"
                  >mdi-eye-outline</v-icon
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

        <v-dialog v-model="details" max-width="40%">
          <v-container class="px-4 py-4">
            <v-data-iterator :items="purchaseOrderSelect" hide-default-footer>
              <template v-slot:header>
                <v-toolbar class="mb-2" color="green darken-3" dark flat>
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
                    :key="item.idPurchaseOrderItem"
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
      </v-container>
    </v-app>
  </div>
</template>

<script>
import register from "@/store/modules/purchaseorder";
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
        purchaseOrderItem: [],
      },
      purchaseOrders: [],
      services: [],
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
        purchaseOrderItem: [],
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
      search: "",
      loading: false,
      details: false,
      headers: [
        {
          text: "Situação",
          align: "center",
          value: "purchaseOrderSituation",
        },
        { text: "Identificador", align: "center", value: "idPurchaseOrder" },
        { text: "Parceiro", align: "center", value: "partnerName" },
        { text: "Animal", align: "center", value: "petName" },
        { text: "Pagamento", align: "center", value: "paymentType" },
        { text: "Valor Total", align: "center", value: "totalValue" },
        { text: "Data da Compra", align: "center", value: "createDate" },
        {
          text: "Serviços",
          align: "center",
          value: "actions",
          sortable: false,
        },
      ],
    };
  },
  mounted() {
    this.listar();
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
      this.loading = true;
      await register
        .getPurchaseOrderUser(true)
        .then((response) => {
          this.purchaseOrders = response.data.data;
          console.log("listar purchaseOrders: ", this.purchaseOrders);
          console.log("listar ", this.purchaseOrders);
          this.loading = false;
        })
        .catch((e) => {
          this.loading = false;
          console.log(e);
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
  },
};
</script>
