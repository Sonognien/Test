import React,{createContext,useContext,useEffect,useMemo,useState}from"react";
import ReactDOM from"react-dom/client";
import{BrowserRouter,Link,Route,Routes,useNavigate,useParams}from"react-router-dom";
import{createClient}from"@supabase/supabase-js";
import{BookOpen,Clock,LogIn,LogOut,Moon,Search,Shield,Sun,Trash2}from"lucide-react";
import"./styles.css";

const supabase=createClient(import.meta.env.VITE_SUPABASE_URL,import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
const AuthContext=createContext({session:null,profile:null});

function AuthProvider({children}){
 const[session,setSession]=useState(null),[profile,setProfile]=useState(null);
 useEffect(()=>{supabase.auth.getSession().then(({data})=>setSession(data.session));const{data}=supabase.auth.onAuthStateChange((_event,next)=>setSession(next));return()=>data.subscription.unsubscribe()},[]);
 useEffect(()=>{if(!session){setProfile(null);return}supabase.from("profils_utilisateurs").select("id_user,nom_complet,role_user").eq("id_user",session.user.id).maybeSingle().then(({data})=>setProfile(data))},[session]);
 return <AuthContext.Provider value={{session,profile}}>{children}</AuthContext.Provider>
}

function Layout({children}){
 const{session,profile}=useContext(AuthContext);
 const[dark,setDark]=useState(localStorage.theme==="dark");
 useEffect(()=>{document.documentElement.classList.toggle("dark",dark);localStorage.theme=dark?"dark":"light"},[dark]);
 return <div className="min-h-screen"><header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3"><Link to="/" className="flex items-center gap-2 font-bold"><BookOpen className="h-5 w-5 text-indigo-600"/>Europoker</Link><nav className="flex items-center gap-2"><Link className="btn2" to="/">Articles</Link>{profile?.role_user==="admin"&&<Link className="btn2" to="/admin"><Shield className="mr-1 h-4 w-4"/>Admin</Link>}<button className="btn2" onClick={()=>setDark(v=>!v)}>{dark?<Sun className="h-4 w-4"/>:<Moon className="h-4 w-4"/>}</button>{session?<button className="btn2" onClick={()=>supabase.auth.signOut()}><LogOut className="mr-1 h-4 w-4"/>Déconnexion</button>:<Link className="btn" to="/auth"><LogIn className="mr-1 h-4 w-4"/>Connexion</Link>}</nav></div></header>{children}<footer className="mt-14 border-t py-8 text-center text-sm text-slate-500 dark:border-slate-800">Europoker · environnement de test sécurisé</footer></div>
}

function Home(){
 const[articles,setArticles]=useState([]),[topics,setTopics]=useState([]),[query,setQuery]=useState(""),[quota,setQuota]=useState({checking:true,allowed:true});
 const{session}=useContext(AuthContext);
 useEffect(()=>{Promise.all([supabase.from("articles").select("*").eq("statut_publication","publie").order("date_publication",{ascending:false}),supabase.from("thematiques").select("id_thematique,nom_thematique").order("nom_thematique")]).then(([a,t])=>{setArticles(a.data||[]);setTopics(t.data||[])})},[]);
 useEffect(()=>{if(session){setQuota({checking:false,allowed:true});return}fetch("https://eflpdvbsndohopnwssge.supabase.co/functions/v1/guest-24h-check",{method:"POST",headers:{apikey:import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,"content-type":"application/json"}}).then(async response=>({status:response.status,...await response.json()})).then(setQuota).catch(()=>setQuota({checking:false,allowed:false,reason:"service_unavailable"}))},[session]);
 const filtered=useMemo(()=>articles.filter(a=>(a.titre+" "+a.resume).toLowerCase().includes(query.toLowerCase())),[articles,query]);
 if(!session&&!quota.checking&&!quota.allowed)return <Layout><main className="mx-auto max-w-2xl px-4 py-20"><div className="card"><h1 className="text-3xl font-bold">Accès invité limité</h1><p className="mt-4 text-slate-600 dark:text-slate-300">La session invitée de 45 minutes est terminée. Le prochain accès invité est disponible 24 heures après le début de la visite.</p>{quota.next_access_at&&<p className="mt-3 font-semibold">Prochain accès : {new Date(quota.next_access_at).toLocaleString("fr-FR")}</p>}<Link className="btn mt-6" to="/auth">Se connecter</Link></div></main></Layout>;
 return <Layout><section className="hero"><div className="mx-auto max-w-7xl px-4 py-20"><p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-600">EUROPOKER · SCIENCE · RECHERCHE · MULTIMÉDIA</p><h1 className="mt-4 max-w-4xl text-4xl font-bold sm:text-6xl">Explorer des connaissances fiables dans un environnement sécurisé.</h1><p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">Articles scientifiques, recherche, commentaires membres et administration éditoriale.</p></div></section><main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[240px,1fr]"><aside className="card h-fit"><h2 className="mb-3 font-semibold">Thématiques</h2>{topics.map(t=><div className="topic" key={t.id_thematique}>{t.nom_thematique}</div>)}</aside><section><div className="mb-6 flex items-center gap-2 rounded-2xl border bg-white px-4 dark:border-slate-800 dark:bg-slate-900"><Search className="h-5 w-5 text-slate-400"/><input className="w-full bg-transparent py-4 outline-none" placeholder="Rechercher…" value={query} onChange={e=>setQuery(e.target.value)}/></div><div className="grid gap-5 md:grid-cols-2">{filtered.map(a=><Link className="card block" key={a.id_article} to={"/article/"+a.slug}><div className="mb-2 flex items-center gap-1 text-xs text-slate-500"><Clock className="h-3.5 w-3.5"/>{a.temps_lecture_min} min · {a.auteur_nom}</div><h2 className="text-xl font-semibold">{a.titre}</h2><p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{a.resume}</p></Link>)}</div></section></main></Layout>
}

function Auth(){
 const navigate=useNavigate(),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[signup,setSignup]=useState(false),[message,setMessage]=useState("");
 async function submit(event){event.preventDefault();setMessage("");const result=signup?await supabase.auth.signUp({email,password,options:{emailRedirectTo:location.origin}}):await supabase.auth.signInWithPassword({email,password});if(result.error)setMessage(result.error.message);else if(signup)setMessage("Compte créé. Vérifiez votre messagerie si nécessaire.");else navigate("/")}
 return <Layout><main className="mx-auto max-w-md px-4 py-16"><div className="card"><h1 className="text-2xl font-bold">{signup?"Créer un compte":"Connexion"}</h1><form className="mt-5 space-y-3" onSubmit={submit}><input className="field" type="email" required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/><input className="field" type="password" minLength={8} required placeholder="Mot de passe" value={password} onChange={e=>setPassword(e.target.value)}/><button className="btn w-full">{signup?"Créer le compte":"Se connecter"}</button></form><div className="my-4 border-t dark:border-slate-800"/><div className="grid gap-2"><button className="btn2" onClick={()=>supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:location.origin}})}>Continuer avec Google</button><button className="btn2" onClick={()=>supabase.auth.signInWithOAuth({provider:"azure",options:{redirectTo:location.origin,scopes:"email"}})}>Continuer avec Microsoft</button></div>{message&&<p className="mt-4 text-sm text-amber-600">{message}</p>}<button className="mt-4 text-sm text-indigo-600" onClick={()=>setSignup(v=>!v)}>{signup?"J’ai déjà un compte":"Créer un compte"}</button></div></main></Layout>
}

function ArticlePage(){
 const{slug}=useParams(),{session}=useContext(AuthContext),[article,setArticle]=useState(null),[comments,setComments]=useState([]),[text,setText]=useState("");
 useEffect(()=>{if(slug)supabase.from("articles").select("*").eq("slug",slug).single().then(({data})=>setArticle(data))},[slug]);
 async function loadComments(){if(!article)return;const{data}=await supabase.from("commentaires").select("id_commentaire,contenu_texte,date_creation").eq("id_article",article.id_article).order("date_creation");setComments(data||[])}
 useEffect(()=>{if(article)loadComments()},[article?.id_article]);
 async function post(){if(!session||!article||!text.trim())return;const{error}=await supabase.from("commentaires").insert({id_article:article.id_article,id_user:session.user.id,contenu_texte:text.trim()});if(!error){setText("");loadComments()}}
 return <Layout><main className="mx-auto max-w-3xl px-4 py-12">{!article?<p>Chargement…</p>:<><p className="text-sm text-indigo-600">{article.auteur_nom} · {article.temps_lecture_min} min</p><h1 className="mt-3 text-4xl font-bold">{article.titre}</h1><p className="mt-4 text-xl text-slate-600 dark:text-slate-300">{article.resume}</p><div className="mt-8 whitespace-pre-wrap leading-8">{article.contenu_complet}</div><section className="mt-12"><h2 className="text-xl font-semibold">Commentaires</h2>{session?<div className="mt-4 flex gap-2"><input className="field" value={text} onChange={e=>setText(e.target.value)} placeholder="Votre commentaire…"/><button className="btn" onClick={post}>Publier</button></div>:<p className="mt-3 text-sm text-slate-500">Connectez-vous pour commenter.</p>}<div className="mt-4 space-y-3">{comments.map(c=><div className="card" key={c.id_commentaire}>{c.contenu_texte}</div>)}</div></section></>}</main></Layout>
}

function Admin(){
 const{profile}=useContext(AuthContext),[articles,setArticles]=useState([]),[form,setForm]=useState({titre:"",slug:"",resume:"",contenu_complet:"",auteur_nom:"Administration"});
 async function load(){const{data}=await supabase.from("articles").select("*").order("date_publication",{ascending:false});setArticles(data||[])}
 useEffect(()=>{if(profile?.role_user==="admin")load()},[profile]);
 async function create(){const{error}=await supabase.from("articles").insert({...form,statut_publication:"brouillon"});if(!error){setForm({titre:"",slug:"",resume:"",contenu_complet:"",auteur_nom:"Administration"});load()}}
 async function publish(id){await supabase.from("articles").update({statut_publication:"publie",date_publication:new Date().toISOString()}).eq("id_article",id);load()}
 async function remove(id){if(confirm("Supprimer cet article ?")){await supabase.from("articles").delete().eq("id_article",id);load()}}
 if(profile?.role_user!=="admin")return <Layout><main className="mx-auto max-w-4xl px-4 py-16">Accès administrateur requis.</main></Layout>;
 return <Layout><main className="mx-auto max-w-7xl px-4 py-10"><h1 className="text-3xl font-bold">Administration</h1><div className="mt-7 grid gap-6 lg:grid-cols-2"><section className="card space-y-3"><h2 className="font-semibold">Nouvel article</h2>{["titre","slug","resume","auteur_nom"].map(key=><input key={key} className="field" placeholder={key} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/>)}<textarea className="field" rows={10} placeholder="contenu_complet" value={form.contenu_complet} onChange={e=>setForm({...form,contenu_complet:e.target.value})}/><button className="btn" onClick={create}>Créer le brouillon</button></section><section className="space-y-3">{articles.map(a=><div className="card flex items-center justify-between gap-3" key={a.id_article}><div><strong>{a.titre}</strong><div className="text-xs text-slate-500">{a.statut_publication}</div></div><div className="flex gap-2">{a.statut_publication!=="publie"&&<button className="btn2" onClick={()=>publish(a.id_article)}>Publier</button>}<button className="btn2" onClick={()=>remove(a.id_article)}><Trash2 className="h-4 w-4"/></button></div></div>)}</section></div></main></Layout>
}

function App(){return <AuthProvider><BrowserRouter><Routes><Route path="/" element={<Home/>}/><Route path="/auth" element={<Auth/>}/><Route path="/article/:slug" element={<ArticlePage/>}/><Route path="/admin" element={<Admin/>}/></Routes></BrowserRouter></AuthProvider>}
ReactDOM.createRoot(document.getElementById("root")).render(<React.StrictMode><App/></React.StrictMode>);
