<template>
  <v-container>
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <PurchaseOrder/>
  </v-container>
</template>

<script>
// @ is an alias to /src
import PurchaseOrder from '@/components/purchaseorder/PurchaseOrder.vue'

export default {
  name: 'PurchaseOrderView',
  components: {
    PurchaseOrder
  }
}
</script>
