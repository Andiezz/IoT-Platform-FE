export const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function uniqueKey(len: number, prefix = 'exro_elm') {
	let result = '';

	const charactersLength = CHARS.length;
	for (let i = 0; i < len; i++) {
		result += CHARS.charAt(Math.floor(Math.random() * charactersLength));
	}
	return `${prefix}_${result}`;
}