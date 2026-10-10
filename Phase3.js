// ===== Empire Ambitions — Phase 3 : marché, concurrence, marketing, événements =====
const ITEMS0=JSON.parse(JSON.stringify(ITEMS)),SK=['resto','cafe','habit','coif','sport'];
const CAMP={pub:['Publicité locale',500,14,1.15],num:['Campagne numérique',1500,14,1.3],promo:['Promotion',300,7,1.1]};
const p3=()=>G.p3||(G.p3={dem:{},sup:1,cw:{},log:[],offer:null});
const applySup=()=>Object.keys(ITEMS).forEach(i=>ITEMS[i][1]=Math.round(ITEMS0[i][1]*p3().sup));
const buyCost=b=>{const o=p3().offer;return Math.round(b.price*1.05*(o&&o.id===b.id?.75:1))};
const rivals=id=>{const b=buildings[id],k=G.biz[id].s;return buildings.filter(o=>o.state==='occupied'&&!o.shop&&o.cs===k&&Math.hypot(o.x-b.x,o.z-b.z)<45).length};
function bizMult(id,z){z.rep=z.rep??50;return(p3().dem[z.s]||1)*(.7+.6*z.rep/100)*(z.mk&&z.mk.d>0?z.mk.m:1)*(1+.07*(z.train||0))*(z.loy?1.08:1)/(1+.07*rivals(id))}
// journal des notifications
const _toast=toast;toast=function(t){try{const P=p3();P.log.unshift(`Jour ${G.day} — ${t}`);P.log.length=Math.min(P.log.length,25)}catch(e){}_toast(t)};
// concurrents persistants
const _apply=apply;apply=function(){_apply();const P=p3();buildings.forEach(b=>{
 if(b.cs===undefined)b.cs=b.type==='bureau'?'bur':b.type==='commerce'?SK[b.id%5]:null;
 const o=P.cw[b.id];if(o&&!G.owned.includes(b.id)&&!G.leased.includes(b.id)){b.state=o.s;b.owner=o.s==='occupied'?'Entreprise concurrente':'Aucun';if(o.c!==undefined)b.cs=o.c}
 b.flash=!!(P.offer&&P.offer.id===b.id&&b.state==='sale')})};
const _start=start;start=function(){applySup();_start()};
// événements quotidiens
function p3Day(){const P=p3();let ch=false;
 Object.keys(SECT).forEach(k=>{const d=P.dem[k]||1;P.dem[k]=Math.max(.75,Math.min(1.3,d+(1-d)*.03+(Math.random()-.5)*.03))});
 Object.values(G.biz).forEach(z=>{z.rep=z.rep??50;if(z.mk&&z.mk.d>0)z.mk.d--;
  if(z.open){const bad=z.stock<=0||z.staff<SECT[z.s].staff;z.rep=Math.max(0,Math.min(100,z.rep+(bad?-.6:.25+.1*(z.train||0)+(z.q>1?.1:0)+(z.loy?.1:0))));
   if(z.layout.length&&Math.random()<.012){const p=z.layout.splice(Math.floor(Math.random()*z.layout.length),1)[0];(z.broken=z.broken||[]).push(p.id);toast(`🔧 Panne : ${ITEMS[p.id][0]} (${z.name})`)}}
  z.orders.forEach(o=>{if(!o.dl&&o.due>G.day&&Math.random()<.12){o.dl=1;o.due+=2;toast('🚚 Retard de livraison : '+ITEMS[o.i][0])}})});
 if(P.offer&&(P.offer.until<G.day||buildings[P.offer.id].state!=='sale')){P.offer=null;ch=true}
 if(!P.offer&&Math.random()<.04){const s=buildings.filter(b=>b.state==='sale');if(s.length){const b=s[Math.floor(Math.random()*s.length)];P.offer={id:b.id,until:G.day+7};toast('💎 Offre flash −25 % : '+b.name+' (7 jours, toit rose)');ch=true}}
 if(ch){apply();paint()}}
// évolution mensuelle de la ville
function p3Month(){const P=p3(),sale=buildings.filter(b=>b.state==='sale'&&!(P.offer&&P.offer.id===b.id)),occ=buildings.filter(b=>b.state==='occupied'&&!b.shop);let o=0,c=0;
 for(let k=0;k<3&&sale.length;k++){const b=sale.splice(Math.floor(Math.random()*sale.length),1)[0];P.cw[b.id]={s:'occupied',c:b.type==='bureau'?'bur':b.type==='commerce'?SK[Math.floor(Math.random()*5)]:null};o++}
 for(let k=0;k<2&&occ.length;k++){const b=occ.splice(Math.floor(Math.random()*occ.length),1)[0];P.cw[b.id]={s:'rent'};c++}
 const old=P.sup;P.sup=Math.max(.8,Math.min(1.3,P.sup*(.93+Math.random()*.14)));applySup();
 toast(`🏙️ Concurrence : ${o} ouverture(s), ${c} fermeture(s). Prix fournisseurs ${P.sup>old?'en hausse':'en baisse'} (${Math.round(P.sup*100)} %)`);apply();paint()}
// actions entreprise
function campaign(id,k){const z=G.biz[id],c=CAMP[k];if(G.money<c[1])return toast('Trésorerie insuffisante');if(z.mk&&z.mk.d>0)return toast('Une campagne est déjà en cours');G.money-=c[1];z.mk={d:c[2],m:c[3]};save();hud();bizModal(id)}
function loyalty(id){if(G.money<800)return toast('Trésorerie insuffisante');G.money-=800;G.biz[id].loy=1;save();hud();bizModal(id)}
function trainStaff(id){const z=G.biz[id];if(G.money<1200||(z.train||0)>=3)return toast('Impossible');G.money-=1200;z.train=(z.train||0)+1;save();hud();bizModal(id)}
function repair(id,i){const z=G.biz[id],x=z.broken[i],c=Math.round(ITEMS[x][1]*.2);if(G.money<c)return toast('Trésorerie insuffisante');G.money-=c;z.broken.splice(i,1);z.inv[x]=(z.inv[x]||0)+1;save();hud();toast('Réparé : '+ITEMS[x][0]+' (à replacer via Aménager)');bizModal(id)}
const _bm=bizModal;bizModal=function(id){_bm(id);const z=G.biz[id];z.rep=z.rep??50;const d=p3().dem[z.s]||1;
 $('mbox').insertAdjacentHTML('beforeend',`<hr style="border-color:#2c3550"><b>📈 Marché et réputation</b>
 <table><tr><td>Réputation</td><td>${Math.round(z.rep)}/100</td></tr><tr><td>Demande du secteur</td><td>${Math.round(d*100)} %</td></tr><tr><td>Concurrents à proximité</td><td>${rivals(id)}</td></tr>
 <tr><td>Campagne</td><td>${z.mk&&z.mk.d>0?z.mk.d+' j (×'+z.mk.m+')':'aucune'}</td></tr><tr><td>Formation du personnel</td><td>${z.train||0}/3 (+150 €/employé/mois par niveau)</td></tr></table>
 <div class="row">${Object.entries(CAMP).map(([k,c])=>`<button class="sec" onclick="campaign(${id},'${k}')">${c[0]} (${fmt(c[1])})</button>`).join('')}
 <button class="sec" ${z.loy?'disabled':''} onclick="loyalty(${id})">🎁 Fidélisation (800 €)</button><button class="sec" ${(z.train||0)>=3?'disabled':''} onclick="trainStaff(${id})">🎓 Formation (1 200 €)</button></div>
 ${(z.broken||[]).map((x,i)=>`<div style="margin-top:6px">🔧 ${ITEMS[x][0]} en panne <button onclick="repair(${id},${i})">Réparer (${fmt(ITEMS[x][1]*.2)})</button></div>`).join('')}`)};
// écran Marché
function openMarket(){const P=p3();modal(`<h2>📊 Marché</h2><table>${Object.entries(SECT).map(([k,s])=>{const d=P.dem[k]||1;return`<tr><td>${s.n}</td><td>${d>=1?'🔼':'🔽'} ${Math.round(d*100)} %</td><td>${buildings.filter(b=>b.state==='occupied'&&!b.shop&&b.cs===k).length} concurrents</td></tr>`}).join('')}</table>
 <div>Prix fournisseurs : <b>${Math.round(P.sup*100)} %</b>${P.offer?`<br>💎 Offre flash : ${buildings[P.offer.id].name} (−25 %, jusqu'au jour ${P.offer.until})`:''}</div>
 <b>Journal</b><div style="max-height:220px;overflow:auto;font-size:13px">${P.log.map(l=>`<div>${l}</div>`).join('')||'Rien à signaler.'}</div><div class="row"><button class="sec" onclick="closeModal()">Fermer</button></div>`)}
document.querySelector('#top .sp').insertAdjacentHTML('afterend','<button class="sec" onclick="openMarket()">📊 Marché</button>');
