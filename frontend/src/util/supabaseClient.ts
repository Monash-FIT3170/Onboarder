// supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bcnxifsqkyzzpgshacts.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjbnhpZnNxa3l6enBnc2hhY3RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1NjM5NjQsImV4cCI6MjAzMTEzOTk2NH0.XT_aSkBLaaaX-66BqDF7Z1oP5qlgJLGNXSovibjatdU";

export const supabase = createClient(supabaseUrl, supabaseKey);
