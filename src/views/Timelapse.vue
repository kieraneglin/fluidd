<template>
  <v-row :dense="$vuetify.breakpoint.smAndDown">
    <v-col
      cols="12"
      md="8"
    >
      <collapsable-card
        :title="$t('app.general.title.timelapse')"
        icon="$video"
      >
        <file-system
          :roots="'timelapse'"
          name="timelapse"
          bulk-actions
          :max-height="816"
        />
      </collapsable-card>
    </v-col>

    <v-col
      cols="12"
      md="4"
    >
      <timelapse-status-card @openRenderDialog="openRenderDialog" />
      <timelapse-settings-card @openRenderDialog="openRenderDialog" />
    </v-col>

    <timelapse-render-settings-dialog
      v-if="renderDialogOpen"
      v-model="renderDialogOpen"
      :renderable="renderDialogRenderable"
    />
  </v-row>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'
import FileSystem from '@/components/widgets/filesystem/FileSystem.vue'
import TimelapseStatusCard from '@/components/widgets/timelapse/TimelapseStatusCard.vue'
import TimelapseSettingsCard from '@/components/widgets/timelapse/TimelapseSettingsCard.vue'
import TimelapseRenderSettingsDialog from '@/components/widgets/timelapse/TimelapseRenderSettingsDialog.vue'

@Component({
  components: {
    TimelapseRenderSettingsDialog,
    FileSystem,
    TimelapseStatusCard,
    TimelapseSettingsCard
  }
})
export default class Timelapse extends Mixins(StateMixin) {
  renderDialogOpen = false
  renderDialogRenderable = false

  openRenderDialog (renderable = false) {
    this.renderDialogRenderable = renderable
    this.renderDialogOpen = true
  }
}
</script>
