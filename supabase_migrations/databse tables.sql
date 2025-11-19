
--
-- TOC entry 388 (class 1259 OID 20368)
-- Name: batches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.batches (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


--
-- TOC entry 387 (class 1259 OID 20367)
-- Name: batches_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.batches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4419 (class 0 OID 0)
-- Dependencies: 387
-- Name: batches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.batches_id_seq OWNED BY public.batches.id;


--
-- TOC entry 404 (class 1259 OID 29021)
-- Name: department_semesters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.department_semesters (
    id integer NOT NULL,
    department_id integer NOT NULL,
    semester_id integer NOT NULL
);


--
-- TOC entry 403 (class 1259 OID 29020)
-- Name: department_semesters_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.department_semesters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4420 (class 0 OID 0)
-- Dependencies: 403
-- Name: department_semesters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.department_semesters_id_seq OWNED BY public.department_semesters.id;


--
-- TOC entry 386 (class 1259 OID 20354)
-- Name: departments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.departments (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    faculty_id integer
);


--
-- TOC entry 385 (class 1259 OID 20353)
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4421 (class 0 OID 0)
-- Dependencies: 385
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


--
-- TOC entry 402 (class 1259 OID 21169)
-- Name: elective_modules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.elective_modules (
    id integer NOT NULL,
    module_id integer NOT NULL,
    faculty_id integer NOT NULL,
    department_id integer NOT NULL,
    semester_id integer NOT NULL
);


--
-- TOC entry 401 (class 1259 OID 21168)
-- Name: elective_modules_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.elective_modules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4422 (class 0 OID 0)
-- Dependencies: 401
-- Name: elective_modules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.elective_modules_id_seq OWNED BY public.elective_modules.id;


--
-- TOC entry 384 (class 1259 OID 20345)
-- Name: faculties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faculties (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


--
-- TOC entry 383 (class 1259 OID 20344)
-- Name: faculties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faculties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4423 (class 0 OID 0)
-- Dependencies: 383
-- Name: faculties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faculties_id_seq OWNED BY public.faculties.id;


--
-- TOC entry 396 (class 1259 OID 20426)
-- Name: module_assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.module_assignments (
    id integer NOT NULL,
    module_id integer,
    faculty_id integer,
    department_id integer,
    batch_id integer,
    semester_id integer
);


--
-- TOC entry 395 (class 1259 OID 20425)
-- Name: module_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.module_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4424 (class 0 OID 0)
-- Dependencies: 395
-- Name: module_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.module_assignments_id_seq OWNED BY public.module_assignments.id;


--
-- TOC entry 394 (class 1259 OID 20415)
-- Name: modules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.modules (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    description text
);


--
-- TOC entry 393 (class 1259 OID 20414)
-- Name: modules_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.modules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4425 (class 0 OID 0)
-- Dependencies: 393
-- Name: modules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.modules_id_seq OWNED BY public.modules.id;


--
-- TOC entry 390 (class 1259 OID 20377)
-- Name: semesters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.semesters (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


--
-- TOC entry 389 (class 1259 OID 20376)
-- Name: semesters_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.semesters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4426 (class 0 OID 0)
-- Dependencies: 389
-- Name: semesters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.semesters_id_seq OWNED BY public.semesters.id;


--
-- TOC entry 398 (class 1259 OID 20460)
-- Name: student_additional_modules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_additional_modules (
    id integer NOT NULL,
    student_id integer,
    module_id integer
);


--
-- TOC entry 397 (class 1259 OID 20459)
-- Name: student_additional_modules_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_additional_modules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4427 (class 0 OID 0)
-- Dependencies: 397
-- Name: student_additional_modules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_additional_modules_id_seq OWNED BY public.student_additional_modules.id;


--
-- TOC entry 392 (class 1259 OID 20386)
-- Name: students; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.students (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    faculty_id integer,
    department_id integer,
    batch_id integer,
    semester_id integer,
    image_url character varying(255),
    linkedin_url character varying,
    index_no text NOT NULL,
    department_name_text text
);


--
-- TOC entry 400 (class 1259 OID 20479)
-- Name: videos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.videos (
    id integer NOT NULL,
    module_id integer,
    title character varying(200) NOT NULL,
    youtube_links jsonb NOT NULL,
    telegram_links jsonb,
    material_urls jsonb,
    is_kuppi boolean DEFAULT false,
    student_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    description text,
    language_code character varying DEFAULT 'si'::character varying NOT NULL,
    published_at date
);


--
-- TOC entry 407 (class 1259 OID 49918)
-- Name: student_video_counts; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.student_video_counts AS
 SELECT s.id AS student_id,
    s.name AS student_name,
    count(v.id) AS video_count
   FROM (public.students s
     LEFT JOIN public.videos v ON ((s.id = v.student_id)))
  GROUP BY s.id, s.name
  ORDER BY s.id;


--
-- TOC entry 391 (class 1259 OID 20385)
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4428 (class 0 OID 0)
-- Dependencies: 391
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- TOC entry 399 (class 1259 OID 20478)
-- Name: videos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.videos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4429 (class 0 OID 0)
-- Dependencies: 399
-- Name: videos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.videos_id_seq OWNED BY public.videos.id;


--
-- TOC entry 406 (class 1259 OID 48506)
-- Name: videos_search_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--
