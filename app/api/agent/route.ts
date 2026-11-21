import {generateText} from 'ai';
import {NextResponse} from 'next/server';
export async function POST(req:Request){
 try {
  const {role,context}=await req.json();
  if(!['sales','builder','qa'].includes(role)||typeof context!=='string'||context.length>15000)return NextResponse.json({error:'Invalid request'},{status:400});
  const instructions:Record<string,string>={
   sales:'You are an ethical B2B sales assistant for a small Indian web design agency. Create a concise prospect assessment, an individually tailored outreach DRAFT, three discovery questions, and a suggested next step. Do not invent verified facts, contact details, consent, or prior interactions. Never claim a message was sent. Clearly distinguish assumptions.',
   builder:'You are a website delivery project manager. Convert the client requirements into a concrete implementation brief with pages, sections, functionality, visual direction, acceptance criteria, milestones, and open questions. Do not claim to have built or deployed a website.',
   qa:'You are a website QA planner. Based only on supplied project information, create a test checklist with priority, expected outcome and manual verification steps. Do not claim any tests passed without evidence.'
  };
  const {text}=await generateText({model:process.env.AI_MODEL||'openai/gpt-5.4',system:instructions[role],prompt:context});
  return NextResponse.json({text});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Agent error'},{status:500})}
}
