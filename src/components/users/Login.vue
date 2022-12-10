<template>
  <v-container>
    <v-card>
      <v-row class="vh-100 vw-100 row-login">
        <v-col
          sm="5"
          md="5"
          class="d-flex justify-content-center align-items-center left-login"
        >
          <v-container>
            <div class="col-12">
              <h2 class="text-center mb-12 title-login">LOGIN PET CLUB</h2>
              <v-form>
                <label class="d-flex justify-content-between"> CPF </label>
                <label label="CPF">
                  <v-text-field
                    v-model="login.userName"
                    type="data"
                    required
                    return-masked-value
                    v-mask="'###.###.###-##'"
                  ></v-text-field>
                </label>

                <label label-for="password">
                  <label class="d-flex justify-content-between"> Senha </label>
                  <v-text-field
                    v-model="login.password"
                    type="password"
                    required
                  ></v-text-field>
                  <label class="d-flex justify-content-between">
                    <small><a href="#">Esqueceu sua senha?</a></small>
                  </label>
                </label>
                <br />
                <v-btn
                  color="teal darken-4"
                  dark
                  @click="loginUser(login)"
                  v-if="!loading"
                >
                  Entrar <v-icon dark>mdi-paw</v-icon>
                </v-btn>
                <v-progress-circular
                  indeterminate
                  color="teal darken-4"
                  v-else
                ></v-progress-circular>
                <p></p>

                <hr />
                <br />
                <v-btn color="teal darken-4" text @click="registerNewUser()">
                  <v-icon dark>mdi-user-plus</v-icon>
                  Quero ser um parceiro!
                </v-btn>
              </v-form>
            </div>
          </v-container>
        </v-col>
        <v-col
          sm="7"
          md="7"
          class="d-flex justify-content-center align-items-center"
        >
          <img
            src="./../../assets/images/petlogin.png"
            class="img-login"
            height="99%"
            width="99%"
          />
        </v-col>
      </v-row>
    </v-card>

    <v-dialog v-model="dialogRegister" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Cadastro de Parceiro</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-spacer></v-spacer>
            <v-row>
              <v-subheader class="text-h6">Dados Pessoais</v-subheader>
              <v-col cols="12">
                <v-text-field
                  v-model="newUser.fullName"
                  label="Nome"
                  type="text"
                  block
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="newUser.cpf"
                  label="CPF"
                  type="text"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="newUser.email"
                  label="Email"
                  type="text"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newUser.phoneNumber"
                  label="Telefone"
                  type="text"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newUser.birthdate"
                  label="Nascimento"
                  type="date"
                  required
                ></v-text-field>
              </v-col>

              <v-spacer></v-spacer>
              <v-divider></v-divider>

              <v-subheader class="text-h6">Dados Endereço</v-subheader>
              <v-spacer></v-spacer>
              <v-col cols="12">
                <v-text-field
                  v-model="newUser.zipCode"
                  @keyup="searchCep()"
                  label="CEP"
                  type="text"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="newUser.addressName"
                  label="Endereço"
                  type="text"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newUser.number"
                  label="Número"
                  type="number"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newUser.complement"
                  label="Complemento"
                  type="text"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="newUser.neighborhood"
                  label="Bairro"
                  type="text"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newUser.city"
                  label="Cidade"
                  type="text"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newUser.state"
                  label="Estado"
                  type="text"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="teal darken-4" dark @click="close"> Fechar </v-btn>
          <v-btn color="teal darken-4" dark @click="salvar(newUser)">
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import register from "@/store/modules/users";
import moment from "moment";
import axios from "axios";

export default {
  name: "PageLogin",
  data() {
    return {
      login: {
        userName: "",
        password: "",
        refreshToken: "",
        grantType: "password",
      },
      responseLogin: {
        accessToken: "",
        refreshToken: "",
        expiresIn: "",
        dateExpire: "",
        idUser: "",
        fullName: "",
        cpf: "",
        email: "",
        birthdate: "",
        lastNumberCard: "",
        nameCard: "",
        phoneNumber: "",
        image: "",
        userPerfil: "",
        isAdmin: false,
        isPartner: false,
      },
      newUser: {
        id: "",
        fullName: "",
        cpf: "",
        email: "",
        phoneNumber: "",
        birthdate: moment(Date.now()).format("yyyy-MM-DD"),
        image: "",
        isAdmin: false,
        isPartner: true,
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
      loading: false,
      dialogRegister: false,
      data: null,
      messageCep: null,
    };
  },
  watch: {
    dialogRegister(val) {
      val || this.close();
    },
  },
  methods: {
    searchCep() {
      if (this.newUser.zipCode.length == 8) {
        axios
          .get(`https://viacep.com.br/ws/${this.newUser.zipCode}/json/`)
          .then((response) => {
            this.newUser.addressName = response.data.logradouro;
            this.newUser.complement = response.data.complemento;
            this.newUser.neighborhood = response.data.bairro;
            this.newUser.city = response.data.localidade;
            this.newUser.state = response.data.uf;
          })
          .catch(() => {
            this.showAlertError("CEP inválido");
          });
      }
    },
    getValidation(field) {
      if (this.$v.form.$dirty === false) {
        return null; //enquanto o form não for submetido não valida os campos
      }
      return !this.$v.form[field].$error;
    },
    async loginUser(login) {
      this.loading = true
      await register
        .loginUser(login)
        .then((response) => {
          window.localStorage.clear("accessToken");
          window.localStorage.clear("idUser");
          window.localStorage.clear("isAdmin");
          window.localStorage.clear("isPartner");
          window.localStorage.clear("cpf");
          window.localStorage.clear("fullName");

          this.responseLogin = response.data.data;
          window.localStorage.setItem(
            "accessToken",
            response.data.data["accessToken"]
          );
          // window.localStorage.setItem('dateExpire', response.data.data['dateExpire']);
          window.localStorage.setItem("idUser", response.data.data["idUser"]);
          window.localStorage.setItem("isAdmin", response.data.data["isAdmin"]);
          window.localStorage.setItem(
            "isPartner",
            response.data.data["isPartner"]
          );
          window.localStorage.setItem("cpf", response.data.data["cpf"]);
          window.localStorage.setItem(
            "fullName",
            response.data.data["fullName"]
          );
          console.log("LOGADO!: ", response.data.data);
          console.log(
            "LOGADO localStorage!: ",
            window.localStorage.getItem("accessToken")
          );
          if (response.data.success === true) {
            this.loading = false
            this.$router.push(this.$route.query.redirect || "/");
            location.reload(true);
          }
        })
        .catch((e) => {
          this.loading = false
          this.showAlertError(e.response.data.errors[0].message);
        });
        this.loading = false

    },
    salvar(newUser) {
      register
        .postUsers(newUser)
        .then(() => {
          this.newUser = {};
          this.showAlertSuccess("Cadastro feito com sucesso!");
          this.close();
        })
        .catch((e) => {
          this.showAlertError(e.response.data.errors[0].message);
        });
    },
    close() {
      this.dialogRegister = false;
    },
    registerNewUser() {
      this.dialogRegister = true;
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

<style>
*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-decoration: none;
}
.row-login {
  margin-left: 0;
}
.left-login {
  background-color: #f2f2f2;
}
.title-login {
  font-weight: bold;
}
</style>
