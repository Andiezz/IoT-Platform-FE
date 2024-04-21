// eslint-disable-next-line no-undef
module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ['eslint:recommended', 'plugin:react/recommended'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		sourceType: 'module',
	},
	plugins: ['react', '@typescript-eslint'],
	rules: {
		'@typescript-eslint/ban-ts-comment': 'error',
		'react/jsx-uses-react': 1,
		'@typescript-eslint/adjacent-overload-signatures': 'error',
		'@typescript-eslint/consistent-type-assertions': 'error',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/quotes': [2, 'single', { 'avoidEscape': true }],
		'no-array-constructor': 'off',
		'@typescript-eslint/no-array-constructor': 'error',
		'@typescript-eslint/no-empty-function': 'error',
		'@typescript-eslint/no-empty-interface': 'error',
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/no-inferrable-types': 'error',
		'@typescript-eslint/no-misused-new': 'error',
		'@typescript-eslint/no-namespace': 'error',
		'@typescript-eslint/no-non-null-assertion': 'warn',
		'@typescript-eslint/no-this-alias': 'error',
		'@typescript-eslint/no-unused-vars': 'error',
		'no-use-before-define': 'off',
		'@typescript-eslint/no-use-before-define': 'error',
		'@typescript-eslint/no-var-requires': 'error',
		'@typescript-eslint/prefer-namespace-keyword': 'error',
		'@typescript-eslint/triple-slash-reference': 'error',
		'@typescript-eslint/type-annotation-spacing': 'error',
		'no-var': 'error',
		'prefer-const': 'error',
		'prefer-rest-params': 'error',
		'prefer-spread': 'error',
		'react/forbid-foreign-prop-types': 0,
		'react/no-typos': 0,
		'no-mixed-spaces-and-tabs': 0
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
	globals: {

		JSX: true
	}
};
