export default {
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    () => 'npm run typecheck',
    'vitest related --run',
  ],
  '*.{json,css,md}': ['prettier --write'],
};
