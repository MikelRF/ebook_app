<template>
  <div id="app">

    <router-view/>
  </div>
</template>
<script>
  export default {}
  // 1rem = fontsize px
  // 1 rem = 16 px
  // 375 fontsize = 37.5 px= 1rem
  // 1px = 1rem / fontsize
  document.addEventListener('DOMContentLoaded', () => {
    const html = document.querySelector('html')
    let fontSize = window.innerWidth / 10
    fontSize = fontSize > 50 ? 50 : fontSize
    html.style.fontSize = fontSize + 'px'
  })
</script>
<style lang="scss">
#app{
  width: 100%;
  height: 100%;
  background: #7d8188;
  overflow: hidden;
}
</style>
