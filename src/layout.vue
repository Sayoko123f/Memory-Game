<template>
  <div class="">
    <div class="">
      <h1>Memory Game</h1>
      <select
        class="outline-none p-1 border focus:border-blue-400 border-black"
        v-model="cf.difficult"
      >
        <option :value="1">Very Very Easy</option>
        <option :value="2">Very Easy</option>
        <option :value="3">Easy</option>
        <option :value="4">Normal</option>
        <option :value="5">Hard</option>
        <option :value="6">Nightmare</option>
      </select>
      <button
        :class="[btnBaseClass, showGame ? 'text-gray-500' : 'text-white']"
        @click="newGame"
        :disabled="showGame"
      >
        New Game
      </button>
      <button
        :class="[btnBaseClass, showGame ? 'text-white' : 'text-gray-500']"
        @click="delGame"
        :disabled="!showGame"
      >
        Destory Game
      </button>
    </div>
    <div class="mt-4" v-if="showGame">
      <game :config="cf"></game>
    </div>
  </div>
</template>

<script>
import game from "./Components/memory-mahjong.vue";
export default {
  mounted() {
    this.newGame();
  },
  components: { game },
  data: () => ({
    cf: {
      difficult: 4,
      showAnswerDuration: 1800,
      showPerCardDuration: 1700,
      gameMode: 2,
    },
    showGame: false,
    btnBaseClass: [
      "rounded",
      "px-2",
      "py-1",
      "font-bold",
      "hover:shadow-md",
      "bg-black",
    ],
  }),
  methods: {
    newGame() {
      // Check Config argv
      this.cf.difficult = parseInt(this.cf.difficult);
      this.cf.gameMode = parseInt(this.cf.gameMode);
      this.cf.showAnswerDuration = parseInt(this.cf.showAnswerDuration);
      this.cf.showPerCardDuration = parseInt(this.cf.showPerCardDuration);
      if (!this.cf.showAnswerDuration || this.cf.showAnswerDuration <= 0) {
        return;
      }
      if (!this.cf.showPerCardDuration || this.cf.showPerCardDuration <= 0) {
        return;
      }
      if (!(1 <= this.cf.gameMode && this.cf.gameMode <= 2)) {
        return;
      }
      if (!(1 <= this.cf.difficult && this.cf.difficult <= 6)) {
        return;
      }

      console.log("New game");
      this.showGame = true;
    },
    delGame() {
      this.showGame = false;
    },
  },
};
</script>

<style>
</style>