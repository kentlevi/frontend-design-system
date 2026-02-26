<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useGuideIcons } from '@/composables/guide/useGuideIcons';

const {
    selectedColor,
    selectedToken,
    hexInput,
    tokenHexQuery,
    tokenHexSuggestions,
    hoverToken,
    hoverHex,
    isLight,
    allSemanticTokens,
    allPaletteTokens,
    selectToken,
    onHexInput,
    onTokenHexQueryInput,
    onSwatchHover,
    clearHover,
    sizeTokens,
    selectedSize,
    customSize,
    selectSize,
    onCustomSize,
    isSelected,
    copyMode,
    searchQuery,
    getCopyProps,
    filteredGrouped,
} = useGuideIcons();

const showTokenDropdown = ref(false);

const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (!target.closest('.guide-search-dropdown')) {
        showTokenDropdown.value = false;
    }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() =>
    document.removeEventListener('click', handleClickOutside)
);
</script>

<template>
    <section class="guide-icons guide-wrapper">
        <header class="guide-header guide-header-inline">
            <div class="guide-header-content">
                <h1 class="guide-title">Icons</h1>
                <p class="guide-description">
                    Pick color, HEX, SCSS variable, or size tokens to preview
                    icons.
                </p>
            </div>

            <div class="guide-color-controls">
                <div class="guide-color-inputs">
                    <input
                        v-model="hexInput"
                        type="color"
                        class="guide-color-picker"
                        @input="onHexInput"
                    />

                    <div class="guide-search-dropdown">
                        <input
                            v-model="tokenHexQuery"
                            type="text"
                            class="guide-color-text"
                            placeholder="Search var or hex"
                            @focus="showTokenDropdown = true"
                            @input="
                                onTokenHexQueryInput();
                                showTokenDropdown = true;
                            "
                        />

                        <div
                            v-if="showTokenDropdown"
                            class="guide-dropdown-panel"
                        >
                            <button
                                v-for="token in tokenHexSuggestions"
                                :key="`token-hex-${token}`"
                                class="guide-color-option"
                                :class="{
                                    'is-active': selectedToken === token,
                                }"
                                @click="
                                    () => {
                                        selectToken(token);
                                        showTokenDropdown = false;
                                    }
                                "
                            >
                                <span
                                    class="guide-color-swatch"
                                    :style="{ background: `var(--${token})` }"
                                />
                                <span class="guide-color-name">{{
                                    token
                                }}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="guide-mini-palette">
                    <div class="guide-mini-group">
                        <span class="guide-mini-label">Semantic</span>
                        <button
                            v-for="token in allSemanticTokens"
                            :key="token"
                            class="guide-mini-swatch"
                            :style="{ background: `var(--${token})` }"
                            @click="selectToken(token)"
                            @mouseenter="onSwatchHover(token)"
                            @mouseleave="clearHover"
                        >
                            <span
                                v-if="hoverToken === token"
                                class="guide-swatch-tooltip"
                            >
                                {{ token }} - {{ hoverHex }}
                            </span>
                        </button>
                    </div>

                    <div class="guide-mini-group">
                        <span class="guide-mini-label">Palette</span>
                        <button
                            v-for="token in allPaletteTokens"
                            :key="token"
                            class="guide-mini-swatch"
                            :style="{ background: `var(--${token})` }"
                            @click="selectToken(token)"
                            @mouseenter="onSwatchHover(token)"
                            @mouseleave="clearHover"
                        >
                            <span
                                v-if="hoverToken === token"
                                class="guide-swatch-tooltip"
                            >
                                {{ token }} - {{ hoverHex }}
                            </span>
                        </button>
                    </div>
                </div>

                <div class="guide-mini-group guide-size-group">
                    <span class="guide-mini-label">Sizes</span>

                    <div class="guide-size-buttons">
                        <button
                            v-for="token in sizeTokens"
                            :key="token"
                            class="guide-size-btn"
                            :class="{ 'is-active': isSelected(token) }"
                            @click="selectSize(token)"
                        >
                            {{ token.replace('size-icon-', '') }}
                        </button>
                    </div>

                    <div class="guide-size-wrapper">
                        <input
                            v-model.number="customSize"
                            type="number"
                            class="guide-size-input"
                            @input="onCustomSize"
                        />
                        <span class="guide-size-unit">px</span>
                    </div>
                </div>

                <div class="guide-mini-group">
                    <span class="guide-mini-label">Copy</span>
                    <div class="guide-size-buttons">
                        <button
                            class="guide-size-btn"
                            :class="{ 'is-active': copyMode === 'code' }"
                            @click="copyMode = 'code'"
                        >
                            Code
                        </button>
                        <button
                            class="guide-size-btn"
                            :class="{ 'is-active': copyMode === 'name' }"
                            @click="copyMode = 'name'"
                        >
                            Name
                        </button>
                    </div>
                </div>

                <div class="guide-mini-group">
                    <span class="guide-mini-label">Search</span>
                    <div class="guide-size-wrapper">
                        <input
                            v-model="searchQuery"
                            class="guide-size-input"
                            placeholder="Search icons"
                        />
                    </div>
                </div>
            </div>
        </header>

        <section
            v-for="(names, style) in filteredGrouped"
            :key="style"
            class="guide-section"
        >
            <h2 class="guide-section-title">{{ style }}</h2>

            <div class="guide-grid guide-grid-auto">
                <GuideCopy
                    v-for="name in names"
                    :key="name"
                    component="UiIcon"
                    :props="getCopyProps(name)"
                    :name="name"
                    :mode="copyMode"
                    class="guide-item guide-item-hoverable"
                    :class="{ 'is-light-icon': isLight }"
                >
                    <UiIcon
                        :name="name"
                        :color="selectedColor"
                        :size="selectedSize"
                    />
                    <code class="guide-label">{{ name }}</code>
                </GuideCopy>
            </div>
        </section>

    </section>
</template>
