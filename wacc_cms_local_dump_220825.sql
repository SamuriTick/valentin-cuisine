--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Debian 14.18-1.pgdg120+1)
-- Dumped by pg_dump version 14.18 (Debian 14.18-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: wacc_user
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO wacc_user;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: wacc_user
--

CREATE TABLE public.accounts (
    id text NOT NULL,
    user_id text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    provider_account_id text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public.accounts OWNER TO wacc_user;

--
-- Name: booking_availability; Type: TABLE; Schema: public; Owner: wacc_user
--

CREATE TABLE public.booking_availability (
    id integer NOT NULL,
    facility_id integer NOT NULL,
    day_of_week integer NOT NULL,
    start_time text NOT NULL,
    end_time text NOT NULL,
    is_available boolean DEFAULT true NOT NULL
);


ALTER TABLE public.booking_availability OWNER TO wacc_user;

--
-- Name: booking_availability_id_seq; Type: SEQUENCE; Schema: public; Owner: wacc_user
--

CREATE SEQUENCE public.booking_availability_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.booking_availability_id_seq OWNER TO wacc_user;

--
-- Name: booking_availability_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wacc_user
--

ALTER SEQUENCE public.booking_availability_id_seq OWNED BY public.booking_availability.id;


--
-- Name: bookings; Type: TABLE; Schema: public; Owner: wacc_user
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    facility_id integer NOT NULL,
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    customer_phone text,
    event_title text NOT NULL,
    event_description text,
    start_date_time timestamp(3) without time zone NOT NULL,
    end_date_time timestamp(3) without time zone NOT NULL,
    total_hours numeric(4,2) NOT NULL,
    hourly_rate numeric(8,2),
    total_cost numeric(10,2),
    status text DEFAULT 'pending'::text NOT NULL,
    notes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.bookings OWNER TO wacc_user;

--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: wacc_user
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bookings_id_seq OWNER TO wacc_user;

--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wacc_user
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- Name: community_groups; Type: TABLE; Schema: public; Owner: wacc_user
--

CREATE TABLE public.community_groups (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    active boolean DEFAULT true NOT NULL,
    age_group text,
    category text DEFAULT 'Cultural & Social'::text,
    contact_email text,
    contact_name text,
    contact_phone text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    display_order integer DEFAULT 0 NOT NULL,
    facebook_url text,
    featured boolean DEFAULT false NOT NULL,
    fees text,
    image_url text,
    instagram_url text,
    language text,
    meeting_day text,
    meeting_time text,
    member_count integer,
    name text,
    updated_at timestamp(3) without time zone,
    website_url text
);


ALTER TABLE public.community_groups OWNER TO wacc_user;

--
-- Name: community_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: wacc_user
--

CREATE SEQUENCE public.community_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.community_groups_id_seq OWNER TO wacc_user;

--
-- Name: community_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wacc_user
--

ALTER SEQUENCE public.community_groups_id_seq OWNED BY public.community_groups.id;


--
-- Name: contact_info; Type: TABLE; Schema: public; Owner: wacc_user
--

CREATE TABLE public.contact_info (
    id integer NOT NULL,
    type text NOT NULL,
    label text,
    value text NOT NULL,
    description text,
    display_order integer DEFAULT 0 NOT NULL,
    active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.contact_info OWNER TO wacc_user;

--
-- Name: contact_info_id_seq; Type: SEQUENCE; Schema: public; Owner: wacc_user
--

CREATE SEQUENCE public.contact_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contact_info_id_seq OWNER TO wacc_user;

--
-- Name: contact_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wacc_user
--

ALTER SEQUENCE public.contact_info_id_seq OWNED BY public.contact_info.id;


--
-- Name: facilities; Type: TABLE; Schema: public; Owner: wacc_user
--

CREATE TABLE public.facilities (
    id integer NOT NULL,
    name text NOT NULL,
    subtitle text,
    description text,
    capacity integer,
    dimensions text,
    hourly_rate numeric(8,2),
    features jsonb,
    image_url text,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.facilities OWNER TO wacc_user;

--
-- Name: facilities_id_seq; Type: SEQUENCE; Schema: public; Owner: wacc_user
--

CREATE SEQUENCE public.facilities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.facilities_id_seq OWNER TO wacc_user;

--
-- Name: facilities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wacc_user
--

ALTER SEQUENCE public.facilities_id_seq OWNED BY public.facilities.id;


--
-- Name: facility_gallery; Type: TABLE; Schema: public; Owner: wacc_user
--

CREATE TABLE public.facility_gallery (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    image_url text NOT NULL,
    category text DEFAULT 'general'::text NOT NULL,
    alt_text text,
    display_order integer DEFAULT 0 NOT NULL,
    active boolean DEFAULT true NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.facility_gallery OWNER TO wacc_user;

--
-- Name: facility_gallery_id_seq; Type: SEQUENCE; Schema: public; Owner: wacc_user
--

CREATE SEQUENCE public.facility_gallery_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.facility_gallery_id_seq OWNER TO wacc_user;

--
-- Name: facility_gallery_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wacc_user
--

ALTER SEQUENCE public.facility_gallery_id_seq OWNED BY public.facility_gallery.id;


--
-- Name: facility_services; Type: TABLE; Schema: public; Owner: wacc_user
--

CREATE TABLE public.facility_services (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    features jsonb,
    pricing_info text,
    category text,
    active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.facility_services OWNER TO wacc_user;

--
-- Name: facility_services_id_seq; Type: SEQUENCE; Schema: public; Owner: wacc_user
--

CREATE SEQUENCE public.facility_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.facility_services_id_seq OWNER TO wacc_user;

--
-- Name: facility_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wacc_user
--

ALTER SEQUENCE public.facility_services_id_seq OWNED BY public.facility_services.id;


--
-- Name: faq_items; Type: TABLE; Schema: public; Owner: wacc_user
--

CREATE TABLE public.faq_items (
    id integer NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    category text,
    image_url text,
    display_order integer DEFAULT 0 NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.faq_items OWNER TO wacc_user;

--
-- Name: faq_items_id_seq; Type: SEQUENCE; Schema: public; Owner: wacc_user
--

CREATE SEQUENCE public.faq_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.faq_items_id_seq OWNER TO wacc_user;

--
-- Name: faq_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wacc_user
--

ALTER SEQUENCE public.faq_items_id_seq OWNED BY public.faq_items.id;


--
-- Name: media_library; Type: TABLE; Schema: public; Owner: wacc_user
--

CREATE TABLE public.media_library (
    id integer NOT NULL,
    filename text NOT NULL,
    original_name text NOT NULL,
    file_path text NOT NULL,
    file_type text NOT NULL,
    file_size integer,
    alt_text text,
    caption text,
    uploaded_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    height integer,
    optimized_path text,
    optimized_size integer,
    thumbnail_path text,
    thumbnail_size integer,
    width integer
);


ALTER TABLE public.media_library OWNER TO wacc_user;

--
-- Name: media_library_id_seq; Type: SEQUENCE; Schema: public; Owner: wacc_user
--

CREATE SEQUENCE public.media_library_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.media_library_id_seq OWNER TO wacc_user;

--
-- Name: media_library_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wacc_user
--

ALTER SEQUENCE public.media_library_id_seq OWNED BY public.media_library.id;


--
-- Name: opening_hours; Type: TABLE; Schema: public; Owner: wacc_user
--

CREATE TABLE public.opening_hours (
    id integer NOT NULL,
    title text NOT NULL,
    schedule jsonb NOT NULL,
    description text,
    type text NOT NULL,
    active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.opening_hours OWNER TO wacc_user;

--
-- Name: opening_hours_id_seq; Type: SEQUENCE; Schema: public; Owner: wacc_user
--

CREATE SEQUENCE public.opening_hours_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.opening_hours_id_seq OWNER TO wacc_user;

--
-- Name: opening_hours_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wacc_user
--

ALTER SEQUENCE public.opening_hours_id_seq OWNED BY public.opening_hours.id;


--
-- Name: program_schedules; Type: TABLE; Schema: public; Owner: wacc_user
--

CREATE TABLE public.program_schedules (
    id integer NOT NULL,
    program_id integer NOT NULL,
    day_of_week text,
    start_time text,
    end_time text,
    description text,
    active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.program_schedules OWNER TO wacc_user;

--
-- Name: program_schedules_id_seq; Type: SEQUENCE; Schema: public; Owner: wacc_user
--

CREATE SEQUENCE public.program_schedules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.program_schedules_id_seq OWNER TO wacc_user;

--
-- Name: program_schedules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wacc_user
--

ALTER SEQUENCE public.program_schedules_id_seq OWNED BY public.program_schedules.id;


--
-- Name: programs; Type: TABLE; Schema: public; Owner: wacc_user
--

CREATE TABLE public.programs (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    category text NOT NULL,
    age_group text,
    price text,
    booking_info text,
    instructor text,
    contact_email text,
    contact_phone text,
    contact_website text,
    image_url text,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.programs OWNER TO wacc_user;

--
-- Name: programs_id_seq; Type: SEQUENCE; Schema: public; Owner: wacc_user
--

CREATE SEQUENCE public.programs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.programs_id_seq OWNER TO wacc_user;

--
-- Name: programs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wacc_user
--

ALTER SEQUENCE public.programs_id_seq OWNED BY public.programs.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: wacc_user
--

CREATE TABLE public.sessions (
    id text NOT NULL,
    session_token text NOT NULL,
    user_id text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO wacc_user;

--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: wacc_user
--

CREATE TABLE public.site_settings (
    id integer NOT NULL,
    key text NOT NULL,
    value text,
    type text NOT NULL,
    description text,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.site_settings OWNER TO wacc_user;

--
-- Name: site_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: wacc_user
--

CREATE SEQUENCE public.site_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.site_settings_id_seq OWNER TO wacc_user;

--
-- Name: site_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wacc_user
--

ALTER SEQUENCE public.site_settings_id_seq OWNED BY public.site_settings.id;


--
-- Name: testimonials; Type: TABLE; Schema: public; Owner: wacc_user
--

CREATE TABLE public.testimonials (
    id integer NOT NULL,
    quote text NOT NULL,
    author_name text NOT NULL,
    author_title text,
    avatar_url text,
    active boolean DEFAULT true NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.testimonials OWNER TO wacc_user;

--
-- Name: testimonials_id_seq; Type: SEQUENCE; Schema: public; Owner: wacc_user
--

CREATE SEQUENCE public.testimonials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.testimonials_id_seq OWNER TO wacc_user;

--
-- Name: testimonials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wacc_user
--

ALTER SEQUENCE public.testimonials_id_seq OWNED BY public.testimonials.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: wacc_user
--

CREATE TABLE public.users (
    id text NOT NULL,
    name text,
    email text NOT NULL,
    email_verified timestamp(3) without time zone,
    image text,
    password text,
    role text DEFAULT 'admin'::text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO wacc_user;

--
-- Name: verificationtokens; Type: TABLE; Schema: public; Owner: wacc_user
--

CREATE TABLE public.verificationtokens (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.verificationtokens OWNER TO wacc_user;

--
-- Name: booking_availability id; Type: DEFAULT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.booking_availability ALTER COLUMN id SET DEFAULT nextval('public.booking_availability_id_seq'::regclass);


--
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- Name: community_groups id; Type: DEFAULT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.community_groups ALTER COLUMN id SET DEFAULT nextval('public.community_groups_id_seq'::regclass);


--
-- Name: contact_info id; Type: DEFAULT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.contact_info ALTER COLUMN id SET DEFAULT nextval('public.contact_info_id_seq'::regclass);


--
-- Name: facilities id; Type: DEFAULT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.facilities ALTER COLUMN id SET DEFAULT nextval('public.facilities_id_seq'::regclass);


--
-- Name: facility_gallery id; Type: DEFAULT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.facility_gallery ALTER COLUMN id SET DEFAULT nextval('public.facility_gallery_id_seq'::regclass);


--
-- Name: facility_services id; Type: DEFAULT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.facility_services ALTER COLUMN id SET DEFAULT nextval('public.facility_services_id_seq'::regclass);


--
-- Name: faq_items id; Type: DEFAULT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.faq_items ALTER COLUMN id SET DEFAULT nextval('public.faq_items_id_seq'::regclass);


--
-- Name: media_library id; Type: DEFAULT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.media_library ALTER COLUMN id SET DEFAULT nextval('public.media_library_id_seq'::regclass);


--
-- Name: opening_hours id; Type: DEFAULT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.opening_hours ALTER COLUMN id SET DEFAULT nextval('public.opening_hours_id_seq'::regclass);


--
-- Name: program_schedules id; Type: DEFAULT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.program_schedules ALTER COLUMN id SET DEFAULT nextval('public.program_schedules_id_seq'::regclass);


--
-- Name: programs id; Type: DEFAULT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.programs ALTER COLUMN id SET DEFAULT nextval('public.programs_id_seq'::regclass);


--
-- Name: site_settings id; Type: DEFAULT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.site_settings ALTER COLUMN id SET DEFAULT nextval('public.site_settings_id_seq'::regclass);


--
-- Name: testimonials id; Type: DEFAULT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.testimonials ALTER COLUMN id SET DEFAULT nextval('public.testimonials_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: wacc_user
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
0004f14f-d2db-4ba4-ad81-5a7bb37e25d6	966a6b432adab13da53e64c5234c782d356dc1ade32444f052b0fa80eee9de7d	2025-08-13 18:16:56.964655+00	20250802220452_init	\N	\N	2025-08-13 18:16:56.578524+00	1
6a8111b2-51b1-43cb-8a66-9e66d517ae6d	9154197fd130910afabcc9aa1f4d73d59a7344c3d2c4dc2b98799b5af5d634e9	2025-08-13 18:16:57.337504+00	20250809162030_add_notes_and_homepage_content	\N	\N	2025-08-13 18:16:57.052877+00	1
0291e972-1d9f-4c1f-b9d7-98fd5d3e2da8	788decba2e4656404932f9b8c693577fc586d4b59c45bd7b05d0d6c9100bd805	2025-08-13 18:17:58.519804+00	20250813181758_add_missing_columns	\N	\N	2025-08-13 18:17:58.324842+00	1
fcfd73af-5b2b-4dec-be64-d6012f1cd173	024b376ca8914a6021c2f0780354afacad3edfa23362218ffd425f9528bb1dfb	2025-08-13 20:21:25.704799+00	20250813202125_add_facility_gallery	\N	\N	2025-08-13 20:21:25.625478+00	1
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: wacc_user
--

COPY public.accounts (id, user_id, type, provider, provider_account_id, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: booking_availability; Type: TABLE DATA; Schema: public; Owner: wacc_user
--

COPY public.booking_availability (id, facility_id, day_of_week, start_time, end_time, is_available) FROM stdin;
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: wacc_user
--

COPY public.bookings (id, facility_id, customer_name, customer_email, customer_phone, event_title, event_description, start_date_time, end_date_time, total_hours, hourly_rate, total_cost, status, notes, created_at, updated_at) FROM stdin;
1	3	dawn hursey	dawn_1985_21@hotmail.co.uk	07475472411	Birthday Party	My daughters 10th birthday 	2025-09-21 11:00:00	2025-09-21 16:00:00	5.00	\N	\N	pending	Description: My daughters 10th birthday \nExpected Guests: 60\nCatering: Own food	2025-08-16 13:53:47.561	2025-08-16 13:53:47.559
2	3	Reza Maleki	rmaleky54@gmail.com	07421004806	Community Meeting	\N	2025-08-16 17:00:00	2025-08-16 19:00:00	2.00	\N	\N	pending	Expected Guests: 60\nCatering: No\nRegular Booking: Yes	2025-08-16 14:26:25.917	2025-08-16 14:26:25.916
3	3	Zoya Khilji	cute_doll3322@yahoo.com	07464815203	Birthday Party	\N	2025-11-23 14:00:00	2025-11-23 16:00:00	2.00	\N	\N	pending	Expected Guests: 30\nCatering: Own catering\nRegular Booking: Yes	2025-08-17 21:21:06.377	2025-08-17 21:21:06.376
4	3	Arthur Gborie	tgborie@yahoo.com	07419341904	Birthday Party	adult birthday party	2025-08-23 14:00:00	2025-08-23 22:00:00	8.00	\N	\N	pending	Description: adult birthday party\nExpected Guests: 40\nCatering: own food and drinks\nRegular Booking: Yes	2025-08-18 13:09:03.043	2025-08-18 13:09:03.042
5	3	Rolanda Dolcy-Campbell	rdolcy@gmail.com	07432753377	Other	Christening	2025-10-05 09:00:00	2025-10-05 22:00:00	13.00	\N	\N	pending	Description: Christening\nExpected Guests: 100\nCatering: Outside catering and drinks\nRegular Booking: Yes	2025-08-18 21:28:08.356	2025-08-18 21:28:08.355
6	3	tamseela mahmood	tamseela24@gmail.com	07958553783	Other	Good evening\nI hope you are well. I am having my mehndi asian ceremony with just around 66 guests maximum and was wondering if you can accommodate? This would be on may 22nd 2026 (the Friday) and would be from around 5/6pm till 11pm latest\n\nIs there also a partition or something to segregate men and women for some part of the ceremony? Or another room for use only for an hour or two? \n\nPlease let me know about speakers and catering if possible\n\nPlease email me as I work in a therapy setting so unable to answer calls \nMany thanks,\nTamseela	2026-05-22 16:00:00	2026-05-22 22:00:00	6.00	\N	\N	pending	Description: Good evening\nI hope you are well. I am having my mehndi asian ceremony with just around 66 guests maximum and was wondering if you can accommodate? This would be on may 22nd 2026 (the Friday) and would be from around 5/6pm till 11pm latest\n\nIs there also a partition or something to segregate men and women for some part of the ceremony? Or another room for use only for an hour or two? \n\nPlease let me know about speakers and catering if possible\n\nPlease email me as I work in a therapy setting so unable to answer calls \nMany thanks,\nTamseela\nExpected Guests: 48\nCatering: outside catering	2025-08-19 21:52:23.238	2025-08-19 21:52:23.237
\.


--
-- Data for Name: community_groups; Type: TABLE DATA; Schema: public; Owner: wacc_user
--

COPY public.community_groups (id, title, description, active, age_group, category, contact_email, contact_name, contact_phone, created_at, display_order, facebook_url, featured, fees, image_url, instagram_url, language, meeting_day, meeting_time, member_count, name, updated_at, website_url) FROM stdin;
1	The Society of Afghan Resident	Welcome to Society of Afghan Residents\nProviding Help & Support Services To Afghan Refugees in UK Since 1982.\n\nThe Society of Afghan Residents aims to provide services to the Afghan and all other refugee communities in the United Kingdom. In particular, we seek to provide the community with information and guidance relating to housing, immigration, Welfare, Education, and Legal matters and also social, religious and cultural activities.\n\nWe also provide long term training for unemployed refugees, helping them to develop their skills to enable them to find work in the future and to this end we aim to further develop our Women’s Group, details of which are outlined above. With all our employment projects we seek to be able to issue recognised certificates to those who successfully attend the course.\n\nOpen 9.00 am – 5.00 pm Monday to Friday	t	\N	cultural	info@afghansociety.co.uk	\N	020 8993 8168	2025-08-13 18:18:07.486	0	\N	f	\N	\N	\N	\N	\N	\N	\N		2025-08-14 14:38:08.069	https://www.afghansociety.co.uk/
2	Al-farazdaq Arabic School	Al-Farazdaq School is an educational institution that was established in 1996. We provide Arabic and Islamic lessons for members of the community who have a passion for learning the Arabic language.\n\n\nThe school curriculum is designed for students from Reception to GCSE and we accept students from age 5.	t	\N	education	contact@alfarazdaq.co.uk	\N	\N	2025-08-13 18:18:07.486	0	\N	f	price on application	\N	\N	\N	Saturday	10:00	\N	\N	2025-08-14 20:43:55.342	https://alfarazdaq.co.uk/
\.


--
-- Data for Name: contact_info; Type: TABLE DATA; Schema: public; Owner: wacc_user
--

COPY public.contact_info (id, type, label, value, description, display_order, active) FROM stdin;
5	email	General Enquiries	info@westactoncentre.co.uk	For bookings, program information, and general questions	1	t
6	phone	Phone	020 8992 8899	Call during office hours for immediate assistance	2	t
7	email	Ealing Council	customers@ealing.gov.uk	For council-related enquiries and services	3	t
8	website	Website	www.westactoncentre.co.uk	Visit our main website for updates and information	4	t
\.


--
-- Data for Name: facilities; Type: TABLE DATA; Schema: public; Owner: wacc_user
--

COPY public.facilities (id, name, subtitle, description, capacity, dimensions, hourly_rate, features, image_url, active, created_at, updated_at) FROM stdin;
4	Small Room	15 Person Capacity • 4.26m × 6.20m	Intimate space ideal for small group classes, meetings, workshops, and community group gatherings.	15	4.26m × 6.20m	\N	["15 person capacity", "Perfect for workshops", "Small group meetings", "Regular class sessions", "Comfortable environment"]	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755111396111_ydbv6i_wacc-smallroom.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250813%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250813T185636Z&X-Amz-Expires=604800&X-Amz-Signature=d72da293a5ab79366e40352135f418b7863d8dc5eb7a293b8e3d6853ac515c44&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	t	2025-08-13 18:18:06.877	2025-08-13 20:39:46.506
3	Main Hall	120 Person Capacity • 9.81m × 12.64m	Spacious hall with outside paved area access, perfect for large events, parties, weddings, NHS courses, and community gatherings.	120	9.81m × 12.64m	\N	["120 person capacity", "Outside paved area access", "Kitchen facilities included", "10 large rectangular tables", "80 chairs included", "Professional cleaning included"]	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755156734737_v1cczy_671941bb78bf45036cc19508_Main_2520hall_526__1_.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250814%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250814T073214Z&X-Amz-Expires=604800&X-Amz-Signature=dfe72e5479206a2de35334f8c5addc3cffdd061c0526f7b68183c2ca9c7f907a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	t	2025-08-13 18:18:06.808	2025-08-14 07:32:16.702
\.


--
-- Data for Name: facility_gallery; Type: TABLE DATA; Schema: public; Owner: wacc_user
--

COPY public.facility_gallery (id, title, description, image_url, category, alt_text, display_order, active, featured, created_at, updated_at) FROM stdin;
1	Small Room	This is the small room	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755117118096_q7qj4g_wacc-smallroom.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250813%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250813T203158Z&X-Amz-Expires=604800&X-Amz-Signature=2e15eb7a2588ca313d588543459ce1da3a3829833b55747074dbe4023761f158&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	general	Small Room	0	t	f	2025-08-13 20:32:04.855	2025-08-13 20:32:04.855
\.


--
-- Data for Name: facility_services; Type: TABLE DATA; Schema: public; Owner: wacc_user
--

COPY public.facility_services (id, name, description, features, pricing_info, category, active) FROM stdin;
3	Kitchen Access	Full kitchen facilities with sink, power outlets for kettle, and small seating area. Outside catering welcome.	["Sink and counter space", "Power outlets for appliances", "Small seating area", "Refrigeration available", "No cooking allowed - catering friendly"]	\N	Additional Services	t
4	Tables & Chairs	Quality furniture included with hall rentals at no additional cost.	["10 large rectangular tables (Main Hall)", "80 chairs (Main Hall)", "Professional setup available", "Included in hire price"]	\N	Additional Services	t
\.


--
-- Data for Name: faq_items; Type: TABLE DATA; Schema: public; Owner: wacc_user
--

COPY public.faq_items (id, question, answer, category, image_url, display_order, active, created_at) FROM stdin;
5	How do I book a room at WACC?	You can book rooms through our website contact form. Please contact us for current pricing.	Booking	\N	1	t	2025-08-13 18:18:07.377
6	What are your opening hours?	The centre is open Monday to Sunday from 7:00 AM to 11:00 PM.	General	\N	2	t	2025-08-13 18:18:07.377
7	Do I need to book for Stay & Play sessions?	No booking required! Just come along on Monday, Wednesday, or Friday from 10:00-11:45 AM. Sessions cost £4 for members, £1 for siblings.	Programs	\N	3	t	2025-08-13 18:18:07.377
8	Is parking available?	Yes, we have onsite parking available for visitors and event attendees.	General	\N	4	t	2025-08-13 18:18:07.377
\.


--
-- Data for Name: media_library; Type: TABLE DATA; Schema: public; Owner: wacc_user
--

COPY public.media_library (id, filename, original_name, file_path, file_type, file_size, alt_text, caption, uploaded_at, height, optimized_path, optimized_size, thumbnail_path, thumbnail_size, width) FROM stdin;
1	uploads/1755109121422_cl1lqb_poster-fitness.jpeg	poster-fitness.jpeg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755109121422_cl1lqb_poster-fitness.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250813%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250813T181844Z&X-Amz-Expires=604800&X-Amz-Signature=ec9f393db135a8c033760d9a1afb003bf61a9041cdcd9b890a8f689a7dbc0ba5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	4595544	Image: poster-fitness.jpeg	\N	2025-08-13 18:18:44.568	\N	\N	\N	\N	\N	\N
2	uploads/1755109227330_2lbrzt_poster-fitness.jpeg	poster-fitness.jpeg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755109227330_2lbrzt_poster-fitness.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250813%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250813T182030Z&X-Amz-Expires=604800&X-Amz-Signature=9ba068050bd11e0d7c3f41a8738618596f5813737eaf340500c4d8fee131c7cb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	4595544	Image: poster-fitness.jpeg	\N	2025-08-13 18:20:30.838	\N	\N	\N	\N	\N	\N
3	uploads/1755110376378_h1j0cb_poster-fitness_Large.jpeg	poster-fitness Large.jpeg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755110376378_h1j0cb_poster-fitness_Large.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250813%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250813T183936Z&X-Amz-Expires=604800&X-Amz-Signature=80026693b40eb10bd45cbd942628a4292e1880e1a2b4717db369e98ceb7525fb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	292923	Image: poster-fitness Large.jpeg	\N	2025-08-13 18:39:36.786	\N	\N	\N	\N	\N	\N
4	uploads/1755111112105_c9v4jt_outside-1.jpeg	outside-1.jpeg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755111112105_c9v4jt_outside-1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250813%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250813T185152Z&X-Amz-Expires=604800&X-Amz-Signature=1ed631b2c64f7625a682bf33b3877b93986b6f1892dfbab14c7279dbbb379ce4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	4544103	Image: outside-1.jpeg	\N	2025-08-13 18:51:52.795	\N	\N	\N	\N	\N	\N
5	uploads/1755111141901_3c8ri3_outside-1.jpeg	outside-1.jpeg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755111141901_3c8ri3_outside-1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250813%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250813T185222Z&X-Amz-Expires=604800&X-Amz-Signature=ced8d4af8d73d113a47254230b9848d00924006413161aa6591fa2c4b3c7e85d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	4544103	Image: outside-1.jpeg	\N	2025-08-13 18:52:22.594	\N	\N	\N	\N	\N	\N
6	uploads/1755111396111_ydbv6i_wacc-smallroom.jpeg	wacc-smallroom.jpeg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755111396111_ydbv6i_wacc-smallroom.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250813%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250813T185636Z&X-Amz-Expires=604800&X-Amz-Signature=d72da293a5ab79366e40352135f418b7863d8dc5eb7a293b8e3d6853ac515c44&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	185405	Image: wacc-smallroom.jpeg	\N	2025-08-13 18:56:36.307	\N	\N	\N	\N	\N	\N
7	uploads/1755111433144_atrenu_WhatsApp_Image_2025-08-05_at_18.19.13.jpeg	WhatsApp Image 2025-08-05 at 18.19.13.jpeg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755111433144_atrenu_WhatsApp_Image_2025-08-05_at_18.19.13.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250813%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250813T185713Z&X-Amz-Expires=604800&X-Amz-Signature=432af079d2700032e3e4a6d7373bf18027d81b46d0b8aff8de2a7f1cb50e22d2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	313253	Image: WhatsApp Image 2025-08-05 at 18.19.13.jpeg	\N	2025-08-13 18:57:13.338	\N	\N	\N	\N	\N	\N
8	uploads/1755117118096_q7qj4g_wacc-smallroom.jpeg	wacc-smallroom.jpeg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755117118096_q7qj4g_wacc-smallroom.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250813%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250813T203158Z&X-Amz-Expires=604800&X-Amz-Signature=2e15eb7a2588ca313d588543459ce1da3a3829833b55747074dbe4023761f158&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	185405	Image: wacc-smallroom.jpeg	\N	2025-08-13 20:31:58.359	\N	\N	\N	\N	\N	\N
9	uploads/1755117767999_r29evi_WhatsApp_Image_2025-08-10_at_14.02.53.jpeg	WhatsApp Image 2025-08-10 at 14.02.53.jpeg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755117767999_r29evi_WhatsApp_Image_2025-08-10_at_14.02.53.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250813%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250813T204248Z&X-Amz-Expires=604800&X-Amz-Signature=622ef55f6bc1c4fd6a7739aecc8925ec0dd42d8e2b9b31b144d9cbf181a81bef&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	320646	Image: WhatsApp Image 2025-08-10 at 14.02.53.jpeg	\N	2025-08-13 20:42:48.587	\N	\N	\N	\N	\N	\N
10	uploads/1755155612523_mx1k9t_All_programmes_at_WACC.jpeg	All programmes at WACC.jpeg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755155612523_mx1k9t_All_programmes_at_WACC.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250814%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250814T071332Z&X-Amz-Expires=604800&X-Amz-Signature=383d4ead79d0ca7ee0b962788862e6ab75c8790683ec5275ac8e9af8a2338d57&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	85360	Image: All programmes at WACC.jpeg	\N	2025-08-14 07:13:32.841	\N	\N	\N	\N	\N	\N
11	uploads/1755155699707_6qot91_ealing_Judo_at_WACC.jpg	ealing Judo at WACC.jpg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755155699707_6qot91_ealing_Judo_at_WACC.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250814%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250814T071459Z&X-Amz-Expires=604800&X-Amz-Signature=0d4c15dd0a3b89a8939689e84f5071207e0ceedfdeadf3b474d8c94cae325191&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	70665	Image: ealing Judo at WACC.jpg	\N	2025-08-14 07:14:59.826	\N	\N	\N	\N	\N	\N
23	uploads/1755180507182_892ocl_warm_hub.jpg	warm hub.jpg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755180507182_892ocl_warm_hub.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250814%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250814T140827Z&X-Amz-Expires=604800&X-Amz-Signature=4389286d0efe836a83cf677c1ad67fc0f9198c22b1a5a77a3da2940cbfaed134&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	243811	Image: warm hub.jpg	\N	2025-08-14 14:08:27.402	\N	\N	\N	\N	\N	\N
12	uploads/1755155814330_rdec8w_203331331_10219844421756905_8832089163918582676_n.jpg	203331331_10219844421756905_8832089163918582676_n.jpg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755155814330_rdec8w_203331331_10219844421756905_8832089163918582676_n.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250814%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250814T071654Z&X-Amz-Expires=604800&X-Amz-Signature=f35ed83d916be41335e1ccd3021c6a72f669459c3529cf2066caaa3001f48af5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	88540	Image: 203331331_10219844421756905_8832089163918582676_n.jpg	\N	2025-08-14 07:16:54.453	\N	\N	\N	\N	\N	\N
13	uploads/1755156734737_v1cczy_671941bb78bf45036cc19508_Main_2520hall_526__1_.jpeg	671941bb78bf45036cc19508_Main%2520hall_526 (1).jpeg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755156734737_v1cczy_671941bb78bf45036cc19508_Main_2520hall_526__1_.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250814%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250814T073214Z&X-Amz-Expires=604800&X-Amz-Signature=dfe72e5479206a2de35334f8c5addc3cffdd061c0526f7b68183c2ca9c7f907a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	18967	Image: 671941bb78bf45036cc19508_Main%2520hall_526 (1).jpeg	\N	2025-08-14 07:32:14.981	\N	\N	\N	\N	\N	\N
14	uploads/1755157876078_zyyubw_entrance_Large.jpeg	entrance Large.jpeg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755157876078_zyyubw_entrance_Large.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250814%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250814T075116Z&X-Amz-Expires=604800&X-Amz-Signature=a05f85eaa8d360fe024b511e721ce974d41805fd98a40e9db8d296e007fbb7e5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	663385	Image: entrance Large.jpeg	\N	2025-08-14 07:51:16.72	\N	\N	\N	\N	\N	\N
15	uploads/1755158217138_arfdu8_WhatsApp_Image_2025-08-10_at_14.02.53__1_.jpeg	WhatsApp Image 2025-08-10 at 14.02.53 (1).jpeg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755158217138_arfdu8_WhatsApp_Image_2025-08-10_at_14.02.53__1_.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250814%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250814T075657Z&X-Amz-Expires=604800&X-Amz-Signature=773344827257b56e6b8a4280b9c88c08c9bb665c6f2a7ecb2d338a252eb07324&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	320646	Image: WhatsApp Image 2025-08-10 at 14.02.53 (1).jpeg	\N	2025-08-14 07:56:57.34	\N	\N	\N	\N	\N	\N
16	uploads/1755158443071_x3bb59_Pic_of_WACC_car_park.jpeg	Pic of WACC car park.jpeg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755158443071_x3bb59_Pic_of_WACC_car_park.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250814%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250814T080043Z&X-Amz-Expires=604800&X-Amz-Signature=056421bef499125f0031e43f792c4b0c700e4ce33c8e5c33dfd8a1889b95be1d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	15071	Image: Pic of WACC car park.jpeg	\N	2025-08-14 08:00:43.334	\N	\N	\N	\N	\N	\N
17	uploads/1755158767758_rwbxut_outside-1.jpeg	outside-1.jpeg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755158767758_rwbxut_outside-1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250814%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250814T080608Z&X-Amz-Expires=604800&X-Amz-Signature=98face6a6bc9915471812c5a1836fa042842d6ad5fd281b335c0251cc2735d53&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	4544103	Image: outside-1.jpeg	\N	2025-08-14 08:06:08.488	\N	\N	\N	\N	\N	\N
18	uploads/1755158800324_2nbvso_entrance_Large.jpeg	entrance Large.jpeg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755158800324_2nbvso_entrance_Large.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250814%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250814T080640Z&X-Amz-Expires=604800&X-Amz-Signature=0df0d1f4661692614113a4dca6702f314d284502e58a832cd2143a7d22e1fba1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	663385	Image: entrance Large.jpeg	\N	2025-08-14 08:06:40.485	\N	\N	\N	\N	\N	\N
19	uploads/1755159318454_d0tmlf_outside-1.jpeg	outside-1.jpeg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755159318454_d0tmlf_outside-1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250814%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250814T081519Z&X-Amz-Expires=604800&X-Amz-Signature=a1a7f1f0e4be1ec63394390bb7d6674fe89db227c5d50816cfba68626122b6cf&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	4544103	Image: outside-1.jpeg	\N	2025-08-14 08:15:19.136	\N	\N	\N	\N	\N	\N
20	uploads/1755159365430_id4lig_Pic_of_WACC_car_park.jpeg	Pic of WACC car park.jpeg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755159365430_id4lig_Pic_of_WACC_car_park.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250814%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250814T081605Z&X-Amz-Expires=604800&X-Amz-Signature=01186bf8cac7a24365b6e30ce6c98e787eb8e037f8867ded232dddfe8e011b8a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	15071	Image: Pic of WACC car park.jpeg	\N	2025-08-14 08:16:05.613	\N	\N	\N	\N	\N	\N
21	uploads/1755179443160_andg3h_picc_of_WACC_car_park.jpeg	picc of WACC car park.jpeg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755179443160_andg3h_picc_of_WACC_car_park.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250814%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250814T135043Z&X-Amz-Expires=604800&X-Amz-Signature=18507f013dcef759acbd2125dd7f60d26a1d596f5231a7f6f4dfb2526c9d3a95&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	89636	Image: picc of WACC car park.jpeg	\N	2025-08-14 13:50:43.409	\N	\N	\N	\N	\N	\N
22	uploads/1755180083787_zc5mt4_78c38f2e-f13c-4dc3-9414-56a3b6bca5c9.jpeg	78c38f2e-f13c-4dc3-9414-56a3b6bca5c9.jpeg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755180083787_zc5mt4_78c38f2e-f13c-4dc3-9414-56a3b6bca5c9.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250814%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250814T140123Z&X-Amz-Expires=604800&X-Amz-Signature=ce51cc5f82d0774f8c7836cf743c1b9d1c746b6427e2bdac3104e0f9c369275c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	60821	Image: 78c38f2e-f13c-4dc3-9414-56a3b6bca5c9.jpeg	\N	2025-08-14 14:01:23.982	\N	\N	\N	\N	\N	\N
24	uploads/1755181008618_md1smz_knit_and_chat.jpeg	knit and chat.jpeg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755181008618_md1smz_knit_and_chat.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250814%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250814T141648Z&X-Amz-Expires=604800&X-Amz-Signature=6f9728302be92f67a0c84b331da3f7b0460f7cb2db0c3beabf36fe16139c4a1d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	105546	Image: knit and chat.jpeg	\N	2025-08-14 14:16:48.778	\N	\N	\N	\N	\N	\N
25	uploads/1755181440931_0qycbp_express_yourself.jpeg	express yourself.jpeg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755181440931_0qycbp_express_yourself.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250814%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250814T142401Z&X-Amz-Expires=604800&X-Amz-Signature=6c8702e91b7176fe05ee409b89a248e146e1d8ff66a13f7ee27e8870a94527ff&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	165979	Image: express yourself.jpeg	\N	2025-08-14 14:24:01.149	\N	\N	\N	\N	\N	\N
26	uploads/1755181654084_t4gnfm_aylett.jpeg	aylett.jpeg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755181654084_t4gnfm_aylett.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250814%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250814T142734Z&X-Amz-Expires=604800&X-Amz-Signature=a1077a38923f397f99d13139023a7dcc773fc1752a76010bea519599f6404f83&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	84884	Image: aylett.jpeg	\N	2025-08-14 14:27:34.313	\N	\N	\N	\N	\N	\N
27	uploads/1755809374500_irozda_WhatsApp_Image_2025-08-10_at_14.05.27.jpeg	WhatsApp Image 2025-08-10 at 14.05.27.jpeg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755809374500_irozda_WhatsApp_Image_2025-08-10_at_14.05.27.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250821%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250821T204934Z&X-Amz-Expires=604800&X-Amz-Signature=06a0d86a058fbd394daea0cbc90970ff2454846e568bd44e8466009d21571ab4&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	185405	Image: WhatsApp Image 2025-08-10 at 14.05.27.jpeg	\N	2025-08-21 20:49:34.89	\N	\N	\N	\N	\N	\N
28	uploads/1755809535500_opsi9c_uploads_1755105782996_k1cz7t_outside-1.jpeg	uploads_1755105782996_k1cz7t_outside-1.jpeg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755809535500_opsi9c_uploads_1755105782996_k1cz7t_outside-1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250821%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250821T205216Z&X-Amz-Expires=604800&X-Amz-Signature=ea7945ec804829ced0c9bc3b744cf46d4158830c2eaa3c63ca35be21758dc3a2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	4544103	Image: uploads_1755105782996_k1cz7t_outside-1.jpeg	\N	2025-08-21 20:52:16.418	\N	\N	\N	\N	\N	\N
29	uploads/1755871443038_wcs4r5_Kumon.jpeg	Kumon.jpeg	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755871443038_wcs4r5_Kumon.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250822%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250822T140403Z&X-Amz-Expires=604800&X-Amz-Signature=cab284abda998b152e131ff90999665ad16b510d6c2521f2c38ace7eec0abc55&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image/jpeg	93783	Image: Kumon.jpeg	\N	2025-08-22 14:04:03.299	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: opening_hours; Type: TABLE DATA; Schema: public; Owner: wacc_user
--

COPY public.opening_hours (id, title, schedule, description, type, active) FROM stdin;
3	Centre Opening Hours	["Monday - Sunday: 7:00 AM - 11:00 PM"]	The centre is open 7 days a week for programs and events	centre	t
4	Office Hours	["Monday: 9:30 AM - 11:00 AM", "Wednesday - Friday: 10:00 AM - 2:30 PM"]	Best times to reach us by phone for immediate assistance	office	t
\.


--
-- Data for Name: program_schedules; Type: TABLE DATA; Schema: public; Owner: wacc_user
--

COPY public.program_schedules (id, program_id, day_of_week, start_time, end_time, description, active) FROM stdin;
18	8	Wednesday	17:00	19:00	Children (Ages 4-13): Wednesday: 5:00 PM - 7:00 PM	t
19	8	Sunday	10:00	11:30	Children (Ages 4-13): Sunday: 10:00 AM - 11:30 AM	t
20	8	Friday	18:30	20:30	Adults (Ages 14+): Friday: 6:30 PM - 8:30 PM	t
21	8	Sunday	11:30	14:00	Adults (Ages 14+): Sunday: 11:30 AM - 2:00 PM (Technical)	t
22	8	Sunday	13:30	15:00	Adults (Ages 14+): Sunday: 1:30 PM - 3:00 PM (Sparring)	t
27	12	Tuesday	10:00	11:00	Tuesday: 10:00 AM - 11:00 AM	t
28	12	Tuesday	18:15	19:15	Tuesday: 6:15 PM - 7:15 PM	t
35	7	Monday	10:00	11:45	Monday: 10:00 AM - 11:45 AM	t
36	7	Wednesday	10:00	11:45	Wednesday: 10:00 AM - 11:45 AM	t
37	7	Friday	10:00	11:45	Friday: 10:00 AM - 11:45 AM	t
38	11	\N	\N	\N	Contact for current schedule	t
41	15	Wednesday	10:00		Term time only 10 am to 12	t
42	16	Thursday	12:45		Term time only	t
44	9	Tuesday	19:30	21:00	Tuesday: 7:30 PM - 9:00 PM	t
45	17	Saturday	15:00		Contact Junko Aylett for schedule	t
46	10	Tuesday	15:00	18:00	Tuesday: 3:00 PM - 6:00 PM	t
47	10	Saturday	10:00	13:00	Saturday: 10:00 AM - 1:00 PM	t
\.


--
-- Data for Name: programs; Type: TABLE DATA; Schema: public; Owner: wacc_user
--

COPY public.programs (id, title, description, category, age_group, price, booking_info, instructor, contact_email, contact_phone, contact_website, image_url, active, created_at, updated_at) FROM stdin;
8	West Acton Taekwondo	Traditional martial arts training for children and adults, building discipline, fitness, and confidence.	martial-arts	Ages 4+	\N	\N	\N	\N	\N	\N	/img/poster-taekwondo.jpeg	t	2025-08-13 18:18:05.76	2025-08-13 18:18:05.76
12	Zumba with Anae	High-energy dance fitness classes combining fun choreography with great music.	fitness	Adults	\N	Book at anae-fitness.com	Anae	\N	\N	anae-fitness.com	/img/poster-zumba.jpeg	t	2025-08-13 18:18:06.628	2025-08-13 18:18:06.628
7	West Acton Stay & Play	Drop-in session run by professionals with toys, arts & crafts, painting, cars & tractors, and soft play in our spacious hall.	early-years	Young children & parents	Members £4.00 per session, siblings £1.00	No booking required - just come along!					https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755155814330_rdec8w_203331331_10219844421756905_8832089163918582676_n.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250814%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250814T071654Z&X-Amz-Expires=604800&X-Amz-Signature=f35ed83d916be41335e1ccd3021c6a72f669459c3529cf2066caaa3001f48af5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	t	2025-08-13 18:18:05.516	2025-08-14 07:16:57.193
11	Ealing Judo Club	Promotes fitness, confidence, friendship, and fun through judo training for all skill levels.	martial-arts	All ages				EalingJudoClub@hotmail.com		http://www.ealingjudoclub.com/	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755155699707_6qot91_ealing_Judo_at_WACC.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250814%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250814T071459Z&X-Amz-Expires=604800&X-Amz-Signature=0d4c15dd0a3b89a8939689e84f5071207e0ceedfdeadf3b474d8c94cae325191&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	t	2025-08-13 18:18:06.425	2025-08-14 07:17:45.72
16	Express Yourself		education	Adults	on application	book with teacher	Yumi Notley	expressyourselfyumi@gmail.com			https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755181440931_0qycbp_express_yourself.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250814%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250814T142401Z&X-Amz-Expires=604800&X-Amz-Signature=6c8702e91b7176fe05ee409b89a248e146e1d8ff66a13f7ee27e8870a94527ff&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	t	2025-08-14 14:24:04.134	2025-08-14 14:24:04.134
13	Pound Fitness	Pound fitness is a 45-minute group fitness class that combines cardio, strength training and Pilates with drumming to achieve a full-body workout. 	fitness	Adults	on application	Booking required	Yoko		07590 547377			t	2025-08-14 07:54:07.466	2025-08-14 13:59:45.513
14	Friendship Hub - 	The Hub is open to the local community and is a warm  place to relax and enjoy free light refreshments and the  company of others. Enjoy activities such as bingo,  dominoes, arts and crafts, health talks, music and more.\ndominoes, arts and crafts, health talks, music and more.\n\n12.15 Registration\n12.30 Warm up\n13.00 Activity\n13.20 Tea/coffee break\nTeas, coffee, cup-a-soups and fruits will be served.\n\nYou can bring your own packed lunch if you wish to.	fitness	Seniors (50+)	free	No booking required - just come along!	Carole Fox	carolefox@outlook.com	07909 601016		https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755180507182_892ocl_warm_hub.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250814%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250814T140827Z&X-Amz-Expires=604800&X-Amz-Signature=4389286d0efe836a83cf677c1ad67fc0f9198c22b1a5a77a3da2940cbfaed134&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	t	2025-08-14 14:08:30.594	2025-08-14 14:12:42.765
15	Knit & Chat		education	Adults	£5.00	No booking required - just come along!		carolefox@outlook.com			https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755181008618_md1smz_knit_and_chat.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250814%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250814T141648Z&X-Amz-Expires=604800&X-Amz-Signature=6f9728302be92f67a0c84b331da3f7b0460f7cb2db0c3beabf36fe16139c4a1d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	t	2025-08-14 14:16:52.143	2025-08-14 14:16:52.143
9	Fitness Exercise Club - Lau Gar Kung Fu	Traditional Shaolin-based martial art with structured training methods focusing on fitness and technique.	martial-arts	Adults				creece4308@gmail.com	7803-492616		/img/poster-kungfu.jpeg	t	2025-08-13 18:18:05.99	2025-08-17 10:21:21.985
17	GCSE Japanese classes	GCSE Japanese classes in person for boys and girls from 14 to 16 years old, a 2-hour session.	education	12 to 17 yr old			Junko Aylett		07879 482867	https://www.tsuruacademy.com/	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755181654084_t4gnfm_aylett.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250814%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250814T142734Z&X-Amz-Expires=604800&X-Amz-Signature=a1077a38923f397f99d13139023a7dcc773fc1752a76010bea519599f6404f83&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	t	2025-08-14 14:28:17.329	2025-08-17 11:30:10.75
10	Kumon Maths & English (and Kokugo - Japanese)	Educational support in English, Maths, and Japanese language with local tutor Teruko Mori.	education	Children & young people			Tomoko Egawa		07777 927516	https://www.kumon.co.uk/acton-west	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755871443038_wcs4r5_Kumon.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250822%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250822T140403Z&X-Amz-Expires=604800&X-Amz-Signature=cab284abda998b152e131ff90999665ad16b510d6c2521f2c38ace7eec0abc55&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	t	2025-08-13 18:18:06.187	2025-08-22 14:04:06.488
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: wacc_user
--

COPY public.sessions (id, session_token, user_id, expires) FROM stdin;
\.


--
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: wacc_user
--

COPY public.site_settings (id, key, value, type, description, updated_at) FROM stdin;
69	programs_hero_title	Programmes & Activities	text	📚 PROGRAMS - title	2025-08-14 07:55:31.338
7	hero_description	From Stay & Play sessions for young families to martial arts, fitness classes, and cultural groups — we're here to bring our community together and support wellbeing for all ages.	text	Description text displayed on the homepage hero section	2025-08-13 18:57:36.322
71	programs_hero_image	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755117767999_r29evi_WhatsApp_Image_2025-08-10_at_14.02.53.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250813%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250813T204248Z&X-Amz-Expires=604800&X-Amz-Signature=622ef55f6bc1c4fd6a7739aecc8925ec0dd42d8e2b9b31b144d9cbf181a81bef&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image	📚 PROGRAMS - image	2025-08-14 07:55:31.339
70	programs_hero_subtitle	15+ regular programmes every week for all ages and interests	text	📚 PROGRAMS - subtitle	2025-08-14 07:55:31.339
115	facilities_section_title	Modern Facilities for Every Occasion	text	🏠 HOME - Facilities Section Title	2025-08-22 16:05:11.936
17	social_facebook	https://www.facebook.com/WestActonCommunityCentre	text	🏠 HOME - Social Facebook	2025-08-22 16:05:11.934
1	site_title	West Acton Centre Community	text	🏠 HOME - Site Title	2025-08-22 16:05:11.93
98	location_button_2_text	Contact Us	text	🏠 HOME - Location Button 2 Text	2025-08-22 16:05:11.934
100	location_button_2_link	/contact	text	🏠 HOME - Location Button 2 Link	2025-08-22 16:05:11.934
42	hero_cta_button_text	EXPLORE OUR PROGRAMMES	text	🏠 HOME - Hero Cta Button Text	2025-08-22 16:05:11.933
102	programs_section_title	Featured Programmes This Week	text	🏠 HOME - Programs Section Title	2025-08-22 16:05:11.935
43	hero_cta_button_link	/programs	text	🏠 HOME - Hero Cta Button Link	2025-08-22 16:05:11.933
108	banner_programs_subtitle	Weekly activities for all ages and interests	text	🏠 HOME - Banner Programs Subtitle	2025-08-22 16:05:11.936
8	contact_phone	+44 20 1234 5678	text	🏠 HOME - Contact Phone	2025-08-22 16:05:11.933
105	programs_button_text	View All Programmes	text	🏠 HOME - Programs Button Text	2025-08-22 16:05:11.936
111	banner_facilities_subtitle	Flexible spaces for your events	text	🏠 HOME - Banner Facilities Subtitle	2025-08-22 16:05:11.936
112	community_section_pretitle	Community Impact	text	🏠 HOME - Community Section Pretitle	2025-08-22 16:05:11.936
116	facilities_section_heading	Our Available Spaces	text	🏠 HOME - Facilities Section Heading	2025-08-22 16:05:11.936
117	location_section_title	Convenient Location & Access	text	🏠 HOME - Location Section Title	2025-08-22 16:05:11.936
119	location_section_contact	Find us at Churchill Gardens, West Acton, London W3 0JN	text	🏠 HOME - Location Section Contact	2025-08-22 16:05:11.937
11	residents_served	3,000+	text	🏠 HOME - Residents Served	2025-08-22 16:05:11.933
113	community_section_title	Serving West Acton Together	text	🏠 HOME - Community Section Title	2025-08-22 16:05:11.936
114	community_section_description	West Acton Community Centre is dedicated to improving wellbeing through education, leisure, and recreational programmes. We work closely with local businesses and community members to create a vibrant, supportive community.	text	🏠 HOME - Community Section Description	2025-08-22 16:05:11.936
85	location_benefit_2_title	Bus Routes	text	🏠 HOME - Location Benefit 2 Title	2025-08-22 16:05:11.937
18	social_twitter		text	Twitter profile URL	2025-08-13 18:57:36.325
20	booking_enabled	true	boolean	Enable online booking functionality	2025-08-13 18:57:36.325
21	maintenance_mode	false	boolean	Enable maintenance mode for the site	2025-08-13 18:57:36.325
4	main_hall_capacity	120	text	🏢 FACILITIES - capacity	2025-08-13 20:01:21.321
88	location_benefit_2_desc	Served by bus 218 and other local routes for easy access from across London and surrounding areas	text	🏠 HOME - Location Benefit 2 Desc	2025-08-22 16:05:11.937
90	location_benefit_3_title	Private On-site Parking	text	🏠 HOME - Location Benefit 3 Title	2025-08-22 16:05:11.937
10	address	West Acton Community Centre, Churchill Gardens W3 0JN	text	🏠 HOME - Address	2025-08-22 16:05:11.933
3	weekly_programs	15	text	🏠 HOME - Weekly Programs	2025-08-22 16:05:11.933
2	community_residents	2000	text	🏠 HOME - Community Residents	2025-08-22 16:05:11.933
92	location_benefit_3_desc	Free private parking available for visitors and event attendees, with disabled access spaces	text	🏠 HOME - Location Benefit 3 Desc	2025-08-22 16:05:11.933
94	location_button_1_text	Get Directions	text	🏠 HOME - Location Button 1 Text	2025-08-22 16:05:11.934
16	opening_hours_details	Monday to Sunday, 7am-11pm	text	🏠 HOME - Opening Hours Details	2025-08-22 16:05:11.934
96	location_button_1_link	https://maps.google.com/?q=Churchill+Gardens+West+Acton+London+W3+0PG	text	🏠 HOME - Location Button 1 Link	2025-08-22 16:05:11.934
118	location_section_description	Located in Churchill Gardens, West Acton, we're easily accessible by public transport and offer onsite parking. Our central location makes us the perfect hub for West London community activities.	text	🏠 HOME - Location Section Description	2025-08-22 16:05:11.937
121	location_section_image	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755158443071_x3bb59_Pic_of_WACC_car_park.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250814%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250814T080043Z&X-Amz-Expires=604800&X-Amz-Signature=056421bef499125f0031e43f792c4b0c700e4ce33c8e5c33dfd8a1889b95be1d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image	🏠 HOME - Location Section Image	2025-08-22 16:05:11.937
41	hero_background_image	https://bucket-wacc1.f47d23c072e7b2f871ecca11e36e0b25.r2.cloudflarestorage.com/uploads/1755809535500_opsi9c_uploads_1755105782996_k1cz7t_outside-1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=1b6772892999957d50aede7703a8627e%2F20250821%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250821T205216Z&X-Amz-Expires=604800&X-Amz-Signature=ea7945ec804829ced0c9bc3b744cf46d4158830c2eaa3c63ca35be21758dc3a2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject	image	🏠 HOME - Hero Background Image	2025-08-22 16:05:11.932
120	location_section_heading	Getting Here	text	🏠 HOME - Location Section Heading	2025-08-22 16:05:11.937
122	location_benefit_1_title	West Acton Station	text	🏠 HOME - Location Benefit 1 Title	2025-08-22 16:05:11.937
5	site_description	A vibrant community centre serving West Acton and surrounding areas	text	🏠 HOME - Site Description	2025-08-22 16:05:11.932
14	hero_subtitle	Your local hub for education, leisure, and recreational programs. We serve over 2,000 residents in West Acton with 15+ regular programs every week.	text	🏠 HOME - Hero Subtitle	2025-08-22 16:05:11.933
9	contact_email	info@westactoncc.org.uk	text	🏠 HOME - Contact Email	2025-08-22 16:05:11.933
15	opening_hours_text	7 days	text	🏠 HOME - Opening Hours Text	2025-08-22 16:05:11.934
19	social_instagram		text	🏠 HOME - Social Instagram	2025-08-22 16:05:11.934
107	banner_programs_title	REGULAR PROGRAMMES	text	🏠 HOME - Banner Programs Title	2025-08-22 16:05:11.935
109	banner_programs_image	/img/poster-stayandplay.jpeg	image	🏠 HOME - Banner Programs Image	2025-08-22 16:05:11.936
110	banner_facilities_title	ROOM HIRE	text	🏠 HOME - Banner Facilities Title	2025-08-22 16:05:11.936
123	location_benefit_1_desc	Just minutes from West Acton Underground station on the Central line, providing direct access to Central London	text	🏠 HOME - Location Benefit 1 Desc	2025-08-22 16:05:11.937
\.


--
-- Data for Name: testimonials; Type: TABLE DATA; Schema: public; Owner: wacc_user
--

COPY public.testimonials (id, quote, author_name, author_title, avatar_url, active, display_order, created_at) FROM stdin;
4	WACC has been such a blessing for our family. The Stay & Play sessions give our toddler a chance to socialize while I connect with other parents in the community.	Sarah Johnson	Parent, West Acton resident	/img/user-1.png	t	1	2025-08-13 18:18:07.263
5	I've been attending Taekwondo classes here for 3 years. The instructors are excellent and the community spirit is amazing. It's not just exercise - it's a second home.	David Chen	Taekwondo student	/img/user-1.png	t	2	2025-08-13 18:18:07.263
6	We recently held our community fundraiser here and the staff were incredibly helpful. The Main Hall was perfect for our event and the kitchen facilities made catering so much easier.	Amira Hassan	Community organizer	/img/user-1.png	t	3	2025-08-13 18:18:07.263
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: wacc_user
--

COPY public.users (id, name, email, email_verified, image, password, role, active, created_at, updated_at) FROM stdin;
cmeabrmhm0000lplz6niw6796	Test Admin	test@admin.com	\N	\N	$2b$12$9e84Kt9ePue/W6n7SPrgCuC6OaXFQZBkfn9ZO.yg6FNUlnfWqDc9m	admin	t	2025-08-13 18:49:49.21	2025-08-13 18:49:49.21
cmeabtkv90000lp3hi13p14j2	WACC Admin	admin@westactoncentre.co.uk	\N	\N	$2b$12$g3FPMeakjYv60.1UJaxmSezDhsTtzmyKiC40twiN.ATbcRM4OfuOu	admin	t	2025-08-13 18:51:20.421	2025-08-13 18:51:20.421
\.


--
-- Data for Name: verificationtokens; Type: TABLE DATA; Schema: public; Owner: wacc_user
--

COPY public.verificationtokens (identifier, token, expires) FROM stdin;
\.


--
-- Name: booking_availability_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wacc_user
--

SELECT pg_catalog.setval('public.booking_availability_id_seq', 1, false);


--
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wacc_user
--

SELECT pg_catalog.setval('public.bookings_id_seq', 6, true);


--
-- Name: community_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wacc_user
--

SELECT pg_catalog.setval('public.community_groups_id_seq', 2, true);


--
-- Name: contact_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wacc_user
--

SELECT pg_catalog.setval('public.contact_info_id_seq', 8, true);


--
-- Name: facilities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wacc_user
--

SELECT pg_catalog.setval('public.facilities_id_seq', 4, true);


--
-- Name: facility_gallery_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wacc_user
--

SELECT pg_catalog.setval('public.facility_gallery_id_seq', 1, true);


--
-- Name: facility_services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wacc_user
--

SELECT pg_catalog.setval('public.facility_services_id_seq', 4, true);


--
-- Name: faq_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wacc_user
--

SELECT pg_catalog.setval('public.faq_items_id_seq', 8, true);


--
-- Name: media_library_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wacc_user
--

SELECT pg_catalog.setval('public.media_library_id_seq', 29, true);


--
-- Name: opening_hours_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wacc_user
--

SELECT pg_catalog.setval('public.opening_hours_id_seq', 4, true);


--
-- Name: program_schedules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wacc_user
--

SELECT pg_catalog.setval('public.program_schedules_id_seq', 47, true);


--
-- Name: programs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wacc_user
--

SELECT pg_catalog.setval('public.programs_id_seq', 17, true);


--
-- Name: site_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wacc_user
--

SELECT pg_catalog.setval('public.site_settings_id_seq', 1674, true);


--
-- Name: testimonials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wacc_user
--

SELECT pg_catalog.setval('public.testimonials_id_seq', 6, true);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: booking_availability booking_availability_pkey; Type: CONSTRAINT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.booking_availability
    ADD CONSTRAINT booking_availability_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: community_groups community_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.community_groups
    ADD CONSTRAINT community_groups_pkey PRIMARY KEY (id);


--
-- Name: contact_info contact_info_pkey; Type: CONSTRAINT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.contact_info
    ADD CONSTRAINT contact_info_pkey PRIMARY KEY (id);


--
-- Name: facilities facilities_pkey; Type: CONSTRAINT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.facilities
    ADD CONSTRAINT facilities_pkey PRIMARY KEY (id);


--
-- Name: facility_gallery facility_gallery_pkey; Type: CONSTRAINT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.facility_gallery
    ADD CONSTRAINT facility_gallery_pkey PRIMARY KEY (id);


--
-- Name: facility_services facility_services_pkey; Type: CONSTRAINT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.facility_services
    ADD CONSTRAINT facility_services_pkey PRIMARY KEY (id);


--
-- Name: faq_items faq_items_pkey; Type: CONSTRAINT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.faq_items
    ADD CONSTRAINT faq_items_pkey PRIMARY KEY (id);


--
-- Name: media_library media_library_pkey; Type: CONSTRAINT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.media_library
    ADD CONSTRAINT media_library_pkey PRIMARY KEY (id);


--
-- Name: opening_hours opening_hours_pkey; Type: CONSTRAINT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.opening_hours
    ADD CONSTRAINT opening_hours_pkey PRIMARY KEY (id);


--
-- Name: program_schedules program_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.program_schedules
    ADD CONSTRAINT program_schedules_pkey PRIMARY KEY (id);


--
-- Name: programs programs_pkey; Type: CONSTRAINT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- Name: testimonials testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: accounts_provider_provider_account_id_key; Type: INDEX; Schema: public; Owner: wacc_user
--

CREATE UNIQUE INDEX accounts_provider_provider_account_id_key ON public.accounts USING btree (provider, provider_account_id);


--
-- Name: booking_availability_facility_id_day_of_week_key; Type: INDEX; Schema: public; Owner: wacc_user
--

CREATE UNIQUE INDEX booking_availability_facility_id_day_of_week_key ON public.booking_availability USING btree (facility_id, day_of_week);


--
-- Name: sessions_session_token_key; Type: INDEX; Schema: public; Owner: wacc_user
--

CREATE UNIQUE INDEX sessions_session_token_key ON public.sessions USING btree (session_token);


--
-- Name: site_settings_key_key; Type: INDEX; Schema: public; Owner: wacc_user
--

CREATE UNIQUE INDEX site_settings_key_key ON public.site_settings USING btree (key);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: wacc_user
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: verificationtokens_identifier_token_key; Type: INDEX; Schema: public; Owner: wacc_user
--

CREATE UNIQUE INDEX verificationtokens_identifier_token_key ON public.verificationtokens USING btree (identifier, token);


--
-- Name: accounts accounts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: booking_availability booking_availability_facility_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.booking_availability
    ADD CONSTRAINT booking_availability_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.facilities(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: bookings bookings_facility_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.facilities(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: program_schedules program_schedules_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.program_schedules
    ADD CONSTRAINT program_schedules_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.programs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wacc_user
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

