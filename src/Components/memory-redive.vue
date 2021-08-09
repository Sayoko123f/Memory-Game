<template>
  <div class="bg-gray-200 bg-opacity-30">
    <!-- Prompt Message -->
    <div class="mt-2 p-4 rounded-md text-center border-2 border-yellow-300">
      <span
        class="font-bold text-xl px-6 py-1.5 bg-gray-200 bg-opacity-60 rounded"
        >{{ _userPrompt }}</span
      >
    </div>
    <div class="p-4 md:px-20 xl:px-24 border-2 border-yellow-300 rounded-md">
      <div class="flex flex-wrap justify-center gap-1.5">
        <div
          class="select-none relative rounded-md"
          v-for="(item, i) in cards"
          :key="i"
          @click.stop="selecting(item)"
          @click="gameStart"
        >
          <div v-if="showAnswerMask" class="absolute top-0 left-0 h-16 w-16">
            <img :src="getCardBackSrc" />
          </div>
          <div
            class="
              absolute
              top-0
              left-0
              h-16
              w-16
              hover:bg-opacity-25
              bg-opacity-25
              rounded
            "
            :class="calcDivClass(item)"
          ></div>
          <img
            class="h-16 w-16"
            :src="item.src"
            draggable="false"
            @mousedown="_disableDrag"
          />
        </div>
      </div>
    </div>
    <!-- Game End show score -->
    <div
      class="p-4 bg-gray-900 text-white rounded text-lg text-center"
      v-if="playerStatus === 3"
      ref="gamerecord"
    >
      <p class="text-xl">------遊戲紀錄------</p>
      <p>
        難度：
        <span class="font-bold">{{ config.levels[config.difficult] }}</span>
      </p>
      <p>
        完成時間： <span class="font-bold">{{ timerSecond }}</span>
      </p>
      <p>
        翻牌次數： <span class="font-bold">{{ userSelectCount }}</span>
      </p>
      <button class="font-bold px-2 py-1 bg-gray-600" @click="copyGameInfo">
        複製到剪貼簿
      </button>
      <p class="text-sm">{{ userCopyResultTip }}</p>
    </div>
    <!-- Debug Message -->
    <!-- <div class="mt-6 p-4 bg-gray-900 text-white rounded" @click="log">
      <p class="font-bold text-xl">------Debug------</p>
      <p class="font-bold">playerStatus: {{ playerStatus }}</p>
      <p class="font-bold">timerSecond: {{ timerSecond }}</p>
      <p class="font-bold">score: {{ score }}</p>
      <p class="font-bold">userSelectCount: {{ userSelectCount }}</p>
      <p class="font-bold">prevClickCard: {{ prevClickCard }}</p>
      <p class="font-bold">config: {{ config }}</p>
    </div> -->
  </div>
</template>

<script>
import redive from "../metadata/redivemeta";
export default {
  mounted() {
    this.init();
  },
  props: {
    config: {
      difficult: Number,
      showAnswerDuration: Number,
      showPerCardDuration: Number,
      countdownSecond: Number,
      /**
       * 1: Countdown.
       * 2: Time race.
       */
      gameMode: Number,
      levels: Array,
    },
  },
  data: () => ({
    cards: [],
    /**
     * 0: Forbidden to any action.
     * 1: It Means that player is not selected card.
     * 2: It Means that player is selected one card.
     * 3: Forbidden to any action, Game End.
     */
    playerStatus: 1,
    prevClickCard: null,
    showing: "showing",
    hidden: "hidden",
    selected: "selected",
    matched: "matched",
    timer: null,
    timerSecond: 0,
    _userPrompt: "",
    getCardBackSrc: "u/999999.png",
    userSelectCount: 0,
    showAnswerMask: true,
    userCopyResultTip: "",
  }),
  computed: {
    diflen() {
      let levelKind = [10, 16, 36, 90];
      if (this.config.difficult >= levelKind.length) {
        return levelKind[0];
      }
      return levelKind[this.config.difficult];
    },
    score() {
      return this.cards.filter((e) => e.status === this.matched).length / 2;
    },
  },
  methods: {
    init() {
      this.userPrompt("正在初始化......");
      this.cards = [];
      this.playerStatus = 0;
      this.prevClickCard = null;
      this.userSelectCount = 0;
      this.showAnswerMask = true;
      let kinds = this.getRandomKinds(this.diflen);
      kinds = kinds.concat(kinds.slice(0));
      this.cards = kinds
        // Random sort
        .sort(() => Math.random() - 0.5)
        // Set card object
        .map((e, i) => {
          let obj = {};
          obj.val = e;
          obj.src = this.getImageSrc(e);
          obj.index = i;
          obj.status = this.showing;
          return obj;
        });
      this.userPrompt("點擊以開始遊戲");
    },
    gameStart() {
      if (!this.showAnswerMask) {
        return;
      }
      // Show answer
      this.showAnswerMask = false;
      this.userPrompt("顯示答案中");
      this.wait(this.config.showAnswerDuration)
        .then(() => {
          // Hidden answer
          for (let i = 0; i < this.cards.length; i++) {
            this.setCardStatus(this.hidden, i);
          }
        })
        .then(() => {
          // Game start
          this.userPrompt("遊戲開始");
          this.playerStatus = 1;

          // Game mode 1
          if (this.config.gameMode === 1) {
            // Start countdown.
            this.countdown(this.config.countdownSecond);
            return;
          }

          // Game mode 2
          if (this.config.gameMode === 2) {
            this.timeRace();
            return;
          }
        });
    },
    countdown(s) {
      this.timerSecond = s;
      this.timer = setInterval(() => {
        if (this.timerSecond-- <= 1) {
          // Game End
          this.gameEnd();
        }
      }, 1000);
    },
    timeRace() {
      this.timerSecond = 0;
      this.timer = setInterval(() => {
        this.timerSecond++;
      }, 1000);
    },
    selecting(card) {
      if (
        card.status !== this.hidden ||
        this.playerStatus === 0 ||
        this.playerStatus === 3
      ) {
        return;
      }
      this.setCardStatus(this.showing, card.index);
      this.setCardStatus(this.selected, card.index);
      this.userSelectCount++;
      switch (this.playerStatus) {
        default:
          throw new Error("Unexpected playerStatus");
        case 1:
          this.prevClickCard = card;
          this.playerStatus = 2;
          this.userPrompt(`正在選擇 ${redive.getCharacterName(card.val)}`);
          break;
        case 2:
          // Check prev click
          const prevIndex = this.prevClickCard.index;
          if (card.val === this.prevClickCard.val) {
            // Same
            this.setCardStatus(this.matched, prevIndex, card.index);
            // Check win
            if (this.score === this.diflen) {
              this.gameEnd();
              return;
            }
          } else {
            // Different
            this.setCardStatus(this.showing, prevIndex, card.index);
            this.userPrompt(
              `配對失敗 ${redive.getCharacterName(
                card.val
              )}|${redive.getCharacterName(this.prevClickCard.val)}`
            );
            this.wait(this.config.showPerCardDuration).then(() => {
              this.setCardStatus(this.hidden, prevIndex, card.index);
            });
          }
          this.prevClickCard = null;
          this.playerStatus = 1;
          break;
      }
    },
    setCardStatus(status, ...index) {
      switch (status) {
        case "showing":
          index.forEach(
            (e) => (this.cards[e].src = this.getImageSrc(this.cards[e].val))
          );
          break;
        case "hidden":
          index.forEach((e) => (this.cards[e].src = this.getCardBackSrc));
          break;
        case "selected":
          break;
        case "matched":
          this.userPrompt(`配對成功！`);
          break;
        default:
          throw new Error("Unexpected status");
      }
      index.forEach((e) => (this.cards[e].status = status));
    },
    calcDivClass(card) {
      if (card.status === this.matched) {
        return ["border-2", "border-yellow-400", "ring-2", "ring-yellow-400"];
      }
      if (card.status === this.selected) {
        return ["border-2", "border-blue-400", "ring-2", "ring-blue-400"];
      }
      return [
        "hover:border-2",
        "hover:border-pink-400",
        "hover:ring-2",
        "hover:ring-pink-400",
        "cursor-pointer",
      ];
    },
    /**
     * gameEnd method has two entrances,
     * 1: this.countdown()
     * 2: this.score === this.diflen
     */
    gameEnd() {
      this.playerStatus = 3;
      clearInterval(this.timer);

      this.userPrompt("遊戲結束");
    },
    wait(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    },
    userPrompt(msg) {
      this._userPrompt = msg;
    },
    getPool() {
      const d = this.config.difficult;
      let res = [...redive.getCharacterPool(3)];
      if (d >= 5) {
        res = [...res, ...redive.getCharacterPool(6)];
      }
      if (d >= 6) {
        res = [...res, ...redive.getCharacterPool(1)];
      }
      return res;
    },
    getRandomKinds(n) {
      return this.getPool()
        .sort(() => Math.random() - 0.5)
        .slice(0, n);
    },
    getImageSrc(val) {
      return `u/${val}.png`;
    },
    log() {
      console.log("this.cards", this.cards);
      console.log("this.prevClickCard", this.prevClickCard);
      console.log(this.config);
    },
    _disableDrag(e) {
      e.preventDefault();
    },
    copyGameInfo() {
      let str = `------遊戲紀錄------\n難度： ${
        this.config.levels[this.config.difficult]
      }\n完成時間： ${this.timerSecond}\n翻牌次數： ${this.userSelectCount}`;
      let result = this._copyToClipboard(str);
      this.userCopyResultTip = result ? "複製成功👌" : "似乎複製失敗了:(";
    },
    _copyToClipboard(text) {
      if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return window.clipboardData.setData("Text", text);
      } else if (
        document.queryCommandSupported &&
        document.queryCommandSupported("copy")
      ) {
        let textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
          return document.execCommand("copy"); // Security exception may be thrown by some browsers.
        } catch (ex) {
          console.warn("Copy to clipboard failed.", ex);
          return false;
        } finally {
          document.body.removeChild(textarea);
        }
      }
    },
  },
};
</script>