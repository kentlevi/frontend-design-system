export type LegalSectionGroup = {
	title?: string;
	items: LegalBulletItem[];
};

export type LegalBulletItem = {
	text: string;
	items?: string[];
};

export type LegalSectionTable = {
	headers: string[];
	rows: string[][];
	note?: string;
};

export type LegalSection = {
	id: string;
	title: string;
	paragraphs?: string[];
	bullets?: LegalBulletItem[];
	groups?: LegalSectionGroup[];
	table?: LegalSectionTable;
};

export type RawLegalSectionGroup = {
	title?: unknown;
	items?: unknown[];
};

export type RawLegalSectionTable = {
	headers?: unknown[];
	rows?: unknown[][];
	note?: unknown;
};

export type RawLegalSection = {
	id?: unknown;
	title?: unknown;
	paragraphs?: unknown[];
	bullets?: unknown[];
	groups?: RawLegalSectionGroup[];
	table?: RawLegalSectionTable;
};

export type RichTextSegment = {
	text: string;
	bold: boolean;
};