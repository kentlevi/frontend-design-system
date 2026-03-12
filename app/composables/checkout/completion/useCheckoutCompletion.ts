import { nextTick, onBeforeUnmount, ref } from 'vue';
import lottie from 'lottie-web';

type UseCheckoutCompletionOptions = {
	redirectPath: string;
	delayMs?: number;
};

export function useCheckoutCompletion(options: UseCheckoutCompletionOptions) {
	const router = useRouter();
	const completingCheckout = ref(false);
	const completeLoaderRef = ref<HTMLElement | null>(null);
	let completeLoaderAnimation: ReturnType<typeof lottie.loadAnimation> | null = null;

	function destroyCompleteAnimation() {
		if (!completeLoaderAnimation) return;
		completeLoaderAnimation.destroy();
		completeLoaderAnimation = null;
	}

	async function mountCompleteAnimation() {
		if (typeof window === 'undefined' || !completeLoaderRef.value) return;
		destroyCompleteAnimation();
		const response = await fetch('/animations/musticker-loader.json');
		if (!response.ok) return;
		const animationData = await response.json();
		completeLoaderAnimation = lottie.loadAnimation({
			container: completeLoaderRef.value,
			renderer: 'svg',
			loop: true,
			autoplay: true,
			animationData,
			rendererSettings: {
				preserveAspectRatio: 'xMidYMid meet',
			},
		});
	}

	async function completeCheckout(canComplete: boolean) {
		if (completingCheckout.value || !canComplete) return;
		completingCheckout.value = true;
		await nextTick();
		await mountCompleteAnimation();
		await new Promise((resolve) => setTimeout(resolve, options.delayMs ?? 1000));
		await router.push(options.redirectPath);
		destroyCompleteAnimation();
		completingCheckout.value = false;
	}

	onBeforeUnmount(() => {
		destroyCompleteAnimation();
	});

	return {
		completingCheckout,
		completeLoaderRef,
		completeCheckout,
	};
}