<template>
    <div>
        <p>{{ country }}</p>
    </div>
</template>
<script setup lang="ts">
 
const { country } = useCountry()
</script>