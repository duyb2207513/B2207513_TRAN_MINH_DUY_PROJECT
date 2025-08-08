<template>
  <div class="container mt-4">
    <h2 class="text-center mb-4">Thống kê</h2>
    <div v-if="loading" class="text-center">Đang tải...</div>
    <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>
    <div v-if="!loading && !error" class="row">
      <div class="col-md-6 mb-3">
        <div class="card">
          <div class="card-body text-center">
            <h5 class="card-title">Số lượng người thuê sách</h5>
            <p class="card-text display-4">{{ borrowerCount }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-6 mb-3">
        <div class="card">
          <div class="card-body text-center">
            <h5 class="card-title">Doanh thu (VND)</h5>
            <p class="card-text display-4">{{ revenue.toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'StatisticsComponent',
  setup() {
    const loading = ref(true);
    const error = ref(null);
    const borrowerCount = ref(0);
    const revenue = ref(0);

    const fetchStatistics = async () => {
      try {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;

        const [borrowersResponse, revenueResponse] = await Promise.all([
          axios.get(`/count-borrowers?year=${year}&month=${month}`),
          axios.get(`/revenue?year=${year}&month=${month}`)
        ]);

        borrowerCount.value = borrowersResponse.data.totalBorrowers;
        revenue.value = revenueResponse.data.totalRevenue;
      } catch (err) {
        error.value = 'Lỗi khi tải thống kê';
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchStatistics);

    return { loading, error, borrowerCount, revenue };
  }
};
</script>

<style scoped>
/* Thêm CSS tùy chỉnh nếu cần */
</style>