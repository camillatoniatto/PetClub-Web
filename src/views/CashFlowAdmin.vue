<template>
  <div id="app">
    <v-app id="inspire">
  <v-container>
    <h1 class="text-left ml-3">Financeiro</h1>

    <Bills/>


</v-container>
</v-app>
  </div>
</template>

<script>
import Bills from "@/components/cashflow/BillsAdmin.vue";

export default {
  name: "CashFlowView",
  components: {
    Bills,
  },
  data() {
    return {
      log: false
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
