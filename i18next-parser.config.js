export default {
  locales: ['en', 'ne'],
  output: 'src/locales/$LOCALE.json',
  input: ['src/**/*.{js,jsx}'],
  keySeparator: false,
  namespaceSeparator: false,
  value: (locale, key) => (locale === 'en' ? key : ''),
};
