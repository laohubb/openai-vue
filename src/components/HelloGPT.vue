<script setup>

import {reactive, ref, computed, onMounted, nextTick} from 'vue';
import request from '../helper/request'


const state = reactive({
  userInput: '',
  chatResponse: ''
});

const dialogue = ref([])

const getResponseFromChatGPT = async (inputText) => {
  dialogue.value.push({
    content: inputText,
    role: 'user'
  })
  const response = await request.post('https://api.openai.com/v1/chat/completions',
      {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": state.userInput}]
      },
      {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_TOKEN}`,
        }
      });
  state.chatResponse = response.data.choices[0].message.content;
  dialogue.value.push({
    content: response.data.choices[0].message.content,
    role: 'bot'
  })
}


const textareaRef = ref();
const value = ref('');
let lineHeight = null;

const computedTextareaHeight = computed(() => {
  if (!textareaRef.value) return 0;
  const height = textareaRef.value.getBoundingClientRect().height;
  return Math.min(height, maxHeight.value);
});

const maxHeight = ref(100);

onMounted(() => {
  lineHeight = parseInt(window.getComputedStyle(textareaRef.value).lineHeight);
});

function updateValue(event) {
  value.value = event.target.value;
  nextTick(() => {

    const textareaElement = textareaRef.value;
    textareaElement.style.height = 'auto';
    textareaElement.style.height = `${Math.min(textareaElement.scrollHeight, maxHeight.value)}px`;
  });
}

const sendMessage = () => {
  getResponseFromChatGPT(state.userInput);
  state.userInput = '';
}
const handleKeydown = (event) => {
  if (event.key === 'Enter') {
    if (event.shiftKey && event.keyCode === 13) {
      // 按下 Shift + Enter
      // event.preventDefault(); // 阻止默认的 Enter 事件
      console.log('Shift + Enter');
    } else {
      event.preventDefault();
      if (state.userInput === '') {
        return;
      }

      getResponseFromChatGPT(state.userInput);
      state.userInput = '';
    }
  }
}
</script>

<template>
  <div class="box">

    <div class="dialogue">
      <p v-for="(item, index) in dialogue" :key="index" :class="{ bot: item.role==='bot' }">{{ item.content }}</p>
    </div>
    <div class="input-container">
      <div class="textarea-wrapper">
           <textarea class="input" :style="{ height: `${computedTextareaHeight}px` }" v-model="state.userInput"
                     @input="updateValue" ref="textareaRef" rows="1" wrap="soft" @keydown="handleKeydown">
      </textarea>
        <button class="my-button" @click="sendMessage">></button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dialogue {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  p {
    width: 40%;
    padding: 10px;
  }

  .bot {
    background-color: #f0f0f0;
  }
}

.input-container {
  position: fixed;
  bottom: 30px;
  width: 100%;
}


.textarea-wrapper {
  position: relative;
  width: 60%;
}
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

.my-button {
  position: absolute;
  right: 10px;
  bottom: 10px;
}

.my-button {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  background-color: #007bff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  border: none
}

.my-button:hover {
  background-color: #0069d9;
  color: #fff;
}

.my-button:active {
  background-color: #005cbf;
  color: #fff;
}

.my-button:disabled {
  background-color: #ced4da;
  color: #6c757d;
  cursor: not-allowed;
}

</style>
