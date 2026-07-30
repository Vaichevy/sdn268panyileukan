INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'sdn268panyileukan@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;