const { execSync } = require('child_process');

console.log('Starting Next.js build...');

// Run Next.js build
execSync('next build', { stdio: 'inherit' });
