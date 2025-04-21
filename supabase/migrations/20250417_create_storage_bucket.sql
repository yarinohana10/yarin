
-- Create a storage bucket for wedding images
INSERT INTO storage.buckets (id, name, public)
VALUES ('wedding-images', 'Wedding Images', true);

-- Allow public access to view files in the bucket
CREATE POLICY "Public Access"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'wedding-images');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'wedding-images' AND
    auth.role() = 'authenticated'
  );

-- Allow authenticated users to update their own files
CREATE POLICY "Authenticated users can update their own files"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'wedding-images' AND
    auth.uid() = owner
  );

-- Allow authenticated users to delete their own files
CREATE POLICY "Authenticated users can delete their own files"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'wedding-images' AND
    auth.uid() = owner
  );
