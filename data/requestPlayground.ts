/** Local, deterministic demo data. This does not call an AI model or database. */
const orders=[{id:"DEMO-104",status:"Pending",total:2400},{id:"DEMO-108",status:"Pending",total:1850},{id:"DEMO-113",status:"Shipped",total:3200}];

export function resolveRequest(question:string){
  if(/\b(delete|drop|update|insert|alter|truncate|remove)\b/i.test(question))return {blocked:true,sql:"— Request stopped before execution —",rows:[],message:"This request would change data. The assistant only allows read-only SELECT queries."};
  if(!/\borders?\b/i.test(question)||/\b(cancelled|canceled|delivered|refunded|paid|unpaid)\b/i.test(question))return null;
  const status=/pending/i.test(question)?"Pending":/shipped/i.test(question)?"Shipped":null;
  const rows=orders.filter(order=>!status||order.status===status);
  const where=status?`\nWHERE status = '${status.toLowerCase()}'`:"";
  if(/\b(count|many|number)\b/i.test(question))return {blocked:false,sql:`SELECT COUNT(*) AS order_count\nFROM orders${where};`,rows,count:rows.length,message:`The sample query found ${rows.length} ${status?status.toLowerCase()+" ":""}order${rows.length===1?"":"s"}. No records were changed.`};
  return {blocked:false,sql:`SELECT order_id, status, total\nFROM orders${where};`,rows,message:"Read-only query approved. These fictional records are returned to the interface."};
}
