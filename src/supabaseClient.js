// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://agaxqagsamshtjzcftgt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnYXhxYWdzYW1zaHRqemNmdGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0Nzg1MjQsImV4cCI6MjA0NDA1NDUyNH0.9cNGzjBB3ZmPOipFqfuU-gd3i7yseTH7YxFhtN2AVao';
export const supabase = createClient(supabaseUrl, supabaseKey);
