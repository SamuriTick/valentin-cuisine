#!/usr/bin/env npx tsx

/**
 * Migration script to convert expired R2 signed URLs to public CDN URLs
 * Run this script to fix old uploaded images that are no longer working
 * 
 * Usage: npx tsx scripts/migrate-r2-urls.ts
 */

import { PrismaClient } from '@prisma/client';
import { convertToPublicUrl } from '../src/lib/r2-storage';

const prisma = new PrismaClient();

interface TableUpdate {
  table: string;
  idField: string;
  urlField: string;
  count: number;
  updated: number;
}

async function migrateUrls(): Promise<void> {
  console.log('🔄 Starting R2 URL migration...\n');
  
  const updates: TableUpdate[] = [];

  try {
    // 1. Update media_library table
    console.log('📁 Migrating media_library table...');
    const mediaItems = await prisma.$queryRaw`
      SELECT id, file_path FROM media_library 
      WHERE file_path LIKE '%r2.cloudflarestorage.com%'
    ` as Array<{id: number, file_path: string}>;
    
    let mediaUpdated = 0;
    for (const item of mediaItems) {
      const newUrl = convertToPublicUrl(item.file_path);
      if (newUrl && newUrl !== item.file_path) {
        await prisma.mediaItem.update({
          where: { id: item.id },
          data: { filePath: newUrl }
        });
        mediaUpdated++;
      }
    }
    
    updates.push({
      table: 'media_library',
      idField: 'id',
      urlField: 'file_path',
      count: mediaItems.length,
      updated: mediaUpdated
    });

    // 2. Update facility_gallery table
    console.log('🏢 Migrating facility_gallery table...');
    const facilityImages = await prisma.$queryRaw`
      SELECT id, image_url FROM facility_gallery 
      WHERE image_url LIKE '%r2.cloudflarestorage.com%'
    ` as Array<{id: number, image_url: string}>;
    
    let facilityUpdated = 0;
    for (const item of facilityImages) {
      const newUrl = convertToPublicUrl(item.image_url);
      if (newUrl && newUrl !== item.image_url) {
        await prisma.$executeRaw`
          UPDATE facility_gallery SET image_url = ${newUrl} WHERE id = ${item.id}
        `;
        facilityUpdated++;
      }
    }
    
    updates.push({
      table: 'facility_gallery',
      idField: 'id', 
      urlField: 'image_url',
      count: facilityImages.length,
      updated: facilityUpdated
    });

    // 3. Update news_posts table
    console.log('📰 Migrating news_posts table...');
    const newsItems = await prisma.$queryRaw`
      SELECT id, image_url FROM news_posts 
      WHERE image_url LIKE '%r2.cloudflarestorage.com%'
    ` as Array<{id: number, image_url: string}>;
    
    let newsUpdated = 0;
    for (const item of newsItems) {
      const newUrl = convertToPublicUrl(item.image_url);
      if (newUrl && newUrl !== item.image_url) {
        await prisma.newsPost.update({
          where: { id: item.id },
          data: { imageUrl: newUrl }
        });
        newsUpdated++;
      }
    }
    
    updates.push({
      table: 'news_posts',
      idField: 'id',
      urlField: 'image_url', 
      count: newsItems.length,
      updated: newsUpdated
    });

    // 4. Update facilities table
    console.log('🏗️  Migrating facilities table...');
    const facilities = await prisma.$queryRaw`
      SELECT id, image_url FROM facilities 
      WHERE image_url LIKE '%r2.cloudflarestorage.com%'
    ` as Array<{id: number, image_url: string}>;
    
    let facilitiesUpdated = 0;
    for (const item of facilities) {
      const newUrl = convertToPublicUrl(item.image_url);
      if (newUrl && newUrl !== item.image_url) {
        await prisma.facility.update({
          where: { id: item.id },
          data: { imageUrl: newUrl }
        });
        facilitiesUpdated++;
      }
    }
    
    updates.push({
      table: 'facilities',
      idField: 'id',
      urlField: 'image_url',
      count: facilities.length,
      updated: facilitiesUpdated
    });

    // 5. Update programs table  
    console.log('🎯 Migrating programs table...');
    const programs = await prisma.$queryRaw`
      SELECT id, image_url FROM programs 
      WHERE image_url LIKE '%r2.cloudflarestorage.com%'
    ` as Array<{id: number, image_url: string}>;
    
    let programsUpdated = 0;
    for (const item of programs) {
      const newUrl = convertToPublicUrl(item.image_url);
      if (newUrl && newUrl !== item.image_url) {
        await prisma.program.update({
          where: { id: item.id },
          data: { imageUrl: newUrl }
        });
        programsUpdated++;
      }
    }
    
    updates.push({
      table: 'programs',
      idField: 'id',
      urlField: 'image_url',
      count: programs.length,
      updated: programsUpdated
    });

    // 6. Update community_groups table
    console.log('👥 Migrating community_groups table...');
    const communityGroups = await prisma.$queryRaw`
      SELECT id, image_url FROM community_groups 
      WHERE image_url LIKE '%r2.cloudflarestorage.com%'
    ` as Array<{id: number, image_url: string}>;
    
    let communityUpdated = 0;
    for (const item of communityGroups) {
      const newUrl = convertToPublicUrl(item.image_url);
      if (newUrl && newUrl !== item.image_url) {
        await prisma.$executeRaw`
          UPDATE community_groups SET image_url = ${newUrl} WHERE id = ${item.id}
        `;
        communityUpdated++;
      }
    }
    
    updates.push({
      table: 'community_groups',
      idField: 'id',
      urlField: 'image_url',
      count: communityGroups.length,
      updated: communityUpdated
    });

    console.log('\n✅ Migration completed successfully!\n');
    
    // Print summary
    console.log('📊 Migration Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    let totalCount = 0;
    let totalUpdated = 0;
    
    updates.forEach(update => {
      console.log(`${update.table.padEnd(20)} | ${update.count.toString().padStart(5)} found | ${update.updated.toString().padStart(5)} updated`);
      totalCount += update.count;
      totalUpdated += update.updated;
    });
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`${'TOTAL'.padEnd(20)} | ${totalCount.toString().padStart(5)} found | ${totalUpdated.toString().padStart(5)} updated`);
    
    if (totalUpdated > 0) {
      console.log(`\n🎉 Successfully converted ${totalUpdated} expired signed URLs to public CDN URLs!`);
      console.log('   Old uploaded images should now work properly.');
    } else {
      console.log('\n👍 No URLs needed to be updated.');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
if (require.main === module) {
  migrateUrls().catch(console.error);
}

export { migrateUrls };