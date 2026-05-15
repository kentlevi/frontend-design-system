<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">Conventions</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Patterns that apply across the frontend design system. Read this once before reaching for the per-component guides — most of the "why doesn't my class show up?" questions are answered here.
		</MuText>

		<MuHeading variant="6" weight="bold">Component prefixes</MuHeading>
		<table class="guide-table">
			<thead><tr><th>Prefix</th><th>Lives in</th><th>Purpose</th></tr></thead>
			<tbody>
				<tr><td><code>Mu*</code></td><td><code>components/base/</code></td><td>Lowest-level primitives shared with the admin app. Minimal API, minimal opinions. Examples: <code>MuText</code>, <code>MuHeading</code>, <code>MuLinearWrapper</code>, <code>MuInput</code>.</td></tr>
				<tr><td><code>Ui*</code></td><td><code>components/ui/</code></td><td>Frontend-specific design-system components. May wrap a <code>Mu*</code> primitive with brand styling or compose multiple primitives. Examples: <code>UiModal</code>, <code>UiButton</code>, <code>UiToast</code>, <code>UiFormField</code>.</td></tr>
				<tr><td><em>No prefix</em></td><td><code>components/features/…</code></td><td>Feature-specific compositions. Should not be re-used outside their feature folder. If you find yourself importing one cross-feature, lift it to <code>ui/</code> or <code>base/</code>.</td></tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold"><code>inheritAttrs: false</code> — the silent class-drop trap</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Several components opt out of Vue's default attribute fall-through. When you write <code>&lt;MuInput class="my-class" /&gt;</code>, the class is <strong>silently dropped</strong> if the component sets <code>inheritAttrs: false</code> and doesn't manually re-bind <code>v-bind="$attrs"</code> on a target element.
		</MuText>
		<table class="guide-table">
			<thead><tr><th>Component</th><th>inheritAttrs</th><th>Where class lands</th></tr></thead>
			<tbody>
				<tr><td><code>MuInput</code></td><td><code>false</code></td><td><strong>Dropped.</strong> Use the <code>inputClass</code> prop to target the inner <code>&lt;input&gt;</code>.</td></tr>
				<tr><td><code>UiModal</code></td><td><code>false</code> + manual rebind</td><td><code>.ui-modal</code> container. Or use <code>modalClass</code> prop.</td></tr>
				<tr><td><code>UiToast</code></td><td><code>false</code> + manual rebind</td><td><code>.ui-toast</code> container.</td></tr>
				<tr><td><code>UiCheckbox</code> / <code>UiRadio</code></td><td><code>false</code> + helper-split</td><td>Helper routes attrs to root vs input. Use <code>boxClass</code> / <code>labelClass</code> / <code>iconClass</code> instead.</td></tr>
				<tr><td><code>UiTextarea</code></td><td><code>true</code> (default)</td><td><code>.ui-textarea</code> wrapper. Use <code>fieldClass</code> for the inner <code>&lt;textarea&gt;</code>.</td></tr>
				<tr><td><code>MuText</code> / <code>MuHeading</code></td><td><code>true</code> (default)</td><td>Root element.</td></tr>
			</tbody>
		</table>
		<MuText size="small" color="var(--text-secondary)">
			Rule of thumb: when a component exposes an <code>*Class</code> prop (<code>inputClass</code>, <code>modalClass</code>, <code>boxClass</code>, etc.), use it. That's the maintainer-blessed target for your styling.
		</MuText>

		<MuHeading variant="6" weight="bold">Responsive props on <code>MuLinearWrapper</code></MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Layout breakpoints are <strong>desktop-first</strong>. The base props apply everywhere; <code>:tablet</code> overrides at ≤1024px; <code>:mobile</code> overrides at ≤600px. Each tier reads <em>only</em> the keys it overrides — unspecified keys fall back through the chain (mobile → tablet → base).
		</MuText>
		<MuText size="small" color="var(--text-secondary)">
			Numbers vs strings matter: <code>:gap="12"</code> emits <code>12px</code>; <code>gap="12"</code> (no <code>:</code>) emits literal <code>12</code> which is invalid CSS.
		</MuText>

		<MuHeading variant="6" weight="bold"><code>min-width: 0</code> for flex truncation</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Flex items default to <code>min-width: auto</code>, which prevents them from shrinking below their content size. If you put <code>text-overflow: ellipsis</code> on a child and it refuses to truncate (instead wrapping or overflowing), the fix is to add <code>min-width: 0</code> to <strong>every flex ancestor</strong> in the chain between the truncating element and the constrained container. <code>flex: 1; min-width: 0</code> is the standard combo.
		</MuText>

		<MuHeading variant="6" weight="bold">v-model patterns</MuHeading>
		<table class="guide-table">
			<thead><tr><th>Pattern</th><th>Used by</th></tr></thead>
			<tbody>
				<tr><td>Standard <code>modelValue</code> + <code>update:modelValue</code></td><td><code>MuInput</code>, <code>UiTextarea</code>, <code>UiCheckbox</code>, <code>MuText</code>-adjacent inputs.</td></tr>
				<tr><td>Controlled-or-uncontrolled (<code>modelValue?: T | undefined</code>)</td><td><code>MuCheckbox</code> — when undefined, the component manages state internally.</td></tr>
				<tr><td>One-way prop + named events</td><td><code>UiDeleteConfirmModal</code> uses <code>:model-value</code> + <code>@cancel</code> / <code>@confirm</code> — no <code>update:modelValue</code>. You drive open state yourself.</td></tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">When to use a feature-folder component vs a Ui component</MuHeading>
		<ul class="guide-notes">
			<li><strong>Use a Ui component when:</strong> the styling/behavior is brand-wide or shared across multiple features. Lives in <code>components/ui/</code>.</li>
			<li><strong>Use a feature folder component when:</strong> it composes Ui primitives for one specific user flow (e.g. <code>checkout/features/CheckoutMemberPerksFeature.vue</code>). Lives in <code>components/features/{feature}/</code> or <code>components/{domain}/</code>.</li>
			<li><strong>Lift to Ui when:</strong> a second feature imports the same feature-folder component. That's the signal it's actually shared infrastructure.</li>
		</ul>

		<MuHeading variant="6" weight="bold">Naming &amp; structure</MuHeading>
		<ul class="guide-notes">
			<li><strong>Filenames:</strong> PascalCase Vue SFCs. Match the auto-import name (Nuxt: <code>ui/Modal.vue</code> → <code>&lt;UiModal&gt;</code>).</li>
			<li><strong>Refs &amp; locals:</strong> snake_case (<code>is_open</code>, <code>form.code</code>). Function names: camelCase (<code>handleConfirm</code>, <code>closeModal</code>).</li>
			<li><strong>CSS classes:</strong> kebab-case (<code>ui-modal</code>, <code>coupon-info</code>). Use BEM-ish naming for variants (<code>ui-checkbox--disabled</code>).</li>
			<li><strong>Test IDs:</strong> <code>data-testid="component-purpose"</code>. Many components accept a <code>testId</code> prop that derives child test IDs (e.g. <code>{testId}-cancel</code>).</li>
		</ul>

		<MuHeading variant="6" weight="bold">Do</MuHeading>
		<ul class="guide-notes">
			<li>Reach for existing <code>Mu*</code> / <code>Ui*</code> primitives before writing custom markup.</li>
			<li>Use the component's documented props/slots before adding ad-hoc classes.</li>
			<li>Pair form controls with <code>UiFormField</code> for label/hint/error wiring.</li>
			<li>Keep page-level files thin — move state and side-effects into composables under <code>composables/</code>.</li>
			<li>Use CSS variables (<code>var(--text-primary)</code>) over raw hex.</li>
		</ul>

		<MuHeading variant="6" weight="bold">Avoid</MuHeading>
		<ul class="guide-notes">
			<li>Duplicating component behavior in feature-specific wrappers — extend the base instead.</li>
			<li>Hardcoded colors when a token/prop already exists.</li>
			<li>Removing <code>inheritAttrs: false</code> from base components without checking <em>all</em> call sites for fall-through impact.</li>
			<li>Setting <code>:gap="50"</code> without <code>min-width: 0</code> further down when you also need text truncation.</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';
</script>

<style scoped lang="scss">
.guide-notes {
	margin: 0;
	padding-left: 20px;
	display: flex;
	flex-direction: column;
	gap: 8px;
	color: var(--text-secondary);
	font-size: var(--body-sm);
	line-height: 1.5;
	strong { color: var(--text-primary); }
}

code {
	background: var(--gray-20);
	padding: 2px 6px;
	border-radius: 4px;
	font-family: monospace;
	font-size: 0.85em;
	color: var(--error);
}
</style>
