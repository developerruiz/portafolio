(()=>{
const root=document.getElementById('icode-universe');if(!root)return;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;let motion=!reduced;root.dataset.motion=motion?'on':'off';
const q=s=>root.querySelector(s),qa=s=>[...root.querySelectorAll(s)];
// Wheel input arrives in steps. Interpolate native page scrolling every frame,
// without transforming the document or interfering with touch and keyboard input.
const scroller=document.scrollingElement;
let scrollFrame=0,scrollTarget=0,scrollPosition=0,scrollWritten=0,scrollStamp=0,scrollEase=105;
function stopSmoothScroll(){if(scrollFrame)cancelAnimationFrame(scrollFrame);scrollFrame=0;scrollStamp=0;if(scroller)scrollTarget=scrollPosition=scrollWritten=scroller.scrollTop}
function canScrollInside(target,delta){for(let el=target instanceof Element?target:null;el&&el!==root;el=el.parentElement){const overflow=getComputedStyle(el).overflowY;if((overflow==='auto'||overflow==='scroll')&&el.scrollHeight>el.clientHeight+2){if(delta>0&&el.scrollTop<el.scrollHeight-el.clientHeight-1)return true;if(delta<0&&el.scrollTop>1)return true}}return false}
function easeScroll(ts){if(!root.isConnected||!motion||reduced){stopSmoothScroll();return}const max=Math.max(0,scroller.scrollHeight-scroller.clientHeight);scrollTarget=Math.max(0,Math.min(max,scrollTarget));const dt=scrollStamp?Math.min(ts-scrollStamp,50):16.67;scrollStamp=ts;const gap=scrollTarget-scrollPosition;
if(Math.abs(gap)<.7){scrollWritten=scrollPosition=scrollTarget;scroller.scrollTop=scrollWritten;scrollFrame=0;scrollStamp=0;return}
scrollPosition+=gap*(1-Math.exp(-dt/scrollEase));scrollWritten=scrollPosition;scroller.scrollTop=scrollWritten;scrollFrame=requestAnimationFrame(easeScroll)}
root.addEventListener('wheel',e=>{if(!scroller||!motion||reduced||e.defaultPrevented||!e.cancelable||e.ctrlKey||e.metaKey||Math.abs(e.deltaX)>Math.abs(e.deltaY)||!e.deltaY)return;
if(e.target instanceof Element&&e.target.closest('input,textarea,select,[contenteditable="true"],[data-native-scroll]'))return;
const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?window.innerHeight*.85:1);if(canScrollInside(e.target,delta))return;
const max=Math.max(0,scroller.scrollHeight-scroller.clientHeight);if(!max)return;
if(!scrollFrame)scrollTarget=scrollPosition=scrollWritten=scroller.scrollTop;
const next=Math.max(0,Math.min(max,scrollTarget+delta));if(!scrollFrame&&Math.abs(next-scrollPosition)<.7)return;
e.preventDefault();scrollTarget=next;scrollEase=Math.abs(delta)<45?65:105;if(!scrollFrame){scrollStamp=0;scrollFrame=requestAnimationFrame(easeScroll)}},{passive:false});
window.addEventListener('scroll',()=>{if(scrollFrame&&Math.abs(scroller.scrollTop-scrollWritten)>2)stopSmoothScroll()},{passive:true});
window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(e.key))stopSmoothScroll()});
window.addEventListener('pointerdown',stopSmoothScroll,{passive:true});window.addEventListener('touchstart',stopSmoothScroll,{passive:true});window.addEventListener('resize',stopSmoothScroll,{passive:true});window.addEventListener('hashchange',stopSmoothScroll);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopSmoothScroll()});
const menu=q('.mobile-menu');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));q('.navlinks').classList.toggle('open',open)});
qa('a[href^="#icode-"]').forEach(a=>a.addEventListener('click',e=>{const target=q(a.getAttribute('href'));if(target){e.preventDefault();target.scrollIntoView({behavior:motion?'smooth':'auto',block:'start'});menu.setAttribute('aria-expanded','false');q('.navlinks').classList.remove('open')}}));
qa('.filter').forEach(b=>b.addEventListener('click',()=>{qa('.filter').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));qa('.project').forEach(p=>{p.hidden=b.dataset.filter!=='all'&&p.dataset.category!==b.dataset.filter;p.classList.add('seen')})}));
const systems={sap:['Aplicaciones empresariales conectadas.','SAPUI5, SAP BTP, CAP con Node.js, OData V2/V4 y Cloud Foundry: del dato a la interfaz.'],full:['Productos de extremo a extremo.','React, React Native, JavaScript, PHP y MySQL. Interfaces, APIs REST y bases de datos que trabajan juntas.'],design:['El código también se siente.','UX/UI, interfaces responsivas y animación con GSAP. Experiencias claras, cuidadas y con personalidad.']};
qa('.system-pill').forEach(b=>b.addEventListener('click',()=>{qa('.system-pill').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));q('.system-description h3').textContent=systems[b.dataset.system][0];q('.system-description p').textContent=systems[b.dataset.system][1];qa('[data-orbit]').forEach(x=>x.classList.toggle('active',x.dataset.orbit===b.dataset.system))}));
const projects={org:{title:'Organigrama & estructura RH',category:'SAP / Gestión organizacional',description:'Una aplicación para explorar y gestionar la estructura de la organización desde una vista gráfica y filtros encadenados.',points:['División operativa → sociedad → unidad organizativa.','Vistas de estructura, posiciones, empleados y auditoría.','Búsqueda individual y solicitudes de plazas y personal.'],stack:['SAPUI5','SAP BTP','OData','Graph']},recruit:{title:'Ecosistema de reclutamiento',category:'SAP / Talento y experiencia de usuario',description:'Un conjunto de aplicaciones que acompaña el proceso desde la consulta de vacantes hasta el seguimiento del candidato.',points:['Vacantes externas e internas, detalle y postulación.','Portal de candidatos y carga de documentación por folio.','Entrevistas, calificaciones y seguimiento de pendientes.','Historial de postulaciones y registro de apelaciones.'],stack:['SAPUI5','OData V4','SAP BTP','CAP / Node.js']},approvals:{title:'Autorizaciones & documentos',category:'SAP / Flujos y trazabilidad',description:'Interfaces para revisar documentos y gestionar decisiones con estados, comentarios e historial.',points:['Autorizaciones jerárquicas secuenciales y paralelas.','Lista y detalle con aceptación o rechazo y comentarios.','Revisión individual de documentos y cierre de validación.','Control de estados y concurrencia en los procesos.'],stack:['SAPUI5','OData','FlexibleColumnLayout','Flujos RH']},web:{title:'Experiencias web & motion',category:'Web / Diseño e interacción',description:'Sitios y propuestas digitales que combinan desarrollo, diseño visual y animaciones para contar una historia.',points:['Portafolios y sitios informativos responsivos.','Propuestas de invitaciones con escenas y transiciones por scroll.','Interfaces y mockups interactivos para revisar antes de desarrollar.','Este concepto de iCodeSpace: movimiento, galaxias y código.'],stack:['JavaScript','HTML / CSS','React','GSAP']}};
let opener=null;const layer=q('.dialog-layer'),dialog=q('.project-dialog');
function close(){layer.classList.remove('open');layer.hidden=true;opener?.focus()}
qa('.project-open').forEach(b=>b.addEventListener('click',()=>{opener=b;const p=projects[b.dataset.project];q('#icode-dialog-title').textContent=p.title;q('.dialog-category').textContent=p.category;q('.dialog-description').textContent=p.description;q('.dialog-points').replaceChildren(...p.points.map(t=>{const li=document.createElement('li');li.textContent=t;return li}));q('.dialog-stack').replaceChildren(...p.stack.map(t=>{const el=document.createElement('span');el.textContent=t;return el}));layer.hidden=false;layer.classList.add('open');const top=Math.max(20,b.getBoundingClientRect().top-root.getBoundingClientRect().top-30);layer.style.paddingTop=top+'px';q('.dialog-close').focus({preventScroll:true})}));
q('.dialog-close').addEventListener('click',close);layer.addEventListener('click',e=>{if(e.target===layer)close()});root.addEventListener('keydown',e=>{if(!layer.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='Tab'){e.preventDefault();q('.dialog-close').focus()}});
if('IntersectionObserver' in window&&!reduced){root.classList.add('animated');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('seen');observer.unobserve(e.target)}}),{threshold:.06});qa('.reveal').forEach(el=>observer.observe(el))}
const toggle=q('.motion-toggle');function updateMotion(){root.dataset.motion=motion?'on':'off';toggle.setAttribute('aria-pressed',String(motion));toggle.textContent='Animaciones: '+(motion?'activadas':'pausadas')}updateMotion();toggle.addEventListener('click',()=>{motion=!motion;updateMotion()});
toggle.addEventListener('click',()=>{if(!motion)stopSmoothScroll()});
// Small bright stars and meteors stay behind the page, never intercepting input.
// The canvas follows the visible slice; it does not allocate a full-page bitmap.
const sky=q('.stellar-canvas'),skyCtx=sky.getContext('2d');
if(skyCtx){
let sw=0,sh=0,viewH=0,skyTime=0,skyLast=0,skyDraw=0,nextMeteor=1.1,spaceVisible=true,skyPointer={x:0,y:0};
let stars=[],meteors=[],randomState=98421,skyDirty=true;
function rand(){randomState=(Math.imul(randomState,1664525)+1013904223)>>>0;return randomState/4294967296}
const starSprite=document.createElement('canvas');starSprite.width=starSprite.height=24;const spriteCtx=starSprite.getContext('2d');
const glow=spriteCtx.createRadialGradient(12,12,0,12,12,12);glow.addColorStop(0,'rgba(230,255,237,1)');glow.addColorStop(.12,'rgba(183,255,207,.8)');glow.addColorStop(.3,'rgba(102,214,158,.18)');glow.addColorStop(1,'rgba(102,214,158,0)');spriteCtx.fillStyle=glow;spriteCtx.fillRect(0,0,24,24);
function resizeSky(){const w=Math.round(root.clientWidth),h=Math.round(root.scrollHeight);if(w===sw&&h===sh)return;sw=w;sh=h;viewH=Math.min(h,Math.max(720,window.innerHeight||900));sky.width=sw;sky.height=viewH;sky.style.height=viewH+'px';randomState=98421;stars=Array.from({length:Math.min(950,Math.max(120,Math.floor(sw*sh/6000)))},()=>({x:rand()*sw,y:rand()*sh,z:.25+rand()*.75,r:.35+rand()*1.35,phase:rand()*6.283,drift:rand()*.55}));meteors=[];skyDirty=true}
new ResizeObserver(resizeSky).observe(root);resizeSky();
root.addEventListener('pointermove',e=>{const r=root.getBoundingClientRect();skyPointer.x=(e.clientX-r.left)/Math.max(1,sw)-.5;skyPointer.y=(e.clientY/Math.max(1,window.innerHeight))-.5;skyDirty=true},{passive:true});
root.addEventListener('pointerleave',()=>{skyPointer={x:0,y:0};skyDirty=true},{passive:true});
window.addEventListener('scroll',()=>{skyDirty=true},{passive:true});window.addEventListener('resize',()=>{sw=0;resizeSky()},{passive:true});
if('IntersectionObserver' in window)new IntersectionObserver(es=>{spaceVisible=es[0].isIntersecting;skyDirty=true},{threshold:0}).observe(root);
document.addEventListener('visibilitychange',()=>{skyLast=0;skyDirty=true});
toggle.addEventListener('click',()=>{meteors=[];skyDirty=true});
function drawSpace(ts){if(!root.isConnected)return;requestAnimationFrame(drawSpace);if(document.hidden||!spaceVisible){skyLast=0;return}if(!skyDirty&&ts-skyDraw<33)return;
const moving=motion&&!reduced,dt=skyLast?Math.min((ts-skyLast)/1000,.1):0;skyLast=ts;if(moving)skyTime+=dt;skyDraw=ts;
const rect=root.getBoundingClientRect();const top=Math.max(0,Math.min(sh-viewH,-rect.top));if(Math.abs((parseFloat(sky.style.top)||0)-top)>1)skyDirty=true;
if(!moving&&!skyDirty)return;skyDirty=false;sky.style.top=top+'px';skyCtx.clearRect(0,0,sw,viewH);
for(const s of stars){const px=s.x+(moving?skyPointer.x*18*s.z:0),py=(s.y+skyTime*s.drift*1.7)%Math.max(1,sh)-top+(moving?skyPointer.y*12*s.z:0);if(py< -20||py>viewH+20)continue;
const twinkle=moving ? .66+.28*Math.sin(s.phase+skyTime*(.45+s.z)): .78;skyCtx.globalAlpha=(.22+s.z*.48)*twinkle;
if(s.r>1.4){const size=9+s.z*7;skyCtx.drawImage(starSprite,px-size/2,py-size/2,size,size);skyCtx.fillStyle='#d3ffe4';skyCtx.fillRect(px-.35,py-2.2,.7,4.4);skyCtx.fillRect(px-2.2,py-.35,4.4,.7)}else{skyCtx.beginPath();skyCtx.arc(px,py,s.r,0,Math.PI*2);skyCtx.fillStyle=s.z>.65?'#d9f4e4':'#83bfa0';skyCtx.fill()}}
if(moving&&skyTime>=nextMeteor){const x=sw*(.35+rand()*.85),y=top+viewH*(.06+rand()*.5),speed=Math.max(190,Math.min(480,sw*.48));meteors.push({x,y,vx:-speed*.78,vy:speed*.62,age:0,life:1.25+rand()*.75,length:85+rand()*100});nextMeteor=skyTime+(sw<620?3.6:2.1)+rand()*2.2}
if(!moving)meteors=[];
for(const m of meteors){m.age+=dt;m.x+=m.vx*dt;m.y+=m.vy*dt;const fade=Math.min(1,m.age/.2)*Math.max(0,1-m.age/m.life);const x=m.x,y=m.y-top,tx=x+m.length*.78,ty=y-m.length*.62;
const trail=skyCtx.createLinearGradient(x,y,tx,ty);trail.addColorStop(0,'rgba(221,255,229,'+(.72*fade)+')');trail.addColorStop(.2,'rgba(129,241,167,'+(.28*fade)+')');trail.addColorStop(1,'rgba(110,232,159,0)');skyCtx.globalAlpha=1;skyCtx.strokeStyle=trail;skyCtx.lineWidth=1.2;skyCtx.beginPath();skyCtx.moveTo(x,y);skyCtx.lineTo(tx,ty);skyCtx.stroke();skyCtx.globalAlpha=fade;skyCtx.drawImage(starSprite,x-7,y-7,14,14)}
meteors=meteors.filter(m=>m.age<m.life);skyCtx.globalAlpha=1;
}requestAnimationFrame(drawSpace);
}
const canvas=q('.orb-canvas');const gl=canvas.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:false});
if(!gl){q('.sphere-fallback').style.display='block';canvas.style.display='none';return}
const vert='attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}';
const frag=`precision highp float;
uniform vec2 res;uniform float time;uniform vec2 mouse;
float hash(vec3 p){p=fract(p*.3183099+vec3(.1,.2,.3));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float v=0.;float a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.02+1.7;a*=.5;}return v;}
void main(){vec2 uv=(gl_FragCoord.xy-.5*res)/res.y;uv-=vec2(.07,-.005)+mouse*.012;float d=length(uv);vec3 col=vec3(0.);float alpha=0.;float radius=.272;
float halo=exp(-abs(d-radius)*32.)*.27+exp(-d*d*9.)*.07;col+=vec3(.42,.09,.72)*halo;alpha+=halo;
if(d<radius){vec3 n=vec3(uv/radius,sqrt(1.-d*d/(radius*radius)));float ang=time*.075;vec3 p=vec3(n.x*cos(ang)+n.z*sin(ang),n.y,n.z*cos(ang)-n.x*sin(ang));float cloud=fbm(p*3.2+vec3(0.,time*.018,0.));float ribbon=pow(.5+.5*sin(p.y*12.+cloud*13.+p.x*4.),3.);float fine=fbm(p*11.+cloud*2.);vec3 surface=mix(vec3(.025,.006,.055),vec3(.26,.045,.39),cloud);surface+=vec3(.32,.09,.51)*ribbon*.7;surface+=vec3(.13,.05,.24)*fine*.3;float light=max(dot(n,normalize(vec3(-.8,.55,1.))),0.);float rim=pow(1.-n.z,3.);float edgeLight=.25+.75*max(dot(normalize(vec3(n.xy,.1)),normalize(vec3(-1.,.45,.3))),0.);float spec=pow(max(dot(reflect(normalize(vec3(.8,-.55,-1.)),n),vec3(0,0,1)),0.),40.);col=surface*(.3+light*1.5)+vec3(.64,.29,1.)*rim*edgeLight*.9+vec3(.5,.34,.69)*spec*.6;alpha=1.;}
// A tilted 3D orbit: depth determines whether the planet hides the moon.
float orbitAngle=time*.28+3.14159265;
vec2 orbitPlane=vec2(.35*cos(orbitAngle),.14*sin(orbitAngle));
float orbitTilt=.67;
vec2 moonCenter=vec2(orbitPlane.x*cos(orbitTilt)-orbitPlane.y*sin(orbitTilt),orbitPlane.x*sin(orbitTilt)+orbitPlane.y*cos(orbitTilt));
float moonDepth=.32*sin(orbitAngle);
float moonRadius=.053*(1.+moonDepth*.40);
vec2 moon=uv-moonCenter;float md=length(moon);
float planetDepth=sqrt(max(0.,radius*radius-d*d));
if(md<moonRadius){
  vec3 n=vec3(moon/moonRadius,sqrt(max(0.,1.-md*md/(moonRadius*moonRadius))));
  float moonSurfaceDepth=moonDepth+n.z*moonRadius;
  if(d>=radius||moonSurfaceDepth>planetDepth){
    float spin=time*.55;
    vec3 lunarPoint=vec3(n.x*cos(spin)+n.z*sin(spin),n.y,n.z*cos(spin)-n.x*sin(spin));
    float rock=fbm(lunarPoint*6.5);
    float crater=smoothstep(.46,.68,noise(lunarPoint*13.));
    float shade=.18+.82*max(dot(n,normalize(vec3(-.6,.6,1.))),0.);
    vec3 lunarSurface=mix(vec3(.007,.009,.013),vec3(.060,.038,.098),rock);
    lunarSurface*=1.-crater*.45;
    float rim=pow(1.-n.z,4.);
    col=lunarSurface*shade+vec3(.15,.055,.21)*rim*.65;
    alpha=1.;
  }
}else if(d>=radius||moonDepth>planetDepth){
  float mh=exp(-abs(md-moonRadius)*120.)*.085;
  col+=vec3(.22,.055,.31)*mh;alpha=max(alpha,mh);
}
vec2 cell=floor(gl_FragCoord.xy/3.);float star=hash(vec3(cell,1.));if(star>.9993){float brightness=.3+.25*sin(time*.4+star*500.);col+=vec3(.66,.56,.84)*brightness;alpha=max(alpha,brightness);}
col=vec3(col.b*.70+col.r*.10,col.b*.98,col.r*.19);
 gl_FragColor=vec4(col,clamp(alpha,0.,1.));}`;
function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s}
let program;try{program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vert));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,frag));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Shader link');gl.useProgram(program)}catch(e){q('.sphere-fallback').style.display='block';canvas.style.display='none';return}
const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const a=gl.getAttribLocation(program,'a');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);const uRes=gl.getUniformLocation(program,'res'),uTime=gl.getUniformLocation(program,'time'),uMouse=gl.getUniformLocation(program,'mouse');let mx=0,my=0,elapsed=0,last=0,visible=true,lastDraw=0;
root.addEventListener('pointermove',e=>{const r=root.getBoundingClientRect();mx=(e.clientX-r.left)/r.width-.5;my=(e.clientY-r.top)/Math.min(r.height,800)-.5},{passive:true});
new ResizeObserver(()=>{const r=canvas.getBoundingClientRect(),ratio=Math.min(window.devicePixelRatio||1,1.35);canvas.width=Math.max(1,Math.round(r.width*ratio));canvas.height=Math.max(1,Math.round(r.height*ratio));gl.viewport(0,0,canvas.width,canvas.height);lastDraw=0}).observe(canvas);
if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting},{rootMargin:'100px'}).observe(canvas);
document.addEventListener('visibilitychange',()=>{last=0});
const planetScene=q('.planet-scene'),cosmicStage=q('.cosmic-stage');
function frame(ts){if(!root.isConnected)return;requestAnimationFrame(frame);if(document.hidden||!visible){last=0;return}
// Keep scroll-driven transforms at the display refresh rate, independent of
// the heavier planet shader's render rate.
if(motion&&!reduced&&root.clientWidth>620){const r=cosmicStage.getBoundingClientRect();const travel=Math.max(0,Math.min(1,-r.top/700));planetScene.style.setProperty('--planet-y',travel*190+'px');planetScene.style.setProperty('--planet-x',travel*-45+'px');planetScene.style.setProperty('--planet-scale',1+travel*.16)}
if(ts-lastDraw<33)return;if(last&&motion)elapsed+=Math.min(ts-last,80)/1000;last=ts;lastDraw=ts;gl.uniform2f(uRes,canvas.width,canvas.height);gl.uniform1f(uTime,elapsed);gl.uniform2f(uMouse,motion?mx:0,motion?my:0);gl.drawArrays(gl.TRIANGLES,0,6)}requestAnimationFrame(frame);
})();
