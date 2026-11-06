import {NextResponse} from 'next/server';
export const revalidate=86400;
const countries=[{iso3:'ARG',name:'Argentina'},{iso3:'MEX',name:'México'},{iso3:'USA',name:'Estados Unidos'},{iso3:'DEU',name:'Alemania'}];
export async function GET(){
 const url='https://api.worldbank.org/v2/country/ARG;MEX;USA;DEU/indicator/NY.GDP.MKTP.KD.ZG?date=1983:1995&format=json&per_page=1000';
 try{
  const response=await fetch(url,{next:{revalidate:86400},headers:{accept:'application/json'}});
  if(!response.ok) return NextResponse.json({error:'World Bank API respondió '+response.status},{status:502});
  const payload=await response.json();
  if(!Array.isArray(payload)||!Array.isArray(payload[1]))return NextResponse.json({error:'Formato de respuesta inesperado del Banco Mundial.'},{status:502});
  const series=countries.map(c=>({iso3:c.iso3,country:c.name,values:payload[1].filter((x:any)=>x.countryiso3code===c.iso3).map((x:any)=>({year:Number(x.date),value:typeof x.value==='number'?x.value:null})).sort((a:any,b:any)=>a.year-b.year)}));
  return NextResponse.json({indicator:'NY.GDP.MKTP.KD.ZG',indicatorName:'GDP growth (annual %)',unit:'%',source:'World Development Indicators · World Bank',sourceUrl:url,updatedAt:new Date().toISOString(),series});
 }catch{return NextResponse.json({error:'No fue posible consultar la API del Banco Mundial.'},{status:502})}
}
