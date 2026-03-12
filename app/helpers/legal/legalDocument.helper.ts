import type {
	LegalBulletItem,
	LegalSection,
	RawLegalSection,
	RichTextSegment,
} from '~/types/legal/legalDocument'

export function toMessageArray(value: unknown) {
	return Array.isArray(value) ? value : [];
}

export function normalizeBulletItem(
	value: unknown,
	resolveMessage: (value: unknown) => string
): LegalBulletItem {
	if (typeof value === 'string') {
		return { text: value };
	}

	if (value && typeof value === 'object') {
		const rawBullet = value as { text?: unknown; items?: unknown[] };
		const hasNestedBulletShape =
			Object.prototype.hasOwnProperty.call(rawBullet, 'text') ||
			Object.prototype.hasOwnProperty.call(rawBullet, 'items');

		if (!hasNestedBulletShape) {
			return {
				text: resolveMessage(value),
			};
		}

		return {
			text:
				typeof rawBullet.text === 'undefined'
					? ''
					: resolveMessage(rawBullet.text),
			items: Array.isArray(rawBullet.items)
				? rawBullet.items.map(resolveMessage)
				: undefined,
		};
	}

	return {
		text: typeof value === 'undefined' ? '' : resolveMessage(value),
	};
}

export function normalizeLegalSections(
	rawSections: RawLegalSection[],
	documentKey: 'terms' | 'privacy',
	resolveMessage: (value: unknown) => string
) {
	return rawSections.map((section, index) => ({
		id:
			typeof section.id === 'string'
				? section.id
				: `${documentKey}-section-${index + 1}`,
		title: resolveMessage(section.title),
		paragraphs: (section.paragraphs || []).map(resolveMessage),
		bullets: (section.bullets || []).map((bullet) =>
			normalizeBulletItem(bullet, resolveMessage)
		),
		groups: (section.groups || []).map((group) => ({
			title: group.title ? resolveMessage(group.title) : undefined,
			items: (group.items || []).map((item) =>
				normalizeBulletItem(item, resolveMessage)
			),
		})),
		table: section.table
			? {
				headers: (section.table.headers || []).map(resolveMessage),
				rows: (section.table.rows || []).map((row) => row.map(resolveMessage)),
				note: section.table.note ? resolveMessage(section.table.note) : undefined,
			}
			: undefined,
	})) as LegalSection[];
}

export function splitLabelPrefix(value: string) {
	if (value.includes('**')) {
		return {
			label: '',
			content: value,
		};
	}

	const match = value.match(/^([^:]+:\s*)(.+)$/);
	if (!match) {
		return {
			label: '',
			content: value,
		};
	}

	return {
		label: match[1] || '',
		content: match[2] || value,
	};
}

export function parseEmphasisSegments(value: string) {
	const segments: RichTextSegment[] = [];
	const pattern = /\*\*(.+?)\*\*/g;
	let lastIndex = 0;
	let match: RegExpExecArray | null;

	match = pattern.exec(value);
	while (match) {
		if (match.index > lastIndex) {
			segments.push({
				text: value.slice(lastIndex, match.index),
				bold: false,
			});
		}

		segments.push({
			text: match[1] || '',
			bold: true,
		});

		lastIndex = match.index + match[0].length;
		match = pattern.exec(value);
	}

	if (lastIndex < value.length) {
		segments.push({
			text: value.slice(lastIndex),
			bold: false,
		});
	}

	return segments.length
		? segments
		: [
			{
				text: value,
				bold: false,
			},
		];
}

export function getBulletContent(value: string) {
	const { label, content } = splitLabelPrefix(value);
	return {
		label,
		content: label ? content : value,
		segments: parseEmphasisSegments(label ? content : value),
	};
}