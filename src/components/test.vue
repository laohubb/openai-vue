<template>
  <div class="input-container">
    <textarea
        class="input"
        :style="{ height: `${computedHeight}px` }"
        :value="value"
        @input="updateValue"
        ref="textarea"
        rows="1"
        wrap="soft"

    ></textarea>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: '',
      lineHeight: null
    };
  },
  computed: {
    computedHeight() {
      if (!this.$refs.textarea) return 0;
      const height = this.$refs.textarea.getBoundingClientRect().height;
      return Math.min(height, this.maxHeight);
    },
    maxHeight() {
      return 200;
    }
  },
  mounted() {
    this.lineHeight = parseInt(window.getComputedStyle(this.$refs.textarea).lineHeight);
  },
  methods: {
    updateValue(event) {
      this.value = event.target.value;
      this.$nextTick(() => {
        const textarea = this.$refs.textarea;
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.min(textarea.scrollHeight, this.maxHeight)}px`;
      });
    }
  }
};
</script>

<style>
.input-container {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.input {
  width: 100%;
  min-height: 50px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  line-height: 1.5;
  resize: none;
  outline: none;
  box-sizing: border-box;
}
.input::-webkit-scrollbar {
  width: 8px; /* 设置滚动条宽度 */
}

.input::-webkit-scrollbar-track {
  background-color: #f2f2f2; /* 设置滚动条轨道背景色 */
}

.input::-webkit-scrollbar-thumb {
  background-color: #aaa; /* 设置滚动条的颜色 */
  border-radius: 10px; /* 设置滚动条的圆角 */
}

.input-container::-webkit-scrollbar-thumb:hover {
  background-color: #666; /* 设置鼠标悬停时滚动条的颜色 */
}
</style>
