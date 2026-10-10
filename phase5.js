// ===== Empire Ambitions — Phase 5 : refonte de la carte, inventaire, fournitures =====
ren.toneMapping=THREE.ACESFilmicToneMapping;ren.toneMappingExposure=1.3;ren.shadowMap.type=THREE.PCFSoftShadowMap;
cam.far=2500;cam.updateProjectionMatrix();sun.shadow.bias=-.0004;hemi.intensity=.8;scene.fog=new THREE.Fog(0xcfe3f2,230,640);
const IM=THREE.InstancedMesh,DUM=new THREE.Object3D(),ZERO=new THREE.Matrix4().makeScale(0,0,0),FCV={},FT={},IS={};
const cv=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
const tex=(c,rx,ry)=>{const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx||1,ry||1);t.anisotropy=4;return t};
const dcv=(w,h,f)=>{const c=cv(w,h);f(c.getContext('2d'));return tex(c)};
const noiseCv=(base,n,al,s)=>{s=s||128;const c=cv(s,s),x=c.getContext('2d');x.fillStyle=base;x.fillRect(0,0,s,s);for(let i=0;i<n;i++){x.fillStyle=`rgba(${Math.random()<.5?0:255},${Math.random()<.5?0:255},${Math.random()<.5?0:255},${al})`;x.fillRect(Math.random()*s,Math.random()*s,2+Math.random()*3,2+Math.random()*3)}return c};
// ---- ciel
function skyCv(night){const c=cv(512,256),x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,256);
 if(night){g.addColorStop(0,'#02040c');g.addColorStop(.5,'#18305a');g.addColorStop(1,'#18305a')}else{g.addColorStop(0,'#2f6fc9');g.addColorStop(.4,'#7fb6e8');g.addColorStop(.5,'#dcedf8');g.addColorStop(1,'#dcedf8')}
 x.fillStyle=g;x.fillRect(0,0,512,256);if(night)for(let i=0;i<260;i++){x.fillStyle=`rgba(255,255,255,${.3+Math.random()*.7})`;x.fillRect(Math.random()*512,Math.random()*120,1.5,1.5)}return new THREE.CanvasTexture(c)}
const skyD=skyCv(0),skyN=skyCv(1),sky=new THREE.Mesh(new THREE.SphereGeometry(1100,32,16),new THREE.MeshBasicMaterial({map:skyD,side:THREE.BackSide,fog:false,toneMapped:false,depthWrite:false}));sky.renderOrder=-1;scene.add(sky);
// ---- façades
const PAL={commerce:[['#c9a27e','#efe6d8','#8a5a44'],['#b5654a','#e9dccb','#3c3c3c'],['#d9c9a3','#ffffff','#5a7d9a'],['#9c8f86','#e8e2da','#7a3b3b']],
 logement:[['#e8dcc8','#ffffff','#6b8e9f'],['#f1e3b8','#ffffff','#8e5b3a'],['#d8c7d8','#ffffff','#4f6b8a'],['#cfd8c4','#ffffff','#7a6a4f']],
 bureau:[['#6e8ea6','#c7d3dc','#0b2540'],['#5b7a8c','#cfd8de','#12303f'],['#7b8ea3','#d5dbe2','#10253a'],['#4d6d7d','#c3d0d6','#0f2c36']],
 entrepot:[['#8f9a76','#d8d8cc','#55603f'],['#9aa2ab','#e0e3e6','#505860'],['#a58f78','#e3dacd','#6b5a45'],['#7f8f9a','#d6dde2','#46545f']]};
function facadeCv(type,v){const k=type+v;if(FCV[k])return FCV[k];const c=cv(128,128),e=cv(128,128),x=c.getContext('2d'),y=e.getContext('2d'),p=PAL[type][v%4];
 x.fillStyle=p[0];x.fillRect(0,0,128,128);y.fillStyle='#000';y.fillRect(0,0,128,128);
 for(let i=0;i<260;i++){x.fillStyle=`rgba(${Math.random()<.5?0:255},${Math.random()<.5?0:255},${Math.random()<.5?0:255},.035)`;x.fillRect(Math.random()*128,Math.random()*128,4,2)}
 const lit=()=>Math.random()<.6?(Math.random()<.5?'#ffd98a':'#fff1c9'):null;
 const win=(px,py,w,h)=>{x.fillStyle=p[1];x.fillRect(px-3,py-3,w+6,h+6);const g=x.createLinearGradient(px,py,px+w,py+h);g.addColorStop(0,'#9fc4dd');g.addColorStop(1,'#35546e');x.fillStyle=g;x.fillRect(px,py,w,h);x.fillStyle='rgba(255,255,255,.4)';x.fillRect(px,py,w,3);x.fillStyle=p[1];x.fillRect(px+w/2-1,py,2,h);x.fillRect(px-5,py+h+3,w+10,4);const l=lit();if(l){y.fillStyle=l;y.fillRect(px,py,w,h)}};
 if(type==='bureau'){for(let i=0;i<4;i++){const px=i*32,g=x.createLinearGradient(px,18,px+32,94);g.addColorStop(0,'#8fb8d4');g.addColorStop(1,'#1d3f5c');x.fillStyle=g;x.fillRect(px+2,16,28,80);x.fillStyle='rgba(255,255,255,.25)';x.fillRect(px+2,16,28,5);const l=lit();if(l){y.fillStyle=l;y.fillRect(px+2,16,28,80)}}x.fillStyle=p[1];x.fillRect(0,0,128,14);x.fillRect(0,96,128,32);for(let i=0;i<4;i++)x.fillRect(i*32,0,2,128)}
 else if(type==='entrepot'){for(let i=0;i<128;i+=4){x.fillStyle=i%8?'rgba(0,0,0,.14)':'rgba(255,255,255,.1)';x.fillRect(i,0,2,128)}for(let i=0;i<6;i++){const px=8+i*20;x.fillStyle='#2b3a46';x.fillRect(px,16,14,12);x.fillStyle='rgba(255,255,255,.3)';x.fillRect(px,16,14,3);const l=lit();if(l){y.fillStyle=l;y.fillRect(px,16,14,12)}}}
 else if(type==='logement'){win(16,22,32,50);win(80,22,32,50);x.fillStyle=p[2];[8,52,72,116].forEach(px=>x.fillRect(px,22,8,50));x.fillStyle=p[1];x.fillRect(4,96,120,4);for(let i=6;i<124;i+=8)x.fillRect(i,100,2,16)}
 else{win(14,24,36,50);win(78,24,36,50);x.fillStyle=p[2];x.fillRect(0,0,128,10)}
 x.fillStyle='rgba(0,0,0,.2)';x.fillRect(0,124,128,4);return FCV[k]=[c,e]}
function facadeT(type,v,rx,ry){const k=type+v+'|'+rx+'|'+ry;if(!FT[k]){const[c,e]=facadeCv(type,v);FT[k]=[tex(c,rx,ry),tex(e,rx,ry)]}return FT[k]}
const sfTex=dcv(256,128,x=>{x.fillStyle='#2b2d33';x.fillRect(0,0,256,128);const g=x.createLinearGradient(0,0,256,128);g.addColorStop(0,'#bfe3f5');g.addColorStop(1,'#4a7ea0');x.fillStyle=g;x.fillRect(8,8,170,112);x.fillStyle='rgba(255,255,255,.3)';x.beginPath();x.moveTo(30,8);x.lineTo(70,8);x.lineTo(30,120);x.lineTo(8,120);x.fill();x.fillStyle='#1c1d22';x.fillRect(188,8,60,120);x.fillStyle='#7fb7d6';x.fillRect(194,14,48,98);x.fillStyle='#ccc';x.fillRect(196,64,4,14)});
const doorT=dcv(64,128,x=>{x.fillStyle='#4b3426';x.fillRect(0,0,64,128);x.fillStyle='#6b4b36';x.fillRect(6,6,52,116);x.fillStyle='#9fc4dd';x.fillRect(14,14,36,40);x.fillStyle='#d8b04a';x.fillRect(48,70,5,5)});
const rollT=dcv(128,128,x=>{x.fillStyle='#8c949c';x.fillRect(0,0,128,128);for(let i=0;i<128;i+=8){x.fillStyle='rgba(0,0,0,.25)';x.fillRect(0,i,128,2)}x.fillStyle='#f2c230';x.fillRect(0,120,128,8)});
const lobT=dcv(128,128,x=>{x.fillStyle='#1b2733';x.fillRect(0,0,128,128);const g=x.createLinearGradient(0,0,128,128);g.addColorStop(0,'#a8d4ee');g.addColorStop(1,'#2d5878');x.fillStyle=g;x.fillRect(6,6,56,116);x.fillRect(66,6,56,116);x.fillStyle='#ccc';x.fillRect(58,60,3,16);x.fillRect(67,60,3,16)});
const SIGNS=[['BOUTIQUE','#8e3b8f'],['CAFÉ','#7a4a2a'],['BOULANGERIE','#b8742a'],['COIFFURE','#2a6f9e'],['PHARMACIE','#1e8a4c'],['FLEURISTE','#c2477a'],['LIBRAIRIE','#3c4d8a'],['RESTAURANT','#b02e2e']],AWN=[0xc0392b,0x2c7a4b,0x2a5db0,0xd98e04,0x7a3b8f];
// ---- sets instanciés
const BOX=()=>new THREE.BoxGeometry(1,1,1),PLN=()=>new THREE.PlaneGeometry(1,1);
const SETDEF={par:[BOX,()=>new THREE.MeshLambertMaterial({color:0xa8a8a2}),1],ac:[BOX,()=>new THREE.MeshLambertMaterial({color:0xcfd3d6}),1],ant:[BOX,()=>new THREE.MeshLambertMaterial({color:0x555555}),1],
 awn:[BOX,()=>new THREE.MeshLambertMaterial({color:0xffffff}),1],sf:[PLN,()=>new THREE.MeshLambertMaterial({map:sfTex})],door:[PLN,()=>new THREE.MeshLambertMaterial({map:doorT})],
 roll:[PLN,()=>new THREE.MeshLambertMaterial({map:rollT})],lob:[PLN,()=>new THREE.MeshLambertMaterial({map:lobT})]};
function signSet(s){const k='sign:'+s[0];if(!SETDEF[k])SETDEF[k]=[PLN,()=>new THREE.MeshLambertMaterial({map:dcv(256,64,x=>{x.fillStyle=s[1];x.fillRect(0,0,256,64);x.strokeStyle='#fff';x.lineWidth=4;x.strokeRect(4,4,248,56);x.fillStyle='#fff';x.font='bold 26px system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(s[0],128,34,230)})})];return k}
function iadd(k,b,x,y,z,sx,sy,sz,ry,col){let s=IS[k];if(!s){const d=SETDEF[k],m=new IM(d[0](),d[1](),700);m.count=0;m.castShadow=!!d[2];scene.add(m);s=IS[k]={m,n:0}}
 const o=DUM;o.position.set(x,y,z);o.rotation.set(0,ry||0,0);o.scale.set(sx,sy,sz);o.updateMatrix();s.m.setMatrixAt(s.n,o.matrix);
 if(col!==undefined){s.m.setColorAt(s.n,new THREE.Color(col));s.m.instanceColor.needsUpdate=true}
 (b.inst=b.inst||[]).push([s,s.n,o.matrix.clone()]);s.n++;s.m.count=s.n;s.m.instanceMatrix.needsUpdate=true}
const PINGEO=new THREE.ConeGeometry(.9,1.8,6);PINGEO.rotateX(Math.PI);
// ---- bâtiments
function mk(b){const bx=Math.round(b.x/PITCH+(N-1)/2),bz=Math.round(b.z/PITCH+(N-1)/2),lx=b.x-(bx-(N-1)/2)*PITCH,lz=b.z-(bz-(N-1)/2)*PITCH;
 let ry=0;if(lz>4)ry=0;else if(lz<-4)ry=Math.PI;else if(lx>4)ry=Math.PI/2;else if(lx<-4)ry=-Math.PI/2;
 const zf=Math.abs(Math.sin(ry))<.5,fw=zf?b.w:b.d,off=(zf?b.d:b.w)/2,sx=Math.sin(ry),sz=Math.cos(ry),v=b.id%4,Y=.3;
 const[ct,et]=facadeT(b.type,v,Math.max(1,Math.round(Math.max(b.w,b.d)/3.5)),b.floors);
 const body=new THREE.Mesh(new THREE.BoxGeometry(b.w,b.h,b.d),new THREE.MeshLambertMaterial({map:ct,emissiveMap:et,emissive:0x000000,transparent:true}));
 body.position.set(b.x,Y+b.h/2,b.z);body.castShadow=body.receiveShadow=true;body.userData.id=b.id;
 const roof=new THREE.Mesh(new THREE.BoxGeometry(b.w-.3,.3,b.d-.3),new THREE.MeshLambertMaterial({transparent:true}));roof.position.set(b.x,Y+b.h+.5,b.z);roof.userData.id=b.id;
 const pin=new THREE.Mesh(PINGEO,new THREE.MeshBasicMaterial({transparent:true,toneMapped:false}));pin.position.set(b.x,Y+b.h+3.5,b.z);pin.userData.id=b.id;
 scene.add(body,roof,pin);b.body=body;b.roof=roof;b.pin=pin;meshes.push(body,roof,pin);
 iadd('par',b,b.x,Y+b.h+.3,b.z,b.w+.5,.6,b.d+.5,0);iadd('ac',b,b.x+b.w*.2,Y+b.h+1,b.z-b.d*.2,1.2,.7,1,0);
 if(b.floors>3)iadd('ant',b,b.x-b.w*.25,Y+b.h+2.2,b.z+b.d*.2,.12,3.4,.12,0);
 const fx=b.x+sx*(off+.04),fz=b.z+sz*(off+.04),shop=b.shop,sg=shop==='supply'?['FOURNITURES','#e08a00']:shop?['MEUBLES & ÉQUIP.','#0e9d94']:SIGNS[b.id%SIGNS.length];
 if(b.type==='commerce'||shop){iadd('sf',b,fx,Y+1.6,fz,fw*.82,3,1,ry);iadd('awn',b,b.x+sx*(off+.7),Y+3.3,b.z+sz*(off+.7),fw*.9,.2,1.5,ry,AWN[b.id%5]);
  iadd(signSet(sg),b,b.x+sx*(off+.06),Y+Math.min(3.95,b.h-.5),b.z+sz*(off+.06),fw*.6,.8,1,ry)}
 else if(b.type==='entrepot')iadd('roll',b,fx,Y+1.6,fz,Math.min(4.5,fw*.6),3.2,1,ry);
 else if(b.type==='bureau')iadd('lob',b,fx,Y+1.4,fz,Math.min(4,fw*.7),2.8,1,ry);
 else iadd('door',b,fx,Y+1.1,fz,1.2,2.2,1,ry)}
// ---- sol, routes, décor
const lampHead=new THREE.MeshLambertMaterial({color:0xfff2c8,emissive:0x000000});
function roads(){const g=tex(noiseCv('#5a9650',900,.07),180,180),gr=new THREE.Mesh(new THREE.PlaneGeometry(1800,1800),new THREE.MeshLambertMaterial({map:g}));gr.rotation.x=-Math.PI/2;gr.position.y=-.05;gr.receiveShadow=true;scene.add(gr);
 const as=new THREE.Mesh(new THREE.PlaneGeometry(EXT*2,EXT*2),new THREE.MeshLambertMaterial({map:tex(noiseCv('#34373c',700,.06),EXT/10,EXT/10)}));as.rotation.x=-Math.PI/2;as.position.y=.02;as.receiveShadow=true;scene.add(as);
 const pc=noiseCv('#aaa8a2',200,.05,64),px=pc.getContext('2d');px.strokeStyle='rgba(0,0,0,.2)';px.strokeRect(0,0,64,64);px.beginPath();px.moveTo(32,0);px.lineTo(32,64);px.moveTo(0,32);px.lineTo(64,32);px.stroke();
 const pm=new THREE.MeshLambertMaterial({map:tex(pc,6,6)}),cm=new THREE.MeshLambertMaterial({color:0xcfcfca}),S=BLK*LOT+1;
 for(let bx=0;bx<N;bx++)for(let bz=0;bz<N;bz++){const cx=(bx-(N-1)/2)*PITCH,cz=(bz-(N-1)/2)*PITCH;
  const cu=new THREE.Mesh(new THREE.BoxGeometry(S+1.2,.26,S+1.2),cm);cu.position.set(cx,.13,cz);cu.receiveShadow=true;const sw=new THREE.Mesh(new THREE.BoxGeometry(S,.3,S),pm);sw.position.set(cx,.15,cz);sw.receiveShadow=true;scene.add(cu,sw)}
 const mk2=(geo,col,n)=>new IM(geo,new THREE.MeshBasicMaterial({color:col}),n),dash=[],zeb=[];
 for(let k=0;k<=N;k++){const c=(k-N/2)*PITCH;for(let t=-EXT+4;t<EXT-3;t+=6){dash.push([t,c,0],[c,t,1])}
  for(let k2=0;k2<=N;k2++){const c2=(k2-N/2)*PITCH;for(const s of[-2.2,-1.3,-.4,.5,1.4,2.3]){zeb.push([c+5,c2+s,0],[c-5,c2+s,0],[c2+s,c+5,1],[c2+s,c-5,1])}}}
 const place=(m,arr,y)=>{arr.forEach((d,i)=>{DUM.position.set(d[0],y,d[1]);DUM.rotation.set(-Math.PI/2,0,d[2]?Math.PI/2:0);DUM.scale.set(1,1,1);DUM.updateMatrix();m.setMatrixAt(i,DUM.matrix)});scene.add(m)};
 place(mk2(new THREE.PlaneGeometry(3,.22),0xe8d96a,dash.length),dash,.05);place(mk2(new THREE.PlaneGeometry(2.2,.5),0xf2f2f2,zeb.length),zeb,.055);
 const lp=[];for(let bx=0;bx<N;bx++)for(let bz=0;bz<N;bz++){const cx=(bx-(N-1)/2)*PITCH,cz=(bz-(N-1)/2)*PITCH;for(const a of[-1,1])for(const b of[-1,1])lp.push([cx+a*13,cz+b*13])}
 const pol=new IM(new THREE.CylinderGeometry(.07,.1,4.6,6),new THREE.MeshLambertMaterial({color:0x2b2f36}),lp.length),hd=new IM(new THREE.SphereGeometry(.3,8,6),lampHead,lp.length);
 lp.forEach((p,i)=>{DUM.rotation.set(0,0,0);DUM.scale.set(1,1,1);DUM.position.set(p[0],2.6,p[1]);DUM.updateMatrix();pol.setMatrixAt(i,DUM.matrix);DUM.position.y=5;DUM.updateMatrix();hd.setMatrixAt(i,DUM.matrix)});pol.castShadow=true;scene.add(pol,hd)}
function trees(){const pos=[];for(let bx=0;bx<N;bx++)for(let bz=0;bz<N;bz++){const cx=(bx-(N-1)/2)*PITCH,cz=(bz-(N-1)/2)*PITCH;for(const o of[-8,0,8])pos.push([cx+12.3,cz+o],[cx-12.3,cz+o],[cx+o,cz+12.3],[cx+o,cz-12.3])}
 const tr=new IM(new THREE.CylinderGeometry(.15,.22,1.6,6),new THREE.MeshLambertMaterial({color:0x6b4a2b}),pos.length),cr=new IM(new THREE.IcosahedronGeometry(1,1),new THREE.MeshLambertMaterial({color:0xffffff}),pos.length),G4=[0x3e8e41,0x4fa34a,0x2f7a3a,0x6aa84f];
 pos.forEach((p,i)=>{const s=.85+((i*7)%6)/10;DUM.rotation.set(0,i,0);DUM.scale.set(1,1,1);DUM.position.set(p[0],1.1,p[1]);DUM.updateMatrix();tr.setMatrixAt(i,DUM.matrix);DUM.scale.set(s,s*1.1,s);DUM.position.y=2.6;DUM.updateMatrix();cr.setMatrixAt(i,DUM.matrix);cr.setColorAt(i,new THREE.Color(G4[i%4]))});tr.castShadow=cr.castShadow=true;scene.add(tr,cr);
 const nf=420,fo=new IM(new THREE.ConeGeometry(2.4,8,6),new THREE.MeshLambertMaterial({color:0xffffff}),nf);
 for(let i=0;i<nf;i++){const a=Math.random()*6.283,r=130+Math.random()*210,s=.8+Math.random()*1.1;DUM.rotation.set(0,0,0);DUM.scale.set(s,s,s);DUM.position.set(Math.cos(a)*r,3.8*s,Math.sin(a)*r);DUM.updateMatrix();fo.setMatrixAt(i,DUM.matrix);fo.setColorAt(i,new THREE.Color().setHSL(.33,.45,.14+Math.random()*.1))}scene.add(fo);
 const mo=new IM(new THREE.ConeGeometry(1,1,7),new THREE.MeshLambertMaterial({color:0xffffff}),30);
 for(let i=0;i<30;i++){const a=i/30*6.283,r=470+Math.random()*50,h=90+Math.random()*90,w=70+Math.random()*50;DUM.rotation.set(0,Math.random()*3,0);DUM.scale.set(w,h,w);DUM.position.set(Math.cos(a)*r,h/2-6,Math.sin(a)*r);DUM.updateMatrix();mo.setMatrixAt(i,DUM.matrix);mo.setColorAt(i,new THREE.Color().setHSL(.3+Math.random()*.1,.12,.32+Math.random()*.12))}scene.add(mo)}
// ---- vie : voitures, piétons, nuages
const CAR=[],PED=[],CLD=[],HP=12.1,PER=8*HP;let carB,carC,pedB,pedH,cloudM;
function mkCars(){const n=58,cols=[0xd33,0x39f,0xeeeeee,0x333,0xfc3,0x2a6,0x888];carB=new IM(new THREE.BoxGeometry(2.5,.7,1.2),new THREE.MeshLambertMaterial({color:0xffffff}),n);carC=new IM(new THREE.BoxGeometry(1.3,.55,1.05),new THREE.MeshLambertMaterial({color:0x2a3a4a}),n);
 for(let i=0;i<n;i++){const bus=i%14===0;CAR.push({ax:i%4<2?0:1,c:(Math.floor(Math.random()*(N+1))-N/2)*PITCH,s:i%2?1:-1,p:(Math.random()*2-1)*EXT,v:bus?.1:.12+Math.random()*.12,k:bus?1:0});carB.setColorAt(i,new THREE.Color(bus?0xf2b705:cols[i%7]))}carB.castShadow=carC.castShadow=true;scene.add(carB,carC);
 const np=90;pedB=new IM(new THREE.CylinderGeometry(.22,.26,.95,6),new THREE.MeshLambertMaterial({color:0xffffff}),np);pedH=new IM(new THREE.SphereGeometry(.19,6,5),new THREE.MeshLambertMaterial({color:0xe0b894}),np);
 for(let i=0;i<np;i++){PED.push({bx:Math.floor(Math.random()*N),bz:Math.floor(Math.random()*N),t:Math.random()*PER,d:i%2?1:-1,v:.012+Math.random()*.014});pedB.setColorAt(i,new THREE.Color().setHSL(Math.random(),.55,.5))}scene.add(pedB,pedH);
 cloudM=new IM(new THREE.SphereGeometry(1,8,6),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.85,fog:false,toneMapped:false}),18);
 for(let i=0;i<18;i++)CLD.push({x:(Math.random()*2-1)*420,y:110+Math.random()*60,z:(Math.random()*2-1)*420,sx:18+Math.random()*16,sz:10+Math.random()*8});scene.add(cloudM)}
function perPos(t){const u=t%(2*HP)-HP;switch(Math.floor(t/(2*HP))%4){case 0:return[u,-HP];case 1:return[HP,u];case 2:return[-u,HP];default:return[-HP,-u]}}
function moveCars(dt){const t=performance.now()/1000,f=(inGame&&uiPause)?0:Math.max(inGame?speed:1,.3),o=DUM;
 if(carB){CAR.forEach((c,i)=>{c.p+=c.s*c.v*dt*60*f;if(c.p>EXT)c.p=-EXT;if(c.p<-EXT)c.p=EXT;const l=c.s*1.7,bus=c.k;
  o.position.set(c.ax?c.c+l:c.p,bus?.9:.4,c.ax?c.p:c.c-l);o.rotation.set(0,c.ax?Math.PI/2:0,0);o.scale.set(bus?2.2:1,bus?2.3:1,bus?1.05:1);o.updateMatrix();carB.setMatrixAt(i,o.matrix);
  o.position.y=1.02;o.scale.set(bus?0:1,1,1);o.updateMatrix();carC.setMatrixAt(i,o.matrix)});carB.instanceMatrix.needsUpdate=carC.instanceMatrix.needsUpdate=true}
 if(pedB){PED.forEach((q,i)=>{q.t=(q.t+q.d*q.v*dt*60*f+PER)%PER;const p=perPos(q.t),bob=f?Math.abs(Math.sin(t*6+i))*.06:0,x=(q.bx-(N-1)/2)*PITCH+p[0],z=(q.bz-(N-1)/2)*PITCH+p[1];
  o.rotation.set(0,0,0);o.scale.set(1,1,1);o.position.set(x,.3+.5+bob,z);o.updateMatrix();pedB.setMatrixAt(i,o.matrix);o.position.y=.3+1.17+bob;o.updateMatrix();pedH.setMatrixAt(i,o.matrix)});pedB.instanceMatrix.needsUpdate=pedH.instanceMatrix.needsUpdate=true}
 if(cloudM){CLD.forEach((c,i)=>{c.x+=.05*dt*60;if(c.x>440)c.x=-440;o.rotation.set(0,0,0);o.position.set(c.x,c.y,c.z);o.scale.set(c.sx,6,c.sz);o.updateMatrix();cloudM.setMatrixAt(i,o.matrix)});cloudM.instanceMatrix.needsUpdate=true}
 buildings.forEach(b=>{if(b.pin&&b.pin.visible){b.pin.position.y=.3+b.h+3.6+Math.sin(t*2+b.id)*.35;b.pin.rotation.y=t}})}
// ---- peinture : épingles, détails, filtres, magasins
const _paint=paint;paint=function(){_paint();buildings.forEach(b=>{if(!b.pin)return;const show=b.body.material.opacity>.5,sup=b.shop==='supply';
 if(sup)b.roof.material.color.set('#ffb703');
 b.pin.visible=show&&!!(b.shop||b.flash||['sale','rent','owned','sublet','leased'].includes(b.state));b.pin.material.color.set(sup?'#ffb703':b.shop?'#1fd1c4':b.flash?'#ff4fd8':STATUS[b.state][1]);
 if(b._v!==show){b._v=show;(b.inst||[]).forEach(([s,i,m])=>{s.m.setMatrixAt(i,show?m:ZERO);s.m.instanceMatrix.needsUpdate=true})}})};
const _tn=toggleNight;toggleNight=function(){_tn();sky.material.map=night?skyN:skyD;sky.material.needsUpdate=true;scene.fog.color.set(night?0x142038:0xcfe3f2);scene.background.set(night?0x050a1a:0x9ec9e8);hemi.intensity=night?.4:.8;
 buildings.forEach(b=>{if(b.body)b.body.material.emissive.setScalar(night?1:0)});lampHead.emissive.set(night?0xffd27a:0x000000)};
// ===== INVENTAIRE ET FOURNITURES =====
const SUP={burger:['Burgers surgelés','carton de 30',45,30,['resto']],frites:['Frites surgelées','sac de 10 kg',22,10,['resto','trad']],boisson:['Boissons','pack de 24',18,24,['resto','cafe','trad','hotel']],
 pain:['Pains et viennoiseries','lot de 40',28,40,['cafe','resto']],cafeg:['Café en grains','sac de 5 kg',55,5,['cafe','hotel']],viande:['Viande et poisson','caisse de 10 kg',120,10,['trad','hotel']],
 legumes:['Fruits et légumes','caisse de 15 kg',40,15,['trad','epic']],sec:['Produits secs','palette de 60',210,60,['epic']],frais:['Produits frais','bac de 30',150,30,['epic']],
 vet:['Vêtements','lot de 20',380,20,['habit']],acc:['Accessoires mode','lot de 40',200,40,['habit']],elecs:['Appareils électroniques','lot de 10',900,10,['elec']],cables:['Câbles et accessoires','lot de 50',150,50,['elec']],
 meubk:['Meubles en kit','lot de 6',700,6,['meub']],deco:['Décoration','carton de 20',160,20,['meub','hotel']],pieces:['Pièces détachées','lot de 25',260,25,['repar']],
 coifp:['Produits capillaires','carton de 24',130,24,['coif']],papier:['Fournitures de bureau','carton de 20',90,20,['bur']],linge:['Linge de maison','lot de 20',220,20,['hotel']],
 supp:['Boissons et compléments sport','carton de 24',110,24,['sport']],palm:['Marchandises en palettes','palette',600,1,['entrep','gros']],mp:['Matières premières','palette',900,1,['indus']]};
const supFor=k=>Object.entries(SUP).filter(e=>e[1][4].includes(k));let invId=null;
function initSup(z){const l=supFor(z.s);z.sup={};if(l.length){const v=z.stock/l.length;l.forEach(([i,s])=>z.sup[i]=Math.round(v/s[2]*s[3]))}z._last=z.stock;return z}
function addSup(z,k,n){const s=SUP[k];z.sup=z.sup||{};z.sup[k]=(z.sup[k]||0)+s[3]*n;z.stock+=s[2]*n;z._last=z.stock}
const _wok=wizOk;wizOk=function(){_wok();const z=G.biz[W.bid];if(z){initSup(z);save()}};
const _sb=setupBiz;setupBiz=function(...a){return initSup(_sb(...a))};
const _p3d5=p3Day;p3Day=function(){_p3d5();Object.values(G.biz).forEach(z=>{z.sup=z.sup||{};
 if(z._last>0&&z.stock<z._last){const r=z.stock/z._last;Object.keys(z.sup).forEach(k=>z.sup[k]*=r)}
 z.sord=(z.sord||[]).filter(o=>{if(o.due<=G.day){addSup(z,o.k,1);toast('📦 Fournitures livrées : '+SUP[o.k][0]);return false}return true});z._last=z.stock})};
function markSupply(){let k=0,e=0;buildings.forEach(b=>{if(b.shop===true)b.name='Meubles & Équipement n°'+(++e)});
 buildings.filter(b=>b.type==='commerce'&&b.base==='occupied'&&!b.shop).filter((b,i)=>i%5===2).slice(0,4).forEach(b=>{b.shop='supply';b.name='Fournitures Pro n°'+(++k);b.baseOwner='Fournitures SA'})}
const _ms=markShops;markShops=function(){_ms();markSupply()};
const _so=shopOpen;shopOpen=function(){sel&&sel.shop==='supply'?supShop():_so()};
function supShop(){const ids=Object.keys(G.biz);if(!ids.length)return toast("Créez d'abord une entreprise");supCat(G.biz[catB]?catB:+ids[0],1)}
function supCat(id,shop){catB=id;const z=G.biz[id],l=supFor(z.s),k=shop?.9:1;
 modal(`<h2>${shop?'🛒 Fournitures Pro':'📦 Fournitures'}</h2><small>${shop?"Achat sur place −10 %, ajouté tout de suite à l'inventaire.":'Livraison en '+(hasVeh()?1:2)+' jour(s), frais '+(hasVeh()?'offerts (véhicule)':'+4 %')+'.'}</small>
 ${shop?`<div style="margin:8px 0">Destination : <select onchange="supCat(+this.value,1)">${Object.keys(G.biz).map(i=>`<option value="${i}" ${+i===id?'selected':''}>${G.biz[i].name}</option>`).join('')}</select></div>`:''}
 <table>${l.map(([i,s])=>{const p=Math.round(s[2]*k);return`<tr><td>${s[0]}<br><small>${s[1]} (${s[3]} unités)</small></td><td>${fmt(p+(shop?0:feeOf(p)))}</td><td><button onclick="buySup('${i}',${shop?1:0})">Acheter</button></td></tr>`}).join('')||'<tr><td>Aucun produit pour ce secteur</td></tr>'}</table>
 <div class="row"><button class="sec" onclick="${shop?'closeModal()':`invModal(${id})`}">Retour</button></div>`)}
function buySup(k,shop){const z=G.biz[catB];if(!z)return;const s=SUP[k],p=Math.round(s[2]*(shop?.9:1)),f=shop?0:feeOf(p);if(G.money<p+f)return toast('Trésorerie insuffisante');G.money-=p+f;
 if(shop){addSup(z,k,1);toast(`Acheté : ${s[0]} (${s[1]})`)}else{(z.sord=z.sord||[]).push({k,due:G.day+(hasVeh()?1:2)});toast('Commande passée : '+s[0])}save();hud()}
function invModal(id){const ids=Object.keys(G.biz);
 if(!ids.length)return modal('<h2>🎒 Inventaire</h2><p>Aucune entreprise. Créez-en une pour gérer vos meubles et vos fournitures.</p><div class="row"><button class="sec" onclick="closeModal()">Fermer</button></div>');
 id=(id!=null&&G.biz[id])?+id:(G.biz[invId]?invId:+ids[0]);invId=id;const z=G.biz[id];z.sup=z.sup||{};
 const furn=Object.entries(z.inv).filter(e=>e[1]>0),sv=Object.entries(z.sup).reduce((a,[k,u])=>a+u*SUP[k][2]/SUP[k][3],0),gen=Math.max(0,z.stock-sv);
 modal(`<h2>🎒 Inventaire</h2><div style="margin-bottom:8px"><select onchange="invModal(+this.value)">${ids.map(i=>`<option value="${i}" ${+i===id?'selected':''}>${G.biz[i].name}</option>`).join('')}</select></div>
 <b>🪑 Mobilier et équipement non installés</b><table>${furn.map(([k,n])=>`<tr><td>${ITEMS[k][0]}</td><td>×${n}</td></tr>`).join('')||'<tr><td>Rien en attente</td></tr>'}</table>
 <small>Installé dans le local : ${z.layout.length} objet(s)${(z.broken||[]).length?', '+z.broken.length+' en panne':''}</small>
 <div class="row"><button onclick="layoutModal(${id})">🪑 Aménager</button><button class="sec" onclick="catalog(${id},0)">Commander du mobilier</button></div><hr style="border-color:#2c3550">
 <b>📦 Fournitures</b><table>${Object.entries(z.sup).filter(e=>e[1]>=1).map(([k,u])=>`<tr><td>${SUP[k][0]}</td><td>${Math.floor(u)} unités</td></tr>`).join('')||'<tr><td>Aucune fourniture spécifique</td></tr>'}
 <tr><td>Stock général</td><td>${fmt(gen)}</td></tr><tr><td><b>Valeur totale du stock</b></td><td><b>${fmt(z.stock)}</b></td></tr></table><small>Livraisons en cours : ${z.orders.length+(z.sord||[]).length}</small>
 <div class="row"><button onclick="supCat(${id},0)">📦 Commander des fournitures</button><button class="sec" onclick="closeModal()">Fermer</button></div>`)}
const _bm5=bizModal;bizModal=function(id){_bm5(id);$('mbox').insertAdjacentHTML('beforeend',`<div class="row"><button onclick="invModal(${id})">🎒 Inventaire et fournitures</button></div>`)};
document.querySelector('#top .sp').insertAdjacentHTML('afterend','<button class="sec" onclick="invModal()">🎒 Inventaire</button>');
