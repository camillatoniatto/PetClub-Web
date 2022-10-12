<template>
  <div id="app">
    <v-app id="inspire">
        <!-- adicionar novo -->
        <v-container>
            <div class="text-left mb-2 mr-2">
                <v-btn color="dark" dark @click="editItem(serviceSelecionado)">
                    <v-icon dark>mdi-plus</v-icon>
                    Adicionar um serviço
                </v-btn>
            </div>

            <br>

            <!-- tabela reserva -->
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details></v-text-field>
            </v-card-title>
            <v-data-table :headers="headers" :items="services" :search="search">
              <template v-slot:item="row">
                <tr>
                    <td>{{row.item.id}}</td>
                    <td>{{row.item.title}}</td>
                    <td>{{row.item.serviceType}}</td>
                    <td>R$ {{row.item.value}}</td>
                </tr>
              </template>
            </v-data-table>
        </v-container>
    </v-app>
</div>
</template>

<script>
import register from '@/store/modules/services'

export default {
  name: 'PageLogService',
  data () {
    return {
      service: {
        id: '',
          title: '',
          serviceType: '',
          value: 0,
      },
      services: [],
      errors: [],
      search: '',
      headers: [
      {
        text: 'Status',
        align: 'start',
        value: 'name',
      },
      { text: 'Titulo', value: 'title' },
      { text: 'Tipo de Serviço', value: 'serviceType' },
      { text: 'Valor', value: 'value' },
    ],
  }
},
mounted(){
  this.listarLog()
},
methods:{
  listarLog(){
      register.getLogServices().then(response => {
      this.services = response.data.data
    }).catch(e => {
      console.log(e)
    })
  },
}
}
</script>