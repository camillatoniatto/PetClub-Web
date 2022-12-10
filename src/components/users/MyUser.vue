<template>
  <v-app>
    <v-card>
      <v-card-title>
        <span class="text-h5">Minha Conta</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-spacer></v-spacer>
          <v-row>
            <v-subheader class="text-h6">Dados Pessoais</v-subheader>

            <v-col cols="12">
              <v-text-field
                v-model="user.fullName"
                label="Nome"
                type="text"
                block
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="user.cpf"
                label="CPF"
                type="text"
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="user.email"
                label="Email"
                type="text"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="user.phoneNumber"
                label="Telefone"
                type="text"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="user.birthdate"
                label="Nascimento"
                type="date"
              ></v-text-field>
            </v-col>

            <v-spacer></v-spacer>
            <v-divider></v-divider>

            <v-subheader class="text-h6">Dados Endereço</v-subheader>
            <br>
            <v-spacer></v-spacer>
            <v-col cols="12">
              <v-text-field
                v-model="user.zipCode"
                label="CEP"
                type="text"
                @keyup="searchCep()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field
                v-model="user.addressName"
                label="Endereço"
                type="text"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="user.number"
                label="Número"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="user.complement"
                label="Complemento"
                type="text"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="user.neighborhood"
                label="Bairro"
                type="text"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="user.city"
                label="Cidade"
                type="text"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="user.state"
                label="Estado"
                type="text"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green lighten-1" x-large dark @click="salvar(user)">
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-app>
</template>

<script>
import register from "@/store/modules/users";
import Alert from "../Alerts.js";
import moment from "moment";
import axios from "axios";

export default {
  name: "PageUser",
  data() {
    return {
      id: localStorage.getItem("idUser"),
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
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
        isActive: true,
        writeDate: "",
      },
    };
  },
  mounted() {
    this.meuUser(this.id);
  },
  methods: {
    searchCep() {
      if (this.user.zipCode.length == 8) {
        axios
          .get(`https://viacep.com.br/ws/${this.user.zipCode}/json/`)
          .then((response) => {
            this.user.addressName = response.data.logradouro;
            this.user.complement = response.data.complemento;
            this.user.neighborhood = response.data.bairro;
            this.user.city = response.data.localidade;
            this.user.state = response.data.uf;
          })
          .catch(() => {
            this.showAlertError("CEP inválido");
          });
      }
    },
    async meuUser(id) {
      console.log("MEU USUARIO ", id);
      await register
        .getUserId(id)
        .then((response) => {
          this.user = response.data.data;
          this.user.birthdate = moment(
            this.user.birthdate,
            "DD/MM/YYYY"
          ).format("yyyy-MM-DD");

          console.log("meuUser ", this.user);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    salvar(user) {
      if (user.id == "") {
        register
          .postUsers(this.user)
          .then((response) => {
            user = {};

            this.meuUser(user.id);
            console.log("salvar user", response);
            Alert.ShowAlertSuccess.Alert("Usuário cadastrado com sucesso!");
          })
          .catch((e) => {
            this.errors = e.response.data.errors[0].message;
          });
      } else {
        register
          .putUserPerfil(user)
          .then((response) => {
            (this.user = {}), console.log("salvar erro", response);
            this.meuUser(user.id);
            Alert.ShowAlertSuccess.Alert("Usuário atualizado com sucesso!");
          })
          .catch((e) => {
            this.errors = e.response.data.errors[0].message;
          });
      }
    },
    editar(user) {
      this.user = user;
    },
  },
};
</script>
