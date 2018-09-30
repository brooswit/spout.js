<template>
  <b-list-group>
    <b-list-group-item v-for="doc in this.$store.getters.docs" :key="doc.key">
      <b-link :to="`./${doc.key}`">{{doc.name}}</b-link>
    </b-list-group-item>
  </b-list-group>
</template>

<script>
export default {
  name: 'ComponentDirectory',
}
</script>

<style>
</style>
