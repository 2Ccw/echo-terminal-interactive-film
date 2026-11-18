import { story, endings } from "./story.js";

const $ = (id) => document.getElementById(id);
const ui = { intro:$("intro"), story:$("story"), ending:$("ending"), chapter:$("chapter"), scene:$("scene"), number:$("scene-number"), speaker:$("speaker"), body:$("body-copy"), choices:$("choices"), echo:$("echo"), echoCopy:$("echo-copy"), status:$("status") };
let state = { node:"wake", name:"林岚", history:[], traits:{} };
let audio;
let soundOn = false;

function save() { localStorage.setItem("echo-terminal-save", JSON.stringify(state)); }
function reset() { localStorage.removeItem("echo-terminal-save"); state={ node:"wake", name:"林岚", history:[], traits:{} }; showIntro(); }
function apply(effects={}) { for (const [key,value] of Object.entries(effects)) state.traits[key]=(state.traits[key]||0)+value; }

function showIntro() {
  ui.intro.classList.remove("hidden"); ui.story.classList.add("hidden"); ui.ending.classList.add("hidden");
  ui.chapter.textContent="序章"; setMood("storm");
}

function start() {
  state.name=$("player-name").value.trim() || "林岚";
  ui.intro.classList.add("hidden"); ui.ending.classList.add("hidden"); ui.story.classList.remove("hidden");
  renderNode(state.node);
}

async function choose(choice) {
  document.querySelectorAll(".choice").forEach(b=>b.disabled=true);
  apply(choice.effects); state.history.push({ node:state.node, label:choice.label }); state.node=choice.next; save(); tone();
  if (endings[state.node]) return renderEnding(state.node);
  renderNode(state.node);
}

async function renderNode(id) {
  const node=story[id];
  ui.story.classList.remove("fade-in"); void ui.story.offsetWidth; ui.story.classList.add("fade-in");
  ui.chapter.textContent=node.chapter; ui.number.textContent=String(state.history.length+1).padStart(2,"0")+" / 12";
  ui.speaker.textContent=node.speaker; ui.body.textContent=node.text.replaceAll("你",state.name === "林岚" ? "你" : state.name);
  ui.choices.replaceChildren(); ui.echo.classList.add("hidden"); setMood(node.mood);
  for (const choice of node.choices) {
    const button=document.createElement("button"); button.className="choice";
    button.innerHTML=`<span>${choice.label}</span><span>→</span>`; button.addEventListener("click",()=>choose(choice)); ui.choices.append(button);
  }
  ui.status.textContent=node.echo ? "正在重构记忆回响…" : "选择将被终端记录";
  if (node.echo) await loadEcho(node);
}

async function loadEcho(node) {
  ui.echo.classList.remove("hidden"); ui.echoCopy.textContent="信号重构中…";
  try {
    const response=await fetch("/api/echo",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:state.name,summary:node.text,choices:state.history})});
    if(!response.ok) throw new Error("echo unavailable"); const data=await response.json();
    ui.echoCopy.textContent=data.line; ui.status.textContent=data.source==="model" ? "AI 记忆回响已生成" : "离线记忆回响已生成";
  } catch { ui.echoCopy.textContent=`${state.name}，机器失去了连接，但你刚才的选择仍在这里。`; ui.status.textContent="连接中断，已切换离线叙事"; }
}

function renderEnding(id) {
  const ending=endings[id]; ui.story.classList.add("hidden"); ui.ending.classList.remove("hidden");
  ui.ending.classList.remove("fade-in"); void ui.ending.offsetWidth; ui.ending.classList.add("fade-in");
  $("ending-title").textContent=ending.title; $("ending-copy").textContent=ending.text;
  $("ending-stats").innerHTML=`<span class="stat">${state.history.length} 次决定</span><span class="stat">证据 ${state.traits.evidence||0}</span><span class="stat">信任 ${state.traits.trust||0}</span><span class="stat">公开倾向 ${state.traits.public||0}</span>`;
  ui.chapter.textContent="记录结束"; ui.status.textContent="时间线已封存"; setMood(id.includes("dawn")||id.includes("truth") ? "dawn":"dark"); save();
}

function tone() {
  if(!soundOn) return; audio ||= new AudioContext(); const osc=audio.createOscillator(), gain=audio.createGain();
  osc.type="sine"; osc.frequency.value=174; gain.gain.setValueAtTime(.045,audio.currentTime); gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.38);
  osc.connect(gain).connect(audio.destination); osc.start(); osc.stop(audio.currentTime+.4);
}

const canvas=ui.scene, ctx=canvas.getContext("2d"); let mood="storm", time=0;
function setMood(next) { mood=next; }
function draw() {
  const dpr=Math.min(devicePixelRatio,2), w=innerWidth,h=innerHeight;
  if(canvas.width!==w*dpr||canvas.height!==h*dpr){canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+"px";canvas.style.height=h+"px";ctx.setTransform(dpr,0,0,dpr,0,0);}
  time+=.008; const palettes={storm:["#071116","#10242a"],archive:["#0b1210","#263429"],security:["#101012","#301b1b"],lab:["#071012","#17323a"],mirror:["#101018","#25233b"],alarm:["#160807","#3b1714"],memory:["#10120d","#39402a"],city:["#080d10","#28383a"],core:["#130908","#3c1714"],dark:["#040606","#0b0d0d"],dawn:["#171b1b","#536866"]};
  const [a,b]=palettes[mood]||palettes.storm, g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,a);g.addColorStop(1,b);ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  ctx.strokeStyle="rgba(170,205,190,.08)";ctx.lineWidth=1;
  for(let x=40;x<w;x+=80){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
  for(let y=40;y<h;y+=80){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
  ctx.fillStyle=mood==="alarm"||mood==="core" ? "rgba(225,81,69,.08)":"rgba(150,201,167,.055)";
  const radius=Math.min(w,h)*(.24+Math.sin(time)*.015);ctx.beginPath();ctx.arc(w*.78,h*.48,radius,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="rgba(225,235,228,.13)";ctx.beginPath();ctx.arc(w*.78,h*.48,radius*.72,0,Math.PI*2);ctx.stroke();
  if(mood==="storm"){ctx.strokeStyle="rgba(190,220,220,.13)";for(let i=0;i<80;i++){const x=(i*97+time*1400)%w;const y=(i*53+time*900)%h;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-13,y+32);ctx.stroke();}}
  requestAnimationFrame(draw);
}

$("begin").addEventListener("click",start); $("again").addEventListener("click",reset); $("restart").addEventListener("click",()=>confirm("清除当前时间线并重新开始？")&&reset());
$("sound").addEventListener("click",e=>{soundOn=!soundOn;e.currentTarget.textContent=soundOn?"♫":"♪";e.currentTarget.title=soundOn?"关闭声音":"开启声音";tone();});
$("player-name").addEventListener("keydown",e=>e.key==="Enter"&&start());
draw(); showIntro();
