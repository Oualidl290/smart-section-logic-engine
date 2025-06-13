
-- Add user_id column to smart_sections table to associate sections with users
ALTER TABLE public.smart_sections 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing sections to have a user_id (set to null for now)
-- In a real scenario, you might want to assign them to a specific user

-- Enable Row Level Security on smart_sections
ALTER TABLE public.smart_sections ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view only their own sections
CREATE POLICY "Users can view their own sections" 
  ON public.smart_sections 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy to allow users to create their own sections
CREATE POLICY "Users can create their own sections" 
  ON public.smart_sections 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own sections
CREATE POLICY "Users can update their own sections" 
  ON public.smart_sections 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own sections
CREATE POLICY "Users can delete their own sections" 
  ON public.smart_sections 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Also update section_usage table to be user-specific if needed
ALTER TABLE public.section_usage 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create policy for section_usage to allow users to view their own usage data
CREATE POLICY "Users can view their own section usage" 
  ON public.section_usage 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own usage data
CREATE POLICY "Users can insert their own section usage" 
  ON public.section_usage 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
