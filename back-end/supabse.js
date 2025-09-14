import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.get('/api/video', async (req, res) => {
  const { data, error } = await supabase
    .storage
    .from('SteelmatVideos')
    .createSignedUrl('home.mp4', 3600); // 1 hora

  if (error) return res.status(500).json({ error: error.message });

  res.json({ url: data.signedUrl });
});