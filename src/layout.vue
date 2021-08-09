<template>
  <div class="">
    <div class="">
      <h1>Memory Game</h1>
      <div class="">
        <h3>請選擇難度</h3>
        <button
          :class="[
            btnBaseClass,
            cf.difficult === i + 1 ? ['bg-blue-600', 'text-white'] : 'bg-white',
          ]"
          v-for="(level, i) in levels"
          :key="i"
          @click.stop="setDifficult(i + 1)"
        >
          {{ level }}
        </button>
      </div>
      <div class="">
        <button
          class="bg-black"
          :class="[btnBaseClass, showGame ? 'text-gray-500' : 'text-white']"
          @click="newGame"
          :disabled="showGame"
        >
          New Game
        </button>
        <button
          class="bg-black"
          :class="[btnBaseClass, showGame ? 'text-white' : 'text-gray-500']"
          @click="delGame"
          :disabled="!showGame"
        >
          Destory Game
        </button>
      </div>
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
    // this.newGame();
  },
  components: { game },
  data: () => ({
    cf: {
      difficult: 4,
      showAnswerDuration: 1800,
      showPerCardDuration: 1500,
      gameMode: 1,
      countdownSecond: 10,
    },
    showGame: false,
    btnBaseClass: ["rounded", "px-2", "py-1", "font-bold", "hover:shadow-md"],
    levels: ["簡單", "普通", "進階", "星爆"],
  }),
  methods: {
    newGame() {
      // Check Config argv
      this.cf.gameMode = parseInt(this.cf.gameMode);
      this.cf.showAnswerDuration = parseInt(this.cf.showAnswerDuration);
      this.cf.showPerCardDuration = parseInt(this.cf.showPerCardDuration);
      this.cf.countdownSecond = parseInt(this.cf.countdownSecond);
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
    setDifficult(level) {
      this.cf.difficult = level;
    },
  },
};
</script>

<style>
</style>