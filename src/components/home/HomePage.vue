<template>
  <div class="pa-3">
    <v-carousel>
      <v-carousel-item
        v-for="(image, i) in images"
        :key="i"
        :src="image.src"
        reverse-transition="fade-transition"
        transition="fade-transition"
      ></v-carousel-item>
    </v-carousel>

    <v-container>
      <v-card :style="{background: grad}" style="min-height: 100%">
      <v-container
        text-xs-center
        fill-height
        align-center
        justify-space-between
      >
        <v-layout row align-center justify-space-between>

          <v-card
            xs12
            md4
            @click.native="changeColor()"
            class="grow"
          >
          <v-card height="200" color="green darken-4" dark>
              <v-card-title class="d-flex align-center flex-column mb-6 text-h5">
                Agendamentos de Hoje <v-icon x-large>mdi-calendar-multiselect</v-icon>
              </v-card-title>
              <v-card-text class="d-flex align-center flex-column mb-6 text-h3">
                {{ cards.agendamentos }}
              </v-card-text>
            </v-card>
          </v-card>
          <v-card
            xs12
            md4
            @click.native="changeColor()"
            class="grow"
          >
            <v-card height="200" color="green darken-2" dark>
              <v-card-title class="d-flex align-center flex-column mb-6 text-h5">
                Animais Cadastrados <v-icon x-large>mdi-paw</v-icon>
              </v-card-title>
              <v-card-text class="d-flex align-center flex-column mb-6 text-h3">
                {{ cards.pet }}
              </v-card-text>
            </v-card>
          </v-card>
          <v-card
            xs12
            md4
            @click.native="changeColor()"
            class="grow"
          >
          <v-card height="200" color="green darken-1" dark>
              <v-card-title class="d-flex align-center flex-column mb-6 text-h5">
                AU-niversariantes do Mês <v-icon x-large>mdi-gift</v-icon>
              </v-card-title>
              <v-card-text class="d-flex align-center flex-column mb-6 text-h3">
                {{ cards.aniversario }}
              </v-card-text>
            </v-card>
          </v-card>




        </v-layout>
      </v-container>
    </v-card>
    </v-container>

    <!-- <v-container>
        <v-row >

          <v-col col="4" class="pa-3">
            <v-card elevation="8" color="green darken-4" dark height="100%" >
              <v-col class="d-flex align-start flex-column mb-6 text-h5">
                Agendamentos de Hoje
              </v-col>
              <v-col class="d-flex align-end flex-column mb-6 text-h3" title>
                {{ cards.agendamentos }}
              </v-col>
            </v-card>
          </v-col>

          <v-col col="4" class="pa-3">
            <v-card elevation="8" color="green darken-3" dark height="100%" >
              <v-col class="d-flex align-start flex-column mb-6 text-h5">
                Animais Cadastrados
              </v-col>
              <v-col class="d-flex align-end flex-column mb-6 text-h3" title>
                {{ cards.pet }}
              </v-col>
            </v-card>
          </v-col>

          <v-col col="4" class="pa-3">
            <v-card elevation="8" color="green darken-2" dark height="100%" >
              <v-col class="d-flex align-start flex-column mb-6 text-h5">
                AU-niversariantes do Mês 🎁
              </v-col>
              <v-col class="d-flex align-end flex-column mb-6 text-h3" title>
                {{ cards.aniversario }}
              </v-col>
            </v-card>
          </v-col>

        </v-row>
      </v-container> -->
  </div>
</template>

<script>
import register from "@/store/modules/users";

export default {
  data: () => ({
    model: 0,
    images: [
      {
        src: require("../.././assets/carrossel/iStock-1345473066-1140x620.jpg"),
      },
      {
        src: require("../.././assets/carrossel/Cachorro-4.jpg"),
      },
      {
        src: require("../.././assets/carrossel/how-to-make-your-dog-famous-on-instagram-2.png"),
      },
    ],
    cards: {
      agendamentos: 0,
      pet: 0,
      aniversario: 0,
    },
  }),
  mounted() {
    this.detalhes();
  },
  methods: {
    detalhes() {
      register
        .getHomeCards()
        .then((response) => {
          this.cards = response.data.data;
        })
        .catch((e) => {
          console.log(e);
        });
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
