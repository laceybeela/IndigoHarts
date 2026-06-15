-- Custom enum types
CREATE TYPE public.user_role AS ENUM ('admin', 'employee');
CREATE TYPE public.stay_status AS ENUM ('upcoming', 'checked_in', 'checked_out', 'cancelled');
CREATE TYPE public.job_status AS ENUM ('assigned', 'accepted', 'in_progress', 'completed');
CREATE TYPE public.sms_status AS ENUM ('pending', 'sent', 'delivered', 'failed');
