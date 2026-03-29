const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if we're on Vercel (production build)
const isVercel = process.env.VERCEL === '1' || process.env.DATABASE_URL?.includes('supabase');

console.log('Environment:', isVercel ? 'Vercel (PostgreSQL)' : 'Local (SQLite)');

if (isVercel) {
  // Use production schema for Vercel
  const productionSchema = path.join(__dirname, '..', 'prisma', 'schema.production.prisma');
  const targetSchema = path.join(__dirname, '..', 'prisma', 'schema.prisma');

  if (fs.existsSync(productionSchema)) {
    fs.copyFileSync(productionSchema, targetSchema);
    console.log('✓ Using PostgreSQL schema for production');
  }

  // Generate Prisma Client
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Push schema to database
  try {
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  } catch (error) {
    console.log('Note: db push failed, continuing with build...');
  }
} else {
  // Generate Prisma Client for local development (SQLite)
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✓ Using SQLite schema for local development');
}
