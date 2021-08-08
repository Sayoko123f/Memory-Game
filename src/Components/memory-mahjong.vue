<template>
  <div class="">
    <div class="bg-gray-500 p-4 md:px-20 xl:px-24">
      <div class="flex flex-wrap justify-center gap-1.5">
        <div
          class="select-none bg-opacity-80"
          :class="calcDivClass(item)"
          v-for="(item, i) in cards"
          :key="i"
          @click="selecting(item)"
        >
          <img
            class="h-sm w-sm md:w-md md:h-md"
            :src="item.src"
            draggable="false"
            @mousedown="_disableDrag"
          />
        </div>
      </div>
    </div>
    <!-- Prompt Message -->
    <div class="mt-2 p-4 bg-gray-900 text-white rounded">
      <p class="font-bold text-xl">{{ _userPrompt }}</p>
    </div>
    <!-- Debug Message -->
    <div class="mt-6 p-4 bg-gray-900 text-white rounded" @click="log">
      <p class="font-bold text-xl">------Debug------</p>
      <p class="font-bold">playerStatus: {{ playerStatus }}</p>
      <p class="font-bold">timerSecond: {{ timerSecond }}</p>
      <p class="font-bold">score: {{ score }}</p>
      <!-- <p class="font-bold">prevClickCard: {{ prevClickCard }}</p> -->
      <p class="font-bold">config: {{ config }}</p>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.init();
  },
  props: {
    config: {
      /**
       * 1: 10 kinds of cards.
       * 2: 15 kinds of cards.
       * 3: 18 kinds of cards.
       * 4: 28 kinds of cards.
       * 5: 32 kinds of cards.
       * 6: 36 kinds of cards.
       */
      difficult: Number,
      showAnswerDuration: Number,
      showPerCardDuration: Number,
      /**
       * 1: Countdown.
       * 2: Time race.
       */
      gameMode: Number,
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
  }),
  computed: {
    diflen() {
      switch (this.config.difficult) {
        case 1:
          return 10;
        case 2:
          return 15;
        case 3:
          return 18;
        case 4:
          return 28;
        case 5:
          return 32;
        case 6:
          return 36;
        default:
          return 10;
      }
    },
    getCardBackSrc() {
      return "source/70.png";
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
      // Show answer
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
            this.countdown(6);
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
      switch (this.playerStatus) {
        default:
          throw new Error("Unexpected playerStatus");
        case 1:
          this.prevClickCard = card;
          this.playerStatus = 2;
          this.userPrompt(`正在選擇 ${card.val}`);
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
            }
          } else {
            // Different
            this.setCardStatus(this.showing, prevIndex, card.index);
            this.userPrompt(`配對失敗 ${card.val}|${this.prevClickCard.val}`);
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
        return ["bg-yellow-400"];
      }
      if (card.status === this.selected) {
        return ["bg-blue-400"];
      }
      return ["bg-white", "hover:bg-pink-400", "cursor-pointer"];
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
    getRandomKinds(n) {
      const pool = [
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "38",
        "39",
        "41",
        "42",
        "43",
        "44",
        "45",
        "46",
        "47",
        "51",
        "52",
        "53",
      ];
      return pool.sort(() => Math.random() - 0.5).slice(0, n);
    },
    getImageSrc(val) {
      return `source/${val}.png`;
    },
    log() {
      console.log("this.cards", this.cards);
      console.log("this.prevClickCard", this.prevClickCard);
      console.log(this.config);
    },
    _disableDrag(e) {
      e.preventDefault();
    },
  },
};
</script>