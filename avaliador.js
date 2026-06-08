// AVALIADOR 99 - logica hospedada no GitHub
var consumo   = 10;     // km por litro do seu carro
var precoComb = 6.09;   // R$ por litro
var metaHora  = 50;     // R$/hora minimo para ACEITAR
var metaKm    = 2.50;   // R$/km minimo para ACEITAR

var bloquear = [
  "santa ifigenia","campos eliseos","glicerio",
  "capao redondo","campo limpo","parque santo antonio",
  "jardim miriam","jardim angela","grajau","cidade ademar",
  "jardim sao luis","sao mateus","itaim paulista","cidade tiradentes",
  "sapopemba","guaianases","sao miguel","jardim helena",
  "lajeado","brasilandia","jaragua","perus"
];

function semAcento(s){
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
}

var rev = /R\$ ?(\d+,\d{2})(\s*\/\s*km)?/g;
var valores = [];
var v;
while ((v = rev.exec(t)) !== null) {
  if (!v[2]) { valores.push(parseFloat(v[1].replace(",","."))); }
}
var valor = valores.length ? Math.max.apply(null, valores) : 0;

if (valores.length === 0) {
  console.log("Sem card 99 na tela");
} else {
  var blocos = [];
  var re = /(\d+)\s?min\s?\((\d+(?:,\d+)?)\s?(km|m)\)/g;
  var mm;
  while ((mm = re.exec(t)) !== null) {
    var dist = parseFloat(mm[2].replace(",","."));
    if (mm[3] === "m") { dist = dist / 1000; }
    blocos.push({ tempo: parseInt(mm[1]), km: dist });
  }
  var desloc = blocos[0] || { tempo:0, km:0 };
  var viagem = blocos[1] || { tempo:0, km:0 };
  var kmTotal    = desloc.km + viagem.km;
  var tempoTotal = desloc.tempo + viagem.tempo;

  var custo = (kmTotal / consumo) * precoComb;
  var lucro = valor - custo;
  var rkm = kmTotal > 0 ? lucro / kmTotal : 0;
  var rh  = tempoTotal > 0 ? lucro / (tempoTotal / 60) : 0;

  var tl = semAcento(t);
  var bloqueado = "";
  for (var i = 0; i < bloquear.length; i++) {
    if (tl.indexOf(semAcento(bloquear[i])) >= 0) { bloqueado = bloquear[i]; break; }
  }

  var titulo, barra;
  if (bloqueado !== "") {
    titulo = "RECUSAR - BAIRRO";  barra = "🔴🔴🔴🔴🔴🔴";
  } else if (rh >= metaHora && rkm >= metaKm) {
    titulo = "ACEITAR";           barra = "🟢🟢🟢🟢🟢🟢";
  } else if (rh >= metaHora || rkm >= metaKm) {
    titulo = "PENSAR";            barra = "🟡🟡🟡🟡🟡🟡";
  } else {
    titulo = "RECUSAR";           barra = "🔴🔴🔴🔴🔴🔴";
  }

  var out = titulo + "\n" + barra + "\n";
  out += "R$/h " + rh.toFixed(0) + "    R$/km " + rkm.toFixed(2) + "\n";
  out += "Lucro R$ " + lucro.toFixed(2) + "  (corrida R$ " + valor.toFixed(2) + ")\n";
  out += "Trajeto " + kmTotal.toFixed(1) + " km / " + tempoTotal + " min";
  if (bloqueado !== "") { out += "\nBairro: " + bloqueado; }
  console.log(out);
}
