export const toGuideLabel = (value: string) =>
    value === 'sm' ? 'Small' : value.charAt(0).toUpperCase() + value.slice(1);
