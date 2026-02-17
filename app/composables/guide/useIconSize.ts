import { ref } from 'vue';

export function useIconSize() {
    const sizeTokens = [
        'size-icon-xs',
        'size-icon-sm',
        'size-icon-md',
        'size-icon-lg',
        'size-icon-xl',
        'size-icon-2xl',
    ];

    const selectedSize = ref<string>('var(--size-icon-md)');
    const customSize = ref<number | null>(null);

    const selectSize = (token: string) => {
        customSize.value = null;
        selectedSize.value = `var(--${token})`;
    };

    const onCustomSize = () => {
        if (customSize.value === null || customSize.value <= 0) return;

        selectedSize.value = `${customSize.value}px`;
    };

    const isSelected = (token: string) => {
        return selectedSize.value === `var(--${token})`;
    };

    return {
        sizeTokens,
        selectedSize,
        customSize,
        selectSize,
        onCustomSize,
        isSelected,
    };
}
