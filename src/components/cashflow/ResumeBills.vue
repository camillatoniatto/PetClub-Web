<template>
  <div id="app">
    <v-app id="inspire">
      <v-container text-xs-center align-center justify-space-between py-12>
        <v-layout row align-center justify-space-between>
          <v-col col="4" class="pa-3">
            <v-card elevation="8" color="green" dark height="100%" class="grow">
              <v-col class="d-flex align-start flex-column mb-6 text-h3">
                Entradas
              </v-col>
              <v-col class="d-flex align-end flex-column mb-6 text-h3" title>
                R$ {{ resumo.entrada }}
              </v-col>
            </v-card>
          </v-col>

          <v-col col="4" class="pa-3">
            <v-card elevation="8" color="red" dark height="100%" class="grow">
              <v-col class="d-flex align-start flex-column mb-6 text-h3">
                Saidas
              </v-col>
              <v-col class="d-flex align-end flex-column mb-6 text-h3" title>
                R$ {{ resumo.saida }}
              </v-col>
            </v-card>
          </v-col>

          <v-col col="4" class="pa-3">
            <v-card elevation="8" color="blue" dark height="100%" class="grow">
              <v-col class="d-flex align-start flex-column mb-6 text-h3">
                Saldo
              </v-col>
              <v-col class="d-flex align-end flex-column mb-6 text-h3" title>
                R$ {{ resumo.saldo }}
              </v-col>
            </v-card>
          </v-col>
        </v-layout>
      </v-container>
    </v-app>
  </div>
</template>

<script>
import register from "@/store/modules/cashflow";
export default {
  name: "PageCashflow",
  data() {
    return {
      resumo: {
        entrada: "0,00",
        saida: "0,00",
        vendas: "0,00",
        aPagar: "0,00",
        aReceber: "0,00",
        saldo: "0,00",
      },
    };
  },
  mounted() {
    this.listar();
  },
  methods: {
    isPartner() {
      return window.localStorage.getItem("isPartner") === "true";
    },
    async listar() {
      await register
        .getResumeCashflow()
        .then((response) => {
          this.resumo = response.data.data;
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
  },
};
</script>
<style>
.grow {
  transition: all 0.2s ease-in-out;
}
.grow:hover {
  transform: scale(1.1);
}
</style>
