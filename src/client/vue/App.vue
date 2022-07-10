<template>
    <headerItem></headerItem>
    <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import headerItem from './components/header-item.vue';

export default defineComponent({
    name: "App",
    components: {
        headerItem
    }
})
</script>