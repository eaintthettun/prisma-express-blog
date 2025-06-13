--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

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
-- Name: BookMark; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BookMark" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" integer NOT NULL,
    "postId" integer NOT NULL
);


ALTER TABLE public."BookMark" OWNER TO postgres;

--
-- Name: BookMark_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."BookMark_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."BookMark_id_seq" OWNER TO postgres;

--
-- Name: BookMark_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."BookMark_id_seq" OWNED BY public."BookMark".id;


--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id integer NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    slug text,
    "updatedAt" timestamp(3) without time zone
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Category_id_seq" OWNER TO postgres;

--
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;


--
-- Name: Comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Comment" (
    id integer NOT NULL,
    content text NOT NULL,
    "postId" integer NOT NULL,
    "authorId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    parent_id integer
);


ALTER TABLE public."Comment" OWNER TO postgres;

--
-- Name: CommentLike; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CommentLike" (
    id integer NOT NULL,
    "commentId" integer NOT NULL,
    "authorId" integer NOT NULL
);


ALTER TABLE public."CommentLike" OWNER TO postgres;

--
-- Name: CommentLike_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CommentLike_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CommentLike_id_seq" OWNER TO postgres;

--
-- Name: CommentLike_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CommentLike_id_seq" OWNED BY public."CommentLike".id;


--
-- Name: Comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Comment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Comment_id_seq" OWNER TO postgres;

--
-- Name: Comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Comment_id_seq" OWNED BY public."Comment".id;


--
-- Name: Like; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Like" (
    id integer NOT NULL,
    "authorId" integer NOT NULL,
    "postId" integer NOT NULL
);


ALTER TABLE public."Like" OWNER TO postgres;

--
-- Name: Like_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Like_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Like_id_seq" OWNER TO postgres;

--
-- Name: Like_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Like_id_seq" OWNED BY public."Like".id;


--
-- Name: Post; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Post" (
    id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "authorId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "categoryId" integer,
    featured boolean DEFAULT false NOT NULL,
    "imageUrl" text,
    subtitle text,
    "readTime" text,
    "topicId" integer
);


ALTER TABLE public."Post" OWNER TO postgres;

--
-- Name: Post_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Post_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Post_id_seq" OWNER TO postgres;

--
-- Name: Post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Post_id_seq" OWNED BY public."Post".id;


--
-- Name: Topic; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Topic" (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "categoryId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Topic" OWNER TO postgres;

--
-- Name: TopicFollow; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TopicFollow" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "topicId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "categoryId" integer
);


ALTER TABLE public."TopicFollow" OWNER TO postgres;

--
-- Name: TopicFollow_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."TopicFollow_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TopicFollow_id_seq" OWNER TO postgres;

--
-- Name: TopicFollow_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."TopicFollow_id_seq" OWNED BY public."TopicFollow".id;


--
-- Name: Topic_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Topic_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Topic_id_seq" OWNER TO postgres;

--
-- Name: Topic_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Topic_id_seq" OWNED BY public."Topic".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    bio text,
    "githubUrl" text,
    "linkedinUrl" text,
    "profilePictureUrl" text,
    title text,
    "twitterUrl" text,
    "categoryId" integer,
    "topicId" integer
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: UserFollow; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserFollow" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "followerId" integer NOT NULL,
    "followingId" integer NOT NULL
);


ALTER TABLE public."UserFollow" OWNER TO postgres;

--
-- Name: UserFollow_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."UserFollow_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserFollow_id_seq" OWNER TO postgres;

--
-- Name: UserFollow_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."UserFollow_id_seq" OWNED BY public."UserFollow".id;


--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: BookMark id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BookMark" ALTER COLUMN id SET DEFAULT nextval('public."BookMark_id_seq"'::regclass);


--
-- Name: Category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);


--
-- Name: Comment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment" ALTER COLUMN id SET DEFAULT nextval('public."Comment_id_seq"'::regclass);


--
-- Name: CommentLike id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CommentLike" ALTER COLUMN id SET DEFAULT nextval('public."CommentLike_id_seq"'::regclass);


--
-- Name: Like id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Like" ALTER COLUMN id SET DEFAULT nextval('public."Like_id_seq"'::regclass);


--
-- Name: Post id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Post" ALTER COLUMN id SET DEFAULT nextval('public."Post_id_seq"'::regclass);


--
-- Name: Topic id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Topic" ALTER COLUMN id SET DEFAULT nextval('public."Topic_id_seq"'::regclass);


--
-- Name: TopicFollow id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TopicFollow" ALTER COLUMN id SET DEFAULT nextval('public."TopicFollow_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: UserFollow id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserFollow" ALTER COLUMN id SET DEFAULT nextval('public."UserFollow_id_seq"'::regclass);


--
-- Data for Name: BookMark; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BookMark" (id, "createdAt", "userId", "postId") FROM stdin;
1	2025-05-27 11:54:36.672	15	36
3	2025-05-27 12:15:39.842	14	36
4	2025-05-27 12:15:42.311	14	35
5	2025-06-06 06:35:34.856	14	37
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, name, "createdAt", slug, "updatedAt") FROM stdin;
26	Business	2025-06-13 03:47:59.777	business	2025-06-13 03:47:59.777
27	Technology	2025-06-13 03:47:59.788	technology	2025-06-13 03:47:59.788
28	Self Improvement	2025-06-13 03:47:59.79	self-improvement	2025-06-13 03:47:59.79
29	Writing	2025-06-13 03:47:59.793	writing	2025-06-13 03:47:59.793
30	Finance	2025-06-13 03:47:59.795	finance	2025-06-13 03:47:59.795
31	Design	2025-06-13 03:47:59.798	design	2025-06-13 03:47:59.798
32	Education	2025-06-13 03:47:59.8	education	2025-06-13 03:47:59.8
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Comment" (id, content, "postId", "authorId", "createdAt", parent_id) FROM stdin;
1	Yes you are correct!	30	14	2025-05-15 10:34:37.751	\N
2	I will definitely follow this routine!	30	14	2025-05-15 10:35:40.427	\N
3	I see!	11	14	2025-05-15 11:11:55.705	\N
4	Yes of course!	11	14	2025-05-15 11:12:04.187	\N
5	I love cat paws	33	15	2025-05-19 14:28:30.78	\N
6	very inspiring post	36	14	2025-05-29 02:58:02.447	\N
\.


--
-- Data for Name: CommentLike; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CommentLike" (id, "commentId", "authorId") FROM stdin;
11	5	15
12	5	14
13	2	16
16	6	14
\.


--
-- Data for Name: Like; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Like" (id, "authorId", "postId") FROM stdin;
3	14	30
9	14	33
10	15	33
12	16	33
13	15	29
14	16	32
16	15	35
17	14	32
29	15	36
37	14	36
39	17	36
40	14	37
\.


--
-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Post" (id, title, content, "authorId", "createdAt", "categoryId", featured, "imageUrl", subtitle, "readTime", "topicId") FROM stdin;
12	Beatus at verbera pecus vestrum magnam villa accusamus aegre.	Vigilo culpo tot studio cilicium veritas ulciscor animus. Vomer toties comptus. Cohors crastinus subseco consectetur acceptus perferendis cunae totus unus cribro.	4	2025-05-13 15:44:16.099	26	t	\N	\N	\N	1
10	Terebro iure celer ocer mollitia rem virgo.	Abduco reprehenderit titulus crustulum considero trans acquiro autem solium. Certe sonitus adnuo arcus testimonium spes aperte vigilo ars cribro. Administratio aestivus tergo fugiat id decimus cultellus cinis.	4	2025-05-13 15:44:16.099	27	t	\N	\N	\N	6
11	Odit turba curvo valens.	This is a nice weather	4	2025-05-13 15:44:16.099	26	f	\N	\N	\N	2
24	Bardus campana vomito consuasor provident eius.	Vereor atqui desino vinco approbo cinis nobis auxilium perspiciatis. Facere stips beatus adicio vetus pecco depereo vespillo. Curis iusto video caterva volup.	4	2025-05-13 15:44:16.099	27	f	\N	\N	\N	7
25	Cattus auctor sulum deleo vigilo blandior creptio solum.	Creo cornu cimentarius arbustum cunabula. Deprecator cubitum usus aufero velociter esse tremo titulus tergeo. Verbera degusto deficio benevolentia debeo derideo.	4	2025-05-13 15:44:16.099	28	f	\N	\N	\N	10
26	Quis vesica triumphus bardus carmen ubi deprimo.	Celo officiis desino conservo. Ratione voro contigo vesica decretum cornu bellicus. Subito contego patruus cumque.	4	2025-05-13 15:44:16.099	29	f	\N	\N	\N	16
29	How I learn Node js	Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, porro iusto in recusandae corporis praesentium eveniet nemo quo perferendis perspiciatis!\r\nLorem ipsum dolor sit amet consectetur adipisicing elit. Quas, porro iusto in recusandae corporis praesentium eveniet nemo quo perferendis perspiciatis!	14	2025-05-14 06:45:29.949	30	f	\N	\N	\N	21
28	Earthquake in Myanmar	Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, porro iusto in recusandae corporis praesentium eveniet nemo quo perferendis perspiciatis!\r\nLorem ipsum dolor sit amet consectetur adipisicing elit. Quas, porro iusto in recusandae corporis praesentium eveniet nemo quo perferendis perspiciatis!\r\n\r\nLorem ipsum dolor sit amet consectetur adipisicing elit. Quas, porro iusto in recusandae corporis praesentium eveniet nemo quo perferendis perspiciatis!\r\nLorem ipsum dolor sit amet consectetur adipisicing elit. Quas, porro iusto in recusandae corporis praesentium eveniet nemo quo perferendis perspiciatis!	14	2025-05-13 15:49:27.937	28	f	\N	\N	\N	12
33	Cat paws	Cat paws, especially those of kittens, are often seen as cute due to their small size, soft pads, and the way they help a cat navigate the world. These "toe beans" are more than just cute; they protect the bones and joints, aid in balance, and act as shock absorbers, allowing cats to move silently. 	14	2025-05-19 14:02:50.229	31	f	\N	\N	3 mins	26
32	Small Business Ideas for Startup Companies	      1.Online Store\r\n\r\n2.Freelance Services \r\n\r\n3.Social Media Marketing Agency\r\n\r\n4.Mobile App Development\r\n\r\n5.Digital Product Sales\r\n\r\n6.Home-based Food Business\r\n\r\n7.Dropshipping Business\r\n\r\n8.Cleaning or Maintenance Services\r\n    \r\n    	15	2025-05-15 11:22:30.968	32	f	\N	\N	3 mins	31
36	How I Became Unemployable as a Software Engineer & What I Learned	I’ll always remember when I became unemployable as a developer.\r\n\r\nLife had happened, and I hadn’t had the time to code lately. That didn’t seem like a big deal, since I had been coding professionally since 2004.\r\n\r\nAt the time, I was working 45–50 hours a week at my full-time physical therapy job on top of 5+ hours every weekend as an Airbnb SuperHost.\r\n\r\nIronically, it’s Airbnb that got me so excited about coding again; their user experience was amazing, whether I was on web or the Android app.\r\n\r\nSo, in 2019, when I felt like I’d accomplished everything I’d ever wanted to in my sports medicine career, I learned about React 16.8 with Hooks.\r\n\r\nThis seemed like a much better way to build dynamic apps than what had been around before: ASP, PHP, WordPress, Drupal, jQuery, Angular, etc.\r\n\r\nWithin a few months, I was a React expert with 50 articles published on my blog, and that had even landed me a remote job as a developer!	17	2025-05-24 08:23:47.855	27	t	https://miro.medium.com/v2/resize:fit:720/format:webp/1*PKJAGKwYBWgj8EpmIoKhOQ.jpeg	Being a developer is a creative, highly-paid profession that can even be fun, but it’s also still a job. Here’s what you need to know.	5 mins	6
30	How to do a fasting diet	Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, porro iusto in recusandae corporis praesentium eveniet nemo quo perferendis perspiciatis!\r\nLorem ipsum dolor sit amet consectetur adipisicing elit. Quas, porro iusto in recusandae corporis praesentium eveniet nemo quo perferendis perspiciatis!	14	2025-05-14 06:51:06.277	28	t	\N	\N	3 mins	14
38	10 Tiny Habits That Make You Healthier, Calmer, and Harder to Kill	What if your longevity wasn’t about breakthroughs or biohacks but tiny, repeatable choices?\r\n\r\nAs a physician and a competitive bodybuilder in my 60s, folks constantly ask me for secrets.\r\n\r\nThe truth is, most of what works isn’t secret — we just ignore it.\r\n\r\nHere are 10 tiny habits I use to protect my brain, body, and peace.\r\n\r\nThey include simple tweaks to how I eat, move, connect, and recover — none flashy, but all-powerful.\r\n\r\nNone are flashy, but all are powerful.\r\n\r\nThey’re free, science-backed, and surprisingly doable.\r\n\r\n1. Get Sunlight Before Screens\r\nWhen: Within 30 minutes of waking\r\n\r\nYour circadian rhythm doesn’t start with caffeine. It starts with light.\r\n\r\n	14	2025-06-12 04:06:47.637	28	f	https://miro.medium.com/v2/resize:fit:720/format:webp/1*tzjoFo3RfZ0Bv_BJUO0uCA.png	Here are 10 tiny habits I use to protect my brain, body, and peace.	10 mins	13
37	The ChatGPT Hack Top 1% Developers Use to Write Code 10x Faster	You’re doing it wrong. That “write a function to…” prompt you just sent to ChatGPT? Delete it. Those generic prompts are why you’re still coding at the same speed as everyone else.\r\n\r\nAfter spending 3,000+ hours pair programming with AI, I discovered what actually works — and it’s not what you think.\r\n\r\nHere’s the raw truth: 85% of developers are stuck in an AI-powered copy-paste loop. They’re just outsourcing Stack Overflow to ChatGPT.\r\n\r\nBut the top 1%? They’re having entire architectural discussions with AI, building complex systems in hours instead of weeks.\r\n\r\nLet me show you how.\r\n\r\nThe Fundamentals\r\nStart with Specificity, Not Vagueness\r\nFirst, stop with the vague prompts. “How do I fix this bug?” gets you nowhere. Here’s your new approach:\r\n\r\nStart with this: Describe the exact problem in detail.\r\n\r\nThe more specific you are, the more targeted and useful ChatGPT’s response will be. Here’s how you do it:\r\n\r\nProvide context: Where’s the bug occurring? In a specific function, or on an entire project?	17	2025-05-30 15:11:57.001	27	f	https://miro.medium.com/v2/resize:fit:720/format:webp/0*PNit5W5SKMrUBovN	Here’s the Framework Nobody Shares	\N	10
35	How to Speed Up Your Reading Skill	In an age overflowing with information, the ability to read efficiently is more valuable than ever. Many people find themselves reading at a pace that limits their ability to absorb all the content they need, whether for work, study, or leisure. Speed reading isn't about rushing through text without comprehension; rather, it's about optimizing your eye movements, minimizing common reading habits that slow you down, and actively engaging with the material to improve both pace and understanding. By adopting specific techniques and consistently practicing them, you can significantly enhance your reading rate and unlock greater productivity and knowledge acquisition.\r\n\r\nOne of the foundational steps to accelerating your reading involves breaking free from habits like subvocalization (mouthing or "hearing" words as you read) and regressing (re-reading words or sentences). Subvocalization limits your reading speed to your speaking speed, which is much slower than your brain's processing capacity. Techniques such as using a pointer (like your finger or a pen) to guide your eyes across the page can help prevent regression by training your eyes to move forward smoothly. Additionally, practicing chunking, where you read groups of words rather than individual words, allows your brain to process information in larger, more meaningful units, boosting both speed and comprehension.\r\n\r\nBeyond basic mechanics, improving reading speed also hinges on active engagement and practice. Before diving into a text, previewing the material by scanning headings, subheadings, and summaries can prime your brain for the content, making it easier to process. Regular practice with diverse materials, from articles to books, is crucial for building stamina and refining your techniques. Consider using speed reading apps or exercises that gradually push your pace while monitoring comprehension. With dedication and consistent application of these methods, you'll not only read faster but also develop a more dynamic and effective approach to consuming information.	14	2025-05-24 04:38:15.373	32	f	https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVhZGluZyUyMGJvb2t8ZW58MHx8MHx8fDA%3D	Follow These Tips and Master Your Reading Skill	2 mins	31
\.


--
-- Data for Name: Topic; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Topic" (id, name, slug, "categoryId", "createdAt", "updatedAt") FROM stdin;
1	Entrepreneurship	entrepreneurship	26	2025-06-13 03:47:59.777	2025-06-13 03:47:59.777
2	Freelancing	freelancing	26	2025-06-13 03:47:59.777	2025-06-13 03:47:59.777
3	Small Business	small-business	26	2025-06-13 03:47:59.777	2025-06-13 03:47:59.777
4	Startups	startups	26	2025-06-13 03:47:59.777	2025-06-13 03:47:59.777
5	Venture Capital	venture-capital	26	2025-06-13 03:47:59.777	2025-06-13 03:47:59.777
6	Artificial Intelligence	artificial-intelligence	27	2025-06-13 03:47:59.788	2025-06-13 03:47:59.788
7	Programming	programming	27	2025-06-13 03:47:59.788	2025-06-13 03:47:59.788
8	Data Science	data-science	27	2025-06-13 03:47:59.788	2025-06-13 03:47:59.788
9	Cybersecurity	cybersecurity	27	2025-06-13 03:47:59.788	2025-06-13 03:47:59.788
10	Gadgets	gadgets	27	2025-06-13 03:47:59.788	2025-06-13 03:47:59.788
11	Productivity	productivity	28	2025-06-13 03:47:59.79	2025-06-13 03:47:59.79
12	Mindfulness	mindfulness	28	2025-06-13 03:47:59.79	2025-06-13 03:47:59.79
13	Motivation	motivation	28	2025-06-13 03:47:59.79	2025-06-13 03:47:59.79
14	Habits	habits	28	2025-06-13 03:47:59.79	2025-06-13 03:47:59.79
15	Time Management	time-management	28	2025-06-13 03:47:59.79	2025-06-13 03:47:59.79
16	Blogging	blogging	29	2025-06-13 03:47:59.793	2025-06-13 03:47:59.793
17	Creative Writing	creative-writing	29	2025-06-13 03:47:59.793	2025-06-13 03:47:59.793
18	Poetry	poetry	29	2025-06-13 03:47:59.793	2025-06-13 03:47:59.793
19	Screenwriting	screenwriting	29	2025-06-13 03:47:59.793	2025-06-13 03:47:59.793
20	Journalism	journalism	29	2025-06-13 03:47:59.793	2025-06-13 03:47:59.793
21	Personal Finance	personal-finance	30	2025-06-13 03:47:59.795	2025-06-13 03:47:59.795
22	Investing	investing	30	2025-06-13 03:47:59.795	2025-06-13 03:47:59.795
23	Crypto	crypto	30	2025-06-13 03:47:59.795	2025-06-13 03:47:59.795
24	Financial Planning	financial-planning	30	2025-06-13 03:47:59.795	2025-06-13 03:47:59.795
25	Stock Market	stock-market	30	2025-06-13 03:47:59.795	2025-06-13 03:47:59.795
26	UI/UX	uiux	31	2025-06-13 03:47:59.798	2025-06-13 03:47:59.798
27	Graphic Design	graphic-design	31	2025-06-13 03:47:59.798	2025-06-13 03:47:59.798
28	Web Design	web-design	31	2025-06-13 03:47:59.798	2025-06-13 03:47:59.798
29	Typography	typography	31	2025-06-13 03:47:59.798	2025-06-13 03:47:59.798
30	Branding	branding	31	2025-06-13 03:47:59.798	2025-06-13 03:47:59.798
31	Online Learning	online-learning	32	2025-06-13 03:47:59.8	2025-06-13 03:47:59.8
32	Study Tips	study-tips	32	2025-06-13 03:47:59.8	2025-06-13 03:47:59.8
33	Teaching	teaching	32	2025-06-13 03:47:59.8	2025-06-13 03:47:59.8
34	EdTech	edtech	32	2025-06-13 03:47:59.8	2025-06-13 03:47:59.8
35	Learning Languages	learning-languages	32	2025-06-13 03:47:59.8	2025-06-13 03:47:59.8
\.


--
-- Data for Name: TopicFollow; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TopicFollow" (id, "userId", "topicId", "createdAt", "categoryId") FROM stdin;
1	14	6	2025-06-13 09:46:13.229	\N
6	15	26	2025-06-13 15:08:04.429	\N
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, password, name, bio, "githubUrl", "linkedinUrl", "profilePictureUrl", title, "twitterUrl", "categoryId", "topicId") FROM stdin;
4	Elwyn_Miller85@hotmail.com	$2b$10$u1iD4KDR8GHSJIFR/wqUOuM9UKmU7HilGNpt04YKaGtWEokndR6Z2	Anita Schneider-Gottlieb	\N	\N	\N	\N	\N	\N	\N	\N
5	Rachelle_Trantow@gmail.com	$2b$10$0U5JQeqOXSmpMSKiIPg8qu36IeYUqOWxE6UOeThqfMMkPJ/TmdkmG	Herman Satterfield	\N	\N	\N	\N	\N	\N	\N	\N
6	Cristopher35@yahoo.com	$2b$10$YrDRjwKXYtXiOYwdnvEuP.BfF.UTLQnnFvZFdqbtcnMvdfYu4kHD6	Cheryl Raynor	\N	\N	\N	\N	\N	\N	\N	\N
7	Berneice81@hotmail.com	$2b$10$7SdcBhp67NY0qTZUSSUliurVJzj4NS.XmZNOMMGlCURAIcPwYc7Ua	Monica Jenkins	\N	\N	\N	\N	\N	\N	\N	\N
8	Armand48@hotmail.com	$2b$10$sPD6LGwhP3dSezIcJnvd/emtOaIv9QffCVx.vzbKa2CJGPhOr/XTe	Angelica D'Amore DDS	\N	\N	\N	\N	\N	\N	\N	\N
9	Gordon16@hotmail.com	$2b$10$a8vZutpBnSv.NpCTeMuAtuGJ/aKY38nY.3/lgKwkcclvwjQVHQuHS	Dr. Dominic Stroman	\N	\N	\N	\N	\N	\N	\N	\N
10	Jarrell13@hotmail.com	$2b$10$mm8b2tRHFmPgNSbGJC3.6uNpV7Udjz8gjWWy/4W9cvA0sjorhrV8W	Viola Schmidt	\N	\N	\N	\N	\N	\N	\N	\N
11	Jay_Price66@yahoo.com	$2b$10$zvWLlm2nTVsNK.ixuNDOOeL9lp1ufdp7kDmAwEze0UxUWBr4ui4aS	Cesar Farrell	\N	\N	\N	\N	\N	\N	\N	\N
12	Randall_Mitchell@hotmail.com	$2b$10$Gkv3MTPU5Z44Vz8ZjGz63emO/bi7CfmPhNjkS5HTPH6NtPZ9dT.BG	Wayne Conn	\N	\N	\N	\N	\N	\N	\N	\N
13	Maximo34@gmail.com	$2b$10$nf0jKmp65fmBO7tRlcJlHuJ5IwI2iOAAmVITNIn.CFWFbMC5QHI.S	Mr. Troy Hirthe	\N	\N	\N	\N	\N	\N	\N	\N
15	popo@gmail.com	$2b$10$CQk509qZMCmLV7PEsCNKUeVwD2ddMb7qTS83Rot880rAiHpIN77j6	PoPo	\N	\N	\N	\N	\N	\N	\N	\N
16	nono@gmail.com	$2b$10$i/bwIVKaNjzG7FG8M/k7n.rrtlsEXetBywG9x8QK3Ron4mjL2wjrq	NoNo	\N	\N	\N	\N	\N	\N	\N	\N
17	yiyi@gmail.com	$2b$10$kZM.TBVtRRZGRKYKwwkwVOk3raQcZ7Dhd7mDnyFuGe4RLikHHRtIa	YiYi	Yi Yi is a passionate tech writer with over 10 years of experience in web development. He loves sharing his knowledge about the latest technologies and helping others learn to code.			https://plus.unsplash.com/premium_photo-1738449261730-2bc6a8ab40b5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHByb2ZpbGUlMjBpbWFnZSUyMGNhcnRvb258ZW58MHx8MHx8fDA%3D	Senior Tech Writer & developer		\N	\N
14	bobo@gmail.com	$2b$10$1Wgs./wttr1ufnAaQmORg.3bBq0sqosuLZWx5WVuMM6SympMRzcw6	BoBo	\N	\N	\N	https://images.unsplash.com/photo-1747901718105-bf9beb57ba3a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8	\N	\N	\N	\N
\.


--
-- Data for Name: UserFollow; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserFollow" (id, "createdAt", "followerId", "followingId") FROM stdin;
2	2025-05-27 11:09:29.492	14	15
41	2025-06-13 10:15:33.137	14	17
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
5e0c202b-021d-48d8-b47a-5066392de11e	ab070dfe31112afb3078ffe3bc04c00eb621ddd520cb7c416f7606705af1071a	2025-05-03 15:36:11.795898+06:30	20250503090610_init	\N	\N	2025-05-03 15:36:11.550372+06:30	1
\.


--
-- Name: BookMark_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."BookMark_id_seq"', 5, true);


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Category_id_seq"', 38, true);


--
-- Name: CommentLike_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CommentLike_id_seq"', 18, true);


--
-- Name: Comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Comment_id_seq"', 18, true);


--
-- Name: Like_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Like_id_seq"', 40, true);


--
-- Name: Post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Post_id_seq"', 38, true);


--
-- Name: TopicFollow_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TopicFollow_id_seq"', 7, true);


--
-- Name: Topic_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Topic_id_seq"', 35, true);


--
-- Name: UserFollow_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."UserFollow_id_seq"', 41, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 17, true);


--
-- Name: BookMark BookMark_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BookMark"
    ADD CONSTRAINT "BookMark_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: CommentLike CommentLike_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CommentLike"
    ADD CONSTRAINT "CommentLike_pkey" PRIMARY KEY (id);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: Like Like_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_pkey" PRIMARY KEY (id);


--
-- Name: Post Post_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_pkey" PRIMARY KEY (id);


--
-- Name: TopicFollow TopicFollow_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TopicFollow"
    ADD CONSTRAINT "TopicFollow_pkey" PRIMARY KEY (id);


--
-- Name: Topic Topic_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Topic"
    ADD CONSTRAINT "Topic_pkey" PRIMARY KEY (id);


--
-- Name: UserFollow UserFollow_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserFollow"
    ADD CONSTRAINT "UserFollow_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: BookMark_userId_postId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "BookMark_userId_postId_key" ON public."BookMark" USING btree ("userId", "postId");


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: CommentLike_authorId_commentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CommentLike_authorId_commentId_key" ON public."CommentLike" USING btree ("authorId", "commentId");


--
-- Name: Like_authorId_postId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Like_authorId_postId_key" ON public."Like" USING btree ("authorId", "postId");


--
-- Name: TopicFollow_userId_topicId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "TopicFollow_userId_topicId_key" ON public."TopicFollow" USING btree ("userId", "topicId");


--
-- Name: Topic_name_categoryId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Topic_name_categoryId_key" ON public."Topic" USING btree (name, "categoryId");


--
-- Name: Topic_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Topic_name_key" ON public."Topic" USING btree (name);


--
-- Name: UserFollow_followerId_followingId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UserFollow_followerId_followingId_key" ON public."UserFollow" USING btree ("followerId", "followingId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: BookMark BookMark_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BookMark"
    ADD CONSTRAINT "BookMark_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: BookMark BookMark_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BookMark"
    ADD CONSTRAINT "BookMark_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CommentLike CommentLike_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CommentLike"
    ADD CONSTRAINT "CommentLike_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CommentLike CommentLike_commentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CommentLike"
    ADD CONSTRAINT "CommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES public."Comment"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Comment Comment_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Comment Comment_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES public."Comment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comment Comment_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Like Like_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Like Like_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Post Post_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Post Post_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Post Post_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public."Topic"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TopicFollow TopicFollow_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TopicFollow"
    ADD CONSTRAINT "TopicFollow_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TopicFollow TopicFollow_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TopicFollow"
    ADD CONSTRAINT "TopicFollow_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public."Topic"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TopicFollow TopicFollow_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TopicFollow"
    ADD CONSTRAINT "TopicFollow_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Topic Topic_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Topic"
    ADD CONSTRAINT "Topic_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserFollow UserFollow_followerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserFollow"
    ADD CONSTRAINT "UserFollow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserFollow UserFollow_followingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserFollow"
    ADD CONSTRAINT "UserFollow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: User User_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public."Topic"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

