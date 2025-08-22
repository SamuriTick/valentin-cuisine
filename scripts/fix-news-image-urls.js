#!/usr/bin/env node

/**
 * Migration script to fix news post image URLs
 * Converts R2 signed URLs to permanent public URLs
 * Also handles other content that might have signed URLs
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const NEW_PUBLIC_URL = 'https://cdn.chartedconsultants.com';

// Function to extract R2 key from signed URL
function extractR2KeyFromSignedUrl(url) {
  if (!url || typeof url !== 'string') return null;
  
  try {
    const urlObj = new URL(url);
    
    // Check if it's an R2 signed URL (contains account ID in hostname)
    if (urlObj.hostname.includes('r2.cloudflarestorage.com')) {
      // Extract key from pathname
      // Format: /bucket-name/path/to/file
      const pathParts = urlObj.pathname.split('/');
      if (pathParts.length >= 3) {
        // Skip empty first element and bucket name
        return pathParts.slice(2).join('/');
      }
    }
    
    // Check if it's already a CDN URL
    if (url.startsWith(NEW_PUBLIC_URL)) {
      console.log(`URL already uses CDN: ${url}`);
      return null; // Already converted
    }
    
    // Check if it's a local file URL
    if (url.startsWith('/api/media/file/') || url.startsWith('/uploads/')) {
      console.log(`Local file URL detected: ${url}`);
      return null; // Don't convert local files
    }
    
  } catch (error) {
    console.error(`Error parsing URL ${url}:`, error.message);
  }
  
  return null;
}

// Function to convert signed URL to public URL
function convertToPublicUrl(signedUrl) {
  const key = extractR2KeyFromSignedUrl(signedUrl);
  if (!key) return signedUrl; // Return original if can't extract key
  
  return `${NEW_PUBLIC_URL}/${key}`;
}

async function fixNewsImageUrls() {
  console.log('🔧 Starting news image URL migration...');
  console.log(`Converting to CDN: ${NEW_PUBLIC_URL}`);
  
  try {
    // Get all news posts with images
    const newsPosts = await prisma.newsPost.findMany({
      where: {
        imageUrl: {
          not: null
        }
      },
      select: {
        id: true,
        title: true,
        imageUrl: true
      }
    });
    
    console.log(`\n📊 Found ${newsPosts.length} news posts with images`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const post of newsPosts) {
      const originalUrl = post.imageUrl;
      const newUrl = convertToPublicUrl(originalUrl);
      
      if (newUrl !== originalUrl) {
        console.log(`\n📝 Updating post: ${post.title}`);
        console.log(`  Old URL: ${originalUrl}`);
        console.log(`  New URL: ${newUrl}`);
        
        await prisma.newsPost.update({
          where: { id: post.id },
          data: { imageUrl: newUrl }
        });
        
        updatedCount++;
      } else {
        console.log(`⏭️  Skipping post: ${post.title} (URL already correct or local)`);
        skippedCount++;
      }
    }
    
    console.log(`\n✅ Migration completed!`);
    console.log(`📈 Updated: ${updatedCount} posts`);
    console.log(`⏭️  Skipped: ${skippedCount} posts`);
    
    // Also check other tables that might have R2 URLs
    await fixOtherImageUrls();
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function fixOtherImageUrls() {
  console.log('\n🔧 Checking other content for R2 URLs...');
  
  const tables = [
    { name: 'programs', field: 'imageUrl' },
    { name: 'facilities', field: 'imageUrl' },
    { name: 'communityGroup', field: 'image_url' },
    { name: 'testimonial', field: 'avatarUrl' },
    { name: 'faqItem', field: 'imageUrl' }
  ];
  
  for (const table of tables) {
    try {
      const records = await prisma[table.name].findMany({
        where: {
          [table.field]: {
            not: null
          }
        },
        select: {
          id: true,
          [table.field]: true
        }
      });
      
      console.log(`\n📋 Checking ${table.name}: ${records.length} records`);
      
      let tableUpdatedCount = 0;
      
      for (const record of records) {
        const originalUrl = record[table.field];
        const newUrl = convertToPublicUrl(originalUrl);
        
        if (newUrl !== originalUrl) {
          await prisma[table.name].update({
            where: { id: record.id },
            data: { [table.field]: newUrl }
          });
          
          console.log(`  ✅ Updated ${table.name} ID ${record.id}`);
          tableUpdatedCount++;
        }
      }
      
      if (tableUpdatedCount > 0) {
        console.log(`📈 Updated ${tableUpdatedCount} records in ${table.name}`);
      } else {
        console.log(`✨ No updates needed for ${table.name}`);
      }
      
    } catch (error) {
      console.error(`❌ Error checking ${table.name}:`, error.message);
    }
  }
}

// Run the migration
if (require.main === module) {
  fixNewsImageUrls()
    .then(() => {
      console.log('\n🎉 All done! News images should now use permanent URLs.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { fixNewsImageUrls };