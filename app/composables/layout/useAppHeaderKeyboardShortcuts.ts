import { onBeforeUnmount, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export function useAppHeaderKeyboardShortcuts(params: {
    handleSearchKeydown: (event: KeyboardEvent) => boolean;
    isSearchModalOpen: () => boolean;
    isLocaleModalOpen: () => boolean;
    closeSearchModal: () => void;
    closeLocaleModal: () => void;
    closeAccountMenu: () => void;
    openSearchModal: () => void;
}) {
    const route = useRoute();

    const isGuideRoute = () => {
        const path = route.path.toLowerCase();
        return path === '/guide' || path.includes('/guide/');
    };

    function onDocKeydown(event: KeyboardEvent) {
        if (params.handleSearchKeydown(event)) return;

        if (event.key === 'Escape') {
            if (params.isSearchModalOpen()) {
                params.closeSearchModal();
                return;
            }

            if (params.isLocaleModalOpen()) {
                params.closeLocaleModal();
                return;
            }

            params.closeAccountMenu();
            return;
        }

        const target = event.target as HTMLElement | null;
        const isTypingTarget = Boolean(
            target &&
                (target.tagName === 'INPUT' ||
                    target.tagName === 'TEXTAREA' ||
                    target.isContentEditable)
        );

        if (
            !isTypingTarget &&
            !params.isSearchModalOpen() &&
            event.key === '/' &&
            !isGuideRoute()
        ) {
            event.preventDefault();
            params.openSearchModal();
        }
    }

    onMounted(() => {
        document.addEventListener('keydown', onDocKeydown);
    });

    onBeforeUnmount(() => {
        document.removeEventListener('keydown', onDocKeydown);
    });
}
