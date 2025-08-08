<template>
  <div class="search-bar mx-auto">
    <div class="input-group shadow-sm rounded overflow-hidden">
      <input
        type="text"
        class="form-control border-0"
        placeholder="🔍 Nhập tên sách để tìm kiếm..."
        :value="modelValue"
        @input="updateModelValue"
        @keyup.enter="submit"
      />
      <div class="input-group-append">
        <button class="btn btn-primary px-4" type="button" @click="submit">
          Tìm kiếm
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: { type: String, default: "" },
  },
  emits: ["submit", "update:modelValue"],
  methods: {
    updateModelValue(e) {
      this.$emit("update:modelValue", e.target.value);
    },
    submit() {
      this.$emit("submit", this.modelValue.trim());
    },
  },
};
</script>

<style scoped>
.search-bar {
  max-width: 500px;
  margin: 20px auto;
}
</style>
