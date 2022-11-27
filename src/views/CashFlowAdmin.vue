<template>
  <div id="app">
    <v-app id="inspire">
  <v-container>

    <Bills/>


</v-container>
</v-app>
  </div>
</template>

<script>
import Bills from "@/components/cashflow/Bills.vue";

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
