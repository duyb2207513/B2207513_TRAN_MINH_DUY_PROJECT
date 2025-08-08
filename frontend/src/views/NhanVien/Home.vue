<template>

  <div class="m-2 p-2">

    <!-- <AppHeader/> -->

    
  </div>

  
</template>

<script>
// import AppFooter from '@/components/AppFooter.vue';
// import AppHeader from '@/components/NhanVien/AppHeader.vue';

// import productService from '@/services/product.service';
export default {
    components:{
        // AppHeader,

    },
  data() {
    return {
      latestProducts: [],
      bestSellers: [],
    };
  },
  methods: {
    getImageUrl(imagePath) {
      return `http://localhost:3000${imagePath}`;
    },
    async fetchProducts() {
      this.latestProducts = await productService.getLatest();
      this.bestSellers = await productService.getAllBestSeller();
    },
  },
  created() {
    this.fetchProducts();
  },
};
</script>
<!-- <style>
#carouselExampleIndicators {
  max-width: 90%; /* Giới hạn chiều rộng */
  margin: auto; /* Căn giữa */

  
}

.carousel-item img {
  height: 200px;
  object-fit: cover;
  border-radius: 20px; /* Bo góc nhẹ */
}
#carouselExampleIndicators {
 
  margin: auto;
}
</style> -->
