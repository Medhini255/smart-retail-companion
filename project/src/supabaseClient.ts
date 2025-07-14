// src/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ytjfqsdbzzvkbdfrfkvc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0amZxc2Rienp2a2JkZnJma3ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MjQwNDIsImV4cCI6MjA2ODAwMDA0Mn0.AzQ-Ccc2scgBR4RLtERyGMqTzP2Im0_Yk-yABLvcP2M"; // go to Project > Settings > API

export const supabase = createClient(supabaseUrl, supabaseKey);
