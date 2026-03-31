import { computed, ref } from 'vue';

export type LoginMemberType = 'member' | 'non-member';

export function useLoginForm() {
	const member_type = ref<LoginMemberType>('member');
	const keep_signed_in = ref(false);
	const show_password = ref(false);

	const is_non_member = computed(() => member_type.value === 'non-member');

	function setMemberType(nextType: LoginMemberType) {
		member_type.value = nextType;
	}

	function togglePassword() {
		show_password.value = !show_password.value;
	}

	function setKeepSignedIn(nextValue: boolean) {
		keep_signed_in.value = nextValue;
	}

	return {
		member_type,
		keep_signed_in,
		show_password,
		is_non_member,
		setMemberType,
		togglePassword,
		setKeepSignedIn,
	};
}