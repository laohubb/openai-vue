<script setup>

import {reactive, ref, computed, onMounted, nextTick} from 'vue';
import request from '../helper/request'


const state = reactive({
  userInput: '',
  chatResponse: ''
});

const getResponseFromChatGPT = async (inputText) => {

  const response = await request.post('https://api.openai.com/v1/chat/completions',
      {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": state.userInput}]
      },
      {
        headers: {
          'Authorization': 'Bearer '
        }
      });
  state.chatResponse = response.data.choices[0].message.content;

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

const sendMessage=()=>{
  getResponseFromChatGPT(state.userInput);
  state.userInput='';
}
const handleKeydown=(event)=>{
  if (event.key === 'Enter') {
    if (event.shiftKey && event.keyCode === 13) {
      // 按下 Shift + Enter
      // event.preventDefault(); // 阻止默认的 Enter 事件
      console.log('Shift + Enter');
    }else {
      event.preventDefault();
      if(state.userInput===''){
        return;
      }

      getResponseFromChatGPT(state.userInput);
      state.userInput='';
    }
  }
}
</script>

<template>
  <div class="box">
    <p>{{ state.chatResponse }}</p>

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
.input-container {
  position: fixed;
  bottom: 30px;
  width: 100%;
}


.textarea-wrapper {
  position: relative;
  width: 60%;
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
  border:none
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
