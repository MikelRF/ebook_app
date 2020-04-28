<template>
  <div class="star">
    <div v-for="(index) in itemClasses" :key="index"
         :class="{'is-selected': isSelected(index)}"
         class="star-item"
         :style="setFontSize"
         ref="star"
         @click="stars(index, notClick)"
         track-by="index">
      <div class="icon-star"></div>
    </div>
  </div>
</template>

<script>
  import { px2rem } from '../../utils/book'

  export default {
    name: 'star',
    props: {
      notClick: {
        type: Boolean,
        default: true
      },
      choseScore: {
        type: Number,
        default: 0
      },
      fontSize: Number
    },
    data () {
      return {
        score: this.choseScore,
        NoCLICK: this.notClick
      }
    },
    computed: {
      itemClasses () {
        const result = [0, 1, 2, 3, 4]
        return result
      },
      setFontSize () {
        return {
          fontSize: `${px2rem(this.fontSize)}rem`
        }
      }
    },
    methods: {
      isSelected (index, notClick) {
        return this.NoCLICK ? (this.score / 2) >= index + 1 : (this.score) >= index + 1
      },
      stars (index, notClick) {
        if (this.NoCLICK) {
        } else {
          this.score = index + 1
          this.$emit('score', this.score)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .star {
    .star-item {
      display: inline-block;
      background-repeat: no-repeat;
      color: #cccccc;

      &.is-selected {
        color: $color-blue;
      }
    }
  }

</style>
