/* ConectaLibras — protótipo local, sem servidor. Nenhum sinal é demonstrado sem vídeo validado. */
const BASE = [
 ['Olá','Saudações','Cumprimentar alguém','👋'],['Bom dia','Saudações','Cumprimento pela manhã','☀️'],['Obrigado','Saudações','Agradecer','💙'],['Por favor','Saudações','Fazer um pedido com gentileza','🤝'],
 ['Professor','Sala de aula','Pessoa que ensina','👩‍🏫'],['Aluno','Sala de aula','Pessoa que aprende','🎒'],['Livro','Sala de aula','Material de leitura','📚'],['Escrever','Sala de aula','Registrar algo por escrito','✏️'],
 ['Somar','Matemática','Operação de adição','➕'],['Número','Matemática','Representação de quantidade','🔢'],['Igual','Matemática','Expressa igualdade','🟰'],
 ['Água','Ciências','Substância essencial à vida','💧'],['Planta','Ciências','Ser vivo vegetal','🌱'],['Animal','Ciências','Ser vivo do reino animal','🐾'],
 ['Ler','Português','Acompanhar e compreender um texto','📖'],['Palavra','Português','Unidade da linguagem','📝'],
 ['Feliz','Emoções','Sentimento de alegria','😄'],['Triste','Emoções','Sentimento de tristeza','😢'],['Ajuda','Emoções','Solicitar apoio','🫶'],
 ['Esperar','Comandos','Pedir para aguardar','⏳'],['Atenção','Comandos','Concentrar-se','👀'],['Repetir','Comandos','Fazer novamente','🔁'],
 ['Recreio','Rotina escolar','Intervalo na escola','🛝'],['Banheiro','Rotina escolar','Espaço de higiene','🚻'],['Lanche','Rotina escolar','Momento de alimentação','🍎']
].map((x,i)=>({id:'base'+i,word:x[0],category:x[1],description:x[2],emoji:x[3],video:''}));

const CATS = [...new Set(BASE.map(x=>x.category))];
const KEY = 'conectalibras-v1';
const fresh = () => ({name:'',points:0,answered:0,correct:0,completed:[],favorites:[],lists:{'Minha aula':[]},custom:[],videos:{},history:[],daily:'',challengeDone:'',feedback:[]});

let data;
try { data = {...fresh(), ...JSON.parse(localStorage.getItem(KEY)||'{}')}; } catch { data = fresh(); }

let page = 'inicio', filter = '', cat = 'Todas', quiz = [], qIndex = 0, qScore = 0, qLocked = false, flashIndex = 0, flashRevealed = false, currentList = 'Minha aula';

const $ = id => document.getElementById(id);
const esc = s => String(s??'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const all = () => [...BASE, ...data.custom];
const get = id => all().find(x => x.id === id);
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { toast('Armazenamento cheio. Use vídeos menores ou links externos.'); } };
const toast = msg => { const t = $('toast'); t.textContent = msg; t.style.display = 'block'; clearTimeout(toast.timer); toast.timer = setTimeout(() => t.style.display = 'none', 3300); };
const head = (title, desc, extra='') => `<div class="page-header"><div><h1 class="page-title">${title}</h1><p class="intro">${desc}</p></div>${extra}</div>`;
const btn = (text, action, kind='outline') => `<button class="btn ${kind}" data-action="${action}">${text}</button>`;
const today = () => new Date().toLocaleDateString('en-CA');

// ==========================================
// SUPORTE A REPRODUÇÃO DE VÍDEO (MODAL / LIBRAS)
// ==========================================
function parseVideoUrl(url) {
  if (!url) return null;
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  if (yt) return { type: 'youtube', src: `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0` };
  return { type: 'file', src: url };
}

function openVideoModal(id) {
  const x = get(id);
  if (!x) return;
  let modal = $('librasModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'librasModal';
    document.body.appendChild(modal);
  }
  const url = data.videos[x.id] || x.video;
  const parsed = parseVideoUrl(url);

  let playerHtml = '';
  if (parsed) {
    if (parsed.type === 'youtube') {
      playerHtml = `
        <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:14px;background:#000;">
          <iframe src="${parsed.src}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>`;
    } else {
      playerHtml = `
        <video id="modalPlayer" style="width:100%;max-height:55vh;border-radius:14px;background:#000;" controls autoplay playsinline src="${esc(parsed.src)}">Seu navegador não suporta vídeos.</video>
        <div style="display:flex;gap:8px;margin-top:10px;justify-content:center;">
          <button class="btn outline small" onclick="document.getElementById('modalPlayer').playbackRate=0.5">0.5×</button>
          <button class="btn outline small" onclick="document.getElementById('modalPlayer').playbackRate=0.75">0.75×</button>
          <button class="btn outline small" onclick="document.getElementById('modalPlayer').playbackRate=1">1.0×</button>
        </div>`;
    }
  } else {
    playerHtml = `
      <div style="background:#f0f5ff;border:2px dashed #90b8f8;border-radius:16px;padding:24px;text-align:center;">
        <div style="font-size:46px;margin-bottom:8px">🤟</div>
        <h3 style="margin:0 0 6px 0;color:#1d3963">Vídeo ainda não cadastrado</h3>
        <p style="color:#52677f;margin:0 0 16px 0;font-size:14px">O vídeo de demonstração para "<strong>${esc(x.word)}</strong>" ainda não foi vinculado.</p>
        <div style="display:flex;flex-direction:column;gap:12px;max-width:400px;margin:0 auto;">
          <a href="https://www.youtube.com/results?search_query=sinal+libras+${encodeURIComponent(x.word)}" target="_blank" rel="noopener" style="text-decoration:none;padding:10px 16px;background:#e52d27;color:#fff;border-radius:10px;font-weight:600;font-size:14px;display:inline-block">▶ Pesquisar sinal de "${esc(x.word)}" no YouTube</a>
          <div style="text-align:left;background:#ffffff;padding:12px;border-radius:10px;border:1px solid #dbe5f1;">
            <label style="font-size:12px;color:#334e68;font-weight:bold;display:block;margin-bottom:4px">Vincular link agora (YouTube ou MP4 direto):</label>
            <div style="display:flex;gap:6px;">
              <input id="quickVideoInput" class="field" style="padding:6px 10px;font-size:13px;flex:1" placeholder="https://...">
              <button class="btn small" style="white-space:nowrap" onclick="quickSaveVideo('${x.id}')">Salvar</button>
            </div>
          </div>
        </div>
      </div>`;
  }

  modal.innerHTML = `
    <div onclick="closeVideoModal()" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(15,28,48,0.72);backdrop-filter:blur(3px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;">
      <div onclick="event.stopPropagation()" style="background:#ffffff;border-radius:20px;max-width:620px;width:100%;padding:22px;box-shadow:0 20px 45px rgba(0,0,0,0.3);position:relative;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:1px solid #edf2f7;padding-bottom:10px;">
          <div>
            <span style="background:#e0edff;color:#1958b7;font-size:11px;font-weight:bold;padding:3px 10px;border-radius:20px;text-transform:uppercase;">${esc(x.category)}</span>
            <h2 style="margin:6px 0 0 0;color:#183252;font-size:22px;display:flex;align-items:center;gap:8px;">${esc(x.emoji)} Sinal: ${esc(x.word)}</h2>
          </div>
          <button onclick="closeVideoModal()" aria-label="Fechar" style="background:none;border:none;font-size:28px;cursor:pointer;color:#8a99ad;line-height:1;padding:0 6px;">&times;</button>
        </div>
        <p style="margin:0 0 14px 0;color:#4a5d78;font-size:14px;"><strong>Significado:</strong> ${esc(x.description)}</p>
        ${playerHtml}
        <div style="margin-top:16px;display:flex;justify-content:space-between;align-items:center;">
          <small style="color:#7e8e9f;font-size:12px">Observe a configuração de mão, movimento e expressão facial.</small>
          <button class="btn outline small" onclick="closeVideoModal()">Fechar</button>
        </div>
      </div>
    </div>`;
  modal.style.display = 'block';
}

function closeVideoModal() {
  const modal = $('librasModal');
  if (modal) {
    modal.innerHTML = '';
    modal.style.display = 'none';
  }
}

window.closeVideoModal = closeVideoModal;
window.quickSaveVideo = function(id) {
  const input = $('quickVideoInput');
  if (!input) return;
  const url = input.value.trim();
  if (!/^https?:\/\//.test(url)) return toast('Insira um link HTTP(S) válido.');
  data.videos[id] = url;
  save();
  toast('Vídeo
