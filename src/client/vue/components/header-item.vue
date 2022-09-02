<template>
    <nav class="navbar navbar-expand-lg navbar-dark nav-bg-custom shadow-lg">
        <div class="container">
            <img src="../assets/osu-peru-2.svg" class="logos" alt="logo banner">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive"
                aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse flex-row-reverse" id="navbarResponsive">
                <ul class="navbar-nav align-items-lg-center">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="/">{{ $t("header.nav.home") }}</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/events">{{ $t("header.nav.events") }}</a>
                    </li>
                    <!--
                    <li class="nav-item">
                        <a class="nav-link" href="/about">{{ $t("header.nav.about") }}</a>
                    </li>
                    <li class="nav-item">
                        <locale-change-item></locale-change-item>
                    </li>
                    -->
                    <login-box></login-box>
                </ul>
            </div>
        </div>
    </nav>



</template>

<script lang="ts">
import { defineComponent } from 'vue';
/*import localeChangeItem from './locale-change-item.vue';*/
import loginBox from './login-box.vue';

export default defineComponent({
    name: "header-item",
    components: {
        /*localeChangeItem,*/
        loginBox
    }
})
</script>