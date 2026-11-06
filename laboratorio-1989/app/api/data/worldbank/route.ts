import {NextResponse} from 'next/server';
export const revalidate=86400;
const countries=[{iso3:'ARG',name:'Argentina'},{iso3:'MEX',name:'México'},{iso3:'USA',name:'Estados Unidos'},{iso3:'DEU',name:'Alemania'}];
const indicators=[{id:'NY.GDP.MKTP.KD.ZG',key:'gdpGrowth',name:'GDP growth (annual %)'},{id:'FP.CPI.TOTL.ZG',key:'inflation',name:'Inflation, consumer prices (annual %)'}] as const;
async function readIndicator(id:string){
 const url=`https://api.worldbank.org/v2/country/ARG;MEX;USA;DEU/indicator/${id}?date=1983:1995&format=json&per_page=1000`;
 const response=await fetch(url,{next:{revalidate:86400},headers:{accept:'application/json'}});
 if(!response.ok)throw new Error('World Bank API respondió '+response.status);
 const payload=await response.json();
 if(!Array.isArray(payload)||!Array.isArray(payload[1]))throw new Error('Formato de respuesta inesperado del Banco Mundial.');
 return {url,series:countries.map(c=>({iso3:c.iso3,country:c.name,values:payload[1].filter((x:any)=>x.countryiso3code===c.iso3).map((x:any)=>({year:Number(x.date),value:typeof x.value==='number'?x.value:null})).sort((a:any,b:any)=>a.year-b.year)}))};
}
export async function GET(){
 try{
  const [gdpGrowth,inflation]=await Promise.all(indicators.map(x=>readIndicator(x.id)));
  return NextResponse.json({source:'World Development Indicators · World Bank',updatedAt:new Date().toISOString(),gdpGrowth:{indicator:indicators[0].id,name:indicators[0].name,unit:'%',sourceUrl:gdpGrowth.url,series:gdpGrowth.series},inflation:{indicator:indicators[1].id,name:indicators[1].name,unit:'%',sourceUrl:inflation.url,series:inflation.series}});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'No fue posible consultar la API del Banco Mundial.'},{status:502})}
}
