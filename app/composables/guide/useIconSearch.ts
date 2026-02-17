import { ref, watch } from 'vue';
import { icons } from '~/data/ui/icons';

export function useIconSearch() {
    const iconList = Object.keys(icons);

    const searchLeft = ref('');
    const searchRight = ref('');

    const showLeft = ref(false);
    const showRight = ref(false);

    const selectedLeft = ref<string | undefined>();
    const selectedRight = ref<string | undefined>();

    /* ================= INTERNAL FLAGS ================= */
    const selectingLeft = ref(false);
    const selectingRight = ref(false);

    /* ================= FILTER ================= */
    const getFilteredLeft = () =>
        iconList.filter((i) =>
            i.toLowerCase().includes(searchLeft.value.toLowerCase())
        );

    const getFilteredRight = () =>
        iconList.filter((i) =>
            i.toLowerCase().includes(searchRight.value.toLowerCase())
        );

    /* ================= WATCHERS ================= */

    watch(searchLeft, (val) => {
        if (selectingLeft.value) return;

        showLeft.value = val.length > 0;
        if (!val) selectedLeft.value = undefined;
    });

    watch(searchRight, (val) => {
        if (selectingRight.value) return;

        showRight.value = val.length > 0;
        if (!val) selectedRight.value = undefined;
    });

    /* ================= CHOOSE ================= */

    const chooseLeft = (icon: string) => {
        selectingLeft.value = true;

        selectedLeft.value = icon;
        searchLeft.value = icon;

        // disable right
        selectedRight.value = undefined;
        searchRight.value = '';

        showLeft.value = false;
        showRight.value = false;

        // unlock on next tick
        queueMicrotask(() => {
            selectingLeft.value = false;
        });
    };

    const chooseRight = (icon: string) => {
        selectingRight.value = true;

        selectedRight.value = icon;
        searchRight.value = icon;

        // disable left
        selectedLeft.value = undefined;
        searchLeft.value = '';

        showLeft.value = false;
        showRight.value = false;

        queueMicrotask(() => {
            selectingRight.value = false;
        });
    };

    /* ================= DISABLED STATES ================= */

    const leftDisabled = ref(false);
    const rightDisabled = ref(false);

    watch(selectedLeft, (val) => {
        rightDisabled.value = !!val;
    });

    watch(selectedRight, (val) => {
        leftDisabled.value = !!val;
    });

    return {
        searchLeft,
        searchRight,
        showLeft,
        showRight,
        selectedLeft,
        selectedRight,

        getFilteredLeft,
        getFilteredRight,

        chooseLeft,
        chooseRight,

        leftDisabled,
        rightDisabled,
    };
}
