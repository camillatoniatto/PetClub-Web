<template>
  <div id="app">
    <v-app id="inspire">
  <v-container>
    <h1 class="text-left ml-3">Financeiro</h1>
      <v-row no-gutters>
        <v-col cols="sm">
          <v-card class="pa-2" outlined tile @click="changeMyList">
            Resumo Financeiro
          </v-card>
        </v-col>
        <v-col cols="sm">
          <v-card class="pa-2" outlined tile @click="changeMyListLog">
            Saídas e Entradas
          </v-card>
        </v-col>
      </v-row>
    <ResumeBills v-if="!log" />
    <Bills v-else />
</v-container>
</v-app>
  </div>
</template>

<script>
import Bills from "@/components/cashflow/Bills.vue";
import ResumeBills from "@/components/cashflow/ResumeBills.vue";

export default {
  name: "CashFlowView",
  components: {
    Bills,
    ResumeBills,
  },
  data() {
    return {
      log: false,
      isPartner: window.localStorage.getItem('isPartner')
    };
  },
  methods: {
    changeMyList() {
      this.log = false;
    },
    changeMyListLog() {
      this.log = true;
    },
  },
};
</script>
