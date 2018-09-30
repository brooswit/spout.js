<template>
  <vue-markdown :source="this.$store.getters.docMarkdown"></vue-markdown>
</template>

<script>
import VueMarkdown from 'vue-markdown'

export default {
  name: 'SpoutContentComponent',
  components: {
    VueMarkdown
  }
}
</script>

<style>
</style>
