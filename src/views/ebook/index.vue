<template>
    <div class="ebook">
      <ebook-title></ebook-title>
      <ebook-reader></ebook-reader>
      <ebook-menu></ebook-menu>
    </div>
</template>

<script>
  import ebookReader from '../../components/ebook/ebookReader'
  import ebookTitle from '../../components/ebook/ebookTitle'
  import ebookMenu from '../../components/ebook/ebookMenu'
  export default {
    name: 'index.vue',
    components: {
      ebookReader,
      ebookTitle,
      ebookMenu
    }
  }
</script>

<style scoped>

</style>
