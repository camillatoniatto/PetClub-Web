<template>
  <div id="app">
    <v-app id="inspire">
      <!-- adicionar novo -->
      <v-container>
        <div class="text-left mb-2 mr-2">
          <v-btn color="dark" dark @click="createItem()">
            <v-icon dark>mdi-plus</v-icon>
            Cadastrar um pet
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
        <v-data-table :headers="headers" :items="pets" :search="search">
          <template v-slot:item="row">
            <tr>
              <td>
                <v-img
                  contain
                  max-height="140"
                  max-width="140"
                  :src="getIconPet(row.item.specie)"
                ></v-img>
              </td>
              <td class="align-start">{{ row.item.name }}</td>
              <td>{{ row.item.tutor }}</td>
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
                <v-icon small @click="deleteItem(row.item)">mdi-delete</v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>

        <!-- delete dialog -->
        <v-dialog v-model="dialogDelete" max-width="50%">
          <v-card>
            <v-alert dense outlined prominent type="error">
              <h3 class="text-h5">Atenção!</h3>
              <div>
                Você tem certeza que deseja deletar esse animal? Essa ação não
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
                    @click="remover(petSelecionado)"
                  >
                    Sim
                  </v-btn>
                </v-col>
              </v-row>
            </v-alert>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogCreate" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Cadastrar Animal</span>
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
                        :src="getIconPet(petSelecionado.specie)"
                      ></v-img
                    ></v-card>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="petSelecionado.idUser"
                      :items="clients"
                      :item-value="'idUser'"
                      :item-text="'userFullName'"
                      label="Cliente"
                      outlined
                      dense
                    ></v-select>
                  </v-col>
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
                      @change="getIconPet(petSelecionado.specie)"
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
                      label="Gênero"
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
                @click="criar(petSelecionado)"
              >
                Salvar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogUpdate" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Editar Animal</span>
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
                        :src="getIconPet(petSelecionado.specie)"
                      ></v-img
                    ></v-card>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="petSelecionado.idUser"
                      :items="clients"
                      :item-value="'idUser'"
                      :item-text="'userFullName'"
                      label="Cliente"
                      outlined
                      dense
                    ></v-select>
                  </v-col>
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
                      @change="getIconPet(petSelecionado.specie)"
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
                  <v-col>
                    <v-checkbox
                      v-model="petSelecionado.isAlive"
                      label="Animal vivo"
                    ></v-checkbox>
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
                @click="salvar(petSelecionado)"
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
import registerUser from "@/store/modules/users";
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
        genre: 0,
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
        genre: 0,
        specie: "",
        brand: "",
        birthdate: moment(Date.now()).format("yyyy-MM-DD"),
        isAlive: true,
      },
      clients: [],
      iconPet: "",
      pets: [],
      editedIndex: -1,
      search: "",
      dialogCreate: false,
      dialogUpdate: false,
      dialogDelete: false,
      admin: true,
      headers: [
        { text: " ", align: "center", value: "image", filterable: false },
        { text: "Nome", align: "center", value: "name" },
        { text: "Tutor", align: "center", value: "tutor" },
        { text: "Gênero", align: "center", value: "genreString" },
        { text: "Espécie", align: "center", value: "specie" },
        { text: "Raça", align: "center", value: "brand" },
        { text: "Nascimento", align: "center", value: "birthdate" },
        { text: "Vivo", align: "center", value: "isAlive" },
        { text: "Ações", align: "center", value: "actions", sortable: false },
      ],
      genre: enums.Genre,
      species: enums.Specie,
    };
  },
  mounted() {
    this.listarClientes();
    this.listarPetPartner();
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
    getIconPet(specie) {
      switch (specie) {
        case "Canino":
          return require("../.././assets/pictures/iconDog.png");
        case "Felino":
          return require("../.././assets/pictures/iconCat.png");
        case "Ave":
          return require("../.././assets/pictures/iconBird2.png");
        case "Réptil":
          return require("../.././assets/pictures/iconReptil.png");
        case "Roedor":
          return require("../.././assets/pictures/iconRat.png");
        case "Coelho":
          return require("../.././assets/pictures/iconBunny.png");
        default:
          return require("../.././assets/pictures/iconPet.png");
      }
    },
    getColor(isAlive) {
      return isAlive ? "green" : "red";
    },
    listarPetPartner() {
      register
        .getPetsPartner()
        .then((response) => {
          this.pets = response.data.data;
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
    criar(petSelecionado) {
      register
        .postPet(petSelecionado)
        .then(() => {
          this.petSelecionado = {};
          this.listarPetPartner();
          this.showAlertSuccess("Animal cadastrado com sucesso!");
          this.close();
        })
        .catch((e) => {
          this.showAlertError(e.response.data.errors[0].message);
        });
    },
    salvar(petSelecionado) {
      register
        .putPet(petSelecionado)
        .then((response) => {
          this.petSelecionado = {};
          console.log("salvar erro", response);
          this.listarPetPartner();
          this.showAlertSuccess("Animal atualizado com sucesso!");
          this.close();
        })
        .catch((e) => {
          this.showAlertError(e.response.data.errors[0].message);
        });
    },
    editar(pet) {
      this.pet = pet;
    },
    remover(pet) {
      register
        .deletePet(pet.idPet)
        .then((response) => {
          this.listarPetPartner();
          console.log("remover", response);
          this.showAlertSuccess("Animal deletado com sucesso!");
          this.closeDelete();
        })
        .catch((e) => {
          this.showAlertError(e.response.data.errors[0].message);
        });
    },
    createItem() {
      this.petSelecionado = {};
      this.dialogCreate = true;
    },
    editItem(item) {
      this.editedIndex = this.pets.indexOf(item);
      this.petSelecionado = Object.assign({}, item);
      this.petSelecionado.birthdate = moment(
        this.petSelecionado.birthdate,
        "DD/MM/YYYY"
      ).format("yyyy-MM-DD");
      this.dialogUpdate = true;
    },
    deleteItem(item) {
      this.editedIndex = this.pets.indexOf(item);
      this.petSelecionado = Object.assign({}, item);
      this.dialogDelete = true;
    },
    close() {
      this.dialogCreate = false;
      this.dialogUpdate = false;
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
    showAlertSuccess(message) {
      this.$swal("Sucesso", message, "success");
    },
    showAlertError(message) {
      this.$swal("Oops...", message, "error");
    },
  },
};
</script>
