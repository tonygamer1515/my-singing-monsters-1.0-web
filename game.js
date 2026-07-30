(() => {
'use strict';
const $=(selector,root=document)=>root.querySelector(selector),$$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const canvas=$('#game'),ctx=canvas.getContext('2d',{alpha:false});
let W=0,H=0,DPR=1,time=0,last=performance.now(),screen='title',toastTimer=0,pendingPlacement=null;
const camera={x:0,y:20,zoom:1,drag:false,moved:false,startX:0,startY:0,baseX:0,baseY:0};
const pointers=new Map(),images=new Map(),music=[];
const imagePaths={sky:'assets/original/gfx/sky01.png',grass:'assets/original/gfx/island_overlay/island01_grass.png',castle:'assets/original/gfx/structures/structure_castle01.png',nursery:'assets/original/gfx/structures/structure_nursery.png',breeding:'assets/original/gfx/structures/structure_breeding.png',bakery:'assets/original/gfx/structures/bakeries_sheet.png'};
const MONSTERS={
 B:{name:'Potbelly',element:'PLANT',cost:250,spore:'assets/original/gfx/spore_B.png',track:'01-B_Monster_01.ogg'},
 C:{name:'Noggin',element:'EARTH',cost:300,spore:'assets/original/gfx/spore_C.png',track:'01-C_Monster_01.ogg'},
 D:{name:'Toe Jammer',element:'WATER',cost:250,spore:'assets/original/gfx/spore_D.png',track:'01-D_Monster_01.ogg'},
 E:{name:'Mammott',element:'COLD',cost:300,spore:'assets/original/gfx/spore_E.png',track:'01-E_Monster_01.ogg'}
};
const freshSave=()=>({version:1,level:1,xp:0,coins:500,diamonds:20,food:100,sound:true,tutorial:false,monsters:[],lastCoinTick:Date.now()});
let save=loadSave();
function loadSave(){try{return{...freshSave(),...JSON.parse(localStorage.getItem('msm-1.0-web-save')||'{}')}}catch{return freshSave()}}
function persist(){localStorage.setItem('msm-1.0-web-save',JSON.stringify(save))}
function resize(){const rect=canvas.getBoundingClientRect();DPR=Math.min(devicePixelRatio||1,1.5);W=rect.width;H=rect.height;canvas.width=Math.round(W*DPR);canvas.height=Math.round(H*DPR);ctx.setTransform(DPR,0,0,DPR,0,0)}
addEventListener('resize',resize);resize();
function loadImage(key,path){return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>{images.set(key,image);resolve(image)};image.onerror=()=>reject(new Error(`Could not load ${path}`));image.src=path})}
async function boot(){await Promise.all(Object.entries(imagePaths).map(([key,path])=>loadImage(key,path)));await Promise.all(Object.entries(MONSTERS).map(([key,monster])=>loadImage(`spore-${key}`,monster.spore)));updateHud();requestAnimationFrame(frame)}
function toast(message){const element=$('#toast');element.textContent=message;element.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>element.classList.remove('show'),1800)}
function playSfx(file,volume=.7){if(!save.sound)return;const audio=new Audio(`assets/original/audio/sfx/${file}`);audio.volume=volume;audio.play().catch(()=>{})}
function stopMusic(){while(music.length){const audio=music.pop();audio.pause();audio.src=''}}
function rebuildSong(){stopMusic();if(!save.sound||screen!=='island')return;const files=['01-Bass_01.ogg',...new Set(save.monsters.map(monster=>MONSTERS[monster.code]?.track).filter(Boolean))];for(const file of files){const audio=new Audio(`assets/original/audio/music/${file}`);audio.loop=true;audio.volume=file.includes('Bass')?.5:.72;music.push(audio)}for(const audio of music){audio.currentTime=0;audio.play().catch(()=>{})}}
function updateHud(){$('#level').textContent=save.level;$('#coins').textContent=Math.floor(save.coins);$('#diamonds').textContent=save.diamonds;$('#food').textContent=save.food;$('#xpBar').style.width=`${save.xp%100}%`;$('#soundButton').textContent=save.sound?'♫':'×'}
function screenToWorld(x,y){return{x:(x-W/2)/camera.zoom+camera.x,y:(y-H/2)/camera.zoom+camera.y}}
function worldToScreen(x,y){return{x:(x-camera.x)*camera.zoom+W/2,y:(y-camera.y)*camera.zoom+H/2}}
function drawCover(image,x,y,width,height){const scale=Math.max(width/image.width,height/image.height),sw=width/scale,sh=height/scale;ctx.drawImage(image,(image.width-sw)/2,(image.height-sh)/2,sw,sh,x,y,width,height)}
function drawWorldImage(image,x,y,width,height,alpha=1){ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(image,x-width/2,y-height/2,width,height);ctx.restore()}
function renderIsland(){
 drawCover(images.get('sky'),0,0,W,H);ctx.fillStyle='#d7f1f4aa';ctx.fillRect(0,0,W,H);
 ctx.save();ctx.translate(W/2-camera.x*camera.zoom,H/2-camera.y*camera.zoom);ctx.scale(camera.zoom,camera.zoom);
 ctx.fillStyle='#574425';ctx.beginPath();ctx.ellipse(0,118,485,235,0,0,Math.PI*2);ctx.fill();
 ctx.save();ctx.beginPath();ctx.ellipse(0,25,500,260,0,0,Math.PI*2);ctx.clip();const pattern=ctx.createPattern(images.get('grass'),'repeat');ctx.fillStyle=pattern||'#67a52a';ctx.fillRect(-520,-260,1040,570);ctx.fillStyle='#ffffff16';ctx.fillRect(-520,-260,1040,570);ctx.restore();
 drawWorldImage(images.get('castle'),-80,-105,230,230);
 // Nursery base is the first 337×435 region in the original sheet.
 ctx.drawImage(images.get('nursery'),2,2,337,435,110,-180,145,187);
 ctx.drawImage(images.get('breeding'),0,0,390,420,250,-120,150,162);
 for(const monster of save.monsters){const def=MONSTERS[monster.code],image=images.get(`spore-${monster.code}`),bob=Math.sin(time*2+monster.phase)*7;ctx.save();ctx.translate(monster.x,monster.y+bob);ctx.scale(1.05,1.05);ctx.drawImage(image,-50,-40,100,80);ctx.fillStyle='#fff';ctx.strokeStyle='#304b1e';ctx.lineWidth=5;ctx.font='900 17px Trebuchet MS';ctx.textAlign='center';ctx.strokeText(def.name,0,55);ctx.fillText(def.name,0,55);if(monster.readyCoins>=1){ctx.beginPath();ctx.arc(35,-38,21,0,Math.PI*2);ctx.fillStyle='#f4be2b';ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#5d3d12';ctx.font='900 14px Arial';ctx.fillText(Math.floor(monster.readyCoins),35,-33)}ctx.restore()}
 if(pendingPlacement){const p=screenToWorld(pendingPlacement.x,pendingPlacement.y),image=images.get(`spore-${pendingPlacement.code}`);ctx.globalAlpha=.72;ctx.drawImage(image,p.x-50,p.y-40,100,80);ctx.globalAlpha=1}
 ctx.restore();
}
function renderTitleBackdrop(){drawCover(images.get('sky'),0,0,W,H)}
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;time+=dt;ctx.setTransform(DPR,0,0,DPR,0,0);tickEconomy();if(screen==='island')renderIsland();else renderTitleBackdrop();requestAnimationFrame(frame)}
function tickEconomy(){const now=Date.now(),elapsed=(now-save.lastCoinTick)/1000;if(elapsed<1)return;save.lastCoinTick=now;for(const monster of save.monsters)monster.readyCoins=Math.min(25,(monster.readyCoins||0)+elapsed/12);persist()}
function monsterAt(point){let best=null,distance=65;for(const monster of save.monsters){const d=Math.hypot(point.x-monster.x,point.y-monster.y);if(d<distance){best=monster;distance=d}}return best}
function collectMonster(monster){const amount=Math.floor(monster.readyCoins||0);if(amount<1)return;monster.readyCoins-=amount;save.coins+=amount;persist();updateHud();playSfx('collect_coins.wav');toast(`+${amount} COINS`)}
function placeMonster(code,point){const monster={id:Date.now(),code,x:clamp(point.x,-390,390),y:clamp(point.y,-135,190),phase:Math.random()*6,readyCoins:0};save.monsters.push(monster);pendingPlacement=null;save.xp+=12;persist();updateHud();playSfx('hatch_monster.wav');rebuildSong();toast(`${MONSTERS[code].name.toUpperCase()} JOINED THE SONG!`)}
function openPanel(title,html){$('#panelTitle').textContent=title;$('#panelBody').innerHTML=html;$('#panel').hidden=false}
function closePanel(){$('#panel').hidden=true}
function showMarket(){openPanel('MONSTER MARKET','<div class="market-grid"></div>');const grid=$('.market-grid');for(const [code,monster] of Object.entries(MONSTERS)){const card=document.createElement('article');card.className='monster-card';card.innerHTML=`<img src="${monster.spore}" alt=""><h3>${monster.name}</h3><small>${monster.element}</small><p>● ${monster.cost}</p><button>BUY & PLACE</button>`;$('button',card).onclick=()=>{if(save.coins<monster.cost)return toast('NOT ENOUGH COINS');save.coins-=monster.cost;pendingPlacement={code,x:W/2,y:H/2};persist();updateHud();closePanel();playSfx('menu_click.wav');toast('TAP THE ISLAND TO PLACE')};grid.append(card)}}
function showBake(){openPanel('BAKERY','<div class="list"><article><h3>Small Cupcake</h3><p>Bake 25 food for 50 coins.</p><button class="action" id="bakeNow">BAKE</button></article></div>');$('#bakeNow').onclick=()=>{if(save.coins<50)return toast('NOT ENOUGH COINS');save.coins-=50;save.food+=25;save.xp+=5;persist();updateHud();playSfx('start_baking.wav');toast('+25 FOOD')}}
function showBreed(){const unlocked=save.monsters.length>=2;openPanel('BREEDING MOUNTAIN',`<div class="list"><article><h3>${unlocked?'BREED TWO MONSTERS':'TWO MONSTERS REQUIRED'}</h3><p>The 1.0 breeding table and incubation timers are being restored from the native resources.</p>${unlocked?'<button class="action" id="breedNow">BREED DEMO</button>':''}</article></div>`);if(unlocked)$('#breedNow').onclick=()=>{playSfx('start_breeding.wav');toast('BREEDING STARTED · DEVELOPMENT BUILD')}}
function showGoals(){const goals=[['Place your first monster',save.monsters.length>=1],['Build a four-part Plant Island song',new Set(save.monsters.map(m=>m.code)).size>=4],['Collect 100 monster coins',save.coins>=600]];openPanel('GOALS',`<div class="list">${goals.map(([text,done])=>`<article><b>${done?'✓':'○'} ${text}</b></article>`).join('')}</div>`)}
function showIslands(){openPanel('ISLANDS','<div class="list"><article><h3>PLANT ISLAND</h3><p>Playable now with original version 1.0 stems.</p></article><article><h3>COLD ISLAND</h3><p>Original art and 23 music stems recovered; world implementation next.</p></article><article><h3>AIR ISLAND</h3><p>Original art and 27 music stems recovered; world implementation next.</p></article></div>')}
const tutorial=[['WELCOME, MONSTER-HANDLER!','This is an offline reconstruction of the original 2012 client. Your island is saved in this browser.'],['MOVE AROUND','Drag the island to pan. Pinch, use the mouse wheel, or press + and − to zoom.'],['BUY A MONSTER','Open MARKET, buy a monster egg, then tap the island to place it.'],['BUILD THE SONG','Each species adds its original synchronized 1.0 OGG music stem. Use the sound button to mute or restore the mix.'],['COLLECT AND GROW','Tap a monster when its gold bubble appears. Bake food, complete goals and expand your song.']];
function showTutorial(index=0){const [title,text]=tutorial[index];openPanel(`TUTORIAL ${index+1} / ${tutorial.length}`,`<div class="tutorial"><div class="icon">${['🎵','☝️','🥚','🎼','⭐'][index]}</div><h3>${title}</h3><p>${text}</p><p class="dots">${tutorial.map((_,i)=>i===index?'●':'○').join(' ')}</p><button class="action" id="tutorialSkip">SKIP</button> <button class="action" id="tutorialNext">${index===tutorial.length-1?'DONE':'NEXT'}</button></div>`);$('#tutorialSkip').onclick=()=>{save.tutorial=true;persist();closePanel()};$('#tutorialNext').onclick=()=>{if(index===tutorial.length-1){save.tutorial=true;persist();closePanel()}else showTutorial(index+1)}}
canvas.addEventListener('pointerdown',event=>{try{canvas.setPointerCapture(event.pointerId)}catch{}pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});camera.drag=true;camera.moved=false;camera.startX=event.clientX;camera.startY=event.clientY;camera.baseX=camera.x;camera.baseY=camera.y});
canvas.addEventListener('pointermove',event=>{if(!pointers.has(event.pointerId))return;pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});if(pendingPlacement){pendingPlacement.x=event.clientX;pendingPlacement.y=event.clientY;return}if(pointers.size===1&&camera.drag){const dx=event.clientX-camera.startX,dy=event.clientY-camera.startY;if(Math.hypot(dx,dy)>5)camera.moved=true;camera.x=clamp(camera.baseX-dx/camera.zoom,-360,360);camera.y=clamp(camera.baseY-dy/camera.zoom,-100,170)}else if(pointers.size>=2){const p=[...pointers.values()],distance=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);if(!camera.pinch){camera.pinch=distance;camera.pinchZoom=camera.zoom}else camera.zoom=clamp(camera.pinchZoom*distance/camera.pinch,.55,1.65);camera.moved=true}});
function finishPointer(event,cancelled=false){const moved=camera.moved;pointers.delete(event.pointerId);if(pointers.size===1){const p=[...pointers.values()][0];camera.startX=p.x;camera.startY=p.y;camera.baseX=camera.x;camera.baseY=camera.y;camera.pinch=0}else if(!pointers.size){camera.drag=false;camera.pinch=0;if(!cancelled&&!moved&&screen==='island'){if(pendingPlacement)placeMonster(pendingPlacement.code,screenToWorld(event.clientX,event.clientY));else{const monster=monsterAt(screenToWorld(event.clientX,event.clientY));if(monster)collectMonster(monster)}}}}
canvas.addEventListener('pointerup',event=>finishPointer(event));canvas.addEventListener('pointercancel',event=>finishPointer(event,true));canvas.addEventListener('lostpointercapture',event=>{if(pointers.has(event.pointerId))finishPointer(event,true)});addEventListener('blur',()=>{pointers.clear();camera.drag=false;camera.pinch=0});
canvas.addEventListener('wheel',event=>{if(screen!=='island')return;event.preventDefault();camera.zoom=clamp(camera.zoom*Math.exp(-event.deltaY*.001),.55,1.65)},{passive:false});
$('#playButton').onclick=()=>{screen='island';$('#title').hidden=true;$('#hud').hidden=false;playSfx('menu_click.wav');rebuildSong();if(!save.tutorial)setTimeout(()=>showTutorial(0),400)};
$$('[data-menu]').forEach(button=>button.onclick=()=>{playSfx('menu_click.wav');({market:showMarket,bake:showBake,breed:showBreed,goals:showGoals,islands:showIslands}[button.dataset.menu])()});
$('#closePanel').onclick=closePanel;$('#helpButton').onclick=()=>showTutorial(0);$('#soundButton').onclick=()=>{save.sound=!save.sound;persist();updateHud();rebuildSong()};$('#zoomIn').onclick=()=>camera.zoom=clamp(camera.zoom*1.15,.55,1.65);$('#zoomOut').onclick=()=>camera.zoom=clamp(camera.zoom/1.15,.55,1.65);
window.__msmDebug=()=>({screen,monsters:save.monsters.length,coins:save.coins,tracks:music.length,camera:{...camera}});
boot().catch(error=>{console.error(error);toast(error.message)});
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
})();
