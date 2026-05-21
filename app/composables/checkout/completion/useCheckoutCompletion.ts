import { nextTick, onBeforeUnmount, ref } from 'vue';
import type { AnimationItem } from 'lottie-web';

type UseCheckoutCompletionOptions = {
	redirectPath: string;
	delayMs?: number;
};

export function useCheckoutCompletion(options: UseCheckoutCompletionOptions) {
	const router = useRouter();
	const completing_checkout = ref(false);
	const complete_loader_ref = ref<HTMLElement | null>(null);
	let complete_loader_animation: AnimationItem | null = null;

	function destroyCompleteAnimation() {
		if (!complete_loader_animation) return;
		complete_loader_animation.destroy();
		complete_loader_animation = null;
	}

	async function mountCompleteAnimation() {
		if (typeof window === 'undefined' || !complete_loader_ref.value) return;
		destroyCompleteAnimation();
		const response = await fetch('/animations/musticker-loader.json');
		if (!response.ok) return;
		const animation_data = await response.json();
		const { default: lottie } = await import('lottie-web');
		complete_loader_animation = lottie.loadAnimation({
			container: complete_loader_ref.value,
			renderer: 'svg',
			loop: true,
			autoplay: true,
			animationData: animation_data,
			rendererSettings: {
				preserveAspectRatio: 'xMidYMid meet',
			},
		});
	}

	async function completeCheckout(canComplete: boolean, order_id:number) {
		if (completing_checkout.value || !canComplete) return;
		completing_checkout.value = true;
		const redirect_path = `${options.redirectPath}?order_id=${order_id}`

		await nextTick();
		await mountCompleteAnimation();
		await new Promise((resolve) => setTimeout(resolve, options.delayMs ?? 1000));
		await router.push(redirect_path);
		destroyCompleteAnimation();
		completing_checkout.value = false;
	}

	onBeforeUnmount(() => {
		destroyCompleteAnimation();
	});

	return {
		completing_checkout,
		complete_loader_ref,
		completeCheckout,
	};
}