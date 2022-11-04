<template>
  <v-carousel>
    <v-carousel-item
      v-for="(image, i) in images"
      :key="i"
      :src="image.src"
      reverse-transition="fade-transition"
      transition="fade-transition"
    ></v-carousel-item>
  </v-carousel>
</template>

<script>
export default {
  data: () => ({
    model: 0,
    images: [
      {
        src: require('../.././assets/carrossel/iStock-1345473066-1140x620.jpg'),
      },
    //   {
    //     src: require('../.././assets/carrossel/Animal-Village_30-e1626475176183.jpg'),
    //   },
      {
        src: require('../.././assets/carrossel/Cachorro-4.jpg'),
      },
      {
        src: require('../.././assets/carrossel/how-to-make-your-dog-famous-on-instagram-2.png'),
      },
    //   {
    //     src: require('../.././assets/carrossel/zwierzeta_w_samolocie-k.jpg'),
    //   },
    ],
  }),
};
</script>
