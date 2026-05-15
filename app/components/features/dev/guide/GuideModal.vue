<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">UiModal</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Teleported modal shell with title, body, footer, and overlay slots. Handles backdrop click, ESC close, vertical alignment, and a scrollable body mode. Renders into <code>&lt;body&gt;</code> via Vue Teleport.
		</MuText>

		<MuHeading variant="6" weight="bold">Basic</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Minimal usage: <code>v-model</code> for open/close, <code>title</code> for the header, and a default slot for body. Default <code>align="top"</code> and <code>width="504px"</code>.
		</MuText>
		<div class="guide-demo">
			<UiButton @click="basic_open = true">Open Basic Modal</UiButton>
			<UiModal v-model="basic_open" title="Basic modal">
				<MuText>
					This is the body. The header (with close button) and footer are rendered automatically when their slots/props are present.
				</MuText>
				<template #footer>
					<div class="guide-modal-footer">
						<UiButton variant="ghost" tone="neutral" @click="basic_open = false">Cancel</UiButton>
						<UiButton @click="basic_open = false">Confirm</UiButton>
					</div>
				</template>
			</UiModal>
		</div>

		<MuHeading variant="6" weight="bold">Vertical alignment</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			<code>align</code> accepts <code>'top'</code> (default), <code>'center'</code>, or <code>'bottom'</code>. Controls where the modal sits inside the viewport.
		</MuText>
		<div class="guide-demo">
			<div class="guide-row">
				<UiButton @click="align_top_open = true">Top</UiButton>
				<UiButton @click="align_center_open = true">Center</UiButton>
				<UiButton @click="align_bottom_open = true">Bottom</UiButton>
			</div>
			<UiModal v-model="align_top_open" title="Top aligned" align="top">
				<MuText>Default alignment — sits near the top of the viewport.</MuText>
			</UiModal>
			<UiModal v-model="align_center_open" title="Center aligned" align="center">
				<MuText>Vertically centered in the viewport.</MuText>
			</UiModal>
			<UiModal v-model="align_bottom_open" title="Bottom aligned" align="bottom">
				<MuText>Anchored to the bottom — useful for mobile sheet-style modals.</MuText>
			</UiModal>
		</div>

		<MuHeading variant="6" weight="bold">Custom width</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			<code>width</code> takes any CSS length string. Default is <code>'504px'</code>.
		</MuText>
		<div class="guide-demo">
			<div class="guide-row">
				<UiButton @click="width_narrow_open = true">Narrow (360px)</UiButton>
				<UiButton @click="width_wide_open = true">Wide (760px)</UiButton>
				<UiButton @click="width_fluid_open = true">Fluid (90vw)</UiButton>
			</div>
			<UiModal v-model="width_narrow_open" title="Narrow" width="360px">
				<MuText>A tighter modal for short prompts.</MuText>
			</UiModal>
			<UiModal v-model="width_wide_open" title="Wide" width="760px">
				<MuText>Roomier for forms or tabular content.</MuText>
			</UiModal>
			<UiModal v-model="width_fluid_open" title="Fluid" width="90vw">
				<MuText>Viewport-relative width.</MuText>
			</UiModal>
		</div>

		<MuHeading variant="6" weight="bold">Custom header slot</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Use the <code>#header</code> slot to fully replace the default title rendering. The close button stays.
		</MuText>
		<div class="guide-demo">
			<UiButton @click="custom_header_open = true">Open</UiButton>
			<UiModal v-model="custom_header_open">
				<template #header>
					<div class="guide-modal-custom-header">
						<MuHeading variant="6" weight="bold">Custom title row</MuHeading>
						<MuText size="small" color="var(--text-secondary)">Subtitle under the title</MuText>
					</div>
				</template>
				<MuText>You can put any layout in #header — not just a string.</MuText>
			</UiModal>
		</div>

		<MuHeading variant="6" weight="bold">Header actions slot</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			The <code>#actions</code> slot adds buttons next to the close button (top-right). Useful for icon-only utility actions.
		</MuText>
		<div class="guide-demo">
			<UiButton @click="actions_open = true">Open with header actions</UiButton>
			<UiModal v-model="actions_open" title="With actions">
				<template #actions>
					<UiButton variant="ghost" tone="neutral" size="24" aria-label="Help">
						<UiIcon name="regular-question-circle" :size="20" />
					</UiButton>
				</template>
				<MuText>The help icon appears just to the left of the close button.</MuText>
			</UiModal>
		</div>

		<MuHeading variant="6" weight="bold">Overlay slot</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			The <code>#overlay</code> slot renders inside the modal container but before the header — handy for absolute-positioned decorations like a hero image, badge, or loading veil.
		</MuText>
		<div class="guide-demo">
			<UiButton @click="overlay_open = true">Open with overlay</UiButton>
			<UiModal v-model="overlay_open" title="Overlay slot">
				<template #overlay>
					<div class="guide-modal-overlay-demo">Overlay content</div>
				</template>
				<MuText>The overlay content sits above the header.</MuText>
			</UiModal>
		</div>

		<MuHeading variant="6" weight="bold">Scrollable body</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Set <code>scrollable</code> to add the <code>ui-modal--scrollable</code> class. Combine with <code>maxHeight</code> to cap the modal height so long bodies scroll internally instead of overflowing the viewport.
		</MuText>
		<div class="guide-demo">
			<UiButton @click="scrollable_open = true">Open scrollable modal</UiButton>
			<UiModal v-model="scrollable_open" title="Scrollable body" scrollable max-height="60vh">
				<div class="guide-modal-long-body">
					<MuText v-for="n in 30" :key="n">Line {{ n }} of long body content — scroll inside the modal, not the page.</MuText>
				</div>
			</UiModal>
		</div>

		<MuHeading variant="6" weight="bold">Disable backdrop / ESC close</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			By default the modal closes when you click the backdrop or press <code>Esc</code>. Set <code>:close-on-backdrop="false"</code> or <code>:close-on-esc="false"</code> to force the user to use an explicit button (good for destructive confirmations).
		</MuText>
		<div class="guide-demo">
			<UiButton @click="locked_open = true">Open locked modal</UiButton>
			<UiModal
				v-model="locked_open"
				title="Locked"
				:close-on-backdrop="false"
				:close-on-esc="false"
			>
				<MuText>
					Clicking the backdrop or pressing Esc won't close this. Only the X or the Done button below.
				</MuText>
				<template #footer>
					<div class="guide-modal-footer">
						<UiButton @click="locked_open = false">Done</UiButton>
					</div>
				</template>
			</UiModal>
		</div>

		<MuHeading variant="6" weight="bold">CSS variable overrides</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			<code>padding</code> and <code>gap</code> props are forwarded to the CSS custom properties <code>--ui-modal-padding</code> and <code>--ui-modal-gap</code> on the modal container. Same for <code>maxHeight</code> → <code>--ui-modal-max-height</code> and <code>width</code> → <code>--ui-modal-width</code>. You can also override these from a parent stylesheet.
		</MuText>
		<div class="guide-demo">
			<UiButton @click="vars_open = true">Open tight-padding modal</UiButton>
			<UiModal v-model="vars_open" title="Tight" padding="8px 16px" gap="6px">
				<MuText>Padding and gap shrunk via props.</MuText>
			</UiModal>
		</div>

		<MuHeading variant="6" weight="bold">Properties</MuHeading>
		<table class="guide-table">
			<thead>
				<tr>
					<th>Prop</th>
					<th>Type</th>
					<th>Default</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>modelValue</td>
					<td><code>boolean</code></td>
					<td><code>false</code></td>
					<td>Open/closed state. Use with <code>v-model</code>.</td>
				</tr>
				<tr>
					<td>title</td>
					<td><code>string</code></td>
					<td><code>''</code></td>
					<td>Default header title. Ignored if <code>#header</code> slot is used.</td>
				</tr>
				<tr>
					<td>closeOnBackdrop</td>
					<td><code>boolean</code></td>
					<td><code>true</code></td>
					<td>Close when the backdrop (outside the modal box) is clicked.</td>
				</tr>
				<tr>
					<td>closeOnEsc</td>
					<td><code>boolean</code></td>
					<td><code>true</code></td>
					<td>Close when the Escape key is pressed.</td>
				</tr>
				<tr>
					<td>width</td>
					<td><code>string</code></td>
					<td><code>'504px'</code></td>
					<td>Any CSS length. Forwarded to <code>--ui-modal-width</code>.</td>
				</tr>
				<tr>
					<td>padding</td>
					<td><code>string</code></td>
					<td><code>''</code></td>
					<td>Override the modal's internal padding. Forwarded to <code>--ui-modal-padding</code>.</td>
				</tr>
				<tr>
					<td>gap</td>
					<td><code>string</code></td>
					<td><code>''</code></td>
					<td>Override the gap between header/body/footer. Forwarded to <code>--ui-modal-gap</code>.</td>
				</tr>
				<tr>
					<td>align</td>
					<td><code>'top' | 'center' | 'bottom'</code></td>
					<td><code>'top'</code></td>
					<td>Vertical anchor inside the viewport.</td>
				</tr>
				<tr>
					<td>modalClass</td>
					<td><code>string</code></td>
					<td><code>''</code></td>
					<td>Extra class appended to the inner <code>.ui-modal</code> container.</td>
				</tr>
				<tr>
					<td>footerClass</td>
					<td><code>string</code></td>
					<td><code>''</code></td>
					<td>Extra class appended to the <code>.ui-modal-footer</code>.</td>
				</tr>
				<tr>
					<td>maxHeight</td>
					<td><code>string</code></td>
					<td><code>''</code></td>
					<td>Any CSS length. Forwarded to <code>--ui-modal-max-height</code>. Combine with <code>scrollable</code> to scroll inside the modal.</td>
				</tr>
				<tr>
					<td>scrollable</td>
					<td><code>boolean</code></td>
					<td><code>false</code></td>
					<td>Adds the <code>ui-modal--scrollable</code> modifier class so the body scrolls when content overflows.</td>
				</tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Slots</MuHeading>
		<table class="guide-table">
			<thead>
				<tr>
					<th>Slot</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>default</td>
					<td>Modal body content. Rendered inside <code>.ui-modal-body</code>.</td>
				</tr>
				<tr>
					<td>header</td>
					<td>Fully replaces the default title row. The close button still renders separately.</td>
				</tr>
				<tr>
					<td>actions</td>
					<td>Extra buttons rendered in the top-right, immediately before the close button.</td>
				</tr>
				<tr>
					<td>footer</td>
					<td>Footer content. When empty, the <code>&lt;footer&gt;</code> element is not rendered at all.</td>
				</tr>
				<tr>
					<td>overlay</td>
					<td>Rendered inside the modal container, <em>before</em> the header. Useful for absolutely-positioned decorations or loading veils.</td>
				</tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Events</MuHeading>
		<table class="guide-table">
			<thead>
				<tr>
					<th>Event</th>
					<th>Payload</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>update:modelValue</td>
					<td><code>boolean</code></td>
					<td>Emitted when open state changes. Drives <code>v-model</code>.</td>
				</tr>
				<tr>
					<td>close</td>
					<td><code>—</code></td>
					<td>Emitted alongside <code>update:modelValue</code> when the modal closes (backdrop click, ESC, or close button). Useful when you need a close-only hook without watching the boolean.</td>
				</tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Notes &amp; gotchas</MuHeading>
		<ul class="guide-notes">
			<li>
				<strong>Teleported to <code>&lt;body&gt;</code>.</strong> The modal renders outside its parent's DOM subtree via <code>&lt;Teleport to="body"&gt;</code>, so <code>z-index</code> and <code>overflow: hidden</code> on ancestors won't trap it.
			</li>
			<li>
				<strong>Body side-effect.</strong> When open, <code>document.body</code> gets the <code>has-ui-modal-open</code> class. Use it in your global styles if you need to lock page scroll (e.g. <code>body.has-ui-modal-open { overflow: hidden; }</code>).
			</li>
			<li>
				<strong>Fall-through attrs land on <code>.ui-modal</code>.</strong> UiModal sets <code>inheritAttrs: false</code> but manually re-binds <code>v-bind="$attrs"</code> onto the inner container. So <code>class</code>, <code>data-*</code>, and event listeners on <code>&lt;UiModal&gt;</code> all forward to <code>.ui-modal</code> — they are not dropped (unlike MuInput).
			</li>
			<li>
				<strong>Use <code>modalClass</code> vs <code>class</code>.</strong> Both end up on <code>.ui-modal</code>. Prefer <code>modalClass</code> when the styling intent is "this modal variant" and reserve plain <code>class</code> for layout glue at the call site.
			</li>
			<li>
				<strong>Header visibility.</strong> The <code>&lt;header&gt;</code> element only renders if <em>at least one</em> of <code>title</code>, <code>#header</code>, or <code>#actions</code> is provided. To get a truly chromeless modal, pass none of them.
			</li>
			<li>
				<strong>ESC listener is global.</strong> The Escape handler is attached to <code>window</code> for the lifetime of the component, not gated on focus. If you have nested modals or other ESC-driven UI, make sure only one captures the event (or set <code>:close-on-esc="false"</code> on background modals).
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';

const basic_open = ref(false);
const align_top_open = ref(false);
const align_center_open = ref(false);
const align_bottom_open = ref(false);
const width_narrow_open = ref(false);
const width_wide_open = ref(false);
const width_fluid_open = ref(false);
const custom_header_open = ref(false);
const actions_open = ref(false);
const overlay_open = ref(false);
const scrollable_open = ref(false);
const locked_open = ref(false);
const vars_open = ref(false);
</script>

<style scoped lang="scss">
.guide-row {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.guide-modal-footer {
	display: flex;
	justify-content: flex-end;
	gap: 8px;
}

.guide-modal-custom-header {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.guide-modal-overlay-demo {
	background: var(--gray-20);
	border-radius: 8px;
	padding: 12px 16px;
	margin-bottom: 12px;
	font-size: var(--body-sm);
	color: var(--text-secondary);
}

.guide-modal-long-body {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.guide-notes {
	margin: 0;
	padding-left: 20px;
	display: flex;
	flex-direction: column;
	gap: 8px;
	color: var(--text-secondary);
	font-size: var(--body-sm);
	line-height: 1.5;

	strong {
		color: var(--text-primary);
	}
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
