export function sizeDimOnly(label: string) {
	const matched = label.match(/(\d+\s*(?:x|\u00d7)\s*\d+)/i);
	if (matched?.[1]) return matched[1].replace(/\s+/g, '');
	return label;
}