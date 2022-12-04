<template>
  <div id="app">
    <v-app id="inspire">
      <!-- adicionar novo -->
      <v-container>
        <div class="text-left mb-2 mr-2">
          <v-btn color="dark" dark @click="editItem(petSelecionado)">
            <v-icon dark>mdi-plus</v-icon>
            Cadastrar um pet
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
        <v-data-table :headers="headers" :items="pets" :search="search">
          <template v-slot:item="row">
            <tr>
              <!-- <td>{{row.item.idPet}}</td> -->
              <td class="align-start">{{ row.item.name }}</td>
              <td>{{ row.item.genreString }}</td>
              <td>{{ row.item.specie }}</td>
              <td>{{ row.item.brand }}</td>
              <td>{{ row.item.birthdate }}</td>
              <td>
                <v-chip
                  dark
                  :color="getColor(row.item.isAlive)"
                  class="align-center my-5 md-5 white-text"
                ></v-chip>
              </td>

              <td>
                <v-icon small class="mr-2" @click="editItem(row.item)"
                  >mdi-pencil</v-icon
                >
                <!-- <v-icon small @click="remover(row.item)">mdi-delete</v-icon> -->
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
              <h3>Você tem certeza que deseja deletar esse animal?</h3>
            </v-card-title>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancelar</v-btn
              >
              <v-btn color="blue darken-1" text @click="remover(petSelecionado)"
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
                  <v-col cols="12">
                    <v-text-field
                      v-model="petSelecionado.name"
                      label="Nome"
                      type="text"
                      block
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-select
                    v-model="petSelecionado.specie"
                    :items="species"
                    :item-value="'value'"
                    :item-text="'value'"
                    label="Espécie"
                    outlined
                    dense
                  ></v-select>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="petSelecionado.brand"
                      label="Raça"
                      type="text"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="petSelecionado.birthdate"
                      label="Nascimento"
                      type="date"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="petSelecionado.genre"
                      :items="genre"
                      :item-value="'key'"
                      :item-text="'value'"
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Fechar </v-btn>
              <v-btn color="blue darken-1" text @click="salvar(petSelecionado)">
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
import register from "@/store/modules/pets";
import enums from "../.././Enums.js";
import moment from "moment";

export default {
  name: "PagePetUser",
  data() {
    return {
      pet: {
        idPet: "",
        idUser: "",
        tutor: "",
        name: "",
        genre: "",
        specie: "",
        brand: "",
        birthdate: moment(Date.now()).format("yyyy-MM-DD"),
        isAlive: true,
      },
      petSelecionado: {
        idPet: "",
        idUser: "",
        tutor: "",
        name: "",
        genre: "",
        specie: "",
        brand: "",
        birthdate: moment(Date.now()).format("yyyy-MM-DD"),
        isAlive: true,
      },
      pets: [],
      editedIndex: -1,
      errors: [],
      search: "",
      dialog: false,
      dialogDelete: false,
      admin: true,
      headers: [
        {
          text: "Nome",
          align: "center",
          value: "name",
        },
        { text: "Gênero", align: "center", value: "genreString" },
        { text: "Espécie", align: "center", value: "specie" },
        { text: "Raça", align: "center", value: "brand" },
        { text: "Nascimento", align: "center", value: "birthdate" },
        { text: "Vivo", align: "center", value: "isAlive" },
        { text: "Ações", align: "center", value: "actions", sortable: false },
      ],
      genre: enums.Genre,
      species: enums.Specie
    };
  },
  mounted() {
    this.listar();
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Cadastrar pet" : "Editar pet";
    },
    filteredList() {
      return this.pets.filter((result) => {
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
    getColor(isAlive) {
      return isAlive ? "green" : "red";
    },
    listar() {
      register
        .getPetUser()
        .then((response) => {
          this.pets = response.data.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    salvar(petSelecionado) {
      petSelecionado.idUser = window.localStorage.getItem("idUser");
      if (petSelecionado.idPet == "") {
        register
          .postPet(this.petSelecionado)
          .then((response) => {
            petSelecionado = {};
            this.errors = {};
            this.listar();
            console.log("salvar pet", response);
            this.showAlertSuccess("Animal cadastrado com sucesso!");
          })
          .catch((e) => {
            this.showAlertError(e.response.data.errors[0].message);
          });
      } else {
        register
          .putPet(petSelecionado)
          .then((response) => {
            this.petSelecionado = {}
            this.errors = {}
            console.log("salvar erro", response);
            this.listar();
            this.showAlertSuccess("Animal atualizado com sucesso!");
          })
          .catch((e) => {
            this.showAlertError(e.response.data.errors[0].message);
          });
      }
      this.close();
    },
    editar(pet) {
      this.pet = pet;
    },
    remover(pet) {
      // var result = Alert.ShowAlertAlert.Alert('Você tem certeza que quer deletar este pet?')
      // if(result){
      register
        .deletePet(pet.idPet)
        .then((response) => {
          this.listar();
          this.errors = {};
          console.log("remover", response);
          this.showAlertSuccess("Animal deletado com sucesso!");
        })
        .catch((e) => {
          this.showAlertError(e.response.data.errors[0].message);
        });
      //}
      //   this.closeDelete()
    },
    editItem(item) {
      this.editedIndex = this.pets.indexOf(item);
      this.petSelecionado = Object.assign({}, item);
      this.petSelecionado.birthdate = moment(
        this.petSelecionado.birthdate,
        "DD/MM/YYYY"
      ).format("yyyy-MM-DD");
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.pets.indexOf(item);
      this.petSelecionado = Object.assign({}, item);
      this.dialogDelete = true;
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        (this.petSelecionado = {}), (this.editedIndex = -1);
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        (this.petSelecionado = {}), (this.editedIndex = -1);
      });
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.pets[this.editedIndex], this.petSelecionado);
      } else {
        this.pets.push(this.petSelecionado);
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
