<template>
    <div class="locale-changer">
        <select class="form-select" v-model="$i18n.locale">
            <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang">
                {{ lang }}
            </option>
        </select>
    </div>
</template>

<script lang="ts">
export default {
    name: 'locale-changer',
    data() {
        return { langs: ['es', 'en'] }
    }
}
</script>
