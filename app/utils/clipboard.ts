export async function copyTextToClipboard(text: string) {
	if (typeof document === 'undefined' || typeof navigator === 'undefined') {
		throw new Error('Clipboard unavailable in non-browser context');
	}

	const fallbackCopy = () => {
		const textarea = document.createElement('textarea');
		textarea.value = text;
		textarea.style.position = 'fixed';
		textarea.style.left = '-9999px';
		textarea.style.opacity = '0';
		textarea.setAttribute('readonly', 'true');
		document.body.appendChild(textarea);
		textarea.focus();
		textarea.select();
		textarea.setSelectionRange(0, textarea.value.length);

		try {
			return document.execCommand('copy');
		} catch {
			return false;
		} finally {
			document.body.removeChild(textarea);
		}
	};

	if (navigator?.clipboard?.writeText) {
		try {
			await navigator.clipboard.writeText(text);
			return;
		} catch {
			// Fallback to execCommand flow on clipboard API errors.
		}
	}

	if (fallbackCopy()) {
		return;
	}

	throw new Error('Copy failed');
}