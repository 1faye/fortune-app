// ==================== 六十四卦 ====================
const HEXAGRAMS=[
{id:1,name:'乾为天',sym:'䷀',gua:'☰☰',desc:'元亨利贞。自强不息。',upper:0,lower:0},
{id:2,name:'坤为地',sym:'䷁',gua:'☷☷',desc:'元亨。厚德载物。',upper:7,lower:7},
{id:3,name:'水雷屯',sym:'䷂',gua:'☵☳',desc:'万事开头难，宜坚守待机。',upper:6,lower:3},
{id:4,name:'山水蒙',sym:'䷃',gua:'☶☵',desc:'蒙昧待启，宜求学问道。',upper:5,lower:6},
{id:5,name:'水天需',sym:'䷄',gua:'☵☰',desc:'等待时机，诚信则吉。',upper:6,lower:0},
{id:6,name:'天水讼',sym:'䷅',gua:'☰☵',desc:'争讼不宁，宜和解。',upper:0,lower:6},
{id:7,name:'地水师',sym:'䷆',gua:'☷☵',desc:'师出有名，军旅征战。',upper:7,lower:6},
{id:8,name:'水地比',sym:'䷇',gua:'☵☷',desc:'亲比团结，互相辅助。',upper:6,lower:7},
{id:9,name:'风天小畜',sym:'䷈',gua:'☴☰',desc:'小有积蓄，待机发展。',upper:4,lower:0},
{id:10,name:'天泽履',sym:'䷉',gua:'☰☱',desc:'履行承诺，谨慎从事。',upper:0,lower:2},
{id:11,name:'地天泰',sym:'䷊',gua:'☷☰',desc:'天地交泰，万事亨通。',upper:7,lower:0},
{id:12,name:'天地否',sym:'䷋',gua:'☰☷',desc:'闭塞不通，遁世无闷。',upper:0,lower:7},
{id:13,name:'天火同人',sym:'䷌',gua:'☰☲',desc:'与人同心，志同道合。',upper:0,lower:4},
{id:14,name:'火天大有',sym:'䷍',gua:'☲☰',desc:'大有收获，富足昌盛。',upper:4,lower:0},
{id:15,name:'地山谦',sym:'䷎',gua:'☷☶',desc:'谦虚退让，君子有终。',upper:7,lower:5},
{id:16,name:'雷地豫',sym:'䷏',gua:'☳☷',desc:'悦乐安逸，凡事豫则立。',upper:3,lower:7},
{id:17,name:'泽雷随',sym:'䷐',gua:'☱☳',desc:'随时而动，顺应变化。',upper:2,lower:3},
{id:18,name:'山风蛊',sym:'䷑',gua:'☶☴',desc:'蛊惑败坏，需整治革新。',upper:5,lower:4},
{id:19,name:'地泽临',sym:'䷒',gua:'☷☱',desc:'居高临下，亲临视察。',upper:7,lower:2},
{id:20,name:'风地观',sym:'䷓',gua:'☴☷',desc:'观察入微，审时度势。',upper:4,lower:7},
{id:21,name:'火雷噬嗑',sym:'䷔',gua:'☲☳',desc:'咀嚼磨合，宜消除障碍。',upper:4,lower:3},
{id:22,name:'山火贲',sym:'䷕',gua:'☶☲',desc:'文饰修饰，讲究外表。',upper:5,lower:4},
{id:23,name:'山地剥',sym:'䷖',gua:'☶☷',desc:'剥落消减，宜退守。',upper:5,lower:7},
{id:24,name:'地雷复',sym:'䷗',gua:'☷☳',desc:'一阳来复，复兴重生。',upper:7,lower:3},
{id:25,name:'天雷无妄',sym:'䷘',gua:'☰☳',desc:'真诚无妄，灾祸不来。',upper:0,lower:3},
{id:26,name:'山天大畜',sym:'䷙',gua:'☶☰',desc:'大畜积蓄，厚积薄发。',upper:5,lower:0},
{id:27,name:'山雷颐',sym:'䷚',gua:'☶☳',desc:'颐养之道，养身养德。',upper:5,lower:3},
{id:28,name:'泽风大过',sym:'䷛',gua:'☱☴',desc:'过犹不及，宜适可而止。',upper:2,lower:4},
{id:29,name:'坎为水',sym:'䷜',gua:'☵☵',desc:'险难重重，诚信可度。',upper:6,lower:6},
{id:30,name:'离为火',sym:'䷝',gua:'☲☲',desc:'光明依附，柔顺中正。',upper:4,lower:4},
{id:31,name:'泽山咸',sym:'䷞',gua:'☱☶',desc:'感而遂通，男女感应。',upper:2,lower:5},
{id:32,name:'雷风恒',sym:'䷟',gua:'☳☴',desc:'恒久不变，夫妻相守。',upper:3,lower:4},
{id:33,name:'天山遁',sym:'䷠',gua:'☰☶',desc:'退避退隐，以退为进。',upper:0,lower:5},
{id:34,name:'雷天大壮',sym:'䷡',gua:'☳☰',desc:'刚健壮大，不可妄动。',upper:3,lower:0},
{id:35,name:'火地晋',sym:'䷢',gua:'☲☷',desc:'晋升进取，光明磊落。',upper:4,lower:7},
{id:36,name:'地火明夷',sym:'䷣',gua:'☷☲',desc:'光明受伤，韬光养晦。',upper:7,lower:4},
{id:37,name:'风火家人',sym:'䷤',gua:'☴☲',desc:'家人和睦，各司其职。',upper:4,lower:4},
{id:38,name:'火泽睽',sym:'䷥',gua:'☲☱',desc:'乖离不合，宜求同存异。',upper:4,lower:2},
{id:39,name:'水山蹇',sym:'䷦',gua:'☵☶',desc:'艰难跋涉，宜求贵人。',upper:6,lower:5},
{id:40,name:'雷水解',sym:'䷧',gua:'☳☵',desc:'困难解除，宽恕为怀。',upper:3,lower:6},
{id:41,name:'山泽损',sym:'䷨',gua:'☶☱',desc:'损益相随，损己利人。',upper:5,lower:2},
{id:42,name:'风雷益',sym:'䷩',gua:'☴☳',desc:'增益有利，利有攸往。',upper:4,lower:3},
{id:43,name:'泽天夬',sym:'䷪',gua:'☱☰',desc:'决断果断，宜果断决策。',upper:2,lower:0},
{id:44,name:'天风姤',sym:'䷫',gua:'☰☴',desc:'不期而遇，宜正道相待。',upper:0,lower:4},
{id:45,name:'泽地萃',sym:'䷬',gua:'☱☷',desc:'聚集荟萃，群体力量。',upper:2,lower:7},
{id:46,name:'地风升',sym:'䷭',gua:'☷☴',desc:'上升渐进，步步高升。',upper:7,lower:4},
{id:47,name:'泽水困',sym:'䷮',gua:'☱☵',desc:'困厄受困，坚守自通。',upper:2,lower:6},
{id:48,name:'水风井',sym:'䷯',gua:'☵☴',desc:'井养不穷，宜修德养民。',upper:6,lower:4},
{id:49,name:'泽火革',sym:'䷰',gua:'☱☲',desc:'改革变革，宜顺势而为。',upper:2,lower:4},
{id:50,name:'火风鼎',sym:'䷱',gua:'☲☴',desc:'鼎新革故，宜创新。',upper:4,lower:4},
{id:51,name:'震为雷',sym:'䷲',gua:'☳☳',desc:'震惊百里，镇定自若。',upper:3,lower:3},
{id:52,name:'艮为山',sym:'䷳',gua:'☶☶',desc:'止于至善，宜知止。',upper:5,lower:5},
{id:53,name:'风山渐',sym:'䷴',gua:'☴☶',desc:'循序渐进，终成大事。',upper:4,lower:5},
{id:54,name:'雷泽归妹',sym:'䷵',gua:'☳☱',desc:'婚姻嫁娶，宜守正。',upper:3,lower:2},
{id:55,name:'雷火丰',sym:'䷶',gua:'☳☲',desc:'丰盛宏大，宜居安思危。',upper:3,lower:4},
{id:56,name:'火山旅',sym:'䷷',gua:'☲☶',desc:'旅途漂泊，宜慎行。',upper:4,lower:5},
{id:57,name:'巽为风',sym:'䷸',gua:'☴☴',desc:'顺从谦逊，宜顺势而为。',upper:4,lower:4},
{id:58,name:'兑为泽',sym:'䷹',gua:'☱☱',desc:'和悦交流，宜协商沟通。',upper:2,lower:2},
{id:59,name:'风水涣',sym:'䷺',gua:'☴☵',desc:'涣散离散，宜团结聚拢。',upper:4,lower:6},
{id:60,name:'水泽节',sym:'䷻',gua:'☵☱',desc:'节制适度，宜守规矩。',upper:6,lower:2},
{id:61,name:'风泽中孚',sym:'䷼',gua:'☴☱',desc:'诚信中孚，感通万物。',upper:4,lower:2},
{id:62,name:'雷山小过',sym:'䷽',gua:'☳☶',desc:'小有过失，宜修正。',upper:3,lower:5},
{id:63,name:'水火既济',sym:'䷾',gua:'☵☲',desc:'事已成就，宜守成防变。',upper:6,lower:4},
{id:64,name:'火水未济',sym:'䷿',gua:'☲☵',desc:'尚未完成，宜继续努力。',upper:4,lower:6}
];
const LIUSHOU=['青龙','朱雀','勾陈','腾蛇','白虎','玄武'];
var coinYao=[],coinIdx=0,qiguaRes=null;

function timeQigua(){
    let dv=document.getElementById('qgDate').value||new Date().toISOString().split('T')[0];
    let d=new Date(dv);let y=d.getFullYear(),m=d.getMonth()+1,day=d.getDate(),h=d.getHours();
    let up=(y+m+day)%8||8,lo=(y+m+day+h)%8||8,dong=(y+m+day+h)%6||6;
    let bg=HEXAGRAMS.find(h=>h.upper===up-1&&h.lower===lo-1)||HEXAGRAMS[(up-1)*8+(lo-1)];
    displayGua(bg,dong,'时间起卦');
}

function startCoinQigua(){coinYao=[];coinIdx=0;document.getElementById('coinResult').innerHTML='';updateDots();document.getElementById('tossBtn').disabled=false;document.getElementById('qiguaResult').style.display='none';}
function tossCoin(){
    if(coinIdx>=6)return;
    let sum=Math.random()>0.5?3:2;sum+=Math.random()>0.5?3:2;sum+=Math.random()>0.5?3:2;
    let y;if(sum===6)y={v:0,n:'老阴 ⚋→⚊',c:true};else if(sum===7)y={v:1,n:'少阳 ⚊',c:false};else if(sum===8)y={v:0,n:'少阴 ⚋',c:false};else y={v:1,n:'老阳 ⚊→⚋',c:true};
    coinYao.push(y);coinIdx++;
    document.getElementById('coinResult').innerHTML='第'+coinIdx+'爻：<b>'+y.n+'</b>（合计'+sum+'）';
    updateDots();
    if(coinIdx>=6){document.getElementById('tossBtn').disabled=true;buildCoinGua();}
}
function updateDots(){let d='';for(let i=0;i<6;i++)d+='<div class="yao-dot'+(i<coinYao.length?' done':'')+'"></div>';document.getElementById('yaoProgress').innerHTML=d;}
function buildCoinGua(){
    let u='',l='';for(let i=5;i>=3;i--)u+=coinYao[i].v;for(let i=2;i>=0;i--)l+=coinYao[i].v;
    let ui=parseInt(u,2),li=parseInt(l,2);
    let bg=HEXAGRAMS.find(h=>h.upper===ui&&h.lower===li)||HEXAGRAMS[ui*8+li];
    let cy=[],cu='',cl='';
    for(let i=2;i>=0;i--){let v=coinYao[i].v;if(coinYao[i].c){v=1-v;cy.push(i+1);}cl+=v;}
    for(let i=5;i>=3;i--){let v=coinYao[i].v;if(coinYao[i].c){v=1-v;cy.push(i+1);}cu+=v;}
    let cui=parseInt(cu,2),cli=parseInt(cl,2);
    let bg2=HEXAGRAMS.find(h=>h.upper===cui&&h.lower===cli)||HEXAGRAMS[cui*8+cli];
    if(cy.length===0)displayGua(bg,0,'手动摇卦');
    else displayGuaWithChange(bg,bg2,cy,'手动摇卦');
}

function displayGua(bg,dongYao,method){
    qiguaRes={method,bg,changeYao:dongYao};
    let h='<div class="hexagram-name">'+bg.name+'</div><div class="hexagram-sub">'+bg.sym+' '+bg.gua+' · 第'+bg.id+'卦</div><div class="yao-row">';
    for(let i=5;i>=0;i--){
        let y=bg.id.toString(2).padStart(6,'0')[i]==='1'?'yang':'yin';
        let isC=(dongYao&&dongYao===i+1)||(qiguaRes.changeYaos&&qiguaRes.changeYaos.includes(i+1));
        h+='<div class="yao-line'+(isC?' yao-change':'')+'"><span class="yao-index">'+(isC?'⚡':'')+(6-i)+'爻</span><span class="yao-symbol '+y+'">'+(y==='yang'?'⚊':'⚋')+'</span><span class="yao-detail">'+(i<5?('<span>'+LIUSHOU[(i+1)%6]+'</span>'):'')+'</span></div>';
    }
    h+='</div>';document.getElementById('hexDisplay').innerHTML=h;
    let cards='<div class="hex-card"><div class="h-name">本卦</div><div class="h-sub">'+bg.sym+'</div><div class="h-icon">'+bg.gua+'</div><div>'+bg.name+'</div></div>';
    document.getElementById('hexCards').innerHTML=cards;
    let qq=document.getElementById('qgQuestion').value;document.getElementById('qiguaAnalysis').innerHTML='<p><strong>卦辞：</strong>'+bg.desc+'</p><p>'+getGuaInterpret(bg,qq)+'</p>';
    document.getElementById('qiguaResult').style.display='block';document.getElementById('qiguaResult').scrollIntoView({behavior:'smooth'});
}
function displayGuaWithChange(bg,bg2,cys,method){
    qiguaRes={method,bg,bg2,changeYaos:cys};
    let h='<div class="hexagram-name">'+bg.name+' → '+bg2.name+'</div><div class="hexagram-sub">'+bg.sym+' → '+bg2.sym+'</div><div class="yao-row">';
    for(let i=5;i>=0;i--){
        let y=bg.id.toString(2).padStart(6,'0')[i]==='1'?'yang':'yin';
        let y2=cys.includes(i+1)?(bg2.id.toString(2).padStart(6,'0')[i]==='1'?'yang':'yin'):null;
        h+='<div class="yao-line'+(y2?' yao-change':'')+'"><span class="yao-index">'+(y2?'⚡':'')+(6-i)+'爻</span><span class="yao-symbol '+y+'">'+(y==='yang'?'⚊':'⚋')+(y2?'→'+(y2==='yang'?'⚊':'⚋'):'')+'</span><span class="yao-detail">'+(i<5?('<span>'+LIUSHOU[(i+1)%6]+'</span>'):'')+'</span></div>';
    }
    h+='</div>';document.getElementById('hexDisplay').innerHTML=h;
    let cards='<div class="hex-card"><div class="h-name">本卦</div><div class="h-sub">'+bg.sym+'</div><div class="h-icon">'+bg.gua+'</div><div>'+bg.name+'</div></div><div class="hex-card"><div class="h-name">变卦</div><div class="h-sub">'+bg2.sym+'</div><div class="h-icon">'+bg2.gua+'</div><div>'+bg2.name+'</div></div>';
    document.getElementById('hexCards').innerHTML=cards;
    let qq=document.getElementById('qgQuestion').value;document.getElementById('qiguaAnalysis').innerHTML='<p><strong>本卦：</strong>'+bg.name+' — '+bg.desc+'</p><p><strong>变卦：</strong>'+bg2.name+' — '+bg2.desc+'</p><p>'+getGuaInterpret(bg,qq)+'</p>';
    document.getElementById('qiguaResult').style.display='block';document.getElementById('qiguaResult').scrollIntoView({behavior:'smooth'});
}
function getGuaInterpret(bg,q){
    q=q||'';
    const it={};
    it['乾为天']='乾卦纯阳，天道刚健。问事业：大有可为，但勿骄。问财运：亨通。问感情：宜主动，但柔能克刚。';
    it['坤为地']='坤卦纯阴，厚德载物。问事业：顺势而为。问财运：稳健为上。问感情：以柔承刚，包容是金。';
    it['地天泰']='天地交泰，万物亨通。问事业：顺风顺水。问财运：获利可期。问感情：两情相悦，正缘之象。';
    it['天地否']='天地不交，闭塞不通。问事业：宜守。问财运：宜俭。问感情：易生误会，主动破冰。';
    it['水雷屯']='万事初生，艰难险阻。问事业：坚持可成。问感情：初期的磨合是必经之路，不放弃就是赢。';
    it['山水蒙']='蒙昧待启。问事业：宜求教。问感情：或有不透明处，多沟通少猜疑。';
    it['水天需']='等待时雨。问事业：时机未到。问感情：需卦利婚姻——等得起的人配得上好结果，切忌急躁催促进度。';
    it['天水讼']='争讼不宁。问事业：防小人。问感情：近期避免翻旧账或气头上说狠话，口舌之争最伤根基。';
    it['地水师']='师出有名。问事业：宜带队。问感情：关系中有一方主导过强，注意平衡权力。';
    it['水地比']='亲比团结。问事业：宜合作。问感情：彼此依靠，关系紧密，是好的走向。';
    it['风天小畜']='小有蓄积。问事业：渐入佳境。问感情：感情在累积中，小细节堆积信任。';
    it['天泽履']='履行承诺。问事业：谨慎从事。问感情：说到做到比甜言蜜语更重要，用行动证明。';
    it['天火同人']='同心同德。问事业：得贵人。问感情：志同者道合，你们是战友也是恋人。';
    it['火天大有']='大有收获。问事业：丰收在即。问感情：感情进入收获期，之前的投入在回馈。';
    it['地山谦']='谦退有终。问事业：低调行事。问感情：放低姿态是智慧，谁先低头谁就赢了。';
    it['雷地豫']='悦乐安逸。问事业：顺势享受。问感情：相处愉快，但勿因舒适而忽略经营。';
    it['泽雷随']='随顺时势。问事业：顺应变化。问感情：别强求节奏，跟着感觉走，此时无为胜有为。';
    it['山风蛊']='蛊惑败坏。问事业：需整顿。问感情：关系中堆积的问题需要清理，拖不得了。';
    it['地泽临']='居高临下。问事业：亲临一线。问感情：多些陪伴，人在心在胜过千言万语。';
    it['风地观']='观察入微。问事业：审时度势。问感情：多观察少下结论，你看到的不一定是全部真相。';
    it['火雷噬嗑']='咀嚼磨合。问事业：需谈判。问感情：磨合期——把话说开、把棱角磨平，过程难受但值得。';
    it['山火贲']='文饰外在。问事业：重包装。问感情：别只看表面，内在连接更重要。';
    it['山地剥']='剥落消减。问事业：宜退守。问感情：可能有一方在退缩，给点空间比步步紧逼好。';
    it['地雷复']='一阳来复。问事业：复兴在望。问感情：分歧后的回暖，旧的破裂是新的开始。';
    it['天雷无妄']='真诚无妄。问事业：脚踏实地。问感情：真心最珍贵，别耍心机。';
    it['山天大畜']='大畜积蓄。问事业：厚积薄发。问感情：感情在持续累积中，量变到质变不远了。';
    it['山雷颐']='颐养之道。问事业：养精蓄锐。问感情：照顾好彼此的日常，感情在每一个小细节里。';
    it['泽风大过']='过犹不及。问事业：勿过激。问感情：爱得太用力反而让人窒息，适度是最好的距离。';
    it['坎为水']='坎险重重。问事业：诚信可度。问感情：感情正经历考验。坎虽深，但水能穿石——坚持就是对这段关系最深的承诺。';
    it['离为火']='光明依附。问事业：柔顺中正。问感情：热情是火，但需要木头来养。别让热度烧过头。';
    it['泽山咸']='感而遂通。问事业：宜合作。问感情：咸卦专主感情——少男少女心灵相通，是六十四卦中最利婚恋的一卦。近期感应强，宜多创造二人独处。';
    it['雷风恒']='恒久之道。问事业：持之以恒。问感情：恒卦利婚姻长久，你们的根基扎实，能走远。细水长流比轰轰烈烈更可靠。';
    it['天山遁']='退避有时。问事业：急流勇退。问感情：暂时退一步不是放弃，是有智慧地给彼此空间。';
    it['雷天大壮']='壮大强盛。问事业：势如破竹。问感情：男方主导力强，注意别让对方感到被控制。';
    it['火地晋']='日出地上。问事业：晋升在即。问感情：关系在往前推进，步伐虽慢但方向是对的。';
    it['地火明夷']='光明受伤。问事业：韬光养晦。问感情：可能有一方情绪低落。不是不爱了，是需要被接住。';
    it['风火家人']='家道之卦。问事业：宜家庭式管理。问感情：这是走向家庭的前奏——感情正在从恋爱模式切换到家人模式，稳。';
    it['火泽睽']='二女不同居。问事业：求同存异。问感情：近期易有分歧，小事放大。记住：你争的不是对错，是输赢。';
    it['水山蹇']='险在前也。问事业：待机而进。问感情：山上有水走不快——眼前的"卡"不是死局，等一等自然化解。';
    it['雷水解']='险以动。问事业：困局将解。问感情：雨过天晴的信号，之前的不顺在松动。';
    it['山泽损']='损下益上。问事业：有舍有得。问感情：关系中有一方在默默付出，别把对方的牺牲当理所当然。';
    it['风雷益']='损上益下。问事业：互惠互利。问感情：好的关系是互相给养，不是单方面索取。';
    it['泽天夬']='决断之时。问事业：当机立断。问感情：拖了很久的问题该做决定了，无论是分是和都比悬着强。';
    it['天风姤']='不期而遇。问事业：有机遇。问感情：注意第三方因素，桃花可能在别处。坚守即赢。';
    it['泽地萃']='聚集荟萃。问事业：人脉汇聚。问感情：感情因共同的朋友或社交圈变得更紧密。';
    it['地风升']='上升之势。问事业：步步高升。问感情：关系在上升期，顺势而为即可。';
    it['泽水困']='困而不失。问事业：坚守待援。问感情：感情陷在困局里——不是不爱了，是现实（工作、距离、钱）在卡着。困卦说"有终"，挺过去就是下一个层次。';
    it['水风井']='井养不穷。问事业：稳定可靠。问感情：感情如井水，越深处越甜。平淡不等于无味。';
    it['泽火革']='革旧换新。问事业：变革时机。问感情：旧的相处模式在崩塌，新的默契在生长——革故才能鼎新，别怕变化。';
    it['火风鼎']='鼎新之象。问事业：大展宏图。问感情：关系进入新阶段，之前的磨合结出了果。';
    it['震为雷']='震来虩虩。问事业：临危不乱。问感情：近期可能有突发事件冲击感情，稳住心态。';
    it['艮为山']='知止有定。问事业：适可而止。问感情：关系进入平台期——不前进不等于退步。';
    it['风山渐']='渐进之象。问事业：循序渐进。问感情：感情像文火慢炖，急不来但一直在变好。';
    it['雷泽归妹']='少女归嫁。问事业：宜联姻合作。问感情：归妹主婚姻——但要注意上下位置不对等，别让关系失衡。';
    it['雷火丰']='丰盛之时。问事业：收获季节。问感情：感情正处在最好的时期，但丰卦提醒：日中则昃，别挥霍对方的好。';
    it['火山旅']='旅居在外。问事业：宜流动。问感情：关系中有一方像"旅人"——来了又走，心还没定下来。异地恋常见此卦。';
    it['巽为风']='申命行事。问事业：顺势渗透。问感情：柔能克刚——不要硬碰硬，用温柔的方式说出你的需求。';
    it['兑为泽']='丽泽兑。问事业：悦而利。问感情：多笑多聊，相处轻松是第一位的。但要防"说得太多做得太少"。';
    it['风水涣']='涣散分离。问事业：宜聚人心。问感情：可能是分手卦，但涣也主"化冰"——散了的也能重新聚。看你怎么选。';
    it['水泽节']='节制有度。问事业：适可而止。问感情：爱要有度，给彼此留些私人空间比黏在一起更健康。';
    it['风泽中孚']='诚信感应。问事业：以诚待人。问感情：信任是最好的纽带，真诚能破一切隔阂。中孚卦极利感情——只要心不假，关系就不会假。';
    it['雷山小过']='小有过越。问事业：宜小不宜大。问感情：小事可过，底线不让。在包容和原则间找到平衡。';
    it['水火既济']='事已成就。问事业：守成防变。问感情：关系进入稳定期。既济卦说：守成比开创更难——别觉得稳了就不经营了。';
    it['火水未济']='尚未完成。问事业：继续努力。问感情：感情还没走到头——不是坏事，说明还有发展的空间和惊喜。';
    return it[bg.name]||('第'+bg.id+'卦「'+bg.name+'」：'+bg.desc+'。此卦寓意深远，宜结合具体问题深入分析。');
}
function switchQiguaMethod(){
    let m=document.getElementById('qgMethod').value;
    if(m==='time'){document.getElementById('timeQiguaInputs').style.display='';document.getElementById('timeBtn').style.display='';document.getElementById('coinBtn').style.display='none';document.getElementById('coinArea').style.display='none';}
    else{document.getElementById('timeQiguaInputs').style.display='none';document.getElementById('timeBtn').style.display='none';document.getElementById('coinBtn').style.display='';document.getElementById('coinArea').style.display='';}
}
function switchDivination(type){
    document.querySelectorAll('#qigua-liuyao,#qigua-meihua,#qigua-liuren,#qigua-chenggu').forEach(d=>d.style.display='none');
    document.querySelectorAll('#dt-liuyao,#dt-meihua,#dt-liuren,#dt-chenggu').forEach(t=>t.classList.remove('active'));
    document.getElementById('qigua-'+type).style.display='block';
    document.getElementById('dt-'+type).classList.add('active');
}

// ==================== 梅花易数 ====================
const MH_BAGUA=['☰乾','☱兑','☲离','☳震','☴巽','☵坎','☶艮','☷坤'];
const MH_NAMES=['乾','兑','离','震','巽','坎','艮','坤'];
const MH_WX=['金','金','火','木','木','水','土','土'];
const MH_MEANING={0:'天行健，君子以自强不息。刚健主动，领导力强。',1:'丽泽兑，君子以朋友讲习。喜悦沟通，利人际。',2:'明两作，大人以继明照四方。热情明亮，需依附。',3:'洊雷震，君子以恐惧修省。变动革新，有爆发力。',4:'随风巽，君子以申命行事。柔顺渗透，顺势而为。',5:'水洊至，君子以常德行。险陷坚持，深流不急。',6:'兼山艮，君子以思不出位。知止有度，适可而止。',7:'地势坤，君子以厚德载物。包容柔顺，承载万物。'};
function meihuaGua(){
    let q=document.getElementById('mhQuestion').value||'问运势';
    let method=document.getElementById('mhMethod').value;
    let up,lo,dong;
    if(method==='date'){
        let now=new Date();let y=now.getFullYear(),m=now.getMonth()+1,d=now.getDate();
        up=(y+m+d)%8||8;lo=(y+m+d+now.getHours())%8||8;dong=(y+m+d)%6||6;
    }else{
        let nums=document.getElementById('mhNums').value.trim().split(/\s+/).map(Number);
        if(nums.length<3||nums.some(isNaN)){let el=document.getElementById('mhResult');el.style.display='block';el.innerHTML='<div style="padding:16px;text-align:center;color:var(--red);background:#fdf8f5;border-radius:10px;font-size:13px;">⚠️ 请输入三个有效数字，用空格分隔（如：3 8 15）</div>';return;}
        up=((nums[0]||1)%8)||8;lo=((nums[1]||1)%8)||8;dong=((nums[2]||1)%6)||6;
    }
    let uIdx=(up-1)%8, lIdx=(lo-1)%8;
    let bgName=MH_NAMES[uIdx]+'为'+([MH_NAMES[lIdx]])[0];
    let huIdx=((uIdx%8)+(lIdx%8))%8, huIdx2=((lIdx%8)+(uIdx%8))%8;
    let biIdx=(uIdx+((dong%2)?1:-1)+8)%8;
    // 体用：动爻在上卦则上卦为用、下卦为体；反之亦然。dong从1开始，1-3为下卦动
    let tiIdx,lxWx,bxWx,tx;
    if(dong<=3){tiIdx=uIdx;lxWx=MH_WX[uIdx];bxWx=MH_WX[lIdx];tx='下卦动，上卦'+MH_NAMES[uIdx]+'为<strong>体</strong>，下卦'+MH_NAMES[lIdx]+'为<strong>用</strong>';}
    else{tiIdx=lIdx;lxWx=MH_WX[lIdx];bxWx=MH_WX[uIdx];tx='上卦动，下卦'+MH_NAMES[lIdx]+'为<strong>体</strong>，上卦'+MH_NAMES[uIdx]+'为<strong>用</strong>';}
    let wxRel='';const wxS={'金':['土','水'],'水':['金','木'],'木':['水','火'],'火':['木','土'],'土':['火','金']};
    // 体卦五行 vs 用卦五行：用生体吉，体生用泄，体用比和吉，用克体凶
    if(lxWx===bxWx)wxRel='体用比和，气场相近，平稳发展，大吉。';
    else if(wxS[lxWx]&&wxS[lxWx][0]===bxWx)wxRel='用生体（'+bxWx+'生'+lxWx+'），对方有利你，顺势而为，吉。';
    else if(wxS[bxWx]&&wxS[bxWx][0]===lxWx)wxRel='体生用（'+lxWx+'生'+bxWx+'），你滋养对方，付出有回报但需量力。';
    else if(wxS[lxWx]&&wxS[lxWx][1]===bxWx)wxRel='用克体（'+bxWx+'克'+lxWx+'），事有不顺，宜以柔克刚，等待时机。';
    else wxRel='体克用（'+lxWx+'克'+bxWx+'），事情可成但需努力，过程较辛苦。';
    let dyName=['初爻','二爻','三爻','四爻','五爻','上爻'][dong-1];
    // huIdx/biIdx 已在上面声明，此处直接使用
    let h='<div style="text-align:center;padding:12px 0;">';
    h+='<div style="font-size:28px;color:var(--accent);letter-spacing:4px;">'+MH_BAGUA[uIdx]+' '+MH_BAGUA[lIdx]+'</div>';
    h+='<div style="font-size:14px;color:var(--text);margin-top:4px;">本卦：'+bgName+'　·　'+dyName+'动</div>';
    h+='<div style="font-size:10px;color:var(--text);opacity:0.7;">上卦：'+MH_NAMES[uIdx]+'('+MH_WX[uIdx]+')　下卦：'+MH_NAMES[lIdx]+'('+MH_WX[lIdx]+')　|　互卦：'+MH_NAMES[huIdx]+'　变卦：'+MH_NAMES[biIdx]+'</div>';
    h+='</div>';
    h+='<div class="analysis-text"><p><strong>【卦象解读】</strong>'+q+'：</p>';
    h+='<p>'+MH_MEANING[uIdx]+'</p><p>'+MH_MEANING[lIdx]+'</p>';
    h+='<p><strong>【体用关系】</strong>'+wxRel+'</p>';
    h+='<p>'+dyName+'动，提示变化正在此处发生。';
    let dyTip={0:'根基层面有变动，注意基础事务。',1:'内部关系在调整，多关注对方感受。',2:'内心的想法正在松动，是改变的好时机。',3:'外部环境开始介入，需应对外界变化。',4:'关键决策点，主动出击的时机。',5:'大局已定，顺势收尾即可。'};
    h+=dyTip[dong-1]||'';
    h+='</p></div>';
    document.getElementById('mhResult').innerHTML=h;
    document.getElementById('mhResult').style.display='block';
}

// ==================== 小六壬 ====================
const LR_NAMES=['大安','留连','速喜','赤口','小吉','空亡'];
const LR_MEAN={
    '大安':{color:'#8bc34a',desc:'大安事事昌，求谋在东方。失物不远去，宅舍保平安。',love:'感情稳定平和，对方心意踏实可感，近期无波澜亦无危机。宜珍惜平淡中的温度。',work:'工作顺利，宜稳中求进。求职者东方有利。',score:85},
    '留连':{color:'#ff9800',desc:'留连事难成，求谋日不明。凡事需缓行，去者未回程。',love:'感情处于胶着期，进也不是退也不舍。不是坏事——云还在聚，等一等就好。切忌在焦虑中做决定。',work:'进展缓慢，宜等待时机。不宜冒进。',score:45},
    '速喜':{color:'#4fc3f7',desc:'速喜喜来临，求财向南行。失物逢午未，行人路上寻。',love:'感情有喜讯，对方态度积极。近期可能有约会、表白或关系升级的契机。主动一点，好事近。',work:'有意外收获，面试/谈判顺利。南方有利。',score:90},
    '赤口':{color:'#ef5350',desc:'赤口主口舌，官非切要防。失物急去寻，行人有惊慌。',love:'小心口角争执。近期容易因小事引发争吵，说话之前先过脑子。不是大矛盾，但别让它发酵。',work:'谨防小人，合同条款仔细检查。',score:30},
    '小吉':{color:'#ff9800',desc:'小吉最吉昌，路上好商量。阳人来报喜，失物在坤方。',love:'感情有贵人相助或喜讯传来。两人相处轻松愉快，是增进感情的好时机。适合一起出游或见朋友。',work:'合作顺利，利于团队协作。西南方有利。',score:78},
    '空亡':{color:'#888',desc:'空亡事不长，阴人少主张。求财无利益，行人有灾殃。',love:'近期感情可能感觉虚空无力，像拳头打在棉花上。不是对方不爱了，是两人都没找到合适的频道。停一停比硬推好。',work:'计划易落空，宜重新评估。不宜重大决策。',score:20}
};
function liurenCalc(){
    let m=parseInt(document.getElementById('lrMonth').value);
    let d=parseInt(document.getElementById('lrDay').value);
    let h=parseInt(document.getElementById('lrHour').value);
    let q=document.getElementById('lrQuestion').value||'问运势';
    // 月→日→时 顺序推算
    let pos=(m-1)%6;
    pos=(pos+d-1)%6;
    pos=(pos+h)%6;
    let name=LR_NAMES[pos],info=LR_MEAN[name];
    let c=info.color;
    let html='<div style="text-align:center;padding:16px;">';
    html+='<div style="font-size:42px;font-weight:700;color:'+c+';">'+name+'</div>';
    html+='<div style="font-size:12px;color:#888;margin-top:4px;">月'+m+'·日'+d+'·时  →  第'+(pos+1)+'位</div>';
    html+='</div>';
    html+='<div class="analysis-text">';
    html+='<p style="color:var(--accent);">🔮 '+q+'</p>';
    html+='<p><strong>判词：</strong>'+info.desc+'</p>';
    html+='<p><strong>❤️ 感情：</strong>'+info.love+'</p>';
    html+='<p><strong>📖 事业：</strong>'+info.work+'</p>';
    html+='<p style="font-size:10px;color:#666;margin-top:8px;">综合吉度：'+info.score+'分</p>';
    // 速断流
    let liuP=[];
    for(let i=0;i<6;i++){let pi=(pos+i)%6;liuP.push('<span style="color:'+LR_MEAN[LR_NAMES[pi]].color+'">'+LR_NAMES[pi]+'</span>');}
    html+='<p style="font-size:10px;color:#888;">六神流转：'+liuP.join(' → ')+'</p>';
    html+='</div>';
    document.getElementById('lrResult').innerHTML=html;
    document.getElementById('lrResult').style.display='block';
}

// ==================== 称骨算命（袁天罡） ====================
const CG_YEAR={
    0:[12,7],1:[9,0],2:[12,0],3:[7,0],4:[15,0],5:[8,0],6:[16,0],7:[8,0],8:[17,0],9:[7,0],10:[18,0],11:[7,0]
};// 地支索引→对应[钱,分] 简化：子1.2两 丑0.9两...
const CG_MONTH={1:[6,0],2:[7,0],3:[18,0],4:[9,0],5:[5,0],6:[16,0],7:[9,0],8:[15,0],9:[18,0],10:[8,0],11:[9,0],12:[5,0]};
const CG_DAY={
    1:[5,0],2:[10,0],3:[8,0],4:[15,0],5:[16,0],6:[15,0],7:[8,0],8:[16,0],9:[8,0],10:[16,0],
    11:[9,0],12:[17,0],13:[8,0],14:[17,0],15:[10,0],16:[8,0],17:[9,0],18:[18,0],19:[5,0],20:[15,0],
    21:[10,0],22:[9,0],23:[8,0],24:[9,0],25:[15,0],26:[18,0],27:[7,0],28:[8,0],29:[16,0],30:[6,0]
};
const CG_HOUR={0:[16,0],1:[6,0],2:[7,0],3:[10,0],4:[9,0],5:[16,0],6:[10,0],7:[8,0],8:[8,0],9:[9,0],10:[6,0],11:[6,0]};

const CG_INTERPRET={
    '2.1':{c:'#ef5350',t:'短命非业谓大凶',d:'平生灾难事重重，凶祸频临陷逆境，终世困苦事不成。此乃最轻之命，一生多磨多难，需行善积德以求转机。',s:10},
    '2.2':{c:'#ef5350',t:'身寒骨冷苦伶仃',d:'此命推来气死人，劳劳碌碌苦中求，若得善行三十六，许汝终生好日头。早年贫苦，中晚年后积善可转。',s:15},
    '2.3':{c:'#ef5350',t:'此命推来骨肉轻',d:'求谋做事事难成，妻儿兄弟实难靠，外出他乡做散人。宜离乡发展，自力更生。',s:18},
    '2.4':{c:'#ef5350',t:'平生衣禄苦中求',d:'独自营谋事不休，离祖出门宜早计，晚来衣禄自无忧。早年独立打拼，晚景尚可。',s:22},
    '2.5':{c:'#ff9800',t:'此命推来祖业微',d:'门庭营度似稀奇，六亲骨肉如冰炭，一世勤劳自把持。祖业无靠，白手起家，勤劳致富。',s:28},
    '2.6':{c:'#ff9800',t:'平生衣禄苦中求',d:'独自营谋事不休，离祖出门宜早计，晚来衣禄庶无忧。早年奔波劳碌，中年起运渐好转，晚景安稳。',s:32},
    '2.7':{c:'#ff9800',t:'一生做事少商量',d:'难靠祖宗做主张，独马单枪空做去，早年晚岁总无长。性格独立，不喜依赖他人，一生靠自己。',s:35},
    '2.8':{c:'#ff9800',t:'一生行事似飘蓬',d:'祖宗产业在梦中，若不房改并改姓，也当移徒二三通。宜改行或换环境，流动性较强。',s:38},
    '2.9':{c:'#ff9800',t:'初年运限未曾亨',d:'纵有功名在后成，需过四旬方可上，移居改姓使为良。中年四十岁后方可转运，前期积蓄。',s:42},
    '3.0':{c:'#ff9800',t:'劳劳碌碌苦中求',d:'东奔西走何日休，若使终生勤与俭，老来稍可免忧愁。勤劳者晚年安稳，一生需不断奋斗。',s:45},
    '3.1':{c:'#ff9800',t:'忙忙碌碌苦中求',d:'何日云开见日头，难得祖基家可立，中年衣食渐无忧。中年后运势转好，生活安定。',s:48},
    '3.2':{c:'#ff9800',t:'初年运蹇事难谋',d:'渐有财源如水流，到得中年衣食旺，那时名利一齐收。中年后财运亨通，名利双至。',s:52},
    '3.3':{c:'#ff9800',t:'早年做事事难成',d:'百计徒劳枉费心，半世自如流水去，后来运到始得金。前半生多有波折，人到中年方始转运。',s:55},
    '3.4':{c:'#ff9800',t:'此命福气果如何',d:'僧道门中衣禄多，离祖出家方得妙，终朝拜佛念弥陀。宜从事文化、宗教或远离世俗纷争之业。',s:52},
    '3.5':{c:'#8bc34a',t:'生平福量不周全',d:'祖业根基觉少传，营事生涯宜守旧，时来衣食胜从前。不宜冒进，守成渐进，运势自然提升。',s:60},
    '3.6':{c:'#8bc34a',t:'不须劳碌过平生',d:'独自成家福不轻，早有福星常照命，任君行去百般成。有福之人，自带贵气，诸事顺遂。',s:70},
    '3.7':{c:'#8bc34a',t:'此命般般事不成',d:'弟兄少力自孤行，虽然祖业须微有，来得明时去不明。独力难支，需提防一手进一手出，不聚财。',s:55},
    '3.8':{c:'#8bc34a',t:'一身骨肉最清高',d:'早入簧门姓氏标，待到年将三十六，蓝衫脱去换红袍。早年学业有成，三十六岁后事业腾飞。',s:72},
    '3.9':{c:'#8bc34a',t:'此命少年运不通',d:'劳劳做事尽皆空，苦心竭力成家计，到得那时在梦中。少年艰辛，中年有成，但需防大起大落。',s:58},
    '4.0':{c:'#8bc34a',t:'平生衣禄是绵长',d:'件件心中自主张，前面风霜多受过，后来必定享安康。先苦后甜之命，晚年福泽深厚。',s:75},
    '4.1':{c:'#8bc34a',t:'此命推来事不同',d:'为人能干异凡庸，中年还有逍遥福，不比前时运未通。能力出众，中年逍遥自在。',s:78},
    '4.2':{c:'#8bc34a',t:'得宽怀处且宽怀',d:'何用双眉皱不开，若使中年命运济，那时名利一齐来。心态好则运势好，中年名利双收。',s:80},
    '4.3':{c:'#8bc34a',t:'为人心性最聪明',d:'做事轩昂近贵人，衣禄一生天数定，不须劳碌是丰亨。聪明颖悟，天生运气不差，一生衣食无忧。',s:82},
    '4.4':{c:'#8bc34a',t:'万事由天莫苦求',d:'须知福碌赖人修，当年财帛难如意，晚景欣然便不忧。晚年福气好，年轻时需耐心积累。',s:76},
    '4.5':{c:'#8bc34a',t:'名利推求竟若何',d:'前番辛苦后奔波，命中难养男与女，骨肉扶持也不多。事业有成但子嗣缘分较薄，需后天多积福。',s:68},
    '4.6':{c:'#8bc34a',t:'东西南北尽皆通',d:'出姓移居更觉隆，衣禄无亏天数定，中年晚景一般同。走南闯北皆宜，适合异地发展。',s:72},
    '4.7':{c:'#8bc34a',t:'此命推来旺末年',d:'妻荣子贵自怡然，平生原有滔滔福，可有财源如水流。晚年大旺，妻贤子孝，财源滚滚。',s:85},
    '4.8':{c:'#8bc34a',t:'初年运道未曾亨',d:'若是蹉跎再不兴，兄弟六亲皆无靠，一身事业晚年成。早年辛苦、晚年事业有成，后福深。',s:70},
    '4.9':{c:'#8bc34a',t:'此命推来福不轻',d:'自成自立显门庭，从来富贵人钦敬，使婢差奴过一生。自立自强，富贵显达，受人尊敬。',s:83},
    '5.0':{c:'#ff9800',t:'为利为名终日劳',d:'中年福禄也多遭，老来是有财星照，不比前番日下高。名利心重，中年有波折，晚年财运亨通。',s:65},
    '5.1':{c:'#8bc34a',t:'一世荣华事事通',d:'不须劳碌自亨通，弟兄叔侄皆如意，家业成时福禄宏。富贵之命，六亲和睦，家业兴旺。',s:88},
    '5.2':{c:'#8bc34a',t:'一世亨通事事能',d:'不须劳苦自然宁，宗族有光欣喜甚，家产丰盈自称心。天生好命，家族荣耀，丰衣足食。',s:90},
    '5.3':{c:'#8bc34a',t:'此格推来礼义通',d:'一身福禄用无穷，甜酸苦辣皆尝过，滚滚财源稳且丰。饱经世事后的富贵，根基稳固，财源丰厚。',s:87},
    '5.4':{c:'#8bc34a',t:'此命推来厚且清',d:'诗书满腹看功成，丰衣足食自然稳，正是人间有福人。书香门第之命，文化底蕴深厚，福泽绵长。',s:85},
    '5.5':{c:'#ff9800',t:'走马扬鞭争利名',d:'少年做事费筹论，一朝福禄源源至，富贵荣华显六亲。少年奔波争名，中晚年富贵双全，光宗耀祖。',s:72},
    '5.6':{c:'#8bc34a',t:'此格推来礼义通',d:'一身福禄用无穷，甜酸苦辣皆尝过，滚滚财源稳且丰。礼义通达之命，经历丰富后终得富贵。',s:86},
    '5.7':{c:'#8bc34a',t:'福禄丰盈万事全',d:'一身荣耀乐天年，名扬威震人争羡，此世逍遥宛似仙。大富大贵之命，名扬四方，一生逍遥。',s:92},
    '5.8':{c:'#8bc34a',t:'平生衣食自然来',d:'名利双收富贵偕，金榜题名登甲第，紫袍玉带走金阶。天生富贵命，功名利禄皆自来，人生赢家。',s:93},
    '5.9':{c:'#8bc34a',t:'细推此格秀而清',d:'必定才高学业成，甲第之中应有分，扬鞭走马显威荣。才高八斗，科举得第，仕途显达。',s:90},
    '6.0':{c:'#8bc34a',t:'一朝金榜快题名',d:'显祖荣宗立大勋，衣食定然原裕足，田园财帛更丰盈。金榜题名，光宗耀祖，财富丰厚。',s:95},
    '6.1':{c:'#8bc34a',t:'不作朝中金榜客',d:'定为世上大财翁，聪明天赋经书熟，名显高科自是荣。非官即商之贵命，天赋异禀，必成大器。',s:93},
    '6.2':{c:'#8bc34a',t:'此命生来福不穷',d:'读书必定显亲宗，紫衣金带为卿相，富贵荣华皆可同。福泽深厚，学而优则仕，官至卿相。',s:94},
    '6.3':{c:'#8bc34a',t:'此命生来福自宏',d:'田园家业最高隆，平生衣禄盈丰足，一路荣华万事通。大富大贵之命，家业兴隆，万事亨通。',s:96},
    '6.4':{c:'#8bc34a',t:'此格威权不可当',d:'紫袍金带坐高堂，荣华富贵谁能及，积玉堆金满储仓。权势滔天之命，位极人臣，富贵至极。',s:97},
    '6.5':{c:'#8bc34a',t:'功名福禄自能昌',d:'紫袍金带在朝堂，一生富贵声名显，定是人间大吉昌。仕途显达之功名命，一生富贵，声名远扬。',s:96},
    '6.6':{c:'#8bc34a',t:'此格人间一福人',d:'堆金积玉满堂春，从来富贵由天定，正笏垂绅谒圣君。人间福人，富贵天成，官运亨通。',s:98},
    '6.7':{c:'#8bc34a',t:'此命生来福自宏',d:'田园家业最高隆，平生衣禄盈丰足，一世荣华万事通。福泽无疆，家业兴盛，万事亨通。',s:97},
    '7.0':{c:'#8bc34a',t:'一生荣华万事通',d:'不须劳碌自亨通，此命推来福不轻，称为天下第一福。万中无一之上上命格，荣华富贵不劳而获，福星高照一生。',s:99},
    '7.1':{c:'#8bc34a',t:'此命生成大不同',d:'公侯卿相在其中，一生自有逍遥福，富贵荣华极品隆。极品贵格，位列三公九卿之命，天下无人能及。',s:100}
};

function chengguCalc(){
    let y=parseInt(document.getElementById('cgYear').value);
    let m=parseInt(document.getElementById('cgMonth').value);
    let d=parseInt(document.getElementById('cgDay').value);
    let h=parseInt(document.getElementById('cgHour').value);
    let g=document.querySelector('#cgGt button.active').dataset.g;
    // 年柱地支：用 getYearGZ 直接获取（已处理立春边界）
    let yGZ=getYearGZ(y,m,d||1);let yB=yGZ.b;
    let yQ=CG_YEAR[yB]||[9,0];
    let mQ=CG_MONTH[m]||[6,0];
    let dQ=CG_DAY[Math.min(d,30)]||[8,0];
    let hQ=CG_HOUR[h]||[10,0];
    let totalQ=yQ[0]*10+yQ[1]+mQ[0]*10+mQ[1]+dQ[0]*10+dQ[1]+hQ[0]*10+hQ[1];
    let liang=Math.floor(totalQ/10),qian=totalQ%10;
    let key=liang+'.'+qian;
    // 向上取最近的键
    let keys=Object.keys(CG_INTERPRET).sort((a,b)=>parseFloat(a)-parseFloat(b));
    let bestKey=key;
    if(!CG_INTERPRET[key]){
        let val=parseFloat(key);
        for(let k of keys){if(parseFloat(k)>=val){bestKey=k;break;}}
        if(!CG_INTERPRET[bestKey])bestKey=keys[keys.length-1];
    }
    let info=CG_INTERPRET[bestKey]||CG_INTERPRET['4.1'];
    let c=info.c,sc=info.s;
    let level=sc>=90?'上上':sc>=80?'上等':sc>=65?'中等':sc>=40?'中下':'下等';
    let html='<div style="text-align:center;padding:16px;">';
    html+='<div style="font-size:56px;font-weight:700;color:'+c+';">'+liang+'两'+qian+'钱</div>';
    html+='<div style="font-size:12px;color:#888;">('+level+'命 · '+info.s+'分)</div>';
    html+='</div>';
    html+='<div class="analysis-text">';
    html+='<p style="color:var(--accent);"><strong>'+info.t+'</strong></p>';
    html+='<p>'+info.d+'</p>';
    html+='<p style="font-size:10px;color:#666;">袁天罡称骨歌 · 年'+yQ[0]+'钱'+yQ[1]+'分 + 月'+mQ[0]+'钱'+mQ[1]+'分 + 日'+dQ[0]+'钱'+dQ[1]+'分 + 时'+hQ[0]+'钱'+hQ[1]+'分 = '+liang+'两'+qian+'钱</p>';
    html+='</div>';
    document.getElementById('cgResult').innerHTML=html;
    document.getElementById('cgResult').style.display='block';
}

