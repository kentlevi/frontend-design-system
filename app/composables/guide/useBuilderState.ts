import { reactive } from 'vue';

export type SizeToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const useBuilderState = () => {
    const state = reactive({
        /* ICON */
        iconSizeToken: 'md' as SizeToken | null,
        iconSize: 24 as number | null,

        /* TYPOGRAPHY */
        fontSize: 16 as number | null,
        fontWeight: 400 as number | null,

        /* DIMENSION */
        width: null as number | null,
        height: null as number | null,
    });

    return state;
};
