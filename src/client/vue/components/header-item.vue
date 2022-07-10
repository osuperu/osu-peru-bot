<template>
    <nav class="navbar navbar-dark navbar-expand-lg bg-dark">
        <div class="container-md">
            <a class="navbar-brand" href="/">osu!Peru</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="/">{{ $t("header.nav.home") }}</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/events">{{ $t("header.nav.events") }}</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/about">{{ $t("header.nav.about") }}</a>
                    </li>
                </ul>
                <locale-change-item></locale-change-item>
                <login-box></login-box>
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import localeChangeItem from './locale-change-item.vue';
import loginBox from './login-box.vue';

export default defineComponent({
    name: "header-item",
    components: {
        localeChangeItem,
        loginBox
    }
})
</script>

<style>
</style>