<template>
  <v-container>
    <!-- titulo -->
    <h1 class="text-left ml-3">Vendas</h1>
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
