<template>
  <div id="app">
    <v-app id="inspire">
      <!-- adicionar novo -->
      <v-container>
        <div class="text-left mb-2 mr-2">
          <v-btn color="dark" dark @click="editItem(schedulerSelecionado)">
            <v-icon dark>mdi-plus</v-icon>
            Agendar
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
        <v-data-table :headers="headers" :items="scheduler" :search="search">
          <template v-slot:item="row">
            <tr>
              <!-- <td class="align-start">{{row.item.IdPartner}}</td> -->
              <td>{{ row.item.petName }}</td>
              <td>{{ row.item.serviceTypeString }}</td>
              <td>{{ row.item.startDateString }}</td>
              <td>{{ row.item.finalDateString }}</td>
              <td>{{ row.item.schedulerSituationString == 'Agendado' ?  `Agendado - Faltam ${setStartDateInterval(row.item.startDateString)} dias`  : row.item.schedulerSituationString }}</td>
              <td>
                <v-icon small class="mr-2" @click="editItem(row.item)"
                  >mdi-pencil</v-icon
                >
                <v-icon small @click="remover(row.item)">mdi-delete</v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>

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
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancelar</v-btn
              >
              <v-btn
                color="blue darken-1"
                text
                @click="remover(schedulerSelecionado)"
                >Sim</v-btn
              >
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
                  <v-col cols="12" sm="8" md="6">
                    <v-select
                      v-model="schedulerSelecionado.idClient"
                      label="Cliente"
                      :items="clients"
                      :item-value="'idUser'"
                      :item-text="'userFullName'"
                      filled
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
                      filled
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
                      filled
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
                  filled
                  dense
                ></v-select>
              </v-col>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Fechar </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="salvar(schedulerSelecionado)"
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
import Alert from "../Alerts.js";
import enums from "../.././Enums.js";
import moment from 'moment';

export default {
  name: "PageScheduler",
  data() {
    return {
      schedulers: {
        idScheduler: "",
        idPartner: "",
        idPet: "",
        serviceType: "",
        // startDate: moment(Date()).format("yyyy-MM-DD HH:MM:SS"),
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
      errors: [],
      search: "",
      dialog: false,
      dialogDelete: false,
      admin: true,
      headers: [
        { text: "Pet", align: "center", value: "IdPet" },
        { text: "Serviço", align: "center", value: "ServiceType" },
        { text: "Data Inicio", align: "center", value: "StartDate" },
        { text: "Data Final", align: "center", value: "FinalDate" },
        { text: "Situação", align: "center", value: "SchedulerSituation" },
        { text: "Ações", align: "center", value: "actions", sortable: false },
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
    // this.listaPetUser();
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
    setStartDateInterval(startDate) {
      
      var dateNow = new Date()
      var invoiceDateFormat = new Date(moment(startDate, 'DD/MM/YYYY').format('MM/DD/YYYY'))
      var difference_In_Time = invoiceDateFormat.getTime() - dateNow.getTime();
      return Math.round(difference_In_Time / (1000 * 3600 * 24));
      

      
    },

    listar() {
      register
        .getSchedulerPartner()
        .then((response) => {
          this.scheduler = response.data.data;
          console.log("listar scheduler: ", this.scheduler);
          console.log("listar ", this.scheduler);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    listarClients() {
      registers
        .getAllClients()
        .then((response) => {
          this.clients = response.data.data;
          console.log("listar Clientes: ", this.clients);
          console.log("listar ", this.clients);
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
          console.log("listar Clientes: ", this.scheduler);
          console.log("listar ", this.scheduler);
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
          console.log("listar pets: ", this.petuser);
          console.log("listar ", this.petuser);
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
          console.log("listar pets: ", this.petuser);
          console.log("listar ", this.petuser);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    showAlertSuccess() {
      this.$swal("Sucesso", "Agendamento Realizado com Sucesso!", "success");
    },

    showAlertError(message) {
      this.$swal("Oops...", message, "error");
    },

    salvar(schedulerSelecionado) {
      this.schedulerEdit.idScheduler = schedulerSelecionado.idScheduler
      this.schedulerEdit.idPartner = schedulerSelecionado.idPartner
      this.schedulerEdit.idPet = schedulerSelecionado.idPet
      this.schedulerEdit.serviceType = schedulerSelecionado.serviceType
      this.schedulerEdit.startDate = schedulerSelecionado.startDate
      this.schedulerEdit.finalDate = schedulerSelecionado.finalDate
      this.schedulerEdit.schedulerSituation = schedulerSelecionado.schedulerSituation
      console.log("salvar scheduler -----", schedulerSelecionado);
      if (this.schedulerEdit.idScheduler == "") {
        register
          .postScheduler(this.schedulerEdit)
          .then((response) => {
            this.schedulerEdit = {};
            this.errors = {};
            this.showAlertSuccess();
            this.listar();
            console.log("salvar scheduler", response);
            Alert.ShowAlertSuccess.Alert("Agendamento realizado com Sucesso!");
            this.close();
          })
          .catch((e) => {
            this.showAlertError(e.response.data.errors[0].message);
          });
      } else {
        register
          .putScheduler(this.schedulerEdit)
          .then((response) => {
            console.log("aaaa", this.schedulerEdit);
            (this.this.schedulerEdit = {}), (this.errors = {});
            (this.this.schedulerSelecionado = {}), (this.errors = {});
            console.log("salvar erro", response);
            this.showAlertSuccess();
            this.listar();
            Alert.ShowAlertSuccess.Alert("Agendamento atualizado com Sucesso!");
            this.close();
          })
          .catch((e) => {
            this.showAlertError(e.response.data.errors[0].message);
          });
      }
    },
    editar(schedulers) {
      this.schedulers = schedulers;
    },
    remover(schedulers) {
      console.log("remover", schedulers);
      // var result = Alert.ShowAlertAlert.Alert('Você tem certeza que quer deletar este pet?')
      // if(result){
      register
        .deleteScheduler(schedulers.idScheduler)
        .then((response) => {
          this.listar();
          console.log("remover", response);
          this.errors = {};
          Alert.ShowAlertSuccess.Alert("Agendamento deletado com sucesso!");
          this.closeDelete();
        })
        .catch((e) => {
          this.showAlertError(e.response.data.errors[0].message);
        });
    },
    editItem(item) {
      this.editedIndex = this.scheduler.indexOf(item);
      this.schedulerSelecionado = Object.assign({}, item);
      // this.schedulerSelecionado.idPet = this.scheduler.detailPet.idPet
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.scheduler.indexOf(item);
      this.schedulerSelecionado = Object.assign({}, item);
      this.dialogDelete = true;
    },
    close() {
      this.dialog = false;
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
    save() {
      if (this.editedIndex > -1) {
        Object.assign(
          this.scheduler[this.editedIndex],
          this.schedulerSelecionado
        );
      } else {
        this.scheduler.push(this.schedulerSelecionado);
      }
      this.close();
    },
  },
};
</script>
