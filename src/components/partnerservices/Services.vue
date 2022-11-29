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

        <br />

        <!-- tabela reserva -->
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="services" :search="search">
          <template v-slot:item="row">
            <tr>
              <td>{{ row.item.title }}</td>
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

        <!-- delete dialog -->
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-center">
              <v-icon x-large icon dark color="center yellow lighten-2"
                >mdi-alert-outline</v-icon
              >
              <br />
              <h3>Você tem certeza que deseja deletar esse serviço?</h3>
            </v-card-title>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancelar</v-btn
              >
              <v-btn
                color="blue darken-1"
                text
                @click="remover(serviceSelecionado)"
                >Sim</v-btn
              >
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
                  <v-col cols="12">
                    <v-text-field
                      v-model="serviceSelecionado.title"
                      label="Titulo"
                      type="text"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="serviceSelecionado.description"
                      label="Descrição"
                      type="text"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="serviceSelecionado.value"
                      label="Valor"
                      type="text"
                    ></v-text-field>
                    <v-subheader>Tipo de Serviço</v-subheader>
                    <v-select
                      v-model="serviceSelecionado.serviceType"
                      :items="serviceType"
                      :item-value="'key'"
                      :item-text="'value'"
                      label="Selecionar..."
                      filled
                      dense
                    ></v-select>
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
      serviceDefault: {
        idService: "",
        title: "",
        description: "",
        serviceType: "",
        value: 0,
      },
      serviceType: enums.ServiceType,
      editedIndex: -1,
      errors: [],
      search: "",
      dialog: false,
      dialogDelete: false,
      admin: true,
      headers: [
        {
          text: "Titulo",
          align: "center",
          value: "title",
        },
        { text: "Tipo de Serviço", align: "center", value: "serviceType" },
        { text: "Valor", align: "center", value: "value" },
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
    formatPrice(value) {
      return Number(value.replace(",", "."));
    },
    listar() {
      register
        .getServices()
        .then((response) => {
          this.services = response.data.data;
        })
        .catch((e) => {
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
    salvar(serviceSelecionado) {
      var valorNovo = this.formatPrice(serviceSelecionado.value);
      serviceSelecionado.value = valorNovo;
      if (!serviceSelecionado.id) {
        register
          .postService(serviceSelecionado)
          .then((response) => {
            serviceSelecionado = {};
            console.log("postService: ", response.data.data);
            serviceSelecionado = this.serv;
            this.listar();
            this.errors = {};
            this.showAlertSuccess("Serviço atualizado com sucesso!");
          })
          .catch(e => {
            this.showAlertError(e.response.data.errors[0].message);
          });
      } else {
        register
          .putService(serviceSelecionado)
          .then((response) => {
            serviceSelecionado = this.serviceDefault;
            this.errors = {};
            console.log("putService: ", response.data.data);
            this.listar();
            this.showAlertSuccess("Serviço cadastrado com sucesso!");
          })
          .catch(e => {
            this.showAlertError(e.response.data.errors[0].message);
          });
      }
      this.close();
    },
    editar(service) {
      this.service = service;
    },
    remover(service) {
      register
        .deleteService(service.idService)
        .then(() => {
          this.listar();
          this.errors = {};
          this.showAlertSuccess("Serviço deletado com sucesso!");
        })
        .catch((e) => {
          this.showAlertError(e.response.data.errors[0].message);
        });
      this.closeDelete();
    },
    editItem(item) {
      this.editedIndex = this.services.indexOf(item);
      this.serviceSelecionado = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.services.indexOf(item);
      this.serviceSelecionado = Object.assign({}, item);
      this.dialogDelete = true;
    },
    close() {
      this.dialog = false;
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
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.services[this.editedIndex], this.serviceSelecionado);
      } else {
        this.services.push(this.serviceSelecionado);
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
