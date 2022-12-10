<template>
  <div id="app">
    <v-app id="inspire">
      <v-container>
        <div class="text-left mb-2 mr-2">
          <v-btn color="dark" dark @click="createItem()">
            <v-icon dark>mdi-plus</v-icon>
            Cadastrar um usuário
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
        <v-data-table :headers="headers" :items="users" :search="search">
          <template v-slot:item="row">
            <tr>
              <td class="align-start">{{ row.item.fullName }}</td>
              <td>{{ row.item.cpf }}</td>
              <td>{{ row.item.email }}</td>
              <td>{{ row.item.phoneNumber }}</td>
              <td>{{ row.item.birthdate }}</td>
              <td>{{ row.item.roles }}</td>
              <td>
                <v-icon
                  small
                  class="mr-2"
                  @click="listarPetUser(row.item.id)"
                  v-if="row.item.quantityPet > 0"
                  >mdi-paw</v-icon
                >
                <v-icon small class="mr-2" @click="editItem(row.item)"
                  >mdi-pencil</v-icon
                >
                <!-- <v-icon small @click="remover(row.item)">mdi-delete</v-icon> -->
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
                Você tem certeza que deseja remover esse usuário? Todos os seus
                animais cadastrados e agendamentos irão ser removidos também,
                mas as compras permanecerão. Cuidado, essa ação não poderá ser
                desfeita.
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
                    @click="remover(userSelecionado)"
                  >
                    Sim
                  </v-btn>
                </v-col>
              </v-row>
            </v-alert>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Editar usuário</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-spacer></v-spacer>
                <v-row>
                  <v-subheader class="text-h6">Dados Pessoais</v-subheader>
                  <v-col cols="12">
                    <v-text-field
                      v-model="userSelecionado.fullName"
                      label="Nome"
                      type="text"
                      block
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="userSelecionado.cpf"
                      label="CPF"
                      type="text"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="userSelecionado.email"
                      label="Email"
                      type="text"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="userSelecionado.phoneNumber"
                      label="Telefone"
                      type="text"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="userSelecionado.birthdate"
                      label="Nascimento"
                      type="date"
                    ></v-text-field>
                  </v-col>

                  <v-spacer></v-spacer>
                  <v-divider></v-divider>
                  <v-col cols="12">
                    <v-checkbox
                      v-model="showAddress"
                      label="Mostrar Endereço"
                      value="showAddress"
                    ></v-checkbox>
                  </v-col>

                  <v-container v-if="showAddress">
                    <v-subheader class="text-h6">Dados Endereço</v-subheader>
                    <v-spacer></v-spacer>
                    <v-col cols="12" md="8">
                      <v-text-field
                        v-model="userSelecionado.zipCode"
                        label="CEP"
                        type="number"
                        @keyup="searchCep()"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="userSelecionado.addressName"
                        label="Endereço"
                        type="text"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="userSelecionado.number"
                        label="Número"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="userSelecionado.complement"
                        label="Complemento"
                        type="text"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="userSelecionado.neighborhood"
                        label="Bairro"
                        type="text"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="userSelecionado.city"
                        label="Cidade"
                        type="text"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="userSelecionado.state"
                        label="Estado"
                        type="text"
                      ></v-text-field>
                    </v-col>
                  </v-container>

                  <v-spacer></v-spacer>
                  <v-divider></v-divider>
                  <v-subheader class="text-h6">Tipo de Usuário</v-subheader>
                  <v-col cols="12">
                    <v-radio-group v-model="radios" mandatory>
                      <v-radio label="Cliente" value="isUser"></v-radio>
                      <v-radio label="Parceiro" value="isPartner"></v-radio>
                      <v-radio label="Administrador" value="isAdmin"></v-radio>
                    </v-radio-group>
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
                @click="salvar(userSelecionado)"
              >
                Salvar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- =============================== -->
        <v-dialog v-model="dialogPost" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Cadastrar Usuário</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-spacer></v-spacer>
                <v-row>
                  <v-subheader class="text-h6">Dados Pessoais</v-subheader>

                  <v-col cols="12">
                    <v-text-field
                      v-model="userSelecionado.fullName"
                      label="Nome"
                      type="text"
                      block
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="userSelecionado.cpf"
                      label="CPF"
                      type="text"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="userSelecionado.email"
                      label="Email"
                      type="text"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="userSelecionado.phoneNumber"
                      label="Telefone"
                      type="text"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="userSelecionado.birthdate"
                      label="Nascimento"
                      type="date"
                    ></v-text-field>
                  </v-col>

                  <v-spacer></v-spacer>
                  <v-divider></v-divider>
                  <v-col cols="12">
                    <v-checkbox
                      v-model="showAddress"
                      label="Cadastrar Endereço"
                      value="showAddress"
                    ></v-checkbox>
                  </v-col>
                  <v-container v-if="showAddress">
                    <v-subheader class="text-h6">Dados Endereço</v-subheader>
                    <v-spacer></v-spacer>
                    <v-col cols="12" md="8">
                      <v-text-field
                        v-model="userSelecionado.zipCode"
                        label="CEP"
                        type="text"
                        @keyup="searchCep()"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="userSelecionado.addressName"
                        label="Endereço"
                        type="text"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="userSelecionado.number"
                        label="Número"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="userSelecionado.complement"
                        label="Complemento"
                        type="text"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="userSelecionado.neighborhood"
                        label="Bairro"
                        type="text"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="userSelecionado.city"
                        label="Cidade"
                        type="text"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="userSelecionado.state"
                        label="Estado"
                        type="text"
                      ></v-text-field>
                    </v-col>
                  </v-container>

                  <v-spacer></v-spacer>
                  <v-divider></v-divider>
                  <v-subheader class="text-h6">Tipo de Usuário</v-subheader>
                  <v-col cols="12">
                    <v-radio-group v-model="radios" mandatory>
                      <v-radio label="Cliente" value="isUser"></v-radio>
                      <v-radio label="Parceiro" value="isPartner"></v-radio>
                      <v-radio label="Administrador" value="isAdmin"></v-radio>
                    </v-radio-group>
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
                @click="cadastrar(userSelecionado)"
              >
                Salvar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="details" max-width="40%">
          <v-container class="px-4 py-4">
            <v-data-iterator :items="pets" hide-default-footer>
              <template v-slot:header>
                <v-toolbar class="mb-2" color="teal darken-3" dark flat>
                  <v-toolbar-title>Animais cadastrados</v-toolbar-title>
                </v-toolbar>
              </template>
              <template v-slot:default="props">
                <v-row>
                  <v-col
                    v-for="item in props.items"
                    :key="item.idPet"
                    cols="12"
                  >
                    <v-card v-if="pets.length > 0">
                      <v-list-item three-line>
                        <v-list-item-content>
                          <v-list-item-title class="text-h5 mb-1">
                            {{ item.name }}
                          </v-list-item-title>
                          <v-list-item-subtitle
                            >Espécie: {{ item.specie }}
                            <br />
                            Raça: {{ item.brand }}</v-list-item-subtitle
                          >
                        </v-list-item-content>
                        <v-img
                          contain
                          max-height="100"
                          max-width="100"
                          :src="getIconPet(item.specie)"
                        ></v-img>
                      </v-list-item>
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
import register from "@/store/modules/users";
import registerPets from "@/store/modules/pets";
import moment from "moment";
import axios from "axios";

export default {
  name: "PageUser",
  data() {
    return {
      user: {
        id: "",
        fullName: "",
        cpf: "",
        email: "",
        phoneNumber: "",
        birthdate: moment(Date.now()).format("yyyy-MM-DD"),
        image: "",
        isAdmin: false,
        isPartner: false,
        addressName: "",
        number: "",
        password: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
        isActive: true,
        writeDate: "",
      },
      userSelecionado: {
        id: "",
        fullName: "",
        cpf: "",
        email: "",
        phoneNumber: "",
        birthdate: moment(Date.now()).format("yyyy-MM-DD"),
        image: "",
        isAdmin: false,
        isPartner: false,
        addressName: "",
        number: "",
        password: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
        isActive: true,
        writeDate: "",
      },
      users: [],
      editedIndex: -1,
      pets: [],
      showAddress: false,
      search: "",
      dialog: false,
      dialogDelete: false,
      dialogPost: false,
      details: false,
      admin: true,
      radios: "",
      headers: [
        {
          text: "Nome",
          align: "center",
          value: "fullname",
        },
        { text: "CPF", align: "center", value: "cpf" },
        { text: "Email", align: "center", value: "email" },
        { text: "Telefone", align: "center", value: "phoneNumber" },
        { text: "Nascimento", align: "center", value: "birthdate" },
        { text: "Tipo", align: "center", value: "roles" },
        { text: "Ações", align: "center", value: "actions", sortable: false },
      ],
      data: null,
      messageCep: null,
    };
  },
  mounted() {
    this.listar();
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Cadastrar usuário" : "Editar usuário";
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
    searchCep() {
      if (this.userSelecionado.zipCode.length == 8) {
        axios
          .get(`https://viacep.com.br/ws/${this.userSelecionado.zipCode}/json/`)
          .then((response) => {
            this.userSelecionado.addressName = response.data.logradouro;
            this.userSelecionado.complement = response.data.complemento;
            this.userSelecionado.neighborhood = response.data.bairro;
            this.userSelecionado.city = response.data.localidade;
            this.userSelecionado.state = response.data.uf;
          })
          .catch(() => {
            this.showAlertError("CEP inválido");
          });
      }
    },
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
          return require("../.././assets/pictures/iconBunny.png");
        default:
          return require("../.././assets/pictures/iconPet.png");
      }
    },
    listar() {
      register
        .getAllUsers()
        .then((response) => {
          this.users = response.data.data;
          console.log("listar users: ", this.users);
          console.log("listar ", this.users);
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
          this.details = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    setRole() {
      if (this.radios == "isUser") {
        this.userSelecionado.isAdmin = false;
        this.userSelecionado.isPartner = false;
      } else if (this.radios == "isPartner") {
        this.userSelecionado.isAdmin = false;
        this.userSelecionado.isPartner = true;
      } else if (this.radios == "isAdmin") {
        this.userSelecionado.isAdmin = true;
        this.userSelecionado.isPartner = false;
      }
    },
    setRadios() {
      if (this.userSelecionado.isAdmin) {
        this.radios = "isAdmin";
      } else if (this.userSelecionado.isPartner) {
        this.radios = "isPartner";
      } else {
        this.radios = "isUser";
      }
    },
    cadastrar(userSelecionado) {
      this.setRole();
      register
        .postUsers(userSelecionado)
        .then((response) => {
          userSelecionado = {};
          this.listar();
          console.log("salvar user", response);
          this.showAlertSuccess("Usuário cadastrado com sucesso!");
        })
        .catch((e) => {
          this.showAlertError(e.response.data.errors[0].message);
        });
      this.close();
    },
    salvar(userSelecionado) {
      this.setRole();
      userSelecionado = this.userSelecionado;
      console.log("este usuario edit 2: ", userSelecionado);

      register.putUserPerfil(userSelecionado).then(
        register
          .putUserAdmin(userSelecionado)
          .then((response) => {
            this.userSelecionado = {};
            console.log("salvar erro", response);
            this.listar();
            this.showAlertSuccess("Usuário atualizado com sucesso!");
          })
          .catch((e) => {
            this.showAlertError(e.response.data.errors[0].message);
          })
      );
      this.close();
    },
    editar(user) {
      this.user = user;
    },
    remover(user) {
      register
        .deleteUser(user.id)
        .then((response) => {
          this.listar();
          console.log("remover", response);
          this.showAlertSuccess("Usuário removido com sucesso!");
          this.closeDelete();
        })
        .catch((e) => {
          this.showAlertError(e.response.data.errors[0].message);
        });
    },
    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.userSelecionado = Object.assign({}, item);
      this.userSelecionado.birthdate = moment(
        this.userSelecionado.birthdate,
        "DD/MM/YYYY"
      ).format("yyyy-MM-DD");
      console.log("este usuario edit 1: ", this.userSelecionado);
      this.dialog = true;
    },
    createItem() {
      this.dialogPost = true;
    },
    deleteItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.userSelecionado = Object.assign({}, item);
      this.dialogDelete = true;
    },
    close() {
      this.dialog = false;
      this.dialogPost = false;
      this.$nextTick(() => {
        (this.userSelecionado = {}), (this.editedIndex = -1);
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        (this.userSelecionado = {}), (this.editedIndex = -1);
      });
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.users[this.editedIndex], this.userSelecionado);
      } else {
        this.users.push(this.userSelecionado);
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
