<template>
  <div id="app">
    <v-app id="inspire">
      <v-container>
        <div class="text-left mb-2 mr-2">
          <v-btn color="dark" dark @click="createItem()">
            <v-icon dark>mdi-plus</v-icon>
            Adicionar um serviço
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
          :items="services"
          :search="search"
          v-if="!loading"
        >
          <template v-slot:item="row">
            <tr>
              <td>
                <v-img
                  contain
                  max-height="140"
                  max-width="140"
                  :src="getIcon(row.item.serviceType)"
                ></v-img>
              </td>
              <td>{{ row.item.title }}</td>
              <td>{{ row.item.description }}</td>
              <td>{{ row.item.serviceTypeString }}</td>
              <td>R$ {{ row.item.valueString }}</td>
              <td>{{ row.item.sold }}</td>
              <td>
                <v-icon small class="mr-2" @click="editItem(row.item)"
                  >mdi-pencil</v-icon
                >
                <v-icon small @click="deleteItem(row.item)">mdi-delete</v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>
        <v-card-actions v-else class="d-flex justify-center">
          <v-progress-circular
            indeterminate
            :size="100"
            color="teal darken-4"
          ></v-progress-circular>
        </v-card-actions>
        <!-- delete dialog -->
        <v-dialog v-model="dialogDelete" max-width="50%">
          <v-card>
            <v-alert dense outlined prominent type="error">
              <h3 class="text-h5">Atenção!</h3>
              <div>
                Você tem certeza que deseja deletar esse serviço? Essa ação não
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
                    @click="remover(serviceSelecionado)"
                  >
                    Sim
                  </v-btn>
                </v-col>
              </v-row>
            </v-alert>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogCreate" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Cadastrar Serviço</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" class="d-flex justify-center">
                    <v-card
                      ><v-img
                        contain
                        max-height="140"
                        max-width="140"
                        :src="getIcon(serviceSelecionado.serviceType)"
                      ></v-img
                    ></v-card>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="serviceSelecionado.title"
                      label="Titulo"
                      type="text"
                      required
                      outlined
                    ></v-text-field>
                    <v-text-field
                      v-model="serviceSelecionado.description"
                      label="Descrição"
                      type="text"
                      required
                      outlined
                    ></v-text-field>
                    <v-text-field
                      v-model="serviceSelecionado.value"
                      label="Valor"
                      type="number"
                      outlined
                    ></v-text-field>
                    <v-subheader>Tipo de Serviço</v-subheader>
                    <v-select
                      v-model="serviceSelecionado.serviceType"
                      :items="serviceType"
                      :item-value="'key'"
                      :item-text="'value'"
                      label="Selecionar..."
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
                @click="criar(serviceSelecionado)"
              >
                Salvar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogUpdate" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Editar Serviço</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" class="d-flex justify-center">
                    <v-card
                      ><v-img
                        contain
                        max-height="140"
                        max-width="140"
                        :src="getIcon(serviceSelecionado.serviceType)"
                      ></v-img
                    ></v-card>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="serviceSelecionado.title"
                      label="Titulo"
                      type="text"
                      required
                      outlined
                    ></v-text-field>
                    <v-text-field
                      v-model="serviceSelecionado.description"
                      label="Descrição"
                      type="text"
                      required
                      outlined
                    ></v-text-field>
                    <v-text-field
                      v-model="serviceSelecionado.value"
                      label="Valor"
                      type="text"
                      outlined
                    ></v-text-field>
                    <v-subheader>Tipo de Serviço</v-subheader>
                    <v-select
                      v-model="serviceSelecionado.serviceType"
                      :items="serviceType"
                      :item-value="'key'"
                      :item-text="'value'"
                      label="Selecionar..."
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
                @click="salvar(serviceSelecionado)"
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
import register from "@/store/modules/services";
import enums from "../.././Enums.js";
export default {
  name: "PageService",
  data() {
    return {
      service: {
        idService: "",
        title: "",
        description: "",
        serviceType: "",
        serviceNumber: "",
        value: 0,
        valueString: "",
      },
      services: [],
      serviceSelecionado: {
        idService: "",
        title: "",
        description: "",
        serviceType: "",
        value: 0,
      },
      serviceEdit: {
        idService: "",
        title: "",
        description: "",
        serviceType: "",
        value: 0,
      },
      serviceType: enums.ServiceType,
      editedIndex: -1,
      search: "",
      dialogCreate: false,
      dialogUpdate: false,
      dialogDelete: false,
      loading: false,
      admin: true,
      headers: [
        { text: " ", align: "center", value: "image", filterable: false },
        { text: "Titulo", align: "center", value: "title" },
        { text: "Descrição", align: "center", value: "description" },
        {
          text: "Tipo de Serviço",
          align: "center",
          value: "serviceTypeString",
        },
        { text: "Valor", align: "center", value: "valueString" },
        { text: "Realizações", align: "center", value: "sold" },
        { text: "Ações", align: "center", value: "actions", sortable: false },
      ],
    };
  },
  mounted() {
    this.listar();
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Cadastrar serviço" : "Editar serviço";
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
    getIcon(type) {
      switch (type) {
        case 0:
          return require("../.././assets/pictures/iconHospedagem.png");
        case 1:
          return require("../.././assets/pictures/iconPasseio.png");
        case 2:
          return require("../.././assets/pictures/iconVet.png");
        case 3:
          return require("../.././assets/pictures/iconGrooming.png");
        default:
          return require("../.././assets/pictures/iconPet.png");
      }
    },
    // formatPrice(value) {
    //   return Number(value.replace(",", "."));
    // },
    listar() {
      this.loading = true;
      register
        .getServices()
        .then((response) => {
          this.services = response.data.data;
          this.loading = false;
        })
        .catch((e) => {
          this.loading = false;
          console.log(e);
        });
    },
    listarServiceUser() {
      register
        .getServiceUser()
        .then((response) => {
          this.services = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    criar(serviceSelecionado) {
      register
        .postService(serviceSelecionado)
        .then(() => {
          serviceSelecionado = {};
          this.listar();
          this.showAlertSuccess("Serviço cadastrado com sucesso!");
          this.close();
        })
        .catch((e) => {
          this.showAlertError(e.response.data.errors[0].message);
        });
    },
    salvar(serviceSelecionado) {
      this.serviceEdit.idService = serviceSelecionado.idService;
      this.serviceEdit.title = serviceSelecionado.title;
      this.serviceEdit.description = serviceSelecionado.description;
      this.serviceEdit.value = serviceSelecionado.value;
      this.serviceEdit.serviceType = serviceSelecionado.serviceType;
      register
        .putService(this.serviceEdit)
        .then(() => {
          this.serviceSelecionado = {};
          this.listar();
          this.showAlertSuccess("Serviço atualizado com sucesso!");
          this.close();
        })
        .catch((e) => {
          this.showAlertError(e.response.data.errors[0].message);
        });
    },
    editar(service) {
      this.service = service;
    },
    remover(service) {
      register
        .deleteService(service.idService)
        .then(() => {
          this.listar();
          this.showAlertSuccess("Serviço deletado com sucesso!");
        })
        .catch((e) => {
          this.showAlertError(e.response.data.errors[0].message);
        });
      this.closeDelete();
    },
    createItem() {
      this.serviceSelecionado = {};
      this.dialogCreate = true;
    },
    editItem(item) {
      this.editedIndex = this.services.indexOf(item);
      this.serviceSelecionado = Object.assign({}, item);
      this.dialogUpdate = true;
    },
    deleteItem(item) {
      this.editedIndex = this.services.indexOf(item);
      this.serviceSelecionado = Object.assign({}, item);
      this.dialogDelete = true;
    },
    close() {
      this.dialogCreate = false;
      this.dialogUpdate = false;
      this.$nextTick(() => {
        (this.serviceSelecionado = {}), (this.editedIndex = -1);
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        (this.serviceSelecionado = {}), (this.editedIndex = -1);
      });
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
