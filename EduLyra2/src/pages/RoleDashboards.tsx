import { useEffect, useMemo, useState } from 'react';
import { BarChart3, BriefcaseBusiness, CheckCircle2, Plus, Search, Users, CalendarDays, MessageSquare, Trash2, Pencil, Send, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMyData, getOpportunities, addOpportunity, allUsers, aiShortlistApplication, inviteForInterview, updateApplicationForCandidate, updateProfile, getInterviews, updateInterview, removeInterview, recruitmentAnalytics, getMessagesForUser, sendMessage, deleteApplication, applyToOpportunity, issueCertificateForUser, getEligibleLearnersForOpportunity, issueIndustryCertificate } from '../services/store';
import { OpportunityCard } from '../components/OpportunityCard';
import { ProgressBar } from '../components/ProgressBar';
function Button({children,onClick,secondary=false,disabled=false}:{children:React.ReactNode;onClick?:()=>void;secondary?:boolean;disabled?:boolean}){return <button disabled={disabled} onClick={onClick} className={`${secondary?'btn-secondary':'btn-primary'} disabled:opacity-50`}>{children}</button>}
function Title({title,subtitle}:{title:string;subtitle:string}){return <div><h1 className="text-2xl font-black">{title}</h1><p className="mt-1 text-sm text-slate-500">{subtitle}</p></div>}
function Stat({label,value}:{label:string;value:string|number}){return <div className="card p-5"><p className="text-xs text-slate-400">{label}</p><p className="mt-2 text-2xl font-black">{value}</p></div>}
function listValue(value:any): string[]{if(Array.isArray(value)) return value.map(String); if(value==null||value==='') return []; return String(value).split(',').map(x=>x.trim()).filter(Boolean);}
function opportunityText(o:any){return `${o?.title||''} ${o?.company||''} ${o?.description||''} ${listValue(o?.skills).join(' ')}`.toLowerCase();}
function facultyRelevant(u:any,o:any){const profile=String(`${u?.profile?.department||''} ${u?.profile?.expertise||''} ${u?.profile?.careerGoal||''} ${listValue(u?.profile?.preferredIndustrySectors).join(' ')}`).toLowerCase();const hits=listValue(o?.skills).filter((x:string)=>profile.includes(x.toLowerCase())).length;return Math.min(99,50+hits*12);}
export function FacultyDashboard(){const u:any=getMyData();const ops=getOpportunities().filter((o:any)=>(o.status||'Published')==='Published').filter(o=>['Faculty','Training','Project','Workshop','Internship'].includes(o.type)).map(o=>({...o,match:facultyRelevant(u,o)})).sort((a,b)=>b.match-a.match);return <div className="space-y-6"><Title title={`Welcome, ${u?.name}`} subtitle="Academician workspace for projects, internships, workshops, opportunities, research and consultancy."/><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Stat label="Profile Strength" value="91%"/><Stat label="Relevant Opportunities" value={ops.length}/><Stat label="Applications" value={(u?.applications||[]).length}/><Stat label="Consultancy Matches" value={getOpportunities().filter(o=>o.type==='Project').length}/></div><div className="grid gap-5 lg:grid-cols-2"><Card title="Professional profile" items={[`Department: ${u?.profile?.department||'Not set'}`,`Expertise: ${u?.profile?.expertise||'Not set'}`,`Career goal: ${u?.profile?.careerGoal||'Not set'}`,`Sectors: ${listValue(u?.profile?.preferredIndustrySectors).join(', ')||'Not set'}`]}/><Card title="Recommended pathways" items={['Industry Projects','Faculty Internships','Workshops','Research Projects','Consultancy Opportunities']}/></div><FacultyOpportunities/></div>}
export function FacultyOpportunities(){const u:any=getMyData();const [q,setQ]=useState('');const ops=getOpportunities().filter((o:any)=>['Faculty','Training','Project','Workshop','Internship'].includes(o.type)).filter((o:any)=>{const a=String(o.audience||'Both').toLowerCase();return a.includes('both')||a.includes('faculty')}).map(o=>({...o,match:facultyRelevant(u,o)})).filter(o=>opportunityText(o).includes(q.toLowerCase())).sort((a,b)=>b.match-a.match);return <div className="space-y-4"><Title title="Faculty Opportunities" subtitle="Search relevant opportunities using expertise, department, goals and industry requirements."/><div className="card p-4 relative"><Search size={17} className="absolute left-7 top-7 text-slate-400"/><input className="input pl-9" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search opportunities, projects, internships, consultancy…"/></div><div className="grid gap-4 lg:grid-cols-2">{ops.map(o=><OpportunityCard key={o.id} opportunity={o}/>)}</div>{!ops.length&&<Empty text="No matching opportunities found."/>}</div>}
export function Collaborations(){return <div className="space-y-5"><Title title="Collaboration Hub" subtitle="Useful collaboration pathways for faculty and industry partners."/><div className="grid gap-4 md:grid-cols-2">{['Industry Mentorship Program','Live Project: Customer Analytics','Guest Lecture','Innovation Challenge','Applied Research Collaboration','Hackathon Partnership'].map(x=><div className="card p-5" key={x}><CheckCircle2 className="text-emerald-500"/><h2 className="mt-3 font-bold">{x}</h2><p className="mt-1 text-sm text-slate-500">Explore this collaboration pathway through the opportunities marketplace.</p><Link className="mt-4 inline-flex text-sm font-bold text-cyan-700" to="/faculty/opportunities">View opportunities →</Link></div>)}</div></div>}
export function GenericFacultyPage({title}:{title:string}){
 const u:any=getMyData(); const [q,setQ]=useState(''); const [editing,setEditing]=useState<any>(null);
 const map:any={'Projects':['Project'],'Faculty Internships':['Internship'],'Consultancy':['Consultancy','Project'],'Opportunities':['Faculty','Training','Project','Workshop','Internship']};
 const allowed=map[title]||['Faculty','Training','Project','Workshop','Internship'];
 const ops=getOpportunities().filter(o=>allowed.includes(o.type)).map(o=>({...o,match:facultyRelevant(u,o)})).filter(o=>opportunityText(o).includes(q.toLowerCase())).sort((a,b)=>b.match-a.match);
 const projects=[
  {id:'fp1',title:'Applied Generative AI Research Project',company:'OpenResearch Collective',description:'Collaborative project exploring practical generative-AI applications for education, including evaluation, responsible use and prototype development.',skills:['Python','Machine Learning'],location:'Remote',workMode:'Remote',compensation:'Research collaboration',type:'Project',deadline:'2026-10-12'},
  {id:'fp2',title:'Student Learning Analytics Project',company:'InsightWorks',description:'Industry-academic project to design learning analytics dashboards and identify student skill-development trends for curriculum improvement.',skills:['Python','SQL','Power BI'],location:'Hybrid',workMode:'Hybrid',compensation:'Academic collaboration',type:'Project',deadline:'2026-10-20'}
 ];
 const consultancy=[
  {id:'fc1',title:'AI Curriculum & Industry Readiness Consultancy',company:'NovaTech Labs',description:'Consultancy engagement for faculty experts to review AI curriculum, industry skill requirements and practical project outcomes.',skills:['Machine Learning','Communication'],location:'Remote',workMode:'Remote',compensation:'Consultancy engagement',type:'Project',deadline:'2026-10-30'},
  {id:'fc2',title:'Data Analytics Faculty Consultancy',company:'InsightWorks',description:'Faculty consultancy opportunity covering analytics curriculum alignment, dashboard design and industry-oriented training plans.',skills:['Python','SQL','Power BI'],location:'Hybrid',workMode:'Hybrid',compensation:'Consultancy engagement',type:'Project',deadline:'2026-11-05'}
 ];
 const visible=title==='Projects' ? [...projects,...ops].filter(o=>opportunityText(o).includes(q.toLowerCase())) : title==='Consultancy' ? [...consultancy,...ops].filter(o=>opportunityText(o).includes(q.toLowerCase())) : ops;
 const plans=Array.isArray(u?.profile?.internshipPlans)?u.profile.internshipPlans:[];
 const savePlan=(plan:any)=>{const next=editing?.id?plans.map((x:any)=>x.id===editing.id?{...x,...plan}:x):[...plans,{id:'fp_'+Date.now(),...plan}];updateProfile({internshipPlans:next});setEditing(null);};
 return <div className="space-y-5"><Title title={title} subtitle={`Relevant ${title.toLowerCase()} based on your expertise, department, sectors and professional goals.`}/>
 {title==='Faculty Internships'&&<div className="card p-5"><div className="flex items-center justify-between gap-3"><div><h2 className="font-bold">Manage internship subjects/details</h2><p className="text-sm text-slate-500">Create or update internship topics you supervise.</p></div><button className="btn-primary" onClick={()=>setEditing({subject:'',details:''})}><Plus size={15}/> Add internship subject</button></div>{plans.map((p:any)=><div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4" key={p.id}><div><b>{p.subject}</b><p className="text-sm text-slate-500">{p.details}</p></div><div className="flex gap-2"><button className="btn-secondary" onClick={()=>setEditing(p)}><Pencil size={14}/> Edit</button><button className="btn-secondary" onClick={()=>updateProfile({internshipPlans:plans.filter((x:any)=>x.id!==p.id)})}><Trash2 size={14}/> Remove</button></div></div>)}{editing&&<PlanForm initial={editing} onCancel={()=>setEditing(null)} onSave={savePlan}/>}</div>}
 <div className="card p-4 relative"><Search size={17} className="absolute left-7 top-7 text-slate-400"/><input className="input pl-9" value={q} onChange={e=>setQ(e.target.value)} placeholder={`Search ${title.toLowerCase()}…`}/></div>
 <div className="grid gap-4 lg:grid-cols-2">{visible.map((o:any)=>o.id.startsWith('fp')||o.id.startsWith('fc')?<FacultyInfoCard key={o.id} item={o}/>:<OpportunityCard key={o.id} opportunity={{...o,match:o.match||facultyRelevant(u,o)}}/>)}</div>{!visible.length&&<Empty text="No matching items are available yet."/>}</div>
}

function FacultyInfoCard({item}:{item:any}){const [open,setOpen]=useState(false);return <div className="card p-5"><span className="badge bg-cyan-50 text-cyan-700">{item.id.startsWith('fc')?'Consultancy':'Project'}</span><h3 className="mt-3 font-bold">{item.title}</h3><p className="mt-1 text-sm text-slate-500">{item.company}</p><p className="mt-4 text-sm leading-6 text-slate-600">{item.description}</p><div className="mt-4 flex flex-wrap gap-1.5">{listValue(item.skills).map((s:string)=><span className="badge bg-slate-100 text-slate-600" key={s}>{s}</span>)}</div><button className="btn-secondary mt-5" onClick={()=>setOpen(!open)}>{open?'Hide details':'View Details'}</button>{open&&<div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm"><p><b>Location:</b> {item.location}</p><p className="mt-1"><b>Work mode:</b> {item.workMode}</p><p className="mt-1"><b>Engagement:</b> {item.compensation}</p><p className="mt-1"><b>Deadline:</b> {item.deadline}</p></div>}</div>}

function PlanForm({initial,onCancel,onSave}:{initial:any;onCancel:()=>void;onSave:(x:any)=>void}){const [subject,setSubject]=useState(initial.subject||'');const [details,setDetails]=useState(initial.details||'');return <div className="mt-4 rounded-xl border p-4 grid gap-3"><input className="input" value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Internship subject"/><textarea className="input min-h-24" value={details} onChange={e=>setDetails(e.target.value)} placeholder="Details, outcomes, skills and duration"/><div className="flex gap-2"><button className="btn-primary" onClick={()=>onSave({subject,details})} disabled={!subject.trim()}>Save</button><button className="btn-secondary" onClick={onCancel}>Cancel</button></div></div>}

export function FacultyApplications(){
 const u:any=getMyData(); const [q,setQ]=useState('');
 const apps=(u?.applications||[]).filter((a:any)=>`${a.role} ${a.company} ${a.stage} ${a.nextAction}`.toLowerCase().includes(q.toLowerCase()));
 return <div className="space-y-6"><Title title="Faculty Applications" subtitle="View and manage applications submitted for faculty opportunities, projects and internships."/><div className="card p-4 relative"><Search size={17} className="absolute left-7 top-7 text-slate-400"/><input className="input pl-9" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search applications, companies or status…"/></div>{apps.map((a:any)=><div className="card p-5 flex flex-wrap items-center justify-between gap-3" key={a.id}><div><b>{a.role}</b><p className="text-sm text-slate-500">{a.company} · {a.appliedDate}</p><p className="mt-2 text-xs text-slate-500">{a.nextAction}</p></div><div className="flex items-center gap-2"><span className="badge bg-cyan-50 text-cyan-700">{a.stage}</span><button className="btn-secondary" onClick={()=>deleteApplication(a.id)}><Trash2 size={14}/> Remove</button></div></div>)}{!apps.length&&<Empty text="No matching faculty applications found."/>}</div>
}

export function FacultyProfile(){
 const u:any=getMyData();
 const [saved,setSaved]=useState(false);
 const [name,setName]=useState(u?.name||'');
 const [department,setDepartment]=useState(u?.profile?.department||'');
 const [designation,setDesignation]=useState(u?.profile?.designation||'');
 const [expertise,setExpertise]=useState(u?.profile?.expertise||'');
 const [goal,setGoal]=useState(u?.profile?.careerGoal||'');
 const [sectors,setSectors]=useState(listValue(u?.profile?.preferredIndustrySectors).join(', '));
 const certs=u?.certificates||[];
 return <div className="mx-auto max-w-3xl space-y-6">
  <Title title="Professional Faculty Profile" subtitle="Keep your academic and industry-collaboration information accurate for opportunity matching."/>
  <div className="card grid gap-4 p-6 sm:grid-cols-2">
   <div><label className="label">Full name</label><input className="input" value={name} onChange={e=>setName(e.target.value)}/></div>
   <div><label className="label">Department</label><input className="input" value={department} onChange={e=>setDepartment(e.target.value)}/></div>
   <div><label className="label">Designation</label><input className="input" value={designation} onChange={e=>setDesignation(e.target.value)}/></div>
   <div><label className="label">Areas of Expertise</label><input className="input" value={expertise} onChange={e=>setExpertise(e.target.value)}/></div>
   <div><label className="label">Career / Professional Goals</label><input className="input" value={goal} onChange={e=>setGoal(e.target.value)}/></div>
   <div><label className="label">Preferred Industry Sectors</label><input className="input" value={sectors} onChange={e=>setSectors(e.target.value)}/></div>
   <div className="sm:col-span-2"><button className="btn-primary" onClick={()=>{updateProfile({displayName:name,department,designation,expertise,careerGoal:goal,preferredIndustrySectors:sectors.split(',').map(x=>x.trim()).filter(Boolean)});setSaved(true)}}>Save profile</button>{saved&&<span className="ml-3 text-sm text-emerald-700">Saved.</span>}</div>
  </div>
  <div className="card p-6">
   <div className="flex items-center gap-2"><span className="text-violet-600">✓</span><h2 className="font-black">Verified Certificates</h2></div>
   {certs.length ? certs.map((c:any)=><div className="mt-3 rounded-xl bg-slate-50 p-4" key={c.id}><p className="font-bold">{c.name}</p><p className="mt-1 text-xs text-slate-500">{c.issuer} · {c.trainingTitle||c.name} · {c.issuedOn}</p><span className="badge mt-2 bg-emerald-50 text-emerald-700">{c.verified?'VERIFIED':'Pending'} · {c.id}</span></div>) : <p className="mt-3 text-sm text-slate-500">No certificates yet. Complete an eligible Industry training to become certifiable.</p>}
  </div>
 </div>;
}
export function IndustryDashboard(){const a=recruitmentAnalytics();return <div className="space-y-6"><Title title={`Welcome, ${getMyData()?.name}`} subtitle="Recruitment workspace with transparent candidate matching and live recruitment analytics."/><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><Stat label="Vacancies" value={a.opportunities}/><Stat label="Applicants" value={a.applicants}/><Stat label="Shortlisted" value={a.shortlisted}/><Stat label="Interviews" value={a.interview}/><Stat label="Hired" value={a.hired}/></div><div className="flex flex-wrap gap-3">
<Link className="btn-primary" to="/industry/internship"><Plus size={16}/> Post Internship</Link><Link className="btn-secondary" to="/industry/training"><Plus size={16}/> Post Training</Link>
<Link className="btn-secondary" to="/industry/candidates"><Search size={16}/> Find Candidates</Link>
<Link className="btn-secondary" to="/industry/applications">Manage Applications</Link>
</div>
<div className="grid gap-4 md:grid-cols-3">
  {[
    ["Experience-first hiring", "Publish internships and structured training to build relationships before recruitment."],
    ["Purpose-built engagement", "Internships use applications; training uses registration instead of a job-style Apply flow."],
    ["Opportunity intelligence", "Every post carries skills, audience, capacity and a learner-facing next action."]
  ].map(([title, body]) => <div className="card p-5" key={title}><p className="text-sm font-black">{title}</p><p className="mt-2 text-xs leading-5 text-slate-500">{body}</p></div>)}
</div><div className="card p-6"><h2 className="font-bold">Hiring progress</h2><div className="mt-5"><ProgressBar label="Applicants → Shortlisted" value={a.applicants?Math.round(a.shortlisted/a.applicants*100):0}/><div className="mt-4"><ProgressBar label="Shortlisted → Hired" value={a.shortlisted?Math.round(a.hired/a.shortlisted*100):0}/></div></div></div></div>}
export function IndustryInternship(){
 const [saved,setSaved]=useState(false); const [f,setF]=useState<any>({title:'',workMode:'Hybrid',description:'',skills:'',location:'',compensation:'',duration:'',eligibility:'',deadline:''});
 const set=(k:string,v:string)=>setF((x:any)=>({...x,[k]:v}));
 const submit=()=>{if(!f.title.trim()||!f.description.trim()||!f.skills.trim())return;addOpportunity({...f,type:'Internship',engagement:'Application',skills:f.skills.split(',').map((x:string)=>x.trim()).filter(Boolean)});setSaved(true);setF({...f,title:'',description:'',skills:''});};
 return <div className="mx-auto max-w-3xl space-y-6"><Title title="Post Internship" subtitle="Publish an internship for eligible students. Internship candidates can apply; this is separate from industry training registration."/><div className="card grid gap-4 p-6 sm:grid-cols-2">{[['title','Internship title'],['location','Location'],['compensation','Stipend / compensation'],['duration','Duration'],['eligibility','Eligibility'],['deadline','Application deadline']].map(x=><div key={x[0]}><label className="label">{x[1]}</label><input className="input" value={f[x[0]]} onChange={e=>set(x[0],e.target.value)}/></div>)}<div><label className="label">Work mode</label><select className="input" value={f.workMode} onChange={e=>set('workMode',e.target.value)}><option>Remote</option><option>Hybrid</option><option>On-site</option></select></div><div className="sm:col-span-2"><label className="label">Required skills</label><input className="input" value={f.skills} onChange={e=>set('skills',e.target.value)} placeholder="React, SQL, Python"/></div><div className="sm:col-span-2"><label className="label">Description / responsibilities / outcomes</label><textarea className="input min-h-32" value={f.description} onChange={e=>set('description',e.target.value)}/></div><button className="btn-primary sm:col-span-2" onClick={submit} disabled={!f.title.trim()||!f.description.trim()||!f.skills.trim()}><Plus size={16}/> Publish Internship</button>{saved&&<div className="sm:col-span-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">Internship published successfully. Eligible students can now view and apply.</div>}</div></div>
}

export function PostOpportunity(){const [saved,setSaved]=useState(false);const [f,setF]=useState<any>({title:'',type:'Job',workMode:'Hybrid',description:'',skills:'',location:'',compensation:'',duration:'',eligibility:'',deadline:''});const set=(k:string,v:string)=>setF((x:any)=>({...x,[k]:v}));const submit=()=>{if(!f.title.trim()||!f.description.trim()||!f.skills.trim())return;addOpportunity({...f,skills:f.skills.split(',').map((x:string)=>x.trim()).filter(Boolean)});setSaved(true);setF({...f,title:'',description:'',skills:''});};return <div className="mx-auto max-w-3xl space-y-6"><Title title="Post Opportunity" subtitle="Publish jobs, internships and other relevant opportunities. Published opportunities immediately enter the student marketplace."/><div className="card grid gap-4 p-6 sm:grid-cols-2">{[['title','Title'],['location','Location'],['compensation','Salary / stipend'],['duration','Duration'],['eligibility','Eligibility'],['deadline','Application deadline']].map(x=><div key={x[0]}><label className="label">{x[1]}</label><input className="input" value={f[x[0]]} onChange={e=>set(x[0],e.target.value)}/></div>)}<div><label className="label">Type</label><select className="input" value={f.type} onChange={e=>set('type',e.target.value)}>{['Job','Internship','Project','Apprenticeship','Training','Certification','Workshop'].map(x=><option key={x}>{x}</option>)}</select></div><div><label className="label">Work mode</label><select className="input" value={f.workMode} onChange={e=>set('workMode',e.target.value)}><option>Remote</option><option>Hybrid</option><option>On-site</option></select></div><div className="sm:col-span-2"><label className="label">Required skills (comma separated)</label><input className="input" value={f.skills} onChange={e=>set('skills',e.target.value)}/></div><div className="sm:col-span-2"><label className="label">Description / responsibilities / outcomes</label><textarea className="input min-h-32" value={f.description} onChange={e=>set('description',e.target.value)}/></div><button className="btn-primary sm:col-span-2" onClick={submit} disabled={!f.title.trim()||!f.description.trim()||!f.skills.trim()}><Plus size={16}/> Publish opportunity</button>{saved&&<div className="sm:col-span-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">Published successfully. Students can now view details and apply.</div>}</div></div>}
export function IndustryOpportunities(){const me:any=getMyData();const [q,setQ]=useState('');const [refresh,setRefresh]=useState(0);useEffect(()=>{const f=()=>setRefresh(x=>x+1);window.addEventListener('edulyra:data',f);return()=>window.removeEventListener('edulyra:data',f)},[]);const ops=getOpportunities().filter(o=>o.company===me?.profile?.companyName).filter(o=>`${o.title} ${o.type} ${o.description} ${o.skills.join(' ')}`.toLowerCase().includes(q.toLowerCase()));return <div className="space-y-5"><Title title="My Opportunities" subtitle="Manage the opportunities your organization has published."/><div className="card p-4 relative"><Search size={17} className="absolute left-7 top-7 text-slate-400"/><input className="input pl-9" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search your jobs, internships and projects…"/></div><div className="grid gap-4 lg:grid-cols-2">{ops.map(o=><OpportunityCard key={o.id} opportunity={o}/>)}</div>{!ops.length&&<Empty text="You have not published any matching opportunities yet."/>}</div>}
export function Candidates(){const me:any=getMyData();const ownIds=new Set(getOpportunities().filter(o=>o.company===me?.profile?.companyName).map(o=>o.id));const users=allUsers().filter((u:any)=>u.role==='student');const applicants=users.filter((u:any)=>(u.applications||[]).some((a:any)=>ownIds.has(a.opportunityId)));const [q,setQ]=useState('');const [selected,setSelected]=useState<any>(null);const matches=applicants.filter((u:any)=>`${u.name} ${u.email} ${u.profile?.currentSkills||''} ${u.profile?.careerGoal||''} ${u.profile?.desiredJobRole||''}`.toLowerCase().includes(q.toLowerCase()));return <div className="space-y-6"><Title title="AI-Assisted Candidate Shortlisting" subtitle="Ranking is explainable and advisory: skills, assessment results, career alignment and profile evidence are shown for recruiter review."/><div className="card p-4 relative"><Search size={17} className="absolute left-7 top-7 text-slate-400"/><input className="input pl-9" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search applicants, skills or career goals…"/></div><div className="space-y-3">{matches.map((u:any)=>{const apps=(u.applications||[]).filter((a:any)=>ownIds.has(a.opportunityId));const best=apps.sort((a:any,b:any)=>(score(u,b)-score(u,a)))[0];const o=getOpportunities().find(x=>x.id===best?.opportunityId);const sc=score(u,best);return <div className="card flex flex-wrap items-center justify-between gap-4 p-5" key={u.id}><div><b>{u.name}</b><p className="text-sm text-slate-500">{u.email} · {u.profile?.careerGoal||u.profile?.desiredJobRole||'Career goal not set'}</p><div className="mt-2 flex flex-wrap gap-1">{(u.profile?.currentSkills||[]).slice(0,7).map((s:string)=><span className="badge bg-slate-100 text-slate-600" key={s}>{s}</span>)}</div><p className="mt-2 text-xs text-slate-400">Applied for: {o?.title||'Opportunity'}</p></div><div className="flex items-center gap-2"><span className="badge bg-emerald-50 text-emerald-700">{sc}% compatibility</span><button className="btn-secondary" onClick={()=>setSelected({u,best,sc})}>Review</button><button className="btn-primary" disabled={sc<70} title={sc<70?"AI threshold not met; review the candidate manually":"AI-assisted shortlist"} onClick={()=>aiShortlistApplication(best.id,sc)}>AI Shortlist</button></div></div>})}</div>{selected&&<div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-5" onClick={()=>setSelected(null)}><div className="w-full max-w-2xl rounded-2xl bg-white p-6" onClick={e=>e.stopPropagation()}><div className="flex justify-between"><div><h2 className="text-xl font-black">{selected.u.name}</h2><p className="text-sm text-slate-500">AI-assisted review · {selected.sc}%</p></div><button onClick={()=>setSelected(null)}><XCircle/></button></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-4"><b>Skills</b><p className="mt-2 text-sm">{(selected.u.profile?.currentSkills||[]).join(', ')||'None listed'}</p></div><div className="rounded-xl bg-slate-50 p-4"><b>Assessment</b><p className="mt-2 text-sm">{selected.u.assessment?.overall||0}% overall</p></div><div className="rounded-xl bg-slate-50 p-4"><b>Career alignment</b><p className="mt-2 text-sm">{selected.u.profile?.careerGoal||selected.u.profile?.desiredJobRole||'Not set'}</p></div><div className="rounded-xl bg-slate-50 p-4"><b>Resume evidence</b><p className="mt-2 text-sm">{(selected.u.portfolio?.projects||[]).length} projects · {(selected.u.portfolio?.certifications||[]).length} certifications</p></div></div><p className="mt-5 text-xs text-slate-500">This score supports recruiter review; it does not make a perfect or automatic hiring decision.</p></div></div>}</div>}
function score(u:any,a:any){if(!a)return 0;const o=getOpportunities().find(x=>x.id===a.opportunityId);const req=o?.skills||[];const skills=u.profile?.currentSkills||[];const hits=req.filter((r:string)=>skills.some((s:string)=>s.toLowerCase()===r.toLowerCase())).length;const skill=Math.round((hits/Math.max(1,req.length))*60);const assessment=Math.round((u.assessment?.overall||0)*0.2);const career=String(u.profile?.careerGoal||u.profile?.desiredJobRole||'').toLowerCase();const align=o&&career&&(`${o.title} ${o.description}`).toLowerCase().split(/\s+/).some((w:string)=>w.length>3&&career.includes(w));return Math.min(99,skill+assessment+(align?20:5));}
export function IndustryApplications(){const [refresh,setRefresh]=useState(0);useEffect(()=>{const f=()=>setRefresh(x=>x+1);window.addEventListener('edulyra:data',f);return()=>window.removeEventListener('edulyra:data',f)},[]);const a=recruitmentAnalytics();return <div className="space-y-6"><Title title="Recruitment Pipeline" subtitle="Applicants → AI-assisted shortlist → interview → selected/hired. Recruiter actions update the student's application status."/><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><Stat label="Applicants" value={a.applicants}/><Stat label="Shortlisted" value={a.shortlisted}/><Stat label="Interviews" value={a.interview}/><Stat label="Hired" value={a.hired}/><Stat label="Rejected" value={a.rejected}/></div><div className="overflow-x-auto rounded-2xl border bg-white"><table className="min-w-[1100px] w-full text-sm"><thead className="bg-slate-50 text-left"><tr>{['Candidate','Role','AI evidence score','Status','Actions'].map(x=><th className="p-4" key={x}>{x}</th>)}</tr></thead><tbody>{a.apps.map((x:any)=><tr className="border-t" key={x.id}><td className="p-4 font-bold">{x.candidate}</td><td className="p-4">{x.role}</td><td className="p-4 font-black">{score(allUsers().find((u:any)=>u.id===x.candidateId),x)}%</td><td className="p-4"><span className="badge bg-cyan-50 text-cyan-700">{x.stage}</span></td><td className="p-4"><div className="flex flex-wrap gap-2">{x.stage==='Applied'&&<button className="btn-secondary" disabled={score(allUsers().find((u:any)=>u.id===x.candidateId),x)<70} onClick={()=>{aiShortlistApplication(x.id,score(allUsers().find((u:any)=>u.id===x.candidateId),x));}}><CheckCircle2 size={14}/> AI Shortlist</button>}{x.stage==='AI Shortlisted'&&<button className="btn-secondary" onClick={()=>{inviteForInterview(x.id);}}><CalendarDays size={14}/> Schedule Interview</button>}{!['Selected','Rejected'].includes(x.stage)&&<><button className="btn-primary" onClick={()=>updateApplicationForCandidate(x.id,'Selected')}><CheckCircle2 size={14}/> Select / Hire</button><button className="btn-secondary" onClick={()=>updateApplicationForCandidate(x.id,'Rejected')}>Reject</button></>}{x.stage==='Selected'&&<span className="badge bg-emerald-50 text-emerald-700">Hired</span>}</div></td></tr>)}</tbody></table>{!a.apps.length&&<div className="p-10 text-center text-slate-500">No applications yet. Students will appear here after applying to your published opportunities.</div>}</div></div>}
export function IndustryInterviews(){const [refresh,setRefresh]=useState(0);useEffect(()=>{const f=()=>setRefresh(x=>x+1);window.addEventListener('edulyra:data',f);return()=>window.removeEventListener('edulyra:data',f)},[]);const interviews=getInterviews().filter(i=>i.company===getMyData()?.profile?.companyName);const [editing,setEditing]=useState<any>(null);return <div className="space-y-6"><Title title="Interviews" subtitle="Scheduled interviews are linked to real applications and candidates."/><div className="space-y-3">{interviews.map(i=><div className="card p-5" key={i.id}><div className="flex flex-wrap justify-between gap-4"><div><span className="badge bg-cyan-50 text-cyan-700">{i.status}</span><h2 className="mt-2 font-bold">{i.candidateName} · {i.position}</h2><p className="text-sm text-slate-500">{i.date} at {i.time} · {i.mode}</p></div><div className="flex gap-2"><button className="btn-secondary" onClick={()=>setEditing(i)}><Pencil size={14}/> Manage</button><button className="btn-secondary" onClick={()=>removeInterview(i.id)}><Trash2 size={14}/> Cancel</button></div></div>{i.link&&<a className="mt-3 inline-flex text-sm font-bold text-cyan-700" href={i.link} target="_blank" rel="noreferrer">Meeting link</a>}{i.notes&&<p className="mt-3 text-sm text-slate-600">{i.notes}</p>}</div>)}{!interviews.length&&<Empty text="No interviews scheduled yet. Shortlist a candidate and schedule an interview from Applications."/>}</div>{editing&&<InterviewForm interview={editing} onClose={()=>setEditing(null)}/>}</div>}
function InterviewForm({interview,onClose}:{interview:any;onClose:()=>void}){const [date,setDate]=useState(interview.date);const [time,setTime]=useState(interview.time);const [mode,setMode]=useState(interview.mode);const [link,setLink]=useState(interview.link);const [notes,setNotes]=useState(interview.notes);return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-5"><div className="w-full max-w-lg rounded-2xl bg-white p-6 space-y-4"><h2 className="text-xl font-black">Manage interview · {interview.candidateName}</h2><input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)}/><input className="input" type="time" value={time} onChange={e=>setTime(e.target.value)}/><select className="input" value={mode} onChange={e=>setMode(e.target.value)}><option>Online</option><option>On-site</option><option>Hybrid</option></select><input className="input" value={link} onChange={e=>setLink(e.target.value)} placeholder="Meeting link"/><textarea className="input min-h-24" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Interview notes"/><div className="flex gap-2"><button className="btn-primary" onClick={()=>{updateInterview(interview.id,{date,time,mode,link,notes,status:'Updated'});onClose()}}><CheckCircle2 size={14}/> Update</button><button className="btn-secondary" onClick={onClose}>Cancel</button></div></div></div>}
export function IndustryAnalytics(){const a=recruitmentAnalytics();const rates=[['Applicant → Shortlist',a.applicants?Math.round(a.shortlisted/a.applicants*100):0],['Shortlist → Interview',a.shortlisted?Math.round(a.interview/a.shortlisted*100):0],['Interview → Hire',a.interview?Math.round(a.hired/a.interview*100):0]];return <div className="space-y-6"><Title title="Recruitment Analysis" subtitle="Live metrics calculated from your organization's published opportunities and applications."/><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><Stat label="Vacancies" value={a.opportunities}/><Stat label="Applicants" value={a.applicants}/><Stat label="Shortlisted" value={a.shortlisted}/><Stat label="Hired" value={a.hired}/><Stat label="Rejected" value={a.rejected}/></div><div className="card p-6"><h2 className="font-bold">Selection progress</h2>{rates.map(([x,v]:any)=><div className="mt-5" key={x}><ProgressBar label={x} value={v}/></div>)}</div><div className="grid gap-4 md:grid-cols-3">{[['Interview',a.interview],['Open vacancies',a.opportunities],['Unselected applicants',Math.max(0,a.applicants-a.hired-a.rejected)]].map(([x,v])=><div className="card p-5" key={x}><BarChart3 className="text-cyan-600"/><p className="mt-3 text-sm text-slate-500">{x}</p><b className="text-2xl">{v}</b></div>)}</div></div>}
export function IndustryMessages(){const u:any=getMyData();const [q,setQ]=useState('');const [body,setBody]=useState('');const [receiver,setReceiver]=useState('');const msgs=getMessagesForUser();const people=allUsers().filter((x:any)=>x.role==='student'&&msgs.some((m:any)=>m.senderId===x.id||m.receiverId===x.id)).filter((x:any)=>`${x.name} ${x.email} ${x.profile?.careerGoal||''}`.toLowerCase().includes(q.toLowerCase()));return <div className="space-y-6"><Title title="Messages" subtitle="Recruitment communication is linked to real shortlist, interview and selection actions."/><div className="card p-5"><div className="relative"><Search size={17} className="absolute left-3 top-3 text-slate-400"/><input className="input pl-9" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search candidates in conversations…"/></div></div>{people.map(p=>{const thread=msgs.filter((m:any)=>m.senderId===p.id||m.receiverId===p.id);return <div className="card p-5" key={p.id}><div className="flex justify-between"><div><h2 className="font-bold">{p.name}</h2><p className="text-xs text-slate-500">{p.email} · {p.profile?.careerGoal||p.profile?.desiredJobRole||'Candidate'}</p></div><button className="btn-secondary" onClick={()=>setReceiver(p.id)}>Reply</button></div>{thread.map((m:any)=><div className={`mt-3 rounded-xl p-3 text-sm ${m.senderId===u.id?'bg-cyan-50':'bg-slate-50'}`} key={m.id}>{m.body}<p className="mt-1 text-[11px] text-slate-400">{new Date(m.createdAt).toLocaleString()}</p></div>)}</div>})}{!people.length&&<div className="card p-8 text-center text-sm text-slate-500">No connected candidate conversations yet. Messages appear after recruitment actions.</div>}{receiver&&<div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-5"><div className="w-full max-w-lg rounded-2xl bg-white p-6"><h2 className="font-black">Reply to {allUsers().find((x:any)=>x.id===receiver)?.name}</h2><textarea className="input mt-4 min-h-28" value={body} onChange={e=>setBody(e.target.value)} placeholder="Write a clear recruiter message…"/><div className="mt-4 flex gap-2"><button className="btn-primary" disabled={!body.trim()} onClick={()=>{sendMessage(receiver,body);setBody('');setReceiver('')}}><Send size={14}/> Send</button><button className="btn-secondary" onClick={()=>setReceiver('')}>Cancel</button></div></div></div>}</div>}

export function IndustryChallenges() {
  const items: [
    string,
    string,
    string,
    string[],
    string
  ][] = [
    [
      "ch1",
      "AI-Powered Customer Support Analytics",
      "6 weeks",
      ["Python", "SQL", "Machine Learning"],
      "Analyze support conversations and build dashboards that identify recurring customer issues.",
    ],
    [
      "ch2",
      "Campus Energy Optimization",
      "8 weeks",
      ["Python", "IoT", "Data Analytics"],
      "Design a data-driven approach to reduce energy waste across a connected campus.",
    ],
    [
      "ch3",
      "Accessible Learning Assistant",
      "5 weeks",
      ["React", "Node.js", "AI / ML"],
      "Prototype an inclusive assistant that improves access to digital learning resources.",
    ],
  ];

  return (
    <div className="space-y-6">
      <Title
        title="Industry Challenges"
        subtitle="Real-world problems, innovation briefs and project opportunities for students and teams."
      />

      <div className="grid gap-4">
        {items.map((x) => (
          <div className="card p-6" key={x[0]}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="badge bg-violet-50 text-violet-700">
                  Challenge
                </span>

                <h2 className="mt-2 text-xl font-black">
                  {x[1]}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {x[4]}
                </p>
              </div>

              <span className="badge bg-cyan-50 text-cyan-700">
                {x[2]}
              </span>
            </div>

            {/* Required Skills */}
            <div className="mt-5 flex flex-wrap gap-2">
              {x[3].map((skill) => (
                <span className="skill-chip" key={skill}>
                  {skill}
                </span>
              ))}
            </div>

            {/* View Requirements Only */}
            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                secondary
                onClick={() =>
                  alert(
                    `Requirements: ${x[3].join(
                      ", "
                    )}\nDuration: ${x[2]}`
                  )
                }
              >
                View Requirements
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IndustryTraining() {
  const me:any=getMyData();
  const [title,setTitle]=useState('');
  const [duration,setDuration]=useState('');
  const [level,setLevel]=useState('Intermediate');
  const [skills,setSkills]=useState('');
  const [description,setDescription]=useState('');
  const [audience,setAudience]=useState('Students and Academicians');
  const [refresh,setRefresh]=useState(0);
  const own=getOpportunities().filter((o:any)=>o.company===me?.profile?.companyName&&o.type==='Training');
  const publish=()=>{
    if(!title.trim()||!description.trim()||!skills.trim()) return;
    addOpportunity({title:title.trim(),type:'Training',location:'Online / Industry Campus',workMode:'Hybrid',compensation:'Industry Training',duration,eligibility:`Level: ${level}`,deadline:'',skills:skills.split(',').map((x:string)=>x.trim()).filter(Boolean),description:description.trim(),engagement:'Registration',audience,postedAt:new Date().toISOString()});
    setTitle('');setDuration('');setSkills('');setDescription('');setRefresh(x=>x+1);
  };
  return <div className="space-y-6">
    <Title title="Post Training" subtitle="Industry teams publish structured training programs. Learners register for training; they do not apply for it like a vacancy."/>
    <div className="card p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label">Training title</label><input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Cloud Fundamentals Training"/></div>
        <div><label className="label">Duration</label><input className="input" value={duration} onChange={e=>setDuration(e.target.value)} placeholder="4 weeks"/></div>
        <div><label className="label">Level</label><select className="input" value={level} onChange={e=>setLevel(e.target.value)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
        <div><label className="label">Target audience</label><input className="input" value={audience} onChange={e=>setAudience(e.target.value)} placeholder="Final-year students / faculty"/></div>
        <div className="sm:col-span-2"><label className="label">Skills covered</label><input className="input" value={skills} onChange={e=>setSkills(e.target.value)} placeholder="AWS, Linux, Networking"/></div>
        <div className="sm:col-span-2"><label className="label">Training outcomes</label><textarea className="input min-h-28" value={description} onChange={e=>setDescription(e.target.value)} placeholder="What participants will learn, build or demonstrate after the training."/></div>
        <button className="btn-primary sm:col-span-2" onClick={publish} disabled={!title.trim()||!description.trim()||!skills.trim()}><Plus size={16}/> Publish Training</button>
      </div>
    </div>
    <div>
      <div className="mb-3 flex items-center justify-between"><div><h2 className="text-xl font-black">Published Trainings</h2><p className="text-sm text-slate-500">Your company's active training programs.</p></div><span className="badge bg-cyan-50 text-cyan-700">{own.length} published</span></div>
      <div className="grid gap-4 md:grid-cols-2">{own.map((x:any)=><div className="card p-6" key={x.id}><span className="badge bg-cyan-50 text-cyan-700">Training Program</span><h2 className="mt-3 text-xl font-black">{x.title}</h2><p className="mt-2 text-sm text-slate-500">{x.description}</p><div className="mt-4 flex flex-wrap gap-2">{(x.skills||[]).map((skill:string)=><span className="skill-chip" key={skill}>{skill}</span>)}</div><div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs"><span>Duration: {x.duration||'Flexible'}</span><span>Audience: {x.audience||'Eligible learners'}</span></div><span className="mt-4 inline-flex badge bg-emerald-50 text-emerald-700">Learner action: Register</span></div>)}</div>
      {!own.length&&<div className="card p-8 text-center text-sm text-slate-500">No trainings published yet. Create the first training program above.</div>}
    </div>
  </div>;
}

export function IndustryCertifications() {
 const me:any=getMyData(); const own=getOpportunities().filter((o:any)=>o.company===me?.profile?.companyName&&o.type==="Training");
 const [training,setTraining]=useState(own[0]?.id||""); const [selected,setSelected]=useState(""); const [title,setTitle]=useState(""); const [notice,setNotice]=useState("");
 const learners=training?getEligibleLearnersForOpportunity(training):[]; const op:any=own.find((x:any)=>x.id===training);
 const issue=()=>{const learner:any=learners.find((u:any)=>u.id===selected);if(!learner||!title.trim()||!op)return;try{issueIndustryCertificate({userId:selected,opportunityId:training,title:title.trim(),skills:op.skills||[],completionDate:(learner.trainingCompletions||[]).find((x:any)=>x.opportunityId===training)?.completedAt||new Date().toISOString().slice(0,10)});setNotice(`Verified certificate issued to ${learner.name}.`);setSelected("");setTitle("")}catch(e:any){setNotice(e?.message||"Certificate issuance failed.")}};
 return <div className="space-y-6"><Title title="Certifications" subtitle="Issue verified certificates only after a learner has registered for your training, completed it and satisfied the completion criteria."/>
  <div className="card p-6"><h2 className="text-lg font-black">Eligible Learners</h2><p className="mt-1 text-sm text-slate-500">Eligibility is computed from actual registration and completion records. Students and faculty are separated.</p>
   {!own.length?<div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">Create and publish a Training under Post Opportunities first.</div>:<>
    <div className="mt-5"><label className="label">Training / Program</label><select className="input" value={training} onChange={e=>{setTraining(e.target.value);setSelected("")}}>{own.map((o:any)=><option key={o.id} value={o.id}>{o.title}</option>)}</select></div>
    <div className="mt-5 grid gap-4 md:grid-cols-2"><div><h3 className="font-black">Students</h3><div className="mt-2 space-y-2">{learners.filter((u:any)=>u.role==="student").map((u:any)=><button onClick={()=>setSelected(u.id)} className={`block w-full rounded-xl border p-3 text-left ${selected===u.id?"border-violet-400 bg-violet-50":"bg-white"}`} key={u.id}><b>{u.name}</b><p className="text-xs text-slate-500">Completed · {op?.title}</p></button>)}{!learners.some((u:any)=>u.role==="student")&&<p className="text-sm text-slate-500">No eligible students.</p>}</div></div><div><h3 className="font-black">Faculty / Academicians</h3><div className="mt-2 space-y-2">{learners.filter((u:any)=>u.role==="faculty").map((u:any)=><button onClick={()=>setSelected(u.id)} className={`block w-full rounded-xl border p-3 text-left ${selected===u.id?"border-violet-400 bg-violet-50":"bg-white"}`} key={u.id}><b>{u.name}</b><p className="text-xs text-slate-500">Completed · {op?.title}</p></button>)}{!learners.some((u:any)=>u.role==="faculty")&&<p className="text-sm text-slate-500">No eligible faculty.</p>}</div></div></div>
    <div className="mt-5 grid gap-4 sm:grid-cols-2"><div><label className="label">Certificate title</label><input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Professional Cloud Fundamentals Certificate"/></div><div><label className="label">Recipient</label><input className="input bg-slate-50" value={learners.find((u:any)=>u.id===selected)?.name||"Select an eligible learner"} readOnly/></div><button className="btn-primary sm:col-span-2" disabled={!selected||!title.trim()} onClick={issue}><CheckCircle2 size={16}/> Issue Verified Certificate</button></div>
   </>}
   {notice&&<div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">{notice}</div>}
  </div>
  <div className="card p-6"><h2 className="font-black">Issuance lifecycle</h2><div className="mt-3 grid gap-3 md:grid-cols-5">{["Registered","In Progress","Completed","Eligible","Verified Certificate"].map((x,i)=><div className="rounded-xl bg-slate-50 p-4" key={x}><span className="text-xs font-black text-violet-600">0{i+1}</span><p className="mt-2 font-bold">{x}</p></div>)}</div></div>
 </div>;
}
export function IndustryMentorship(){
 const [requested,setRequested]=useState<string[]>([]);
 const mentors: [string,string,string,string,string][]=[
   ['m1','Arjun Mehta','Senior Product Engineer','React · Cloud · System Design','8+ years'],
  ['m2','Ananya Rao','Data Analytics Lead','SQL · Python · Data Analytics','10+ years'],
  ['m3','Meera Iyer','Career & Hiring Mentor','Interviews · Resume · Career Strategy','9+ years']
 ];
 return <div className="space-y-6"><Title title="Industry Mentorship" subtitle="Connect with industry experts for technical guidance, career advice and mentoring sessions."/>
 <div className="grid gap-4 md:grid-cols-3">{mentors.map(x=><div className="card p-5" key={x[0] as string}><div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-50 text-cyan-700"><Users size={20}/></div><h2 className="mt-4 font-black">{x[1]}</h2><p className="mt-1 text-xs font-semibold text-slate-500">{x[2]}</p><span className="badge mt-3 bg-violet-50 text-violet-700">{x[4]}</span><p className="mt-4 text-xs leading-5 text-slate-500">Expertise: {x[3]}</p><Button onClick={()=>setRequested(v=>v.includes(x[0] as string)?v:v.concat(x[0] as string))}>{requested.includes(x[0] as string)?'Request Sent':'Request Mentorship'}</Button></div>)}</div>
 <div className="card p-5"><h2 className="font-black">Upcoming Mentoring Sessions</h2><p className="mt-2 text-sm text-slate-500">{requested.length?`${requested.length} mentorship request${requested.length>1?'s':''} submitted. Confirmed sessions will appear here.`:'No sessions booked yet. Request a mentor to start.'}</p></div></div>
}

export function IndustryGeneric({title}:{title:string}){if(title==='Opportunities')return <IndustryOpportunities/>;if(title==='Interviews')return <IndustryInterviews/>;if(title==='Recruitment Analytics')return <IndustryAnalytics/>;if(title==='Messages')return <IndustryMessages/>;return <Card title={title} items={['Active hiring campaign','Candidate pipeline','Interview schedule','Analytics report']}/>}
export function InstitutionDashboard(){const students=allUsers().filter((u:any)=>u.role==='student');const [q,setQ]=useState('');const results=students.filter((u:any)=>`${u.name} ${u.email} ${u.profile?.careerGoal||''} ${(u.profile?.currentSkills||[]).join(' ')}`.toLowerCase().includes(q.toLowerCase())).slice(0,5);return <div className="space-y-6"><Title title="Institution Dashboard" subtitle="Student readiness, skill gaps, internships, placements and industry collaboration."/><div className="card p-4 relative"><Search size={17} className="absolute left-7 top-7 text-slate-400"/><input className="input pl-9" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search students, skills or career goals…"/>{q&&<div className="mt-3 space-y-2">{results.map((u:any)=><Link to="/institution/students" className="block rounded-xl bg-slate-50 p-3 text-sm" key={u.id}><b>{u.name}</b> · {u.profile?.careerGoal||'Goal not set'}<span className="ml-2 text-slate-400">{(u.profile?.currentSkills||[]).slice(0,4).join(', ')}</span></Link>)}{!results.length&&<p className="text-sm text-slate-500">No matching students.</p>}</div>}</div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Stat label="Total Students" value={students.length}/><Stat label="Assessed" value={students.filter((u:any)=>u.assessment).length}/><Stat label="Applications" value={students.reduce((n,u)=>n+(u.applications||[]).length,0)}/><Stat label="Placed" value={students.reduce((n,u)=>n+(u.applications||[]).filter((a:any)=>a.stage==='Selected').length,0)}/></div><Link className="btn-primary" to="/institution/students"><Users size={15}/> Open student search</Link></div>}
export function InstitutionGeneric({title}:{title:string}){return <Card title={title} items={['Student cohort overview','Most common skills','Most common Skill Gaps','Industry demand','Placement report','Internship participation']}/>}
function Empty({text}:{text:string}){return <div className="card p-8 text-center text-sm text-slate-500">{text}</div>}
function Card({title,items}:{title:string;items:string[]}){return <div className="card p-6"><h2 className="font-bold">{title}</h2><div className="mt-4 grid gap-2 sm:grid-cols-2">{items.map(x=><div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm" key={x}><CheckCircle2 size={15} className="text-emerald-500"/>{x}</div>)}</div></div>}
