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
      <v-card style="min-height: 100%">
        <v-container
          text-xs-center
          fill-height
          align-center
          justify-space-between
        >
          <v-layout row align-center justify-space-between>
            <v-card xs12 md4 class="grow" @click="$router.push({name: 'scheduler'})">
              <v-card height="200" color="green darken-4" dark>
                <v-card-title
                  class="d-flex align-center flex-column mb-6 text-h5"
                >
                  Agendamentos de Hoje
                  <v-icon x-large>mdi-calendar-multiselect</v-icon>
                </v-card-title>
                <v-card-text
                  class="d-flex align-center flex-column mb-6 text-h3"
                >
                  {{ cards.agendamentos }}
                </v-card-text>
              </v-card>
            </v-card>
            <v-card xs12 md4 class="grow" @click="redirectPet()">
              <v-card height="200" color="green darken-2" dark>
                <v-card-title
                  class="d-flex align-center flex-column mb-6 text-h5"
                >
                  Animais Cadastrados <v-icon x-large>mdi-paw</v-icon>
                </v-card-title>
                <v-card-text
                  class="d-flex align-center flex-column mb-6 text-h3"
                >
                  {{ cards.pet }}
                </v-card-text>
              </v-card>
            </v-card>
            <v-card xs12 md4 class="grow" @click="(birthdatePet = true)">
              <v-card height="200" color="green darken-1" dark>
                <v-card-title
                  class="d-flex align-center flex-column mb-6 text-h5"
                >
                  AUniversariantes do Mês <v-icon x-large>mdi-gift</v-icon>
                </v-card-title>
                <v-card-text
                  class="d-flex align-center flex-column mb-6 text-h3"
                >
                  {{ cards.aniversario }}
                </v-card-text>
              </v-card>
            </v-card>
          </v-layout>
        </v-container>
      </v-card>

      <v-dialog v-model="birthdatePet" max-width="40%">
        <v-container class="px-4 py-4">
          <v-data-iterator :items="cards.petsAniversario" hide-default-footer>
            <template v-slot:header>
              <v-toolbar class="mb-2" color="green darken-3" dark flat>
                <v-toolbar-title
                  >AUniversariantes do Mês <v-icon>mdi-gift</v-icon></v-toolbar-title
                >
              </v-toolbar>
            </template>
            <template v-slot:default="props">
              <v-row>
                <v-col
                  v-for="item in props.items"
                  :key="item.idPet"
                  cols="12"
                >

              <v-card>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="text-h5 mb-1">
                      {{item.name}}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Tutor: {{item.userFullName}}<br>
                      Espécie: {{item.specie}}<br>
                      Raça: {{item.brand}}<br>
                      Nascimento: {{item.birthdate}}
                      </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-img
                  contain
                  max-height="100"
                  max-width="100"
                  :src="getIconPet(item.specie)"
                ></v-img>
                </v-list-item>
              </v-card>
                </v-col>
              </v-row>
            </template>
          </v-data-iterator>
        </v-container>
      </v-dialog>

    </v-container>
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
      petsAniversario: []
    },
    birthdatePet: false
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
    redirectPet() {
      if (window.localStorage.getItem("isAdmin") === "true") {
        return this.$router.push({name: 'pets'})
      } else if (window.localStorage.getItem("isPartner") === "true") {
        return this.$router.push({name: 'petspartner'})
      }else {
        return this.$router.push({name: 'petsuser'})
      }
    },
    getIconPet(specie) {
      switch (specie) {
        case "Canino":
          return require("../.././assets/pictures/iconDog.png");
        case "Felino":
          return require("../.././assets/pictures/iconCat.png");
        case "Ave":
          return require("../.././assets/pictures/iconBird2.png");
        case "Réptil":
          return require("../.././assets/pictures/iconReptil.png");
        case "Roedor":
          return require("../.././assets/pictures/iconBunny.png");
        default:
          return require("../.././assets/pictures/iconPet.png");
      }
    },
    openBirthdates(){
      if(this.cards.petsAniversario.length > 0){
        this.birthdatePet = true
      }
    }
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
