<template>
  <div id="app">
    <v-app id="inspire">
      <!-- adicionar novo -->
      <v-container>
        <div class="text-left mb-2 mr-2" v-if="checkUser()">
          <v-btn color="dark" dark @click="openCreate()">
            <v-icon dark>mdi-plus</v-icon>
            Criar Agendamento
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
          :headers="getHeaders()"
          :items="scheduler"
          :search="search"
          v-if="!loading"
        >
          <template v-slot:item="row">
            <tr>
              <td v-if="!checkUser()">{{ row.item.partnerName }}</td>
              <td>{{ row.item.petName }}</td>
              <td>{{ row.item.serviceTypeString }}</td>
              <td>{{ row.item.startDateString }}</td>
              <td>{{ row.item.finalDateString }}</td>

              <td>
                <v-chip
                  dark
                  :color="getColorStatus(row.item.schedulerSituationString)"
                  class="align-center my-5 md-2 white-text"
                  >{{
                    row.item.schedulerSituationString == "Agendado"
                      ? `Agendado - Faltam ${setStartDateInterval(
                          row.item.startDateString
                        )} dias`
                      : row.item.schedulerSituationString
                  }}</v-chip
                >
              </td>

              <td v-if="checkUser()">
                <v-icon small class="mr-2" @click="editItem(row.item)"
                  >mdi-pencil</v-icon
                >
                <v-icon small @click="remover(row.item)">mdi-close-circle</v-icon>
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
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-center">
              <v-icon x-large icon dark color="yellow lighten-2"
                >mdi-alert-outline</v-icon
              >
              <br />
              <h3>Você tem certeza que deseja deletar esse Agendamento?</h3>
            </v-card-title>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green lighten-1" dark @click="closeDelete"
                >Cancelar</v-btn
              >
              <v-btn
                color="green lighten-1"
                dark
                @click="remover(schedulerSelecionado)"
                >Sim</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogCreate" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Criar Agendamento</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="8" md="6">
                    <v-select
                      v-model="schedulerSelecionado.idClient"
                      label="Cliente"
                      :items="clients"
                      :item-value="'idUser'"
                      :item-text="'userFullName'"
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="8" md="6">
                    <v-select
                      @click="listaPetUser(schedulerSelecionado.idClient)"
                      v-model="schedulerSelecionado.idPet"
                      label="Pet"
                      :items="petuser"
                      :item-value="'idPet'"
                      :item-text="'name'"
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="14" md="12">
                    <v-select
                      v-model="schedulerSelecionado.serviceType"
                      label="Tipo de Serviço"
                      :items="servicetype"
                      :item-value="'key'"
                      :item-text="'value'"
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="8" md="6">
                    <v-text-field
                      v-model="schedulerSelecionado.startDate"
                      label="Data Inicio"
                      type="datetime-local"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="8" md="6">
                    <v-text-field
                      v-model="schedulerSelecionado.finalDate"
                      label="Data Final"
                      type="datetime-local"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-col cols="12" md="6">
                <v-select
                  v-model="schedulerSelecionado.schedulerSituation"
                  label="Situação"
                  :items="situation"
                  :item-value="'key'"
                  :item-text="'value'"
                  outlined
                  dense
                ></v-select>
              </v-col>
              <v-spacer></v-spacer>
              <v-btn color="grey darken-1" dark @click="close"> Fechar </v-btn>
              <v-btn
                color="green lighten-1"
                dark
                @click="criarAgendamento(schedulerSelecionado)"
              >
                Salvar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogUpdate" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Editar Agendamento</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="8" md="6">
                    <v-select
                      v-model="schedulerSelecionado.idClient"
                      label="Cliente"
                      :items="clients"
                      :item-value="'idUser'"
                      :item-text="'userFullName'"
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="8" md="6">
                    <v-select
                      @click="listaPetUser(schedulerSelecionado.idClient)"
                      v-model="schedulerSelecionado.idPet"
                      label="Pet"
                      :items="petuser"
                      :item-value="'idPet'"
                      :item-text="'name'"
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="14" md="12">
                    <v-select
                      v-model="schedulerSelecionado.serviceType"
                      label="Tipo de Serviço"
                      :items="servicetype"
                      :item-value="'key'"
                      :item-text="'value'"
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="8" md="6">
                    <v-text-field
                      v-model="schedulerSelecionado.startDate"
                      label="Data Inicio"
                      type="datetime-local"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="8" md="6">
                    <v-text-field
                      v-model="schedulerSelecionado.finalDate"
                      label="Data Final"
                      type="datetime-local"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-col cols="12" md="6">
                <v-select
                  v-model="schedulerSelecionado.schedulerSituation"
                  label="Situação"
                  :items="situation"
                  :item-value="'key'"
                  :item-text="'value'"
                  outlined
                  dense
                ></v-select>
              </v-col>
              <v-spacer></v-spacer>
              <v-btn color="grey darken-1" dark @click="close"> Fechar </v-btn>
              <v-btn
                color="green lighten-1"
                dark
                @click="editarAgendamento(schedulerSelecionado)"
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
import register from "@/store/modules/scheduler";
import registers from "@/store/modules/users";
import registerpet from "@/store/modules/pets";
import enums from "../.././Enums.js";
import moment from "moment";
export default {
  name: "PageScheduler",
  data() {
    return {
      schedulers: {
        idScheduler: "",
        idPartner: "",
        idPet: "",
        serviceType: "",
        startDate: "",
        finalDate: "",
        schedulerSituation: "",
      },
      schedulerSelecionado: {
        idScheduler: "",
        idPartner: "",
        idPet: "",
        serviceType: "",
        startDate: "",
        finalDate: "",
        schedulerSituation: "",
      },
      schedulerEdit: {
        idScheduler: "",
        idPartner: "",
        idPet: "",
        serviceType: "",
        startDate: "",
        finalDate: "",
        schedulerSituation: "",
      },
      scheduler: [],
      editedIndex: -1,
      search: "",
      dialogCreate: false,
      dialogUpdate: false,
      dialogDelete: false,
      loading: false,
      admin: true,
      headersPartner: [
        { text: "Animal", align: "center", value: "petName" },
        { text: "Serviço", align: "center", value: "serviceTypeString" },
        { text: "Data Inicio", align: "center", value: "startDateString" },
        { text: "Data Final", align: "center", value: "finalDateString" },
        {
          text: "Situação",
          align: "center",
          value: "schedulerSituationString",
        },
        { text: "Ações", align: "center", value: "actions", sortable: false },
      ],
      headers: [
        { text: "Parceiro", align: "center", value: "partnerName" },
        { text: "Pet", align: "center", value: "petName" },
        { text: "Serviço", align: "center", value: "serviceTypeString" },
        { text: "Data Inicio", align: "center", value: "startDateString" },
        { text: "Data Final", align: "center", value: "finalDateString" },
        {
          text: "Situação",
          align: "center",
          value: "schedulerSituationString",
        },
      ],
      situation: enums.SchedulerSituation,
      servicetype: enums.ServiceType,
      clients: [],
      petuser: [],
    };
  },
  mounted() {
    this.listar();
    this.listarClients();
    this.listaPets();
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Cadastrar Agenda" : "Editar Agenda";
    },
    filteredList() {
      return this.scheduler.filter((result) => {
        return result.name.toLowerCase().includes(this.search.toLowerCase());
      });
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
    getColorStatus(status) {
      switch (status) {
        case "Agendado":
          return "light-blue accent-4";
        case "Concluido":
          return "green darken-1";
        case "Cancelado":
          return "red darken-1";
        case "Em Atendimento":
          return "deep-purple lighten-2";
        case "Em atraso":
          return "amber accent-4";
        default:
          return "black";
      }
    },
    setStartDateInterval(startDate) {
      var dateNow = new Date();
      var invoiceDateFormat = new Date(
        moment(startDate, "DD/MM/YYYY").format("MM/DD/YYYY")
      );
      var difference_In_Time = invoiceDateFormat.getTime() - dateNow.getTime();
      return Math.round(difference_In_Time / (1000 * 3600 * 24));
    },
    checkUser() {
      if (window.localStorage.getItem("isPartner") === "true") {
        return true;
      }
    },
    getHeaders() {
      if (window.localStorage.getItem("isPartner") === "true") {
        return this.headersPartner;
      } else {
        return this.headers;
      }
    },
    listar() {
      this.loading = true
      register
        .getSchedulerPartner()
        .then((response) => {
          this.scheduler = response.data.data;
          this.loading = false
          console.log("listar scheduler: ", this.scheduler);
          console.log("listar ", this.scheduler);
        })
        .catch((e) => {
          this.loading = false
          console.log(e);
        });
    },
    listarClients() {
      registers
        .getAllClients()
        .then((response) => {
          this.clients = response.data.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    listarSchedulers() {
      register
        .getSchedulerId()
        .then((response) => {
          this.schedulersall = response.data.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    listaPetUser(idClient) {
      registerpet
        .getPetUser(idClient)
        .then((response) => {
          this.petuser = response.data.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    listaPets() {
      registerpet
        .getPetsPartner()
        .then((response) => {
          this.petuser = response.data.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    showAlertSuccess(message) {
      this.$swal("Sucesso", message, "success");
    },

    showAlertError(message) {
      this.$swal("Oops...", message, "error");
    },
    criarAgendamento(schedulerSelecionado) {
      this.schedulerEdit.idScheduler = schedulerSelecionado.idScheduler;
      this.schedulerEdit.idPartner = schedulerSelecionado.idPartner;
      this.schedulerEdit.idPet = schedulerSelecionado.idPet;
      this.schedulerEdit.serviceType = schedulerSelecionado.serviceType;
      this.schedulerEdit.startDate = schedulerSelecionado.startDate;
      this.schedulerEdit.finalDate = schedulerSelecionado.finalDate;
      this.schedulerEdit.schedulerSituation =
        schedulerSelecionado.schedulerSituation;
      console.log("#CRIAR#", this.schedulerEdit);
      register
        .postScheduler(this.schedulerEdit)
        .then(() => {
          this.schedulerEdit = {};
          this.schedulerSelecionado = {};
          this.listar();
          this.showAlertSuccess("Agendamento realizado com Sucesso!");
          this.close();
        })
        .catch((e) => {
          this.showAlertError(e.response.data.errors[0].message);
        });
    },
    editarAgendamento(schedulerSelecionado) {
      this.schedulerEdit.idScheduler = schedulerSelecionado.idScheduler;
      this.schedulerEdit.idPartner = schedulerSelecionado.idPartner;
      this.schedulerEdit.idPet = schedulerSelecionado.idPet;
      this.schedulerEdit.serviceType = schedulerSelecionado.serviceType;
      this.schedulerEdit.startDate = schedulerSelecionado.startDate;
      this.schedulerEdit.finalDate = schedulerSelecionado.finalDate;
      this.schedulerEdit.schedulerSituation =
        schedulerSelecionado.schedulerSituation;
      console.log("#EDITAR#", this.schedulerEdit);
      register
        .putScheduler(this.schedulerEdit)
        .then((response) => {
          this.schedulerEdit = {};
          this.schedulerSelecionado = {};
          console.log("salvar erro", response);
          this.showAlertSuccess("Agendamento atualizado com Sucesso!");
          this.listar();
          this.close();
        })
        .catch((e) => {
          this.showAlertError(e.response.data.errors[0].message);
        });
    },
    editar(schedulers) {
      this.schedulers = schedulers;
    },
    remover(schedulers) {
      register
        .deleteScheduler(schedulers.idScheduler)
        .then(() => {
          this.listar();
          this.showAlertSuccess("Agendamento cancelado com sucesso!");
          this.closeDelete();
        })
        .catch((e) => {
          this.showAlertError(e.response.data.errors[0].message);
        });
    },
    openCreate() {
      this.schedulerSelecionado = {};
      this.dialogCreate = true;
    },
    editItem(item) {
      this.editedIndex = this.scheduler.indexOf(item);
      this.schedulerSelecionado = Object.assign({}, item);
      this.dialogUpdate = true;
    },
    deleteItem(item) {
      this.editedIndex = this.scheduler.indexOf(item);
      this.schedulerSelecionado = Object.assign({}, item);
      this.dialogDelete = true;
    },
    close() {
      this.dialogCreate = false;
      this.dialogUpdate = false;
      this.$nextTick(() => {
        (this.schedulerSelecionado = {}), (this.editedIndex = -1);
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        (this.schedulerSelecionado = {}), (this.editedIndex = -1);
      });
    },
  },
};
</script>
