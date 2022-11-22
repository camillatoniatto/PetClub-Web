<template>
  <v-container>
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
