<template>
  <div id="app">
    <v-app id="inspire">
      <!-- adicionar novo -->
      <v-container>
        <div class="text-left mb-2 mr-2">
          <v-btn color="dark" dark @click="getCpf(userSelecionado)">
            <v-icon dark>mdi-plus</v-icon>
            Adicionar um Cliente
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
        <v-data-table :headers="headers" :items="users" :search="search">
          <template v-slot:item="row">
            <tr>
              <td class="align-start">{{ row.item.userFullName }}</td>
              <td>{{ row.item.userCpf }}</td>
              <td>{{ row.item.userEmail }}</td>
              <td>{{ row.item.userPhone }}</td>
              <td>{{ row.item.dateCreation }}</td>
              <td>
                <v-icon small class="mr-2" @click="listarPetUser(row.item.idUser)"
                >mdi-paw</v-icon
                >
                <v-icon small class="mr-2" @click="editItem(row.item)"
                  >mdi-pencil</v-icon
                >
              </td>
            </tr>
          </template>
        </v-data-table>

        <v-dialog v-model="dialogCpf" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Buscar Usuário</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-spacer></v-spacer>
                <v-row>
                  <v-subheader class="text-h6">Insira o CPF:</v-subheader>
                  <v-col cols="12">
                    <v-text-field
                      v-model="userSelecionado.cpf"
                      label="CPF"
                      type="text"
                    ></v-text-field>
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
                @click="buscarCliente(userSelecionado.cpf)"
              >
                Buscar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Editar Cliente</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-spacer></v-spacer>
                <v-row>
                  <v-subheader class="text-h6">Dados Pessoais</v-subheader>
                  <v-col cols="12">
                    <v-text-field
                      v-model="userSelecionado.userFullName"
                      label="Nome"
                      type="text"
                      block
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="userSelecionado.userCpf"
                      label="CPF"
                      type="text"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="userSelecionado.userEmail"
                      label="Email"
                      type="text"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="userSelecionado.userPhone"
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

                  <!-- <v-spacer></v-spacer>
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

                    <v-col cols="12">
                      <v-text-field
                        v-model="userSelecionado.addressName"
                        label="Endereço"
                        type="text"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="userSelecionado.number"
                        label="Número"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
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
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="userSelecionado.zipCode"
                        label="CEP"
                        type="text"
                      ></v-text-field>
                    </v-col> 
                  </v-container>-->
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Fechar </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="salvar(userSelecionado)"
              >
                Salvar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogPost" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Cadastrar Cliente</span>
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

                    <v-col cols="12">
                      <v-text-field
                        v-model="userSelecionado.addressName"
                        label="Endereço"
                        type="text"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="userSelecionado.number"
                        label="Número"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
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
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="userSelecionado.zipCode"
                        label="CEP"
                        type="text"
                      ></v-text-field>
                    </v-col>
                  </v-container>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Fechar </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="cadastrarUsuario(userSelecionado)"
              >
                Salvar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- =============================== -->
        <v-dialog v-model="dialogVisual" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Adicionar Cliente</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-spacer></v-spacer>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="userSelecionado.fullName"
                      label="Nome"
                      type="text"
                      block
                      required
                      disabled
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
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="userSelecionado.phoneNumber"
                      label="Telefone"
                      type="text"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="userSelecionado.birthdate"
                      label="Nascimento"
                      type="date"
                      disabled
                    ></v-text-field>
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
                @click="cadastrarCliente(userSelecionado.cpf)"
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
                  <v-toolbar-title
                    >Animais cadastrados</v-toolbar-title
                  >
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
                        {{item.name}}
                      </v-list-item-title>
                      <v-list-item-subtitle>Espécie: {{item.specie}}
                        <br>
                        Raça: {{item.brand}}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-avatar
                      tile
                      size="80"
                    >
                  <v-icon>mdi-paw</v-icon></v-list-item-avatar>
                  </v-list-item>
                </v-card>
                <v-card v-else>
                  <v-list-item-title class="text-h5 mb-1">
                    Nenhum animal cadastrado
                  </v-list-item-title>
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

export default {
  name: "PageUser",
  data() {
    return {
      search: "",
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
      pets: [],
      editedIndex: -1,
      errors: [],
      showAddress: false,
      dialog: false,
      dialogDelete: false,
      dialogPost: false,
      dialogCpf: false,
      dialogVisual: false,
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
        { text: "Data de Adesão", align: "center", value: "dateCreation" },
        { text: "Ações", align: "center", value: "actions", sortable: false },
      ],
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
    listar() {
      register
        .getAllClients()
        .then((response) => {
          this.users = response.data.data;
          console.log("listar users: ", this.users);
          console.log("listar ", this.users);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    buscarCliente(cpf) {
      register
        .getCpf(cpf)
        .then((response) => {
          if (response.data.data != null) {
            this.userSelecionado = response.data.data;
            this.userSelecionado.birthdate = moment(
              this.userSelecionado.birthdate,
              "DD/MM/YYYY"
            ).format("yyyy-MM-DD");
            this.createClient(this.userSelecionado);
          } else {
            this.userSelecionado.cpf = cpf;
            console.log("this.userSelecionado.cpf: ", cpf);
            this.createItem(this.userSelecionado);
          }
        })
        .catch((e) => {
          this.showAlertError(e.response.data.errors[0].message);
        });
        this.close();
    },
    cadastrarCliente(cpf) {
      register
        .postUserPartner(cpf)
        .then(() => {
          this.userSelecionado = {};
          this.errors = {};
          this.listar();
          this.showAlertSuccess("Cliente cadastrado com sucesso!");
          this.close();
        })
        .catch((e) => {
          this.showAlertError(e.response.data.errors[0].message);
        });
    },
    cadastrarUsuario(userSelecionado) {
      register
        .postUsers(userSelecionado)
        .then((response) => {
          this.cadastrarCliente(userSelecionado.cpf);
          userSelecionado = {};
          this.errors = {};
          this.listar();
          console.log("salvar user", response);
        })
        .catch((e) => {
          this.showAlertError(e.response.data.errors[0].message);
        });
      this.close();
    },
    async listarPetUser(id) {
      await registerPets
        .getPetUser(id)
        .then((response) => {
          this.pets = response.data.data;
          this.details = true
        })
        .catch((e) => {
          console.log(e);
        });
    },
    salvar(userSelecionado) {
      this.setRole();
      userSelecionado = this.userSelecionado;
      console.log("este usuario edit 2: ", userSelecionado);

      register.putUserPerfil(userSelecionado).then(
        register
          .putUserAdmin(userSelecionado)
          .then((response) => {
            this.userSelecionado = {}
            this.errors = {}
            console.log("salvar erro", response);
            this.listar();
            this.showAlertSuccess("Cliente atualizado com sucesso!");
            this.close();
          })
          .catch((e) => {
            this.showAlertError(e.response.data.errors[0].message);
          })
      );
    },
    editar(user) {
      this.user = user;
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
    createClient(item) {
      this.dialogCpf = false;
      this.editedIndex = this.users.indexOf(item);
      this.userSelecionado = Object.assign({}, item);
      this.dialogVisual = true;
    },
    createItem(item) {
      this.dialogCpf = false;
      this.editedIndex = this.users.indexOf(item);
      this.userSelecionado = Object.assign({}, item);
      this.dialogPost = true;
    },
    getCpf(item) {
      this.dialogCpf = true;
      this.userSelecionado = Object.assign({}, item);
      this.dialogPost = false;
    },
    close() {
      this.dialog = false;
      this.dialogPost = false;
      this.dialogCpf = false;
      this.dialogVisual = false;
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
