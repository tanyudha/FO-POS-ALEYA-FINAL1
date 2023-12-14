<template>
  <global-container>
    <template slot="left">
      <activity-list @select="fetchTransaction" />
    </template>
    <template slot="default">
      <activity-detail
        :activity="selectedActivity"
        :loading="loading"
        @refund="refundTransaction"
      />
    </template>
  </global-container>
</template>

<script lang="ts">
import Vue from 'vue'
import ActivityList from '@/components/activity/activity-list.vue'
import ActivityDetail from '@/components/activity/activity-detail.vue'

export default Vue.extend({
  components: { ActivityList, ActivityDetail },
  middleware: ['authenticated', 'shift-started'],
  data() {
    return {
      selectedActivity: {},
      loading: false,
    }
  },
  methods: {
    async fetchTransaction(activityId: number) {
      this.loading = true
      try {
        const res = await this.$axios.$get(`/transaction/detail/${activityId}`)
        this.selectedActivity = res as Object
      } catch (e) {
        this.$toast.global.asyncError(e)
      } finally {
        this.loading = false
      }
    },
    async refundTransaction(activityId: number) {
      this.loading = true
      try {
        await this.$axios.$post(`/transaction/refund/${activityId}`)
        this.$toast.show('Refund berhasil dilakukan')
        await this.fetchTransaction(activityId)
      } catch (e) {
        this.$toast.global.asyncError(e)
      } finally {
        this.loading = false
      }
    },
  },
})
</script>
