<template>
    <b-container>
        <b-row>
            <b-col>
                <SpoutHeaderComponent/>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <SpoutDirectoryComponent/>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <SpoutFooterComponent/>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import SpoutHeaderComponent from './SpoutHeaderComponent'
import SpoutDirectoryComponent from './SpoutDirectoryComponent'
import SpoutFooterComponent from './SpoutFooterComponent'

export default {
  name: 'AppSpout',
  components: {
    SpoutHeaderComponent,
    SpoutDirectoryComponent,
    SpoutFooterComponent
  }
}
</script>

<style>
</style>
