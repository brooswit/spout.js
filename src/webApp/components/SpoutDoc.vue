<template>
    <b-container>
        <b-row>
            <b-col>
                <SpoutHeaderComponent/>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <SpoutContentComponent/>
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
import SpoutContentComponent from './SpoutContentComponent'
import SpoutFooterComponent from './SpoutFooterComponent'

export default {
  name: 'AppSpout',
  components: {
    SpoutHeaderComponent,
    SpoutContentComponent,
    SpoutFooterComponent
  }
}
</script>

<style>
</style>
