<template>
    <div>
        <!-- TEMPORARY -->
        <div class="dev_site" v-if="is_dev">
            <p>This is a staged site for {{ app_name }}</p>
        </div>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig()

const env = String(config.public.ENV || '').toLowerCase()
const is_dev = env === 'development' || env === 'homestead'

const app_name = config.public.app_name
</script>
<style lang="scss" scoped>
.dev_site {
    min-height: 60px;
    width: 100%;
    background: #2E2E2E;
    text-align: center;
    position: sticky;
    top: 0;
    padding: 21px;
    z-index: 102;
    p {
        color: #fff;
        font-weight: 600;
        line-height: 17px;
        margin: 0;
    }
}
</style>