CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created_role
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name text NOT NULL DEFAULT 'SDN 268 Panyileukan',
  tagline text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  npsn text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  maps_embed_url text NOT NULL DEFAULT '',
  logo_url text,
  hero_image_url text,
  about_text text NOT NULL DEFAULT '',
  vision text NOT NULL DEFAULT '',
  mission text NOT NULL DEFAULT '',
  headmaster_name text NOT NULL DEFAULT '',
  headmaster_title text NOT NULL DEFAULT '',
  headmaster_photo_url text,
  headmaster_speech text NOT NULL DEFAULT '',
  stat_students text NOT NULL DEFAULT '',
  stat_teachers text NOT NULL DEFAULT '',
  stat_classrooms text NOT NULL DEFAULT '',
  stat_accreditation text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage site settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL,
  event_date date,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_items TO authenticated;
GRANT ALL ON public.gallery_items TO service_role;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view gallery" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Admins manage gallery" ON public.gallery_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER gallery_items_updated BEFORE UPDATE ON public.gallery_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.news_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  image_url text,
  published_at date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.news_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.news_items TO authenticated;
GRANT ALL ON public.news_items TO service_role;
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view news" ON public.news_items FOR SELECT USING (true);
CREATE POLICY "Admins manage news" ON public.news_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER news_items_updated BEFORE UPDATE ON public.news_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_settings (
  school_name, tagline, address, npsn, phone, email, maps_embed_url,
  about_text, vision, mission,
  headmaster_name, headmaster_title, headmaster_speech,
  stat_students, stat_teachers, stat_classrooms, stat_accreditation
) VALUES (
  'SDN 268 Panyileukan',
  'Sekolah Dasar Negeri yang Unggul, Berkarakter, dan Berprestasi',
  'Komplek Bumi Panyileukan G.15 No. 23, RT 01 / RW 07, Kelurahan Cipadung Kidul, Kecamatan Panyileukan, Kota Bandung',
  '20245726',
  '(022) 87882549',
  'sdn268panyileukan@gmail.com',
  'https://www.google.com/maps?q=Komplek%20Bumi%20Panyileukan%20G.15%20No.%2023%2C%20Cipadung%20Kidul%2C%20Panyileukan%2C%20Bandung&output=embed',
  'SDN 268 Panyileukan adalah sekolah dasar negeri yang berlokasi di Komplek Bumi Panyileukan, Kelurahan Cipadung Kidul, Kecamatan Panyileukan, Kota Bandung. Kami berkomitmen menyelenggarakan pendidikan dasar yang bermutu, menyenangkan, dan berlandaskan nilai-nilai karakter Profil Pelajar Pancasila.',
  'Terwujudnya peserta didik yang beriman, bertakwa, berakhlak mulia, cerdas, kreatif, serta peduli lingkungan.',
  E'Menanamkan nilai keimanan dan ketakwaan dalam kegiatan sehari-hari.\nMenyelenggarakan pembelajaran aktif, kreatif, dan menyenangkan.\nMengembangkan bakat dan minat peserta didik melalui ekstrakurikuler.\nMembangun budaya sekolah yang bersih, sehat, dan ramah anak.\nMenjalin kerja sama yang harmonis dengan orang tua dan masyarakat.',
  'Maria Rosa, S.Pd., M.M.',
  'Kepala SDN 268 Panyileukan',
  E'Assalamu''alaikum warahmatullahi wabarakatuh. Salam sejahtera untuk kita semua.\n\nPuji syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa atas segala rahmat dan karunia-Nya, sehingga website resmi SDN 268 Panyileukan ini dapat hadir sebagai jendela informasi bagi seluruh warga sekolah dan masyarakat luas.\n\nWebsite ini kami hadirkan sebagai sarana keterbukaan informasi, dokumentasi kegiatan, sekaligus jembatan komunikasi antara sekolah, orang tua, dan masyarakat. Kami percaya bahwa pendidikan yang berkualitas lahir dari kolaborasi yang erat antara guru, siswa, keluarga, dan lingkungan.\n\nSemoga setiap langkah kecil yang kami dokumentasikan di sini menjadi inspirasi dan motivasi bagi kita semua untuk terus tumbuh bersama. Terima kasih atas dukungan dan kepercayaan yang telah diberikan kepada SDN 268 Panyileukan.\n\nWassalamu''alaikum warahmatullahi wabarakatuh.',
  '384', '21', '12', 'A'
);