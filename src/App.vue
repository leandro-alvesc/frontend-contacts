<template>
  <Dashboard v-if="$route.meta.requiresAuth" />
  <Default v-else />
</template>

<script>
import Dashboard from "@/layouts/Dashboard";
import Default from "@/layouts/Default";
export default {
  components: { Dashboard, Default },
};
</script>

<style></style>
