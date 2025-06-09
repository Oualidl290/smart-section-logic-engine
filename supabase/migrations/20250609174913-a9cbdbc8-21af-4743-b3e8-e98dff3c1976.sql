
-- Enable Row Level Security on smart_sections (if not already enabled)
ALTER TABLE public.smart_sections ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to select sections
CREATE POLICY "Allow public read access to smart_sections" 
  ON public.smart_sections 
  FOR SELECT 
  USING (true);

-- Create policy to allow anyone to insert sections
CREATE POLICY "Allow public insert access to smart_sections" 
  ON public.smart_sections 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow anyone to update sections
CREATE POLICY "Allow public update access to smart_sections" 
  ON public.smart_sections 
  FOR UPDATE 
  USING (true);

-- Create policy to allow anyone to delete sections
CREATE POLICY "Allow public delete access to smart_sections" 
  ON public.smart_sections 
  FOR DELETE 
  USING (true);

-- Also add policies for section_usage table
ALTER TABLE public.section_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to section_usage" 
  ON public.section_usage 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access to section_usage" 
  ON public.section_usage 
  FOR INSERT 
  WITH CHECK (true);
