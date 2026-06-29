import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ervoiurdzfjuivjqbhdf.supabase.co';
const supabaseAnonKey = 'sb_publishable_60vzVTz8BLmfk87j-M2wWw_adLZr-dq';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
