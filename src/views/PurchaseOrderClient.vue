<template>
  <v-container>
    <h1 class="text-left ml-3">Minhas Compras</h1>
    <PurchaseOrder/>
  </v-container>
</template>

<script>
import PurchaseOrder from '@/components/purchaseorder/PurchaseOrderClient.vue'

export default {
  name: 'PurchaseOrderClientView',
  components: {
    PurchaseOrder
  }
}
</script>
