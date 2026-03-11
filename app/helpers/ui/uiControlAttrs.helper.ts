import { computed, type ComputedRef, type HTMLAttributes, type StyleValue, type useAttrs } from 'vue';

type AttrSource = ReturnType<typeof useAttrs>;

export function useControlTestId(attrs: AttrSource) {
	return computed(() => String(attrs['data-testid'] || '').trim());
}

export function useRootAttrs(
	attrs: AttrSource,
	testId: ComputedRef<string>
) {
	return computed<HTMLAttributes>(() => {
		const className = attrs.class as HTMLAttributes['class'];
		const style = attrs.style as StyleValue | undefined;

		return {
			...(className ? { class: className } : {}),
			...(style ? { style } : {}),
			...(testId.value ? { 'data-testid': testId.value } : {}),
		};
	});
}

export function useControlAttrs(
	attrs: AttrSource,
	testId: ComputedRef<string>
) {
	return computed(() => {
		const { class: _className, style: _style, 'data-testid': _testId, ...rest } = attrs;
		return {
			...rest,
			...(testId.value ? { 'data-testid': `${testId.value}-control` } : {}),
		};
	});
}