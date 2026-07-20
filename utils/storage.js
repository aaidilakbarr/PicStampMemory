import { Directory, File, Paths } from 'expo-file-system';
import { supabase } from './supabase';

export const BUCKET_NAME = 'memories';
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://chzskrrmoxgtbrdnogjj.supabase.co';

export function getPublicUrl(imagePath) {
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${imagePath}`;
}

function copyToPersistentStorage(localUri) {
  const source = new File(localUri);
  const extension = source.extension || '.jpg';
  const directory = new Directory(Paths.document, 'framory');
  if (!directory.exists) {
    directory.create({ intermediates: true });
  }
  const destination = directory.createFile(
    `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${extension}`,
    'image/jpeg',
  );
  source.copy(destination);
  return destination.uri;
}

export async function uploadImage(localUri) {
  if (!supabase) {
    return copyToPersistentStorage(localUri);
  }

  const source = new File(localUri);
  const bytes = await source.bytes();
  const storagePath = `public/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.jpg`;
  const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(storagePath, bytes, {
    contentType: 'image/jpeg',
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  return getPublicUrl(data.path);
}

export async function deleteImage(imageUrl) {
  if (!imageUrl || !supabase || !imageUrl.includes(`${BUCKET_NAME}/`)) return;

  const path = imageUrl.split(`${BUCKET_NAME}/`)[1];
  if (path) {
    await supabase.storage.from(BUCKET_NAME).remove([path]);
  }
}

export async function verifyBucket() {
  if (!supabase) return false;
  const { data, error } = await supabase.storage.getBucket(BUCKET_NAME);
  return !error && !!data;
}
