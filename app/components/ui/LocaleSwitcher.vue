<script setup lang="ts">
const { locales, setLocale, locale } = useI18n();
</script>

<template>
    <div class="flex gap-2">
        <button
            v-for="l in locales"
            :key="l.code"
            :class="[
                'px-3 py-2 rounded-lg border',
                locale === l.code ? 'bg-black text-white' : 'bg-white',
            ]"
            @click="setLocale(l.code)"
        >
            {{ l.name }}
        </button>
    </div>
</template>
