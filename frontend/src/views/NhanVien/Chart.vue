<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Thống kê số sách được mượn trong tháng</h1>

    <!-- Chọn tháng và năm -->
    <div class="mb-4 flex space-x-4">
      <select v-model="month" class="p-2 border rounded">
        <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
      </select>
      <select v-model="year" class="p-2 border rounded">
        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
      </select>
      <button @click="fetchData" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
        Lấy dữ liệu
      </button>
    </div>

    <!-- Hiển thị biểu đồ -->
    <div v-if="loading" class="text-center py-4">Đang tải...</div>
    <div v-else>
      <canvas ref="chartCanvas" class="mt-4"></canvas>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Chart from 'chart.js/auto';

export default {
  data() {
    return {
      month: new Date().getMonth() + 1, // Tháng hiện tại
      year: new Date().getFullYear(),   // Năm hiện tại
      years: Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i),
      loading: false,
      chartInstance: null,
      borrowData: [],
    };
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const response = await axios.get('/api/phieumuon/borrows-by-book', {
          params: { year: this.year, month: this.month },
        });
        this.borrowData = response.data;
        this.renderChart();
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        this.loading = false;
      }
    },
    renderChart() {
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      const ctx = this.$refs.chartCanvas.getContext('2d');
      this.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.borrowData.map(item => item._id),
          datasets: [{
            label: 'Số lần mượn',
            data: this.borrowData.map(item => item.borrowCount),
            backgroundColor: '#4CAF50',
            borderColor: '#45A049',
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Số lần mượn',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Mã sách',
              },
            },
          },
        },
      });
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
canvas {
  max-height: 400px;
}
</style>