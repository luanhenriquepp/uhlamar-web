<template>
	<main>
		<transition mode="out-in">
			<router-view/>
		</transition>
	</main>
</template>

<style lang="scss">
	@import "@/styles/index.scss";

	/* Remove in 1.2 */
	.v-datatable thead th.column.sortable i {
		vertical-align: unset;
	}
</style>
<script>
	export default {
	created: function () {
		this.$http.interceptors.response.use((response) => {
			return response;
		}, (error) => {
	  if (error.response.status === 401) {
		if (this.$store.getters.authorized) {
			this.$store.dispatch('refreshtoken')
		} else {
			return Promise.reject(error)
		}
		} else {
			return Promise.reject(error)
			}
		})
	}
}
</script>
