// ===== Empire Ambitions — Phase 4 : secteurs, logistique, holding, banque, expansion =====
Object.assign(ITEMS,{cuisine:['Cuisine professionnelle',2200,3,2],comptoir:['Comptoir',400,3,1],rayon:['Rayonnage',250,3,1],congelo:['Congélateur',900,2,1],vtech:['Vitrine électronique',700,3,1],presentoir:['Présentoir meubles',500,3,2],etabli:['Établi',450,3,1],outils:['Caisse à outils',180,1,1],lit:["Lit d'hôtel",700,2,2],reception:['Réception',600,3,1],palette:['Rack à palettes',800,3,2],transpal:['Transpalette',500,1,1],machine:['Machine industrielle',9000,3,2],convoyeur:['Convoyeur',2500,3,1]});
Object.keys(ITEMS).forEach(k=>{if(!ITEMS0[k])ITEMS0[k]=ITEMS[k].slice()});
Object.assign(SECT,{
 trad:{n:'Restaurant traditionnel',t:['commerce'],minA:110,fee:900,stock:1800,sign:900,staff:5,rev:700,req:{cuisine:1,frigo:2,caisse:1,table:5,chaise:10},opt:{eclairage:2,poubelle:2}},
 epic:{n:'Épicerie et supermarché',t:['commerce'],minA:120,fee:800,stock:4000,sign:700,staff:4,rev:650,req:{rayon:4,congelo:2,caisse:2},opt:{poubelle:1,eclairage:2}},
 elec:{n:"Magasin d'électronique",t:['commerce'],minA:80,fee:700,stock:5000,sign:700,staff:3,rev:560,req:{vtech:2,rayon:2,caisse:1},opt:{eclairage:2}},
 meub:{n:'Magasin de meubles',t:['commerce','entrepot'],minA:140,fee:700,stock:3500,sign:700,staff:3,rev:520,req:{presentoir:4,comptoir:1,caisse:1},opt:{eclairage:2}},
 repar:{n:'Atelier de réparation',t:['commerce','entrepot'],minA:60,fee:500,stock:700,sign:400,staff:2,rev:340,req:{etabli:2,outils:2,caisse:1},opt:{etagere:1,poubelle:1}},
 hotel:{n:'Hôtellerie',t:['commerce','bureau'],minA:300,fee:2000,stock:1500,sign:1500,staff:6,rev:1100,req:{lit:6,reception:1,caisse:1},opt:{eclairage:2,chaise:4}},
 entrep:{n:'Entrepôt et distribution',t:['entrepot'],minA:200,fee:900,stock:500,sign:300,staff:3,rev:380,req:{palette:3,transpal:1,caisse:1},opt:{etagere:2}},
 gros:{n:'Commerce de gros / import-export',t:['entrepot'],minA:250,fee:1500,stock:6000,sign:500,staff:4,rev:950,req:{palette:4,transpal:2,caisse:1,poste:1,ordi:1},opt:{etagere:2}},
 indus:{n:'Production industrielle',t:['entrepot'],minA:400,fee:3000,stock:8000,sign:800,staff:6,rev:1700,req:{machine:2,convoyeur:2,transpal:1,caisse:1},opt:{etagere:2}}});
const _w1=wiz1;wiz1=function(){_w1();if(!p4().hold)document.querySelectorAll('#mbox button').forEach(b=>{if((b.getAttribute('onclick')||'').includes("W.s='indus'")){b.disabled=true;b.textContent='Nécessite une holding'}})};
// ---- état
const p4=()=>G.p4||(G.p4={veh:[],hold:null,loans:[],cities:[]});
const VEH={van:['Camionnette',8000,300,2000],truck:['Camion',25000,800,6000]},LOANS=[[20000,12,.04],[50000,36,.055],[100000,60,.07]],CITIES=[['Lyon',60000],['Marseille',90000],['Bordeaux',120000]];
function hasVeh(){return p4().veh.length>0}
function fastDel(){return hasVeh()}
function feeOf(p){return hasVeh()?0:Math.max(20,Math.round(p*.04))}
const vcap=()=>Math.max(0,...p4().veh.map(v=>VEH[v][3]));
const netW=()=>{const P=p4();return G.money+buildings.filter(b=>G.owned.includes(b.id)).reduce((a,b)=>a+valueOf(b),0)-G.debt-P.loans.reduce((a,l)=>a+l.p,0)+(P.hold?P.hold.cash:0)};
const _hud=hud;hud=function(){_hud();$('wealth').textContent=fmt(netW())};
const _proj=proj;proj=function(){const p=_proj(),P=p4();P.veh.forEach(v=>p.exp+=VEH[v][2]+1900);P.loans.forEach(l=>p.exp+=l.pay);return p};
const _p3d=p3Day;p3Day=function(){_p3d();Object.values(G.biz).forEach(z=>{if(z.open)z.revM=(z.revM||0)+z.rev})};
const _month=month;month=function(){const P=p4();let tax=0,roy=P.cities.length*2500;
 Object.values(G.biz).forEach(z=>{tax+=Math.round((z.revM||0)*(z.sub?.08:.15));z.revM=0;roy+=(z.fr||0)*400});
 _month();G.money+=roy-tax;const h=G.hist[G.hist.length-1];if(h){h.inc+=roy;h.exp+=tax}
 P.loans.forEach(l=>{l.p=Math.max(0,l.p-(l.pay-l.p*l.r/12));l.left--});P.loans=P.loans.filter(l=>l.left>0&&l.p>1);
 if(tax||roy)toast(`🧾 Impôts : −${fmt(tax)} · Redevances et expansion : +${fmt(roy)}`);save();hud()};
// ---- hub
document.querySelector('#top .sp').insertAdjacentHTML('afterend','<button class="sec" onclick="hub()">🏢 Groupe</button>');
function hub(){const P=p4();modal(`<h2>🏢 Groupe</h2><p>Holding : ${P.hold?P.hold.name:'non créée'} · Véhicules : ${P.veh.length} · Prêts : ${P.loans.length} · Villes : ${P.cities.length}</p><div class="row" style="flex-direction:column"><button onclick="holdModal()">🏛️ Holding et filiales</button><button onclick="logiModal()">🚚 Logistique et entrepôts</button><button onclick="bankModal()">🏦 Banque</button><button onclick="expModal()">🌍 Expansion</button><button class="sec" onclick="closeModal()">Fermer</button></div>`)}
// ---- holding
function holdModal(){const P=p4(),ids=Object.keys(G.biz);
 if(!P.hold)return modal(`<h2>🏛️ Holding</h2><p>Création : ${fmt(15000)}. Impôt réduit à 8 % (au lieu de 15 %) sur les filiales, résultats consolidés, accès à la production industrielle et à l'expansion.</p><div class="row"><button ${G.money<15000||!ids.length?'disabled':''} onclick="mkHold()">Créer la holding</button><button class="sec" onclick="hub()">Retour</button></div>`);
 let ca=0,st=0,em=0;ids.forEach(i=>{const z=G.biz[i];ca+=z.open?z.rev:0;st+=z.stock;em+=z.staff});
 modal(`<h2>🏛️ ${P.hold.name}</h2><table><tr><td>Filiales</td><td>${ids.filter(i=>G.biz[i].sub).length}/${ids.length}</td></tr><tr><td>CA consolidé (jour)</td><td>${fmt(ca)}</td></tr><tr><td>Stocks</td><td>${fmt(st)}</td></tr><tr><td>Employés</td><td>${em}</td></tr><tr><td>Trésorerie holding</td><td>${fmt(P.hold.cash)}</td></tr></table>
 ${ids.map(i=>`<div style="margin:4px 0">${G.biz[i].name} <button class="${G.biz[i].sub?'grn':'sec'}" onclick="toggleSub(${i})">${G.biz[i].sub?'Filiale ✔':'Rattacher (1 000 €)'}</button></div>`).join('')}
 <div class="row"><button class="sec" onclick="capTx(10000)">➡ Apporter 10 000 €</button><button class="sec" onclick="capTx(-10000)">⬅ Dividendes 10 000 €</button><button class="sec" onclick="hub()">Retour</button></div>`)}
function mkHold(){if(G.money<15000)return;G.money-=15000;p4().hold={name:'Groupe '+clean(Object.values(G.biz)[0].name).slice(0,18),cash:0};save();hud();holdModal()}
function toggleSub(i){const z=G.biz[i];if(!z.sub){if(G.money<1000)return toast('Trésorerie insuffisante');G.money-=1000;z.sub=1}else z.sub=0;save();hud();holdModal()}
function capTx(a){const h=p4().hold;if(a>0?G.money<a:h.cash<-a)return toast('Fonds insuffisants');G.money-=a;h.cash+=a;save();hud();holdModal()}
// ---- logistique
let T={s:null,d:null};
function logiModal(){const P=p4(),ids=Object.keys(G.biz).map(Number);if(!ids.includes(T.s))T.s=ids[0];if(!ids.includes(T.d))T.d=ids[1]??ids[0];
 const o=sv=>ids.map(i=>`<option value="${i}" ${i===sv?'selected':''}>${G.biz[i].name}</option>`).join('');
 modal(`<h2>🚚 Logistique</h2><small>Avec un véhicule : livraisons gratuites en 1 jour et transferts de stock. Chaque véhicule coûte son entretien + un chauffeur (1 900 €/mois).</small>
 <table>${P.veh.map((v,i)=>`<tr><td>${VEH[v][0]} (capacité ${fmt(VEH[v][3])})</td><td>${fmt(VEH[v][2]+1900)}/mois</td><td><button class="red" onclick="sellVeh(${i})">Vendre</button></td></tr>`).join('')||'<tr><td>Aucun véhicule</td></tr>'}</table>
 <div class="row">${Object.entries(VEH).map(([k,v])=>`<button ${G.money<v[1]?'disabled':''} onclick="buyVeh('${k}')">${v[0]} (${fmt(v[1])})</button>`).join('')}</div><hr style="border-color:#2c3550">
 <b>Transfert de stock</b> (carburant 40 €)<div style="margin:6px 0">De <select onchange="T.s=+this.value">${o(T.s)}</select> vers <select onchange="T.d=+this.value">${o(T.d)}</select></div>
 <div class="row">${[1000,2000,5000].map(a=>`<button class="sec" onclick="transfer(${a})">${fmt(a)}</button>`).join('')}<button class="grn" onclick="bulk()">📦 Achat en gros entrepôt : +5 000 € de stock pour 4 250 €</button></div>
 <div class="row"><button class="sec" onclick="hub()">Retour</button></div>`)}
function buyVeh(k){if(G.money<VEH[k][1])return;G.money-=VEH[k][1];p4().veh.push(k);save();hud();logiModal()}
function sellVeh(i){const P=p4();G.money+=Math.round(VEH[P.veh[i]][1]*.7);P.veh.splice(i,1);save();hud();logiModal()}
function transfer(a){const s=G.biz[T.s],d=G.biz[T.d];if(!s||!d||T.s===T.d)return toast('Choisissez deux établissements différents');if(!hasVeh())return toast('Il faut un véhicule');
 if(a>vcap())return toast('Capacité du véhicule dépassée');if(s.stock<a||G.money<40)return toast('Stock ou trésorerie insuffisant');s.stock-=a;d.stock+=a;G.money-=40;save();hud();toast(`Transfert de ${fmt(a)} effectué`)}
function bulk(){const w=Object.values(G.biz).find(z=>z.s==='entrep'&&z.open);if(!w)return toast("Il faut un entrepôt ouvert (secteur « Entrepôt et distribution »)");if(G.money<4250)return toast('Trésorerie insuffisante');G.money-=4250;w.stock+=5000;save();hud();toast('Stock acheté en gros dans '+w.name)}
// ---- banque
function bankModal(){const P=p4();modal(`<h2>🏦 Banque</h2><table>${P.loans.map(l=>`<tr><td>Capital restant ${fmt(l.p)}</td><td>${l.left} mois</td><td>${fmt(l.pay)}/mois (${(l.r*100).toFixed(1)} %)</td></tr>`).join('')||'<tr><td>Aucun prêt en cours</td></tr>'}</table>
 <small>Prêt accordé si votre patrimoine net couvre 40 % du montant (plafond 200 000 € d'encours).</small><div class="row">${LOANS.map(([a,n,r],i)=>`<button onclick="takeLoan(${i})">${fmt(a)} · ${n} mois · ${(r*100).toFixed(1)} %</button>`).join('')}<button class="sec" onclick="hub()">Retour</button></div>`)}
function takeLoan(i){const[a,n,r]=LOANS[i],P=p4();if(netW()<a*.4)return toast('Patrimoine insuffisant pour ce prêt');if(P.loans.reduce((s,l)=>s+l.p,0)+a>200000)return toast("Plafond d'encours atteint");
 const m=r/12;P.loans.push({p:a,r,left:n,pay:Math.round(a*m/(1-Math.pow(1+m,-n)))});G.money+=a;save();hud();bankModal()}
// ---- expansion
function expModal(){const P=p4();modal(`<h2>🌍 Expansion</h2><small>Implantation simplifiée dans une autre ville (non modélisée en 3D) : un réseau régional rapporte 2 500 €/mois. Holding requise.</small>
 ${CITIES.map(([n,c])=>{const have=P.cities.includes(n);return`<div style="margin:6px 0">${n} — ${fmt(c)} <button ${have||G.money<c||!P.hold?'disabled':''} onclick="openCity('${n}',${c})">${have?'Implanté ✔':P.hold?'Ouvrir':'Holding requise'}</button></div>`}).join('')}<div class="row"><button class="sec" onclick="hub()">Retour</button></div>`)}
function openCity(n,c){if(G.money<c)return;G.money-=c;p4().cities.push(n);save();hud();toast('🌍 Implantation à '+n);expModal()}
// ---- rachat de concurrents
const _show=show;show=function(){_show();const b=sel;if(b&&b.state==='occupied'&&b.cs&&!b.shop){const c=Math.round(b.price*1.3);$('panel').insertAdjacentHTML('beforeend',`<button class="grn" ${G.money<c?'disabled':''} onclick="acquire(${b.id})">🤝 Racheter l'entreprise concurrente (${fmt(c)})</button>`)}};
function setupBiz(b,s,q,rep){const z={s:Object.keys(SECT).find(k=>SECT[k]===s),name:clean(s.n+' '+b.address.split(' ').slice(1).join(' ')).slice(0,30),q,open:false,staff:s.staff,stock:Math.round(s.stock*q),inv:{},layout:[],orders:[],rev:0,rep};
 const g=gridOf(b);Object.entries({...s.req,...s.opt}).forEach(([i,n])=>{for(let k=0;k<n;k++)if(!autoFit(z,g,i))z.inv[i]=(z.inv[i]||0)+1});G.biz[b.id]=z;z.open=reqs(b.id).every(x=>x.ok);return z}
function acquire(id){const b=buildings[id],c=Math.round(b.price*1.3),s=SECT[b.cs];if(G.money<c||!s)return;G.money-=c;G.owned.push(id);delete p3().cw[id];
 const z=setupBiz(b,s,1,55);apply();save();paint();sel=b;show();toast('🤝 Entreprise rachetée : '+z.name+(z.open?'':' (à aménager avant ouverture)'))}
// ---- succursales et franchises
const brCost=z=>{const s=SECT[z.s];return Math.round((s.fee+s.sign*z.q+s.stock*z.q+pkg(s)*.85)*.8)};
const _bm4=bizModal;bizModal=function(id){_bm4(id);const z=G.biz[id],s=SECT[z.s],free=buildings.filter(b=>(G.owned.includes(b.id)||G.leased.includes(b.id))&&!G.biz[b.id]&&s.t.includes(b.type)&&b.area>=s.minA);
 $('mbox').insertAdjacentHTML('beforeend',`<hr style="border-color:#2c3550"><b>🌐 Réseau</b><div style="margin:6px 0">Franchises vendues : ${z.fr||0}/3 (+400 €/mois chacune, réputation ≥ 60 requise)</div>
 <div class="row"><button class="sec" ${(z.fr||0)>=3||z.rep<60?'disabled':''} onclick="sellFr(${id})">Vendre une franchise (+8 000 €)</button>
 ${free.slice(0,4).map(b=>`<button class="sec" ${G.money<brCost(z)?'disabled':''} onclick="branch(${id},${b.id})">Succursale : ${b.address} (${fmt(brCost(z))})</button>`).join('')||'<small>Aucun local libre adapté pour une succursale.</small>'}</div>`)};
function sellFr(id){const z=G.biz[id];if((z.fr||0)>=3||z.rep<60)return;z.fr=(z.fr||0)+1;G.money+=8000;save();hud();toast('Franchise vendue !');bizModal(id)}
function branch(src,dst){const z=G.biz[src],c=brCost(z);if(G.money<c)return;G.money-=c;const n=setupBiz(buildings[dst],SECT[z.s],z.q,Math.round(z.rep*.7));n.name=clean(z.name).slice(0,22)+' II';
 save();hud();toast('Succursale créée : '+n.name+(n.open?' (ouverte)':' (à aménager)'));bizModal(dst)}
