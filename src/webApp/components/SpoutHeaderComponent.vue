<template>
  <div>
    <h1>{{ this.$store.getters.docTitle }}</h1>
    <h3>{{ this.$store.getters.docAuthor }}</h3>
  </div>
</template>

<script>
export default {
  name: 'ComponentHeader',
}
</script>

<style>
</style>
