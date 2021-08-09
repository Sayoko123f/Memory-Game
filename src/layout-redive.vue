<template>
  <div class="bg-white">
    <div class="">
      <h1 class="text-xl text-center">Memory Game</h1>
      <div class="text-center mt-1.5">
        <h3 class="inline mr-2">請選擇難度：</h3>
        <button
          class="ml-0.5"
          :class="[
            btnBaseClass,
            cf.difficult === i ? ['bg-blue-600', 'text-white'] : 'bg-white',
          ]"
          v-for="(level, i) in cf.levels"
          :key="i"
          @click.stop="setDifficult(i)"
        >
          {{ level }}
        </button>
      </div>
      <!-- <div class="text-center">
        <h3 class="inline mr-2">是否倒數計時：</h3>
        <button
          class="ml-0.5"
          :class="[
            btnBaseClass,
            cf.gameMode === 1 ? ['bg-blue-600', 'text-white'] : 'bg-white',
          ]"
          @click.stop="setGameMode(1)"
        >
          倒數
        </button>
        <button
          class="ml-0.5"
          :class="[
            btnBaseClass,
            cf.gameMode === 2 ? ['bg-blue-600', 'text-white'] : 'bg-white',
          ]"
          @click.stop="setGameMode(2)"
        >
          不限時
        </button>
      </div> -->
      <div class="text-center mt-1.5">
        <button
          class="bg-black mr-1"
          :class="[btnBaseClass, showGame ? 'text-gray-500' : 'text-white']"
          @click="newGame"
          :disabled="showGame"
        >
          開始
        </button>
        <button
          class="bg-black ml-1"
          :class="[btnBaseClass, showGame ? 'text-white' : 'text-gray-500']"
          @click="delGame"
          :disabled="!showGame"
        >
          重來
        </button>
      </div>
    </div>
    <div class="mt-4 bg-redive bg-no-repeat" v-if="showGame">
      <game :config="cf"></game>
    </div>
  </div>
</template>

<script>
import game from "./Components/memory-redive.vue";
export default {
  mounted() {
    // this.newGame();
  },
  components: { game },
  data: () => ({
    cf: {
      difficult: 1,
      showAnswerDuration: 3500,
      showPerCardDuration: 1500,
      gameMode: 2,
      countdownSecond: 10,
      levels: ["簡單", "普通", "進階", "星爆"],
    },
    showGame: false,
    btnBaseClass: ["rounded", "px-2", "py-1", "font-bold", "hover:shadow-md"],
  }),
  methods: {
    newGame() {
      // Check Config argv
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
      if (!(0 <= this.cf.difficult && this.cf.difficult <= 3)) {
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
    setGameMode(mode) {
      this.cf.gameMode = mode;
    },
  },
};
</script>

<style>
</style>