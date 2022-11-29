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

        <br />

        <!-- tabela reserva -->
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="services" :search="search">
          <template v-slot:item="row">
            <tr>
              <td>{{ row.item.title }}</td>
              <td>{{ row.item.serviceType }}</td>
              <td>R$ {{ row.item.value }}</td>
              <td>{{ row.item.sold }}</td>
              <td>{{ row.item.writeDate }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-container>
    </v-app>
  </div>
</template>

<script>
import register from "@/store/modules/services";

export default {
  name: "PageLogService",
  data() {
    return {
      service: {
        id: "",
        title: "",
        serviceType: "",
        value: 0,
        writeDate: "",
      },
      services: [],
      errors: [],
      search: "",
      headers: [
        {
          text: "Titulo",
          align: "center",
          value: "title",
        },
        { text: "Tipo de Serviço", align: "center", value: "serviceType" },
        { text: "Valor", align: "center", value: "value" },
        { text: "Realizações", align: "center", value: "sold" },
        { text: "Data da Remoção", align: "center", value: "writeDate" },
      ],
    };
  },
  mounted() {
    this.listarLog();
  },
  methods: {
    listarLog() {
      register
        .getLogServices()
        .then((response) => {
          this.services = response.data.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>
