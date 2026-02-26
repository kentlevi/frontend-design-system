<script setup>
    const route = useRoute()
    const unsupported = computed(() =>
        String(route.query.unsupported || '').toLowerCase()
    )
</script>

<template>
    <div class="region-page">
        <div class="card">
            <h1>Select your region</h1>

            <p v-if="unsupported" class="warning">
                Looks like you're in <strong>{{ unsupported.toUpperCase() }}</strong>.
                We don’t support it yet.
            </p>

            <div class="buttons">
                <NuxtLink to="/ph" class="btn">Philippines</NuxtLink>
                <NuxtLink to="/kr" class="btn">Korea</NuxtLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
.region-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f6f8;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
}

.card {
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    text-align: center;
    max-width: 420px;
    width: 100%;
}

h1 {
    margin-bottom: 16px;
    font-size: 24px;
}

.warning {
    margin-bottom: 24px;
    color: #b54708;
    background: #fff4e5;
    padding: 12px;
    border-radius: 8px;
    font-size: 14px;
}

.buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.btn {
    padding: 10px 20px;
    border-radius: 8px;
    background: #111827;
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: 0.2s;
}

.btn:hover {
    background: #374151;
}
</style>