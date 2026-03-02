import { computed, ref } from 'vue';

export type LoginMemberType = 'member' | 'non-member';

export function useLoginForm() {
    const memberType = ref<LoginMemberType>('member');
    const keepSignedIn = ref(false);
    const showPassword = ref(false);

    const isNonMember = computed(() => memberType.value === 'non-member');

    function setMemberType(nextType: LoginMemberType) {
        memberType.value = nextType;
    }

    function togglePassword() {
        showPassword.value = !showPassword.value;
    }

    function setKeepSignedIn(nextValue: boolean) {
        keepSignedIn.value = nextValue;
    }

    return {
        memberType,
        keepSignedIn,
        showPassword,
        isNonMember,
        setMemberType,
        togglePassword,
        setKeepSignedIn,
    };
}
