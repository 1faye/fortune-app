function switchMode(mode){
    document.querySelectorAll('.mode-tab').forEach(t=>t.classList.remove('active'));
    if(typeof event!=='undefined'&&event&&event.target)event.target.classList.add('active');
    else document.querySelector('.mode-tab[onclick*="'+mode+'"]').classList.add('active');
    document.getElementById('mode-bazi').style.display='none';
    document.getElementById('mode-qigua').style.display='none';
    document.getElementById('mode-ziwei').style.display='none';
    document.getElementById('mode-hepan').style.display='none';
    if(mode==='bazi'){document.getElementById('mode-bazi').style.display='block';document.getElementById('mainTitle').innerText='八字排盘 · 全面专业版';document.getElementById('mainSub').innerText='全国城市经纬度 · 详细命理分析';}
    else if(mode==='qigua'){document.getElementById('mode-qigua').style.display='block';document.getElementById('mainTitle').innerText='占卜 · 三法合参';document.getElementById('mainSub').innerText='六爻起卦 · 梅花易数 · 小六壬';}
    else if(mode==='ziwei'){document.getElementById('mode-ziwei').style.display='block';document.getElementById('mainTitle').innerText='紫微斗数 · 命盘分析';document.getElementById('mainSub').innerText='十二宫 · 十四主星 · 命盘解读';}
    else{document.getElementById('mode-hepan').style.display='block';document.getElementById('mainTitle').innerText='八字合盘 · 缘分分析';document.getElementById('mainSub').innerText='双方八字匹配度 · 夫妻宫互动 · 五行互补';}
}

// ==================== GLOBALS ====================
var ps=[],cyGZ,cmGZ,cdGZ,chGZ,wc,gst,gys,ggen;

function calc(){
    let y=parseInt(document.getElementById('byear').value);
    let m=parseInt(document.getElementById('bmonth').value);
    let d=parseInt(document.getElementById('bday').value);
    let hh=parseInt(document.getElementById('bhour').value);
    let mm=parseInt(document.getElementById('bmin').value);
    let lon=parseFloat(document.getElementById('lonVal').value)||116.4;
    ggen=document.querySelector('#gt button.active').dataset.g;
    let ts=trueSolarTime(hh,mm,lon,y,m,d);let h=ts.h,min=ts.m;
    document.getElementById('tsInfo').innerHTML='🕐 真太阳时校正：<b>'+String(h).padStart(2,'0')+':'+String(min).padStart(2,'0')+'</b>（经度 '+lon.toFixed(1)+'°E'+(lon>120?'，比北京时间早 '+Math.round(ts.dm)+' 分钟':(lon<120?'，比北京时间晚 '+Math.round(Math.abs(ts.dm))+' 分钟':'，与北京时间一致'))+'）';
    let dy=y,dm=m,dd=d;if(h>=23){let nd=new Date(y,m-1,d+1);dy=nd.getFullYear();dm=nd.getMonth()+1;dd=nd.getDate();}
    let yGZ_=getYearGZ(y,m,d),mb_=getMonthBranch(y,m,d),ms_=getMonthStem(yGZ_.s,mb_);
    let mGZ={s:ms_,b:mb_},dGZ_=getDayGZ(new Date(dy,dm-1,dd));
    let hb_=getHourBranch(h),hs_=getHourStem(dGZ_.s,hb_),hGZ={s:hs_,b:hb_};
    ps=[{name:'年柱',s:yGZ_.s,b:yGZ_.b,stem:S[yGZ_.s],branch:B[yGZ_.b],nayin:getNayin(yGZ_.s,yGZ_.b)},{name:'月柱',s:mGZ.s,b:mGZ.b,stem:S[mGZ.s],branch:B[mGZ.b],nayin:getNayin(mGZ.s,mGZ.b)},{name:'日柱',s:dGZ_.s,b:dGZ_.b,stem:S[dGZ_.s],branch:B[dGZ_.b],nayin:getNayin(dGZ_.s,dGZ_.b)},{name:'时柱',s:hGZ.s,b:hGZ.b,stem:S[hGZ.s],branch:B[hGZ.b],nayin:getNayin(hGZ.s,hGZ.b)}];
    cyGZ=yGZ_;cmGZ=mGZ;cdGZ=dGZ_;chGZ=hGZ;
    gst=analyzeStrength(dGZ_,mb_,ps);gys=analyzeYongShen(dGZ_,gst.st);
    wc={木:0,火:0,土:0,金:0,水:0};
    ps.forEach(p=>{wc[SE[p.s]]++;wc[BE[p.b]]++;HD[p.b].forEach(h=>{let hi=S.indexOf(h);if(hi>=0)wc[SE[hi]]++;});});
    render(y,m,d,h,ggen);
    document.getElementById('res').style.display='block';
    setTimeout(()=>document.getElementById('bazi').scrollIntoView({behavior:'smooth'}),100);
}

function render(y,m,d,h,gen){
    let dGZ_=cdGZ;
    // 四柱
    let hdr='<div class="lbl">天干</div>';ps.forEach(p=>hdr+='<div class="hcell">'+p.name+'</div>');
    let sr='<div class="lbl">天干</div>';ps.forEach(p=>{let e=SE[p.s];sr+='<div class="scell wx-'+e+'">'+p.stem+'<div class="elabel etag '+e+'">'+e+SYY[p.s]+'</div></div>'});
    let br='<div class="lbl">地支</div>';ps.forEach(p=>{let e=BE[p.b];br+='<div class="bcell wx-'+e+'">'+p.branch+'<div class="elabel etag '+e+'">'+e+BYY[p.b]+'</div></div>'});
    document.getElementById('baziTbl').innerHTML=hdr+sr+br;
    let naR='';ps.forEach(p=>naR+='<div>'+p.nayin+'</div>');document.getElementById('nayinR').innerHTML=naR;
    let kw_=getKongWang(dGZ_);let kwR='';ps.forEach(p=>kwR+='<div>空亡：'+kw_[0]+kw_[1]+'</div>');document.getElementById('kwR').innerHTML=kwR;
    // 胎元 & 命宫
    let taiYuanS=(ps[1].s+1)%10,taiYuanB=(ps[1].b+3)%12;
    let taiYuan=S[taiYuanS]+B[taiYuanB]+'（胎元）';
    let mingGongB=(26-(ps[1].b+ps[3].b))%12;if(mingGongB<0)mingGongB+=12;
    let mingGongS=(('甲己'.includes(S[cyGZ.s])?0:'乙庚'.includes(S[cyGZ.s])?2:'丙辛'.includes(S[cyGZ.s])?4:'丁壬'.includes(S[cyGZ.s])?6:8)+mingGongB)%10;
    let mingGong=S[mingGongS]+B[mingGongB]+'（命宫）';
    document.getElementById('taiyuanR').innerHTML='<div>'+taiYuan+'</div><div>'+mingGong+'</div>';
    // 日柱详解
    const RZJ={
'甲子':'甲子为六十甲子之首，甲木坐子水正印，印星生身，聪明仁慈。甲子日生人性格温良，好学上进，有领导力。一生多得长辈贵人相助。配偶宫子水滋润，婚姻宜找温柔体贴之人。事业方向：教育、文化、管理。',
'乙丑':'乙木坐丑土偏财，财星藏杀。乙丑日人外柔内刚，心思细腻，善于理财但不露富。丑中藏辛金七杀，内心有韧劲。婚姻宜配敦厚之人。事业方向：金融、农业、设计。',
'丙寅':'丙火坐寅木长生，寅为丙之长生位。丙寅日生人热情似火，充满活力，天生领袖气质。寅中藏甲木偏印，聪明善谋。婚姻宜找能包容你光芒之人。事业方向：政治、能源、传媒。',
'丁卯':'丁火坐卯木偏印，卯为丁之病地。丁卯日人外热内敛，心思细腻，有艺术天赋。卯木偏印生身，学习能力强。婚姻宜配开朗之人。事业方向：文艺、设计、教育。',
'戊辰':'戊土坐辰土比肩，辰为水库亦为财库。戊辰日人稳重厚道，诚信可靠，天生有积累财富的本能。辰中藏乙木正官，有责任心。婚姻稳定但少浪漫。事业方向：房地产、金融、公职。',
'己巳':'己土坐巳火正印，巳为帝旺。己巳日人温和中带着刚强，巳火印星生身，智慧出众。巳中藏丙火劫财，重情义但易为朋友所累。婚姻宜配稳重之人。事业方向：教育、医疗、服务业。',
'庚午':'庚金坐午火正官，午为沐浴。庚午日人刚毅正直，午火锻金，性格经过磨砺更显锋利。午中藏丁火正官，事业心强。婚姻宜找包容理解之人。事业方向：军警、法律、工程。',
'辛未':'辛金坐未土偏印，未为衰地。辛未日人精致讲究，审美出众，未土生金但亦燥金。未藏丁火七杀，内心有不服输的劲。婚姻宜配温柔润泽之人。事业方向：珠宝、艺术、金融。',
'壬申':'壬水坐申金偏印，申为长生。壬申日人聪明灵活，思维敏捷，申金偏印生水，善于学习和变通。申藏庚金偏印，学术天赋高。婚姻宜配沉稳之人。事业方向：IT、科研、贸易。',
'癸酉':'癸水坐酉金偏印，酉为病地。癸酉日人内敛深沉，心思缜密，酉金生水但偏印过旺易多想。酉藏辛金偏印，直觉敏锐。婚姻宜配阳光开朗之人。事业方向：研究、策划、咨询。',
'甲戌':'甲木坐戌土偏财，戌为养地。甲戌日人有担当、重情义。戌为火库，藏丁火伤官，才华在逆境中绽放。戌中辛金正官，自律性强。婚姻宜配理解你事业心之人。事业方向：建筑、能源、管理。',
'乙亥':'乙木坐亥水正印，亥为死地亦为长生。乙亥日人温柔而坚韧，亥水正印滋养木根，一生多得贵人。亥藏壬水正印，天生好命。婚姻宜配阳光积极之人。事业方向：文化、公益、教育。',
'丙子':'丙火坐子水正官，子为胎地。丙子日人外热内冷，双重性格。子水正官制约丙火，做事有分寸但内心有压抑感。婚姻宜配温和体贴之人。事业方向：管理、政务、服务业。',
'丁丑':'丁火坐丑土食神，丑为墓地。丁丑日人深沉内敛，丑中藏辛金偏财，善于理财但不易露富。食神生财，有口福和偏财运。婚姻宜配务实之人。事业方向：餐饮、金融、农业。',
'戊寅':'戊土坐寅木七杀，寅为长生。戊寅日人看似沉稳实则有冲劲，寅木七杀赋予行动力。寅藏甲木七杀，勇于挑战。婚姻宜配柔和之人。事业方向：军警、体育、创业。',
'己卯':'己土坐卯木七杀，卯为病地。己卯日人温和外表下藏着不妥协的劲。卯木七杀制约己土，有危机意识。婚姻宜配刚健之人以互补。事业方向：医疗、服务、艺术。',
'庚辰':'庚金坐辰土偏印，辰为养地。庚辰日人刚中有柔，辰为水库亦为印库，一生带贵气。辰藏乙木正财，财运稳定。婚姻宜配理解你脾气之人。事业方向：管理、金融、技术。',
'辛巳':'辛金坐巳火正官，巳为死地。辛巳日人表面精致、内心火热。巳中丙火正官锻金，事业需经考验方成。婚姻宜配包容润泽之人。事业方向：金融、珠宝、法律。',
'壬午':'壬水坐午火正财，午为胎地。壬午日人浪漫多情，午火正财为壬水所克，事业财运需主动争取。午藏丁火正财，财运尚可。婚姻宜配稳重踏实之人。事业方向：贸易、旅游、销售。',
'癸未':'癸水坐未土七杀，未为墓地。癸未日人外柔内烈，未土七杀制癸水，内心有不服输的倔强。未藏丁火偏财，有偏财运。婚姻宜配阳光之人。事业方向：工程、金融、服务业。',
'甲申':'甲木坐申金七杀，申为绝地。甲申日人一生需经历挑战方成大器。申金七杀锻甲木，磨砺出锋芒。申藏庚金七杀，事业心极强。婚姻宜配温柔滋养之人。事业方向：军警、管理、竞技。',
'乙酉':'乙木坐酉金七杀，酉为绝地。乙酉日人外表柔弱内心坚韧，酉金七杀似剪刀修枝，越挫越勇。酉藏辛金七杀，有决断力。婚姻宜配温暖包容之人。事业方向：设计、医疗、教育。',
'丙戌':'丙火坐戌土食神，戌为墓地。丙戌日人热情中带着深沉，戌为火库，能量深藏不露。戌藏辛金正财，财运稳健。婚姻宜配理解你热情之人。事业方向：能源、建筑、餐饮。',
'丁亥':'丁火坐亥水正官，亥为胎地。丁亥日人温暖而有原则，亥水正官制约丁火，做事有分寸。亥藏壬水正官，贵气自然而来。婚姻宜配阳光有主见之人。事业方向：管理、文化、公职。',
'戊子':'戊土坐子水正财，子为胎地。戊子日人表面厚道，内心精明。子水正财为戊土所克，财运需靠勤劳获取。子藏癸水正财，一分耕耘一分收获。婚姻宜配温柔之人。事业方向：金融、贸易、农业。',
'己丑':'己土坐丑土比肩，丑为墓地。己丑日人性格厚重沉稳，丑为金库亦为财库，一生善于积累。丑藏辛金食神，才华内敛。婚姻宜配开朗外向之人。事业方向：房地产、金融、仓储。',
'庚寅':'庚金坐寅木偏财，寅为绝地。庚寅日人刚健而灵活，寅木偏财为庚金所克，生来具有商业头脑。寅藏甲木偏财，投资眼光独到。婚姻宜配温和之人。事业方向：商业、投资、管理。',
'辛卯':'辛金坐卯木偏财，卯为绝地。辛卯日人精致而善理财，卯木偏财赋予敏锐的金钱观。卯藏乙木偏财，偏财运佳。婚姻宜配阳光外向之人。事业方向：珠宝、艺术、投资。',
'壬辰':'壬水坐辰土七杀，辰为墓地。壬辰日人外柔内刚，辰为水库，壬水虽被土制却源源不绝。辰藏乙木伤官，才华横溢。婚姻宜配稳重之人。事业方向：水利、物流、文化。',
'癸巳':'癸水坐巳火正财，巳为胎地。癸巳日人外表平和内心热烈，巳火正财赋予强烈的求财欲。巳藏丙火正财，财运不错。婚姻宜配热情大方之人。事业方向：能源、贸易、艺术。',
'甲午':'甲木坐午火伤官，午为死地。甲午日人正直中带着叛逆，午火伤官赋予艺术天赋和批判精神。午藏丁火伤官，才华外露。婚姻宜配包容理解之人。事业方向：艺术、演艺、设计。',
'乙未':'乙木坐未土偏财，未为养地。乙未日人温柔而有韧劲，未为木库亦为财库，天生财运不差。未藏丁火食神，有品位和生活情趣。婚姻宜配稳重之人。事业方向：文化、教育、设计。',
'丙申':'丙火坐申金偏财，申为病地。丙申日人热情中带着理性，申金偏财为丙火所克，生来善于理财。申藏庚金偏财，金融天赋高。婚姻宜配温柔体贴之人。事业方向：金融、科技、贸易。',
'丁酉':'丁火坐酉金偏财，酉为长生。丁酉日人温暖而有原则，酉金偏财赋予敏锐的商业嗅觉。酉藏辛金偏财，财运亨通。婚姻宜配开朗积极之人。事业方向：金融、艺术、珠宝。',
'戊戌':'戊土坐戌土比肩，戌为墓地。戊戌日人坚如磐石，戌为火库亦为印库，有深厚的能量储备。魁罡日之一，性格果断。婚姻宜配柔顺包容之人。事业方向：建筑、军事、管理。',
'己亥':'己土坐亥水正财，亥为胎地。己亥日人外表温和内心精于算计，亥水正财赋予务实的理财观。亥藏壬水正财，财运稳定增长。婚姻宜配阳光大方之人。事业方向：农业、贸易、服务业。',
'庚子':'庚金坐子水伤官，子为死地。庚子日人刚健而有才华，子水伤官赋予过人的聪明和表达能力。子藏癸水伤官，艺术天赋突出。婚姻宜配包容格局大之人。事业方向：文艺、演讲、科技。',
'辛丑':'辛金坐丑土偏印，丑为养地。辛丑日人内敛有深度，丑为金库亦为印库，学识渊博。丑藏辛金比肩，有同伴相助。婚姻宜配开朗外向之人。事业方向：学术、研究、金融。',
'壬寅':'壬水坐寅木食神，寅为病地。壬寅日人聪明而有创意，寅木食神赋予艺术感和表现力。寅藏甲木食神，才华出众。婚姻宜配稳重之人。事业方向：文艺、教育、创意产业。',
'癸卯':'癸水坐卯木食神，卯为长生。癸卯日人灵气逼人，卯木食神赋予细腻的感受力和艺术天赋。卯藏乙木食神，审美一流。婚姻宜配阳光稳重之人。事业方向：艺术、设计、文学。',
'甲辰':'甲木坐辰土偏财，辰为衰地。甲辰日人正直而有财力，辰为水库亦为财库，一生财运不错。辰藏乙木劫财，注意合伙关系。婚姻宜配温柔体贴之人。事业方向：管理、金融、体育。',
'乙巳':'乙木坐巳火伤官，巳为沐浴。乙巳日人温柔中带着锋芒，巳火伤官赋予才情和表现欲。巳藏丙火伤官，创造力强。婚姻宜配理解包容之人。事业方向：演艺、设计、文学。',
'丙午':'丙火坐午火劫财，午为帝旺。丙午日人烈阳如火，午火劫财赋予超强的能量和行动力。午藏丁火劫财，为人慷慨大方但需防破财。婚姻宜配柔水般的人来调和。事业方向：能源、演艺、军警。',
'丁未':'丁火坐未土食神，未为冠带。丁未日人温暖中带着智慧，未土食神赋予生活品味和人际手腕。未藏乙木偏印，学习能力强。婚姻宜配阳光积极之人。事业方向：餐饮、文化、教育。',
'戊申':'戊土坐申金食神，申为病地。戊申日人稳重而有才华，申金食神赋予聪明才智。申藏庚金食神，技术天赋高。婚姻宜配温柔之人。事业方向：工程、科技、研发。',
'己酉':'己土坐酉金食神，酉为长生。己酉日人外表温和内心机敏，酉金食神赋予口才和社交能力。酉藏辛金食神，善于表达。婚姻宜配大方开朗之人。事业方向：销售、公关、教育。',
'庚戌':'庚金坐戌土偏印，戌为衰地。庚戌日人刚毅有担当，戌为火库亦为官杀库，领导力强。魁罡日之一，不怒自威。婚姻宜配柔顺包容之人。事业方向：军警、管理、法律。',
'辛亥':'辛金坐亥水伤官，亥为沐浴。辛亥日人精致而有才情，亥水伤官赋予敏锐的直觉和创造力。亥藏壬水伤官，文采出众。婚姻宜配阳光温暖之人。事业方向：文学、艺术、金融。',
'壬子':'壬水坐子水劫财，子为帝旺。壬子日人聪明绝顶，子水劫财赋予超强的智力和适应力。子藏癸水劫财，为人慷慨但易为情义所困。婚姻宜配稳重踏实之人。事业方向：IT、金融、贸易。',
'癸丑':'癸水坐丑土七杀，丑为冠带。癸丑日人外表平和内心刚毅，丑土七杀制癸水，有超强抗压能力。丑藏辛金偏印，学术天赋高。婚姻宜配阳光温暖之人。事业方向：研究、医疗、金融。',
'甲寅':'甲木坐寅木比肩，寅为临官。甲寅日人正直刚健，寅木比肩赋予超强的独立性和自尊心。寅藏甲木比肩，一生靠自己。婚姻宜配温柔包容之人。事业方向：管理、体育、创业。',
'乙卯':'乙木坐卯木比肩，卯为临官。乙卯日人温柔而有韧性，卯木比肩赋予细腻的感受力。卯藏乙木比肩，人缘好但需独立。婚姻宜配有担当之人。事业方向：文化、教育、设计。',
'丙辰':'丙火坐辰土食神，辰为冠带。丙辰日人热情而智慧，辰为水库亦为官杀库，有领导才能。辰藏乙木正印，贵气藏身。婚姻宜配温柔之人。事业方向：能源、管理、文化。',
'丁巳':'丁火坐巳火劫财，巳为帝旺。丁巳日人外温和内炽烈，巳火劫财赋予超强能量和行动力。巳藏丙火劫财，重情义也耗财。婚姻宜配水般柔和之人。事业方向：能源、科技、创业。',
'戊午':'戊土坐午火正印，午为帝旺。戊午日人稳重而有热情，午火正印生身，聪明有学识。午藏丁火正印，一生多得长辈贵人。婚姻宜配温和之人。事业方向：教育、地产、公职。',
'己未':'己土坐未土比肩，未为冠带。己未日人敦厚温和，未为木库亦为官杀库，一生带贵气。未藏乙木七杀，内里有原则。婚姻宜配开朗外向之人。事业方向：农业、文化、金融。',
'庚申':'庚金坐申金比肩，申为临官。庚申日人刚健果断，申金比肩赋予超强的决断力和执行力。申藏庚金比肩，一生靠自己打拼。婚姻宜配温柔包容之人。事业方向：法律、军警、管理。',
'辛酉':'辛金坐酉金比肩，酉为临官。辛酉日人精致而果决，酉金比肩赋予敏锐的判断力和审美。酉藏辛金比肩，独立性强。婚姻宜配阳光开朗之人。事业方向：珠宝、艺术、金融。',
'壬戌':'壬水坐戌土七杀，戌为冠带。壬戌日人聪明而有魄力，戌为火库亦为财库，财运深厚。戌藏辛金正印，贵气内藏。婚姻宜配稳重之人。事业方向：水利、管理、金融。',
'癸亥':'癸水坐亥水劫财，亥为帝旺。癸亥日人灵气逼人，亥水劫财赋予超强的直觉和智慧。亥藏壬水劫财，为人慷慨但需防交浅言深。婚姻宜配阳光稳重之人。事业方向：IT、研究、文化。',
};
    let rjKey=S[dGZ_.s]+B[dGZ_.b];
    document.getElementById('riZhuJie').innerHTML='<strong style="color:var(--accent);">📅 日柱详解 · '+rjKey+'：</strong><br>'+ (RZJ[rjKey]||'此日柱配置独特，需结合全局四柱综合判断。日柱为夫妻宫，亦代表中年运势和个人内核，是八字中最重要的一柱。');
    // 总览
    let stColor=gst.st?'#ff9800':'#4fc3f7';
    document.getElementById('sg').innerHTML='<div class="sum-item"><div class="s-label">日主</div><div class="s-value wx-'+gys.de+'">'+S[dGZ_.s]+'<span style="font-size:12px;"> '+gys.de+' · '+SYY[dGZ_.s]+'</span></div><div class="s-sub">'+ps[2].nayin+'</div></div><div class="sum-item"><div class="s-label">旺衰</div><div class="s-value" style="color:'+stColor+'">'+gst.lv+'</div><div class="s-sub">综合评分：'+(gst.sc>0?'+':'')+gst.sc+'</div></div><div class="sum-item"><div class="s-label">用神</div><div class="s-value">'+gys.ys.map(e=>'<span class="wx-'+e+'">'+e+'</span>').join(' ')+'</div><div class="s-sub">优先：'+gys.xs.map(e=>'<span class="wx-'+e+'">'+e+'</span>').join(' ')+'</div></div><div class="sum-item"><div class="s-label">忌神</div><div class="s-value">'+gys.js.map(e=>'<span class="wx-'+e+'">'+e+'</span>').join(' ')+'</div><div class="s-sub">需避之五行</div></div>';
    let yTips={木:'宜绿/东方/3,8 · 文化教育、医疗健康',火:'宜红/南方/2,7 · 能源、餐饮、传媒',土:'宜黄/中部/5,10 · 房地产、建筑、农业',金:'宜白/西方/4,9 · 金融、机械、法律',水:'宜黑/北方/1,6 · 物流、贸易、水利'};
    let ysEx='';gys.ys.forEach(e=>ysEx+='<div class="ys-tag ys-xi"><span class="ys-head">喜 '+e+'</span><span class="ys-body">'+yTips[e]+'</span></div>');gys.js.forEach(e=>ysEx+='<div class="ys-tag ys-ji"><span class="ys-head">忌 '+e+'</span><span class="ys-body">需避开或调和</span></div>');
    document.getElementById('ysBox').innerHTML=ysEx;
    // 五行
    let mc=Math.max(...Object.values(wc),1);let wo=['木','火','土','金','水'];let wxH='';
    wo.forEach(w=>{let c=wc[w];let pct=Math.round(c/mc*100);wxH+='<div class="wx-bar"><div class="wx-name">'+w+'</div><div class="wx-num wx-'+w+'">'+c+'</div><div class="bar-track"><div class="bar-fill" style="width:'+pct+'%;background:var(--'+w+')"></div></div></div>'});
    document.getElementById('wxStat').innerHTML=wxH;
    document.getElementById('wxExplain').innerHTML=analyzeWuxingDetail(wc,gys);
    // 五行流通分析
    document.getElementById('wxFlow').innerHTML=analyzeWuxingFlow(wc,gys);
    // 十二长生
    let csH='<table class="ss-table"><tr><th></th>'+['年柱','月柱','日柱','时柱'].map(n=>'<th>'+n+'</th>').join('')+'</tr><tr><td style="color:#888;">十二长生</td>';
    ps.forEach(p=>{let cs=getChangSheng12(dGZ_.s,p.b);let cc=cs.i<=5?'ss-good':(cs.i<=8?'ss-mid':'ss-bad');csH+='<td class="'+cc+'">'+cs.n+'</td>'});csH+='</tr></table>';document.getElementById('csTbl').innerHTML=csH;
    // 地支
    let rels=getDizhiRelations(ps);document.getElementById('dzRel').innerHTML=rels.length>0?rels.map(r=>'<span class="sha-tag'+(r.w?' warn':'')+'">'+r.txt+'</span>').join(''):'<span style="color:#666;font-size:11px;">无特殊冲合刑害</span>';
    // 十神
    let sn=['年柱','月柱','日柱','时柱'];document.getElementById('ssTh').innerHTML='<tr><th></th>'+sn.map(n=>'<th>'+n+'</th>').join('')+'</tr>';
    let ssS='<tr><td style="color:#888;">天干十神</td>';ps.forEach(p=>ssS+='<td>'+p.stem+' <span style="font-size:10px;color:#aaa;">'+getShiShen(dGZ_.s,p.s)+'</span></td>');ssS+='</tr>';
    let ssB='<tr><td style="color:#888;">地支（本气）</td>';ps.forEach(p=>{let h0=HD[p.b][0];ssB+='<td>'+p.branch+' <span style="font-size:10px;color:#aaa;">'+getShiShen(dGZ_.s,S.indexOf(h0))+'</span></td>'});ssB+='</tr>';document.getElementById('ssTb').innerHTML=ssS+ssB;
    let hh='';ps.forEach(p=>{let hs=HD[p.b];let hsStr=hs.map(h=>{let hi=S.indexOf(h);return'<span class="etag '+SE[hi]+'">'+h+'('+SE[hi]+')</span>'}).join(' ');hh+='<div class="hs-row"><span class="hs-name">'+p.name+'</span><span>'+p.branch+'藏：'+hsStr+'</span></div>'});document.getElementById('hidStem').innerHTML=hh;
    // 十神解读
    let ssJie='';let riGan=dGZ_.s;
    let ssCount={};ps.forEach(p=>{let s=getShiShen(riGan,p.s);ssCount[s]=(ssCount[s]||0)+1;});
    let ssTips={
        '正官':'正官为克我之阳，代表责任感、自律、事业。你命中'+(ssCount['正官']||0)+'个正官，'+(ssCount['正官']>=2?'官星较旺，重规则讲原则，适合体制内或管理岗；但需防过于拘谨。':'有基本的责任心，做事靠谱。'),
        '七杀':'七杀为克我之阴，代表挑战、魄力、竞争。'+(ssCount['七杀']?'你命带七杀，有不服输的冲劲和执行力，适合创业或竞技型工作。但七杀过刚，需学会以柔克刚。':'无七杀，性格偏温和，不太喜欢激烈的竞争环境。'),
        '正财':'正财为我克之阳，代表稳定收入、储蓄、妻子（男命）。'+(ssCount['正财']?'你有稳定财源，理财观念强，适合靠工资或长期投资积累财富。':'正财不显，财运需靠偏财或专业技能获取。'),
        '偏财':'偏财为我克之阴，代表意外之财、投资、人脉财。'+(ssCount['偏财']?'你有偏财运，适合投资理财或副业增收；但也需防财来财去。':'偏财不显，不建议依赖投机性收入。'),
        '正印':'正印为生我之阳，代表学识、贵人、母爱。'+(ssCount['正印']?'印星护身，学习能力强，一生多得长辈或上司提携。适合教育、研究类工作。':'印星不显，需靠后天学习弥补。'),
        '偏印':'偏印为生我之阴，代表特殊才能、偏门学识、直觉。'+(ssCount['偏印']?'偏印旺的人有独特天赋，适合技术、艺术等需要独创性的领域。但偏印过旺易孤僻。':'偏印不显，思维方式偏主流。'),
        '食神':'食神为我生之阳，代表才华、口福、享受。'+(ssCount['食神']?'食神旺的人有创意有品位，生活讲究，适合文艺、餐饮、设计行业。':'食神不显，创造力和生活情趣需后天培养。'),
        '伤官':'伤官为我生之阴，代表才华外露、批判精神、反叛。'+(ssCount['伤官']?'伤官旺的人极其聪明有才，但锋芒毕露易得罪人。适合演艺、写作、创意行业。':'伤官不显，性格偏内敛踏实。'),
        '比肩':'比肩为同我之阳，代表自我、独立、兄弟朋友。'+(ssCount['比肩']?'比肩旺的人独立自主，不依赖他人，适合单打独斗或合伙平等合作。但比肩多易固执。':'独立性强但不太与人争。'),
        '劫财':'劫财为同我之阴，代表竞争、破耗、社交。'+(ssCount['劫财']?'劫财旺的人社交能力强，但要小心合伙破财或被朋友拖累。重情义是你的优点也是软肋。':'劫财不显，社交圈子精简。'),
    };
    for(let [k,v] of Object.entries(ssTips)){if(ssCount[k])ssJie+='<p>'+v+'</p>';}
    if(ssJie)ssJie='<p style="color:var(--accent);text-indent:0;">🔍 十神解读</p>'+ssJie;
    //═ 逐柱十神解析 ═
    let zhupos=['年柱（祖辈·童年·根基）','月柱（父母·事业·青年）','日柱（自身·婚姻·中年）','时柱（子女·晚年·归宿）'];
    let zhuJie='<p style="color:var(--accent);text-indent:0;">📋 四柱十神逐柱解析</p>';
    ps.forEach((p,i)=>{
        let ss=getShiShen(dGZ_.s,p.s);
        let pos=zhupos[i].split('（')[0];
        let byCol=[['童年时被长辈严格要求，养成了自律性格','青年时对事业有清晰规划，不喜走捷径','择偶标准高，对伴侣忠诚但也要求对方同样靠谱','晚年仍有社会参与感，子女对你敬重有加'],
                    ['童年环境或许并不轻松，但磨练出了你坚韧的性格','事业上敢于挑战高难度目标，压力越大反弹越强','择偶眼光独到，喜欢有挑战性的人而非一眼看透的类型','对子女要求高但也给TA们最好的支持和自由'],
                    ['从小懂得珍惜资源，不挥霍不浪费，是长辈眼里懂事的孩子','正职收入是你财富的基石，理财风格稳健不冒进','对伴侣大方但也要求经济上透明和共同规划','晚年经济独立，不给子女添负担，甚至能帮衬下一代'],
                    ['家境或有起伏，让你从小就知道钱不是死的','主业之外总有各种开源的路子，斜杠人生就是你的标配','择偶时会被有才华或有资源的人吸引，不拘泥于传统标准','晚年可能有意外之财或投资回报，手头宽裕'],
                    ['从小就得到长辈和老师的偏爱，学习能力是同龄人中的佼佼者','工作中善于总结学习，容易被上司赏识提携','与伴侣的关系像亦师亦友，互相成就而非互相消耗','晚年心态平和，热爱阅读或传授经验，是家里的智慧担当'],
                    ['童年可能有些特立独行，不太合群但内心世界丰富','适合技术、艺术等需要独创性的领域，不随大流反而出彩','择偶标准独特，比起合适更看重灵魂契合','晚年有独到的人生见解，是晚辈眼里很酷的长辈'],
                    ['童年被照顾得比较好，生活有质量，性格乐观开朗','适合餐饮、设计、服务等与人打交道的行业','和伴侣的相处模式轻松自然，不吝啬表达爱意','晚年生活有滋有味，广场舞上最靓的那位'],
                    ['童年就展现出过人的聪明或艺术天赋，但也可能不太听话','工作中不愿被束缚，适合创意类、自由职业而非朝九晚五','恋爱中追求精神共鸣，不满意的感情不会将就','晚年思维活跃，保持学习和创作的兴趣，不认老'],
                    ['童年就表现出独立意识，不太依赖父母做决定','工作中适合单打独斗或平等合作，不喜欢等级森严的环境','与伴侣追求势均力敌的关系，既亲密又各自独立','晚年生活自理能力强，不愿给子女添麻烦'],
                    ['从小在人群中吃得开，兄弟姐妹或发小对你的影响深远','工作中善于整合人脉资源，但也容易被朋友的事牵扯精力','感情上容易因为义气而纠结，需分清友情和爱情的界限','晚年朋友多、社交圈子活跃，但也要留意财务上的边界']];
        let ssIdx={'正官':0,'七杀':1,'正财':2,'偏财':3,'正印':4,'偏印':5,'食神':6,'伤官':7,'比肩':8,'劫财':9};
        let idx=ssIdx[ss]!==undefined?ssIdx[ss]:-1;
        let detail=idx>=0?ss+'在'+pos+'——'+byCol[idx][i]:ss+'在'+pos+'——具体情况需结合全局判断。';
        zhuJie+='<p><strong>'+pos+'：</strong>天干'+p.stem+'(<span class="wx-'+SE[p.s]+'">'+ss+'</span>)——'+detail+'</p>';
    });
    ssJie+=zhuJie;
    document.getElementById('ssJieDiv').innerHTML=ssJie;
    // 神煞
    let ssha=getShenSha(ps);document.getElementById('sshaR').innerHTML=ssha.length?ssha.map(s=>'<span class="sha-tag">'+s+'</span>').join(''):'<span style="color:#666;font-size:11px;">无特殊神煞</span>';
    // 神煞详细解析
    let shaJie=buildShenshaJiexi(ssha);
    document.getElementById('sshaJie').innerHTML=shaJie;
    // 分析
    document.getElementById('caiYun').innerHTML=analyzeCaiYun(dGZ_,ps,gst.st,gys);
    document.getElementById('love').innerHTML=analyzeLove(dGZ_,ps,gen);
    document.getElementById('women').innerHTML=analyzeWomen(dGZ_,ps,wc,gys,gen);
    document.getElementById('health').innerHTML=analyzeHealth(dGZ_,ps,wc);
    document.getElementById('career').innerHTML=analyzeCareer(dGZ_,ps,gst.st,gys);
    document.getElementById('personality').innerHTML=analyzePersonality(dGZ_,ps,gst.st,gys);
    document.getElementById('liuqin').innerHTML=analyzeLiuQin(dGZ_,ps,gen);
    document.getElementById('guiren').innerHTML=analyzeGuiren(dGZ_,ps,ssha,gys);
    document.getElementById('xueye').innerHTML=analyzeXueye(dGZ_,ps,ssha);
    document.getElementById('fengshui').innerHTML=analyzeFengshui(dGZ_,ps,gys);
    document.getElementById('peiou').innerHTML=analyzePeiou(dGZ_,ps,gen,gys);
    document.getElementById('keyage').innerHTML=analyzeKeyAge(dGZ_,ps,cyGZ,gen,gys,gst);
    document.getElementById('naming').innerHTML=analyzeNaming(dGZ_,ps,gys);
    document.getElementById('scorecard').innerHTML=analyzeScore(dGZ_,ps,gst,gys,ssha);
    document.getElementById('shishenGeju').innerHTML=analyzeShiShenGeJu(dGZ_,ps);
    document.getElementById('guardian').innerHTML=analyzeGuardian(dGZ_,gys);
    document.getElementById('wannian').innerHTML=analyzeWannian(dGZ_,ps,gys);
    document.getElementById('weekly').innerHTML=analyzeWeekly(dGZ_,gys);
    document.getElementById('lucktable').innerHTML=analyzeLuckTable(dGZ_,gys);
    document.getElementById('birthGeo').innerHTML=analyzeBirthGeo(y,m,d,h,ps,dGZ_);
    // 大运
    let dy=dayun(cyGZ,y,m,d,h,gen);
    let ny=new Date().getFullYear();let naAge=ny-y;
    document.getElementById('dyInfo').innerHTML='起运年龄：<b>'+dy.qa+'岁</b> · 排法：'+(dy.sp?'顺排（阳男阴女）':'逆排（阴男阳女）')+' · 当前年龄：<b>'+naAge+'岁</b>';
    let dyH='';let curDy=null;
    dy.dys.forEach((ddy,i)=>{let isCur=(naAge>=ddy.age&&naAge<ddy.age+10);if(isCur)curDy=ddy;dyH+='<div class="dayun-item'+(isCur?' current':'')+'"><div class="dy-stem wx-'+SE[ddy.si]+'">'+ddy.stem+'</div><div class="dy-branch wx-'+BE[ddy.bi]+'">'+ddy.branch+'</div><div class="dy-age">'+ddy.age+'-'+(ddy.age+9)+'岁</div><div style="font-size:8px;color:#555;">'+ddy.nayin+'</div></div>'});
    document.getElementById('dyRow').innerHTML=dyH;
    if(curDy)document.getElementById('dyDetail').innerHTML=dayunDetailText(curDy,dGZ_,gst.st,gys);
    else document.getElementById('dyDetail').innerHTML='';
    // 流年
    let lnH='';let cy=new Date().getFullYear();
    for(let i=cy-1;i<cy+9;i++){let ls=((i-4)%10+10)%10,lb=((i-4)%12+12)%12;lnH+='<div class="ln-item'+(i===cy?' current':'')+'"><div class="ln-year">'+i+'</div><div class="ln-gz wx-'+SE[ls]+'">'+S[ls]+B[lb]+'</div><div style="font-size:8px;color:#555;">'+getNayin(ls,lb)+'</div></div>'}
    document.getElementById('lnGrid').innerHTML=lnH;
    let cls=((cy-4)%10+10)%10,clb=((cy-4)%12+12)%12;
    // 当前流年12个月逐月运势
    document.getElementById('liunianMonthTbl').innerHTML=analyzeLiunianMonths(cy,cls,clb,dGZ_,gys,gst);
    let le=SE[cls];let ySet=new Set(gys.ys),jSet=new Set(gys.js);
    let lt='<b>'+cy+'年流年：</b>'+S[cls]+B[clb]+'（'+getNayin(cls,clb)+'）';
    // 初始化流年流月流日选择器
    initTimeSelectors();
    // 默认渲染当前流年/流月/流日详情
    renderLiunianDetail();
    renderLiuyueDetail();
    renderLiuriDetail();
    // ═══════ 命理总结（全维编织 · 一命一相）═══════
    let summaryText='',de=gys.de,ri=S[dGZ_.s]+B[dGZ_.b],riNayin=ps[2].nayin;
    let yueZhi=B[getMonthBranch(y,m,d)];
    let ssAll={};ps.forEach(p=>{let s=getShiShen(dGZ_.s,p.s);ssAll[s]=(ssAll[s]||0)+1;});
    let hasGuan=(ssAll['正官']||0)+(ssAll['七杀']||0)>=2;
    let hasYin=(ssAll['正印']||0)+(ssAll['偏印']||0)>=2;
    let hasShiShang=(ssAll['食神']||0)+(ssAll['伤官']||0)>=2;
    let hasCai=(ssAll['正财']||0)+(ssAll['偏财']||0)>=2;
    let hasBiJie=(ssAll['比肩']||0)+(ssAll['劫财']||0)>=2;
    let gcMixed=(ssAll['正官']||0)>=1&&(ssAll['七杀']||0)>=1;
    let shiShaZhi=(ssAll['食神']||0)>=1&&(ssAll['七杀']||0)>=1;
    let caiPoYin=(hasCai&&hasYin);
    let ysWx=gys.xs[0],jiWx=gys.js[gys.js.length-1]||'';
    let kw=getKongWang(dGZ_);
    let cs12=getChangSheng12(dGZ_.s,dGZ_.b);
    let taYuan=ps[1].stem+B[(ps[1].b+3)%12];
    let taYuanNayin=getNayin(ps[1].s,(ps[1].b+3)%12);

    //═ 0. 命格主题（指纹级差异化）═
    let themeIdx=(((ps[0].s*100+ps[1].s*10+ps[2].s)*7+(ps[1].b*13+ps[3].b*17)+dGZ_.s*31+dGZ_.b*37)%10+10)%10;
    let themes=[
        {t:'✨ 灵秀之命',d:'你的八字清透有灵气。不必刻意追求什么，好的事物自然会向你靠近。你是一个"被命运眷顾"的人，但眷顾的代价是——你需要比常人更懂得珍惜。'},
        {t:'🌋 烈火真金',d:'你的命格像一块未炼的原矿。人生中的每一次挫折都是给你的淬火——烧一次，更纯一分。别怕困难，它们是你最好的老师。'},
        {t:'🌊 暗流奔涌',d:'表面平静，内心汹涌。你的八字有一股被压抑的能量——找到了释放的出口，你的人生会从"还不错"变成"太精彩"。你的天赋等你去发现。'},
        {t:'🏔️ 孤峰独立',d:'你的命格带着一种"不随大流"的气质。别人走的路你不一定适合——你有自己的海拔和视野。独行不是孤独，是你的高度常人难以企及。'},
        {t:'🌸 春风化雨',d:'你的八字温润而有韧劲。像春雨一样——不声张却能滋养万物。你不需要做人群里最耀眼的那个，你是人群散了之后大家最想找的那个。'},
        {t:'⚡ 惊雷乍响',d:'你的命格里藏着一股爆发力。平时低调到让人忽略，但关键时刻——你总能让所有人记住你的名字。你的节奏是"蓄力→爆发→再蓄力"。'},
        {t:'🕯️ 暗夜烛光',d:'在黑暗中坚持发光的，才是真正的光。你的八字可能"硬件"不是最好的，但你的"软件"——韧性、直觉、善良——让你在长跑中胜出。'},
        {t:'🌳 盘根古木',d:'树长得慢，但根扎得深。你的命格就是这样——别人一年做成的事你可能需要三年，但十年后回头看，你比他们都站得稳。'},
        {t:'💎 未经雕琢',d:'你的八字是一块璞玉。表面粗糙但内有乾坤。你需要的是一个"雕刻师"——可能是一个贵人、一次经历、或一次觉醒——来把你的潜力释放出来。'},
        {t:'🦅 逆风飞翔',d:'顺风时谁都能飞。你的命格偏偏选的是逆风——不是命不好，是老天觉得你扛得住。每一次逆风，都是给你升级的机会。'}
    ];
    let theme=themes[themeIdx];
    summaryText+='<p style="font-size:14px;text-align:center;margin:8px 0;color:var(--accent);letter-spacing:2px;">'+theme.t+'</p>';
    summaryText+='<p>'+theme.d+'</p>';

    //═ 1. 命格定位（3维度交叉）═
    let geJu='';
    if(gst.st&&hasGuan&&hasYin)geJu='官印相生——这是命理中的上等格局。你有规矩（官）也有内涵（印），做事有理有据，让人信服。适合走体制内或大平台管理路线，越规范的环境你越出色。';
    else if(gst.st&&hasGuan&&hasCai)geJu='官星卫财——你能管好自己也管好钱。事业财运双轨并行，是能同时兼顾"抬头看路"和"埋头赚钱"的实干家。';
    else if(gst.st&&hasGuan)geJu='官杀为用——你天生适合当"说了算"的那个人。带团队、管项目、定方向是你最强的赛道。';
    else if(gst.st&&hasCai&&hasShiShang)geJu='食神生财、身强能扛——八字里最好的赚钱组合之一。你的才华能直接变现，是典型的"靠本事吃饭、越吃越香"型。';
    else if(gst.st&&hasCai)geJu='身强财旺——你有足够的能量去承载财富。这种格局不怕钱多，只怕胆不够大。';
    else if(gst.st&&hasYin)geJu='印星护身——你有天生的贵人缘，大事上总有后盾。';
    else if(!gst.st&&hasYin&&hasShiShang)geJu='印食相济——虽然身不够强，但你有智慧（印）也有才华（食伤），以巧取胜而非以力服人。适合脑力型工作。';
    else if(!gst.st&&hasYin)geJu='印旺身弱——你像一块海绵，吸收力强但需要时间消化。别人跑百米你跑马拉松，后半程才是你的天下。';
    else if(!gst.st&&hasShiShang)geJu='食伤泄秀——老天关了一扇门但给你开了整面落地窗。你的才华和创造力是你最强的护身符。';
    else if(gst.st)geJu='日主得令得地，骨子里有股谁都不服的硬气。一生靠自己闯，不靠祖荫。';
    else geJu='柔中带韧，善借力打力——最强的力量不一定在正面，你的力量在韧性里。';

    //═ 2. 十神交织 ═
    summaryText+='<p>你的命局：日柱<strong>'+ri+'</strong>（'+riNayin+'），日主'+S[dGZ_.s]+de+'，生于'+yueZhi+'月。'+geJu+'</p>';
    
    let crossText='';
    if(gcMixed)crossText+='命中<strong>官杀混杂</strong>——正官和七杀同时出现，意味着你在规矩和突破之间摇摆。年轻时可能换过多份工作或多段感情，直到找到那个"刚刚好"的平衡点。你的考验不在能力在方向。';
    if(shiShaZhi)crossText+='命带<strong>食神制杀</strong>——这是以柔克刚的经典组合。别人用蛮力解决的事，你用智慧化解。这种能力在职场上尤其珍贵——你是那种能在混乱中找到方案的人。';
    if(caiPoYin)crossText+='命中<strong>财破印</strong>——财星和印星相遇，你的学习和工作容易互相拉扯。想进修时来了赚钱机会，想赚钱时又想回去读书。处理好这个矛盾，你的路会宽一倍。';
    if(hasBiJie&&hasCai)crossText+='<strong>比劫夺财</strong>的信号已在命局中显现——提醒你：合伙要谨慎、借贷要三思。你的钱容易因为"人情"流出去，学会说"不"是对自己最大的保护。';
    if(crossText)summaryText+='<p><strong>【十神交织】</strong>'+crossText+'</p>';

    //═ 3. 神煞点睛 ═
    let shaText='';
    if(ssha.some(s=>s.includes('天乙')))shaText+='命带<strong>天乙贵人</strong>，逢凶化吉，一生有举足轻重之人相助。';
    if(ssha.some(s=>s.includes('文昌')))shaText+='命带<strong>文昌星</strong>，读书、考试、写作有天赋加成。';
    if(ssha.some(s=>s.includes('太极')))shaText+='命带<strong>太极贵人</strong>，天生对玄学、哲学、深度思考有慧根。';
    if(ssha.some(s=>s.includes('三奇')))shaText+='命中带<strong>三奇贵人</strong>——万中无一的稀有配置，一生必有非常之遇。';
    if(ssha.some(s=>s.includes('魁罡')))shaText+='<strong>魁罡日</strong>出生——骨子里有股不容侵犯的正气，说话做事自带分量。';
    if(ssha.some(s=>s.includes('金神')))shaText+='<strong>金神格</strong>——这是富贵格局的一种，但需要在逆境中磨炼才会发光。';
    if(ssha.some(s=>s.includes('桃花')))shaText+='命带<strong>桃花</strong>——你天生有一种让人想靠近的磁场，异性缘、人缘都旺。但要记得：桃花是机会也是考验。';
    if(ssha.some(s=>s.includes('驿马')))shaText+='命带<strong>驿马</strong>——你是坐不住的那种人。适合流动性强的工作，旅行、出差、外派对你来说是加分项而非减分。';
    if(ssha.some(s=>s.includes('华盖')))shaText+='命带<strong>华盖</strong>——你有独立思考的能力，不易被群体裹挟。适合研究型、技术型工作，有时独处比社交更能给你能量。';
    if(ssha.some(s=>s.includes('羊刃')))shaText+='命带<strong>羊刃</strong>——你骨子里有股狠劲，关键时刻敢拼敢闯。但锋芒需适度，柔一点反而能走更远。';
    if(shaText)summaryText+='<p><strong>【神煞点睛】</strong>'+shaText+'</p>';

    //═ 4. 十二长生 + 空亡 ═
    let csLabel=cs12.n;
    let csMsg='';
    if(cs12.i<=3)csMsg='日柱坐<strong>'+csLabel+'</strong>之地——你的生命力在上升期，做事的冲劲和朝气比同龄人更足。';
    else if(cs12.i<=6)csMsg='日柱在<strong>'+csLabel+'</strong>阶段——你处于能量最饱满的时期，适合大展拳脚。';
    else if(cs12.i<=8)csMsg='日柱处于<strong>'+csLabel+'</strong>——身体精力需多加保养，事业上宜守不宜激进扩张。';
    else csMsg='日柱处于<strong>'+csLabel+'</strong>状态——你可能在经历一个人生的整理期。这不是坏事，养精蓄锐是为了下一次出发。';
    let kwName=kw[0]+kw[1];
    csMsg+='空亡在<strong>'+kwName+'</strong>——这两个地支所代表的事物（六亲、方位、属相）在你的命局中作用偏弱，不必强求，随缘即可。';
    summaryText+='<p><strong>【状态与空亡】</strong>'+csMsg+'</p>';

    //═ 5. 胎元命宫 ═
    summaryText+='<p><strong>【胎元与命宫】</strong>胎元<strong>'+taYuan+'</strong>（'+taYuanNayin+'）代表你的先天禀赋，它与你月柱'+ps[1].stem+ps[1].branch+'的关系决定了你与原生家庭的深层联结。命宫是你后天安身立命之所在，与年柱'+ps[0].stem+ps[0].branch+'互相呼应。</p>';

    //═ 6. 用神指南 + 大运 ═
    let ysDet={木:'木主仁慈生长。东方是你的福地，教育、文化、医疗类机遇最多。身边木属性的人（正直温和型）最能帮你。',
              火:'火主热情文明。南方是你的幸运方向，能源、餐饮、传媒等与人打交道的行业最旺你。',
              土:'土主诚信稳重。中部/本地适合你，地产、建筑、金融等需要耐心的行业最能沉淀你。',
              金:'金主义气决断。西方有利，金融、法律、机械等需要果断纪律的行业是你的天下。',
              水:'水主智慧流动。北方是你的旺地，贸易、物流、IT等需要灵活头脑的行业最适合你。'};
    summaryText+='<p><strong>【用神指南】</strong>'+ysDet[ysWx]+'</p>';

    if(curDy){
        let dyIsGood=gys.ys.includes(SE[curDy.si])||gys.ys.includes(BE[curDy.bi]);
        let dyStr=S[curDy.si]+B[curDy.bi];
        if(dyIsGood)summaryText+='<p><strong>【大运】</strong>你'+naAge+'岁，正在<strong>'+dyStr+'运</strong>中——用神运。想做的事不要再等，这十年是给你铺路的。</p>';
        else summaryText+='<p><strong>【大运】</strong>你'+naAge+'岁，正在<strong>'+dyStr+'运</strong>中——忌神运。少做激进决策，多积累资源和技能，等用神运一到之前攒的全能变现。</p>';
    }

    //═ 7. 开运 ═
    let kc={木:'绿色/青色 · 木质饰品',火:'红色/粉色 · 水晶手链',土:'黄色/米色 · 黄水晶玉器',金:'白色/银色 · 银饰金属表',水:'黑色/蓝色 · 黑曜石'};
    summaryText+='<p><strong>【🔮 开运】</strong>用神<strong>'+ysWx+'</strong> → '+kc[ysWx]+'。多接触'+ysWx+'属性的人事物。</p>';

    //═ 分析一致性验证 ═
    let verify=[];
    // 婚姻一致性：配偶星+桃花+夫妻宫
    let spouseInfo=ps.filter(p=>getShiShen(dGZ_.s,p.s)===(gen==='male'?'正财':'正官'));
    let hasPeach=ssha.some(s=>s.includes('桃花'));
    if(spouseInfo.length>0&&hasPeach)verify.push('✅ 配偶星显于'+spouseInfo.map(p=>p.name).join('/')+'，且命带桃花——两相印证：你的异性缘和婚姻缘分确实较强。');
    if(!spouseInfo.length&&!hasPeach)verify.push('⚡ 配偶星不显且无桃花——多维度一致指向：你的正缘需要更多耐心等待，大运逢之自来。');

    // 财运一致性：财星+财库+食伤
    let caiStars=ps.filter(p=>{let s=getShiShen(dGZ_.s,p.s);return s==='正财'||s==='偏财';});
    let hasCaiku=ps.some(p=>B[p.b]==='戌'||B[p.b]==='丑'||B[p.b]==='未'||B[p.b]==='辰');
    if(caiStars.length>=2&&hasCaiku)verify.push('✅ 财星显于'+caiStars.map(p=>p.name).join('/')+'且带财库——聚财能力强、守得住是来真的，不是虚火。');

    // 性格一致性：十神主导+日柱性格
    let ssCount2={};ps.forEach(p=>{let s=getShiShen(dGZ_.s,p.s);ssCount2[s]=(ssCount2[s]||0)+1;});
    let maxSs='',maxN=0;Object.entries(ssCount2).forEach(([k,v])=>{if(v>maxN&&k!=='比肩'){maxN=v;maxSs=k;}});
    if(maxSs==='正官'&&(ssha.some(s=>s.includes('将星'))))verify.push('✅ 正官旺且带将星——你的领导力和守规矩不是装出来的，命带双证。');
    if(maxSs==='食神'&&(ssha.some(s=>s.includes('文昌'))))verify.push('✅ 食神旺且带文昌——才气有根，创意和学识互为表里，不是花瓶型才华。');

    if(verify.length>0)summaryText+='<p><strong>【🔬 交叉验证】</strong>以下结论由多个独立维度共同印证，置信度更高：</p><p>'+verify.join('</p><p>')+'</p>';

    summaryText+='<p style="font-size:10px;color:#b8a49e;">以上为命理参考。命是地图，运是天气，走路的是你。</p>';
    document.getElementById('finalSummary').innerHTML=summaryText;
}

function dayun(yGZ,y,m,d,h,gen){
    let iY=(SYY[yGZ.s]==='阳');let sp=(gen==='male'&&iY)||(gen==='female'&&!iY);let dtj=0;
    if(sp){for(let i=0;i<12;i++){let j=getJieQi(y,i);let jd=new Date(y,j.m-1,j.d);let bd=new Date(y,m-1,d);if(jd>=bd){dtj=daysBetween(bd,jd);break}}if(dtj===0)dtj=daysBetween(new Date(y,m-1,d),new Date(y+1,getJieQi(y+1,0).m-1,getJieQi(y+1,0).d));}
    else{for(let i=11;i>=0;i--){let j=getJieQi(y,i);let jd=new Date(y,j.m-1,j.d);let bd=new Date(y,m-1,d);if(jd<bd){dtj=daysBetween(jd,bd);break}}if(dtj===0)dtj=daysBetween(new Date(y-1,getJieQi(y-1,11).m-1,getJieQi(y-1,11).d),new Date(y,m-1,d));}
    let qa=Math.max(1,Math.round(dtj/3));
    let dys=[];for(let i=0;i<8;i++){let age=qa+i*10;let si,bi;if(sp){si=(ps[1].s+1+i)%10;bi=(ps[1].b+1+i)%12}else{si=((ps[1].s-1-i)%10+10)%10;bi=((ps[1].b-1-i)%12+12)%12}dys.push({si,bi,age,stem:S[si],branch:B[bi],nayin:getNayin(si,bi)});}
    return{qa,dys,sp};
}

function toggleCard(header){let card=header.closest('.card');if(card.id==='input')return;card.classList.toggle('collapsed');}

// ==================== 时间选择器 ====================
function initTimeSelectors(){
    let cy=new Date().getFullYear();
    // 流年选择器
    let lnSel=document.getElementById('lnYearSel');
    lnSel.innerHTML='';
    for(let i=cy-5;i<=cy+5;i++){lnSel.innerHTML+='<option value="'+i+'"'+(i===cy?' selected':'')+'>'+i+'年</option>';}
    // 流月选择器
    let lyYSel=document.getElementById('lyYearSel');
    lyYSel.innerHTML='';
    for(let i=cy-5;i<=cy+5;i++){lyYSel.innerHTML+='<option value="'+i+'"'+(i===cy?' selected':'')+'>'+i+'年</option>';}
    let lyMSel=document.getElementById('lyMonthSel');
    lyMSel.innerHTML='';
    for(let i=1;i<=12;i++){lyMSel.innerHTML+='<option value="'+i+'"'+(i===new Date().getMonth()+1?' selected':'')+'>'+i+'月</option>';}
    // 流日选择器
    let lrYSel=document.getElementById('lrYearSel');
    lrYSel.innerHTML='';
    for(let i=cy-5;i<=cy+5;i++){lrYSel.innerHTML+='<option value="'+i+'"'+(i===cy?' selected':'')+'>'+i+'年</option>';}
    let lrMSel=document.getElementById('lrMonthSel');
    lrMSel.innerHTML='';
    for(let i=1;i<=12;i++){lrMSel.innerHTML+='<option value="'+i+'"'+(i===new Date().getMonth()+1?' selected':'')+'>'+i+'月</option>';}
    updateLrDays();
}

function updateLrDays(){
    let y=parseInt(document.getElementById('lrYearSel').value);
    let m=parseInt(document.getElementById('lrMonthSel').value);
    let days=m===2?(y%4===0&&y%100!==0||y%400===0?29:28):([4,6,9,11].includes(m)?30:31);
    let lrDSel=document.getElementById('lrDaySel');
    let cur=parseInt(lrDSel.value)||new Date().getDate();
    lrDSel.innerHTML='';
    for(let i=1;i<=days;i++){lrDSel.innerHTML+='<option value="'+i+'"'+(i===Math.min(cur,days)?' selected':'')+'>'+i+'日</option>';}
}

function analyzeTimeStem(gzStem,gzBranch,dayStem,fullPillars,gender,lon){
    fullPillars=fullPillars||ps;
    let ySet=new Set(gys.ys),jSet=new Set(gys.js);
    let elem=SE[gzStem],belem=BE[gzBranch];
    let isYong=ySet.has(elem)||ySet.has(belem);
    let isJi=jSet.has(elem)||jSet.has(belem);
    let shishen=getShiShen(dayStem,gzStem);
    let cs=getChangSheng12(dayStem,gzBranch);
    let nayin=getNayin(gzStem,gzBranch);
    let dayBranchIdx=fullPillars[2].b;
    let t='',events=[];
    let gzKey=S[gzStem]+B[gzBranch];

    // === 与四柱逐一对照分析 ===
    let pillarNames=['年柱','月柱','日柱','时柱'];
    let interactions=[];
    fullPillars.forEach((p,i)=>{
        let pillarSs=getShiShen(dayStem,p.s);
        let pillarCs=getChangSheng12(dayStem,p.b);
        // 天干对比
        let ganRel='';
        if(gzStem===p.s)ganRel='天干相同（伏吟），气场重叠，影响加倍';
        else if(p.s===dayStem)ganRel='与日干相同，直接作用于命主';
        // 地支对比
        let zhiCh={0:6,6:0,1:7,7:1,2:8,8:2,3:9,9:3,4:10,10:4,5:11,11:5};
        let zhiLh={0:1,1:0,2:11,3:10,4:9,5:8,6:7,7:6,8:5,9:4,10:3,11:2};
        let zhiRel='';
        if(zhiCh[gzBranch]===p.b)zhiRel='六冲⚠';
        else if(zhiLh[gzBranch]===p.b)zhiRel='六合✨';
        else if(gzBranch===p.b)zhiRel='地支相同';

        let pillarElem=SE[p.s];
        let isPillarYong=ySet.has(pillarElem);
        let isPillarJi=jSet.has(pillarElem);

        interactions.push({
            name:p.name, stem:p.stem, branch:p.branch,
            ss:pillarSs, cs:pillarCs,
            ganRel,zhiRel,
            isPillarYong,isPillarJi,
            pillarElem,
            score:(isPillarYong?1:(isPillarJi?-1:0))+(zhiRel==='六合✨'?1:(zhiRel==='六冲⚠'?-1:0))
        });
    });

    // 开头：干支基本信息
    t+='<p style="color:var(--accent);text-indent:0;">📅 '+S[gzStem]+B[gzBranch]+'日（'+nayin+'）——'+shishen+'日，十二长生为<strong>'+cs.n+'</strong></p>';

    // 十神解析
    let ssDetail={
        '比肩':'依据十神理论——日干'+S[dayStem]+'与今日天干'+S[gzStem]+'同为'+SE[gzStem]+'，阴阳相同，故为比肩。比肩代表同性同类的帮扶力量：气场与你高度一致，适合团队协作、朋友聚会。但比肩过旺则竞争加剧，需守好利益边界。',
        '劫财':'依据十神理论——日干'+S[dayStem]+'与今日天干'+S[gzStem]+'同为'+SE[gzStem]+'，阴阳相反，故为劫财。劫财主破耗竞争：开销增大、钱财易散。不宜借贷担保，守住钱包为要。',
        '食神':'依据十神理论——日干'+S[dayStem]+'（'+SE[dayStem]+'）生今日天干'+S[gzStem]+'（'+SE[gzStem]+'），阴阳相同，故为食神。食神主口福才华：心情愉悦，创造力强，适合头脑风暴、美食聚会。',
        '伤官':'依据十神理论——日干'+S[dayStem]+'（'+SE[dayStem]+'）生今日天干'+S[gzStem]+'（'+SE[gzStem]+'），阴阳相反，故为伤官。伤官主表现欲：表达欲旺盛，适合演讲创作，但言辞收敛以防得罪人。',
        '正财':'依据十神理论——日干'+S[dayStem]+'（'+SE[dayStem]+'）克今日天干'+S[gzStem]+'（'+SE[gzStem]+'），阴阳相反，故为正财。正财主稳定收入：财运正当其时，适合薪资谈判、签约合同。',
        '偏财':'依据十神理论——日干'+S[dayStem]+'（'+SE[dayStem]+'）克今日天干'+S[gzStem]+'（'+SE[gzStem]+'），阴阳相同，故为偏财。偏财主意外之财：或有红包礼物等额外进账，小额投资可试。',
        '正官':'依据十神理论——今日天干'+S[gzStem]+'（'+SE[gzStem]+'）克日干'+S[dayStem]+'（'+SE[dayStem]+'），阴阳相反，故为正官。正官主规则秩序：适合处理公文、述职，上级关注度高。',
        '七杀':'依据十神理论——今日天干'+S[gzStem]+'（'+SE[gzStem]+'）克日干'+S[dayStem]+'（'+SE[dayStem]+'），阴阳相同，故为七杀。七杀主压力挑战：需冷静应对突发状况，不宜正面冲突。',
        '正印':'依据十神理论——今日天干'+S[gzStem]+'（'+SE[gzStem]+'）生日干'+S[dayStem]+'（'+SE[dayStem]+'），阴阳相反，故为正印。正印主贵人相助：长辈上级帮助，学习效率高，适合备考进修。',
        '偏印':'依据十神理论——今日天干'+S[gzStem]+'（'+SE[gzStem]+'）生日干'+S[dayStem]+'（'+SE[dayStem]+'），阴阳相同，故为偏印。偏印主灵感独思：第六感敏锐，适合研究和命理学习。'
    };
    t+='<p><strong>🔮 十神依据：</strong>'+ssDetail[shishen]+'</p>';

    // 十二长生解析
    let csDetail={
        '长生':'依据十二长生——日干'+S[dayStem]+'在地支'+B[gzBranch]+'处于长生位，如旭日初升。此为气运之始，适合启动新项目、开启新计划，做什么都容易上手。',
        '沐浴':'依据十二长生——日干'+S[dayStem]+'在地支'+B[gzBranch]+'处于沐浴位，桃花之象。人缘好但需防烂桃花，适合社交不宜放纵。',
        '冠带':'依据十二长生——日干'+S[dayStem]+'在地支'+B[gzBranch]+'处于冠带位，意气风发。自信心强，适合展现争取机会，需防轻狂之言。',
        '临官':'依据十二长生——日干'+S[dayStem]+'在地支'+B[gzBranch]+'处于临官(禄)位，运势较强。工作顺利易获认可，财运较旺。',
        '帝旺':'依据十二长生——日干'+S[dayStem]+'在地支'+B[gzBranch]+'处于帝旺位，精力达峰。适合攻坚克难但物极必反，锋芒勿太露。',
        '衰':'依据十二长生——日干'+S[dayStem]+'在地支'+B[gzBranch]+'处于衰位，气运收敛。不宜强求大事，顺其自然为好。',
        '病':'依据十二长生——日干'+S[dayStem]+'在地支'+B[gzBranch]+'处于病位，气运受损。精力不济易出错，不适合重要决策。',
        '死':'依据十二长生——日干'+S[dayStem]+'在地支'+B[gzBranch]+'处于死位，气场偏弱。宜低调行事，大事缓办小事从简。',
        '墓':'依据十二长生——日干'+S[dayStem]+'在地支'+B[gzBranch]+'处于墓位，收藏之意。适合整理归档储备，钱财宜存不宜花。',
        '绝':'依据十二长生——日干'+S[dayStem]+'在地支'+B[gzBranch]+'处于绝位，气运谷底。力不从心，不宜新计划，静观其变。',
        '胎':'依据十二长生——日干'+S[dayStem]+'在地支'+B[gzBranch]+'处于胎位，孕育之象。宜酝酿构思新方案，不宜急于实施。',
        '养':'依据十二长生——日干'+S[dayStem]+'在地支'+B[gzBranch]+'处于养位，休养生息。适合调整身心，饮食调理效果佳。'
    };
    t+='<p><strong>🌱 长生依据：</strong>'+csDetail[cs.n]+'</p>';

    // 冲合检测
    let dayBranch=cdGZ.b;
    let ha={0:7,7:0,1:6,6:1,2:5,5:2,3:4,4:3,8:11,11:8,9:10,10:9};
    if(ZHI_CHONG[gzBranch]===dayBranch) t+='<p><strong>⚡ 地支冲合依据：</strong>今日地支'+B[gzBranch]+'与你的日支'+B[dayBranch]+'构成<em>六冲关系</em>（子午冲/丑未冲/寅申冲/卯酉冲/辰戌冲/巳亥冲）。地支六冲在命理中属于最强烈的对立关系——<em>大事不宜</em>，感情易争执，出行注意安全。</p>';
    else if(ZHI_HE[gzBranch]===dayBranch) t+='<p><strong>⚡ 地支冲合依据：</strong>今日地支'+B[gzBranch]+'与你的日支'+B[dayBranch]+'构成<strong>六合关系</strong>（子丑合/寅亥合/卯戌合/辰酉合/巳申合/午未合）。地支六合是命理中最和谐的组合——贵人运强，人际和谐，适合合作洽谈。</p>';
    else if(ha[gzBranch]===dayBranch) t+='<p>今日地支'+B[gzBranch]+'与日支'+B[dayBranch]+'相害，小事不顺但影响不大。注意细节。</p>';

    // 用神/忌神/平运总结
    if(isYong){
        t+='<p><strong style="color:#8bc34a;">✅ 五行吉凶依据：</strong>今日天干<strong style="color:#8bc34a;">'+S[gzStem]+'（'+elem+'）</strong>'+(ySet.has(elem)?'为你的用神五行':'')+'，地支<strong style="color:#8bc34a;">'+B[gzBranch]+'（'+belem+'）</strong>'+(ySet.has(belem)?'为你的用神五行':'')+'。用神当令时五行流通顺畅——天时地利人和齐聚。决策力、执行力、人际运三高，适合处理积压已久的重要事务。</p>';
        t+='<p><strong>💰 财运依据：</strong>用神日财气通畅，财星不受克泄。利于合作签约和催收账款。若投资计划待决，今日落子时机较佳。</p>';
        t+='<p><strong>🏥 健康依据：</strong>用神日精气充沛，身体自我修复力强。服药调理时药效吸收更佳。但忌过度消耗。</p>';
        t+='<p><strong>❤️ 感情依据：</strong>用神日磁场柔和有力，是约会表白化解矛盾的佳日。单身可主动。</p>';
    }else if(isJi){
        t+='<p><strong style="color:#ef5350;">⚠ 五行吉凶依据：</strong>今日天干<em>'+S[gzStem]+'（'+elem+'）</em>'+(jSet.has(elem)?'为你的忌神五行':'')+'，地支<em>'+B[gzBranch]+'（'+belem+'）</em>'+(jSet.has(belem)?'为你的忌神五行':'')+'。忌神当道时五行流通受阻——外部气场与你不合，万事不宜强求。</p>';
        t+='<p><strong>💰 财运依据：</strong>忌神日财气受阻，易意外破耗。绝不适合签重要合同、做大额转账或风险投资。</p>';
        t+='<p><strong>🏥 健康依据：</strong>忌神日免疫力偏低，旧疾易复发（尤其与'+elem+'/'+belem+'五行相关的脏腑）。避免熬夜暴饮暴食。疲惫是身体信号——请尊重它。</p>';
        t+='<p><strong>❤️ 感情依据：</strong>忌神日情绪敏感易怒，小事易摩擦。不宜讨论分手离婚等敏感话题，也不适合相亲表白——成功概率远低于平时。</p>';
    }else{
        t+='<p><strong>🔵 五行吉凶依据：</strong>今日干支'+S[gzStem]+B[gzBranch]+'的五行('+elem+'/'+belem+')在你的命局中既非用神也非忌神，气场呈中性。无大喜无大忧，好坏全凭自身努力。</p>';
        t+='<p><strong>💰 财运：</strong>平平无波，按部就班。小额消费无碍，大额支出建议暂缓。</p>';
        t+='<p><strong>🏥 健康：</strong>平稳无风险，正常作息即可。</p>';
        t+='<p><strong>❤️ 感情：</strong>平淡是真，适合日常相处。</p>';
    }

    // 时辰影响（如果有真实出生时辰）
    if(cdGZ){
        let hourGan=chGZ.s,hourZhi=chGZ.b;
        let hourShiShen=getShiShen(dayStem,hourGan);
        let hourCs=getChangSheng12(dayStem,hourZhi);
        t+='<p><strong>🕐 时柱联动：</strong>命主时柱为'+S[hourGan]+B[hourZhi]+'（'+hourShiShen+'），十二长生在时支为'+hourCs.n+'。这说明命主天生的行动力和晚年运势与今日能量场产生交互，需结合时柱特点一起参考。</p>';
    }

    // 纳音特色
    let nayinTips={
        '海中金':'海中金藏于海底，今日财气内敛，需深挖细掘方能发现机会。',
        '炉中火':'炉中火旺，今日执行力强，适合加班赶工。但防火气过旺伤身。',
        '大林木':'大林木生机勃勃，今日适合拓展人脉、建立合作关系。',
        '路旁土':'路旁土不厚，稳扎稳打即是上策。不宜冒进。',
        '剑锋金':'剑锋金利，今日果断决策能见成效。但需防言辞伤人。',
        '山头火':'山头火势猛而短，今日冲劲足但后劲不足，见好就收。',
        '涧下水':'涧下水清冽流动，今日思维灵活，适合创意工作。',
        '城头土':'城头土坚固，适合处理长线项目、打基础的事。',
        '白蜡金':'白蜡金细腻，适合精打细算、细致工作，理财日佳。',
        '杨柳木':'杨柳木随风，今日灵活应变最为重要，不宜固执己见。',
        '泉中水':'泉中水清甜，今日宜慢节奏，品味生活，不宜匆忙。',
        '屋上土':'屋上土有庇护之意，今日适合居家整理、家庭事务。',
        '霹雳火':'霹雳火来得快去得也快，今日情绪波动大，慎言慎行。',
        '松柏木':'松柏木耐寒，适合坚持做困难之事，毅力可成。',
        '流年水':'流水不腐，今日适合变化调整，一成不变反而不利。',
        '砂中金':'砂中埋金需淘洗，今日耐心沉淀方能见真章。',
        '山下火':'山火暗燃，今日暗中发力，不必张扬。',
        '平地木':'平地木向阳而生，今日宜正向积极，与人为善。',
        '壁上土':'壁上土不厚，立足要稳，步步为营。',
        '金箔金':'金箔虽薄但耀眼，适合包装展示、对外交流。',
        '覆灯火':'灯烛之光虽微却明，今日宜专注一隅，深耕细作。',
        '天河水':'天河之水浩瀚，今日心胸开阔，适合做长远规划。',
        '大驿土':'大驿土通达，出行运佳，适合出差、旅行。',
        '钗钏金':'钗钏虽小却贵，今日精细操作最宜。',
        '桑柘木':'桑柘养蚕，今日付出即有回报，宜踏实努力。',
        '柘榴木':'柘榴结实，今日适合收获成果、验收项目。',
        '大海水':'大海水不可斗量，大气包容，格局放大。',
        '石榴木':'石榴多子多福，适合家庭团聚、亲子活动。'
    };
    if(nayinTips[nayin]) t+='<p><strong>💎 纳音提示：</strong>'+nayinTips[nayin]+'</p>';

    // === 周易卦象对应 ===
    let zhouyiMap = getZhouyiHexagram(gzStem, gzBranch);
    if(zhouyiMap){
        t+='<div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--border);"><span style="font-size:10px;color:#888;">📖 周易卦象参考</span></div>';
        t+='<p><strong>'+zhouyiMap.name+'</strong> — '+zhouyiMap.guaCi+'</p>';
        if(zhouyiMap.yaoCi){
            t+='<p><strong>爻辞提示：</strong>'+zhouyiMap.yaoCi+'</p>';
        }
    }

    // === 四柱逐一对照表 ===
    t+='<div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border);"><span style="font-size:10px;color:#888;">🔗 与命主四柱逐一对照</span></div>';
    t+='<table class="ln-table-sm" style="margin-top:4px;"><tr><th>命柱</th><th>干支</th><th>十神</th><th>天干关系</th><th>地支关系</th><th>影响</th></tr>';
    interactions.forEach(ix=>{
        let impactColor='#8bc34a', impactText='有利';
        if(ix.score<0){impactColor='#ef5350';impactText='不利';}else if(ix.score===0)impactText='中性';
        let extra='';
        if(ix.ganRel)extra=ix.ganRel;
        if(ix.zhiRel)extra+=(extra?'，':'')+ix.zhiRel;
        if(!extra)extra='无直接关系';
        t+='<tr><td>'+ix.name+'</td><td>'+ix.stem+ix.branch+'</td><td>'+ix.ss+'</td><td>'+(ix.ganRel||'-')+'</td><td>'+(ix.zhiRel||'-')+'</td><td style="color:'+impactColor+'">'+impactText+'</td></tr>';
    });
    t+='</table>';

    // === 具体事件举例 ===
    t+='<div style="margin-top:10px;padding-top:8px;"><span style="font-size:10px;color:#888;">📋 当日可能发生的事件举例：</span></div>';
    let eventExamples=[];
    if(isYong){
        eventExamples.push('遇到能帮助你的贵人（概率较高）');
        eventExamples.push('之前卡住的审批或流程突然推进');
        eventExamples.push('收到好消息或意外惊喜');
        if(shishen==='正财'||shishen==='偏财')eventExamples.push('有额外收入或回款到账');
        if(shishen==='正官'||shishen==='七杀')eventExamples.push('获得上级表扬或正式任命');
        if(shishen==='食神'||shishen==='伤官')eventExamples.push('灵感迸发或获得创意突破');
    }else if(isJi){
        eventExamples.push('重要文件或合同出现纰漏');
        eventExamples.push('与人发生不必要的争执');
        eventExamples.push('身体突然感到不适或旧疾复发');
        if(shishen==='劫财'||shishen==='比肩')eventExamples.push('钱包意外失窃或破财');
        if(shishen==='七杀')eventExamples.push('工作中遇到突发危机或挑战');
        if(shishen==='偏印'||shishen==='正印')eventExamples.push('计划被外部因素打乱');
    }else{
        eventExamples.push('日常工作和生活按部就班');
        eventExamples.push('没有特别的需要注意的大事件');
    }
    // 地支冲合事件
    let zhiCh={0:6,6:0,1:7,7:1,2:8,8:2,3:9,9:3,4:10,10:4,5:11,11:5};
    let zhiLh={0:1,1:0,2:11,3:10,4:9,5:8,6:7,7:6,8:5,9:4,10:3,11:2};
    if(zhiCh[gzBranch]===dayBranch)eventExamples.push('⚠ 出行注意交通安全，防跌倒受伤');
    if(zhiLh[gzBranch]===dayBranch)eventExamples.push('✨ 适合签署合约或达成重要协议');
    if(cs.n==='帝旺')eventExamples.push('今日精力极旺，适合完成高强度任务');
    if(cs.n==='绝'||cs.n==='死')eventExamples.push('今日适合低调行事，不争不抢');

    if(eventExamples.length>0){
        t+='<ul style="margin-top:4px;padding-left:20px;font-size:11px;color:#bbb;line-height:1.8;">';
        eventExamples.forEach(e=>t+='<li>'+e+'</li>');
        t+='</ul>';
    }

    // === 当日开运指南 ===
    let luckyColors={'木':['绿色','青色','翠色'],'火':['红色','紫色','橙色'],'土':['黄色','棕色','咖啡色'],'金':['白色','银色','金色'],'水':['黑色','蓝色','灰色']};
    let luckyItems={'木':['木质饰品','绿植盆景','翡翠玉石'],'火':['红色手链','电子设备','蜡烛'],'土':['陶瓷摆件','黄水晶','琥珀'],'金':['金银首饰','金属手表','白水晶'],'水':['黑曜石','蓝宝石','鱼缸流水']};
    let luckyWx=SE[cdGZ.s];
    let colors=luckyColors[luckyWx]||['白色'];
    let items=luckyItems[luckyWx]||['水晶'];
    t+='<div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--border);"><span style="font-size:10px;color:#888;">🎨 当日开运指南</span></div>';
    t+='<div style="margin-top:4px;font-size:11px;color:#aaa;line-height:1.8;">';
    t+='<p><strong>幸运颜色：</strong>'+colors.join('、')+'（日主为'+luckyWx+'，五行相生相扶之色）</p>';
    t+='<p><strong>幸运饰品：</strong>'+items.join('、')+'</p>';
    if(isYong){
        t+='<p><strong>宜：</strong>重大决策、签约谈判、投资理财、表白求婚、开始新项目</p>';
    }else if(isJi){
        t+='<p><strong>宜：</strong>静养休息、整理回顾、读书学习、独处思考</p><p><strong>忌：</strong>重大决策、签约谈判、投资理财、与人争执</p>';
    }else{
        t+='<p><strong>宜：</strong>日常事务、轻度社交、小额消费</p><p><strong>忌：</strong>重大突破性举措</p>';
    }
    t+='</div>';

    return t;
}

function renderLiunianDetail(){
    let selY=parseInt(document.getElementById('lnYearSel').value)||new Date().getFullYear();
    let lnStem=((selY-4)%10+10)%10,lnBranch=((selY-4)%12+12)%12;
    let gzStr=S[lnStem]+B[lnBranch];
    document.getElementById('lnAnalysis').innerHTML='<p><b>'+selY+'年流年：</b>'+gzStr+'（'+getNayin(lnStem,lnBranch)+'）</p>'+analyzeTimeStem(lnStem,lnBranch,cdGZ.s,ps,ggen,null);
    // 更新十年格子当前选择
    let cy=new Date().getFullYear();
    let lnH='';for(let i=cy-1;i<cy+9;i++){let ls=((i-4)%10+10)%10,lb=((i-4)%12+12)%12;lnH+='<div class="ln-item'+(i===selY?' current':'')+'"><div class="ln-year">'+i+'</div><div class="ln-gz wx-'+SE[ls]+'">'+S[ls]+B[lb]+'</div></div>'}
    document.getElementById('lnGrid').innerHTML=lnH;
}

function renderLiuyueDetail(){
    let selY=parseInt(document.getElementById('lyYearSel').value)||new Date().getFullYear();
    let selM=parseInt(document.getElementById('lyMonthSel').value)||new Date().getMonth()+1;
    let yrStem=(selY-4)%10;if(yrStem<0)yrStem+=10;
    let mbIdx=getMonthBranch(selY,selM,1);
    let msIdx=getMonthStem(yrStem,mbIdx);
    let gzStr=S[msIdx]+B[mbIdx];
    document.getElementById('lyAnalysis').innerHTML='<p><b>'+selY+'年'+selM+'月：</b>'+gzStr+'（'+getNayin(msIdx,mbIdx)+'）</p>'+analyzeTimeStem(msIdx,mbIdx,cdGZ.s);
    // 全年表
    let lyHTML='<tr><th>月份</th><th>干支</th><th>五行</th><th>💰财运</th><th>🏥健康</th><th>❤️爱情</th></tr>';
    let ySet=new Set(gys.ys),jSet=new Set(gys.js);
    for(let mi=1;mi<=12;mi++){
        let mb=getMonthBranch(selY,mi,1),ms=getMonthStem(yrStem,mb);
        let elem=SE[ms],belem=BE[mb];
        let isYong=ySet.has(elem)||ySet.has(belem);
        let isJi=jSet.has(elem)||jSet.has(belem);
        let caiW='',caiT='平稳';if(isYong){caiT='利好';caiW='good';}else if(isJi){caiT='不佳';caiW='warn';}
        let hltW='',hltT='正常';if(isJi){hltT='注意';hltW='warn';}else if(isYong){hltT='良好';hltW='good';}
        let lovW='',lovT='平稳';if(isYong){lovT='和谐';lovW='good';}else if(isJi){lovT='波折';lovW='warn';}
        lyHTML+='<tr'+(mi===selM?' style="background:#141430;"':'')+'><td>'+(mi===selM?'▶ ':'')+mi+'月</td><td>'+S[ms]+B[mb]+'</td><td class="wx-'+elem+'">'+elem+'</td><td class="'+caiW+'">'+caiT+'</td><td class="'+hltW+'">'+hltT+'</td><td class="'+lovW+'">'+lovT+'</td></tr>';
    }
    document.getElementById('liuyueTbl').innerHTML=lyHTML;
}

function renderLiuriDetail(){
    let selY=parseInt(document.getElementById('lrYearSel').value)||new Date().getFullYear();
    let selM=parseInt(document.getElementById('lrMonthSel').value)||new Date().getMonth()+1;
    let selD=parseInt(document.getElementById('lrDaySel').value)||new Date().getDate();
    let dt=new Date(selY,selM-1,selD);
    let gz=getDayGZ(dt);
    document.getElementById('lrAnalysis').innerHTML='<p><b>'+selY+'年'+selM+'月'+selD+'日：</b>'+S[gz.s]+B[gz.b]+'（'+getNayin(gz.s,gz.b)+'）</p>'+analyzeTimeStem(gz.s,gz.b,cdGZ.s);
    // 前后15天
    let lrHTML='<tr><th>日期</th><th>干支</th><th>五行</th><th>💰财运</th><th>🏥健康</th><th>❤️爱情</th></tr>';
    let ySet=new Set(gys.ys),jSet=new Set(gys.js);
    for(let i=-15;i<=15;i++){
        let d=new Date(dt);d.setDate(d.getDate()+i);
        let gz2=getDayGZ(d);
        let elem=SE[gz2.s],belem=BE[gz2.b];
        let isYong=ySet.has(elem)||ySet.has(belem);
        let isJi=jSet.has(elem)||jSet.has(belem);
        let caiW='',caiT='平稳';if(isYong){caiT='利好';caiW='good';}else if(isJi){caiT='不佳';caiW='warn';}
        let hltW='',hltT='正常';if(isJi){hltT='注意';hltW='warn';}else if(isYong){hltT='良好';hltW='good';}
        let lovW='',lovT='平稳';if(isYong){lovT='和谐';lovW='good';}else if(isJi){lovT='波折';lovW='warn';}
        let isToday=(i===0)?'style="background:#141430;font-weight:700;"':'';
        let dl=String(d.getMonth()+1).padStart(2,'0')+'/'+String(d.getDate()).padStart(2,'0');
        lrHTML+='<tr '+isToday+'><td>'+(i===0?'★ ':'')+dl+'</td><td>'+S[gz2.s]+B[gz2.b]+'</td><td class="wx-'+elem+'">'+elem+'</td><td class="'+caiW+'">'+caiT+'</td><td class="'+hltW+'">'+hltT+'</td><td class="'+lovW+'">'+lovT+'</td></tr>';
    }
    document.getElementById('liuriTbl').innerHTML=lrHTML;
}

// ==================== 折叠式出生地选择 ====================
function openBirthModal(){document.getElementById('birthModal').style.display='block';if(!document.getElementById('birthTree').innerHTML)buildBirthTree();}
function closeBirthModal(){document.getElementById('birthModal').style.display='none';}
function buildBirthTree(){
    let tree=document.getElementById('birthTree'),h='',idx=0;
    for(let prov in CITIES){
        let pid='bp'+idx;h+='<div style="border-bottom:1px solid var(--border);"><div class="bt-toggle" data-target="'+pid+'" style="padding:10px 12px;cursor:pointer;font-weight:600;background:#fdf8f5;">'+prov+'</div>';
        h+='<div id="'+pid+'" style="display:none;">';idx++;
        for(let city in CITIES[prov]){
            let cd=CITIES[prov][city],cid='bp'+idx;idx++;
            h+='<div style="padding-left:16px;"><div class="bt-toggle" data-target="'+cid+'" style="padding:8px 12px;cursor:pointer;color:var(--accent);">'+city+'</div>';
            h+='<div id="'+cid+'" style="display:none;padding-left:16px;">';
            if(Array.isArray(cd))h+='<div class="bt-pick" data-lon="'+cd[1]+'" data-name="'+prov+' '+city+'" style="padding:6px 12px;cursor:pointer;">'+city+' ('+cd[1]+'°E)</div>';
            else for(let d in cd){let v=cd[d];h+='<div class="bt-pick" data-lon="'+v[1]+'" data-name="'+prov+' '+city+' → '+d+'" style="padding:6px 12px;cursor:pointer;">'+city+' → '+d+'</div>';}
            h+='</div></div>';
        }
        h+='</div></div>';
    }
    tree.innerHTML=h;
    // 事件委托
    tree.onclick=function(e){
        let t=e.target;
        if(t.classList.contains('bt-toggle')){let el=document.getElementById(t.dataset.target);if(el)el.style.display=el.style.display==='none'?'block':'none';}
        else if(t.classList.contains('bt-pick')){document.getElementById('lonVal').value=t.dataset.lon;document.getElementById('birthBtn').textContent=t.dataset.name;closeBirthModal();}
    };
}
function initSelects(){
    let defYear=1995;
    let by=document.getElementById('byear');let opts='';for(let i=2100;i>=1900;i--)opts+='<option value="'+i+'"'+(i===defYear?' selected':'')+'>'+i+'年</option>';by.innerHTML=opts;
    let bm=document.getElementById('bmonth');opts='';for(let i=1;i<=12;i++)opts+='<option value="'+i+'"'+(i===1?' selected':'')+'>'+i+'月</option>';bm.innerHTML=opts;
    let bd=document.getElementById('bday');opts='';for(let i=1;i<=31;i++)opts+='<option value="'+i+'"'+(i===1?' selected':'')+'>'+i+'日</option>';bd.innerHTML=opts;
    let bh=document.getElementById('bhour');opts='';for(let i=0;i<24;i++)opts+='<option value="'+i+'"'+(i===12?' selected':'')+'>'+String(i).padStart(2,'0')+'时</option>';bh.innerHTML=opts;
    let bi=document.getElementById('bmin');opts='';for(let i=0;i<60;i++)opts+='<option value="'+i+'"'+(i===0?' selected':'')+'>'+String(i).padStart(2,'0')+'分</option>';bi.innerHTML=opts;
    // 联动日期
    document.getElementById('bmonth').addEventListener('change',updateDays);
    document.getElementById('byear').addEventListener('change',updateDays);
}
function updateDays(){
    let y=parseInt(document.getElementById('byear').value),m=parseInt(document.getElementById('bmonth').value);
    let days=m===2?(y%4===0&&y%100!==0||y%400===0?29:28):([4,6,9,11].includes(m)?30:31);
    let bd=document.getElementById('bday');let cur=parseInt(bd.value)||1;
    bd.innerHTML='';for(let i=1;i<=days;i++)bd.innerHTML+='<option value="'+i+'"'+(i===Math.min(cur,days)?' selected':'')+'>'+i+'日</option>';
}

document.addEventListener('DOMContentLoaded',()=>{
    initSelects();
    document.querySelectorAll('#gt button').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('#gt button').forEach(x=>x.classList.remove('active'));b.classList.add('active');});});
    document.getElementById('qgDate').value=new Date().toISOString().split('T')[0];
    // 不自动排盘——等用户选好生日再算。默认年份设为1995避免算出"婴儿命"
    // calc();
    initZiweiSelects();
    document.querySelectorAll('#zwGt button').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('#zwGt button').forEach(x=>x.classList.remove('active'));b.classList.add('active');});});
    calcZiwei();
    initHepanSelects();
    document.querySelectorAll('#hpAgt button,#hpBgt button').forEach(b=>{b.addEventListener('click',()=>{let toggle=b.closest('.gender-toggle');toggle.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');});});
    // 初始化小六壬
    for(let i=1;i<=12;i++)document.getElementById('lrMonth').innerHTML+='<option value="'+i+'">'+i+'月</option>';
    for(let i=1;i<=30;i++)document.getElementById('lrDay').innerHTML+='<option value="'+i+'"'+(i===1?' selected':'')+'>'+i+'日</option>';
    // 初始化称骨
    let cy=new Date().getFullYear();let o='';for(let i=2100;i>=1900;i--)o+='<option value="'+i+'"'+(i===cy?' selected':'')+'>'+i+'年</option>';document.getElementById('cgYear').innerHTML=o;
    for(let i=1;i<=12;i++)document.getElementById('cgMonth').innerHTML+='<option value="'+i+'">'+i+'月</option>';
    for(let i=1;i<=30;i++)document.getElementById('cgDay').innerHTML+='<option value="'+i+'"'+(i===1?' selected':'')+'>'+i+'日</option>';
    document.querySelectorAll('#cgGt button').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('#cgGt button').forEach(x=>x.classList.remove('active'));b.classList.add('active');});});
});

// ==================== 合盘地点联动 ====================
function hpUpdateCities(p){let pfx=p==='A'?'hpA':'hpB';let pv=document.getElementById(pfx+'pv').value;let cs=document.getElementById(pfx+'cy');cs.innerHTML='<option value="">不限</option>';if(pv&&CITIES[pv]){Object.keys(CITIES[pv]).forEach(ct=>{cs.innerHTML+='<option value="'+ct+'">'+ct+'</option>';});}hpUpdateDistricts(p);}
function hpUpdateDistricts(p){let pfx=p==='A'?'hpA':'hpB';let pv=document.getElementById(pfx+'pv').value;let ct=document.getElementById(pfx+'cy').value;let ds=document.getElementById(pfx+'ds');ds.innerHTML='<option value="">不限</option>';let lh=document.getElementById(pfx+'lon');if(pv&&ct&&CITIES[pv]&&CITIES[pv][ct]){let cd=CITIES[pv][ct];if(Array.isArray(cd)){lh.value=cd[1];ds.innerHTML+='<option value="'+ct+'|'+cd[0]+'|'+cd[1]+'" selected>'+ct+' ('+cd[1]+'°E)</option>';}else if(typeof cd==='object'){for(let d in cd){let v=cd[d];ds.innerHTML+='<option value="'+d+'|'+v[0]+'|'+v[1]+'">'+d+'</option>';}if(Object.keys(cd).length>0){let fk=Object.keys(cd)[0];ds.value=fk+'|'+cd[fk][0]+'|'+cd[fk][1];lh.value=cd[fk][1];}}}else{lh.value='116.4';}}

// ==================== 合盘分析 ====================
function initHepanSelects(){
    let ctrlPairs=[['hpAy','hpAm','hpAd','hpAh'],['hpBy','hpBm','hpBd','hpBh']];
    ctrlPairs.forEach(([yId,mId,dId,hId],idx)=>{
        let cy=new Date().getFullYear();
        let ys=document.getElementById(yId);let o='';for(let i=2100;i>=1900;i--)o+='<option value="'+i+'"'+(i===cy?' selected':'')+'>'+i+'年</option>';ys.innerHTML=o;
        let ms=document.getElementById(mId);for(let i=1;i<=12;i++)ms.innerHTML+='<option value="'+i+'"'+(i===1?' selected':'')+'>'+i+'月</option>';
        let ds=document.getElementById(dId);for(let i=1;i<=31;i++)ds.innerHTML+='<option value="'+i+'"'+(i===1?' selected':'')+'>'+i+'日</option>';
        let hs=document.getElementById(hId);for(let i=0;i<24;i++)hs.innerHTML+='<option value="'+i+'"'+(i===12?' selected':'')+'>'+String(i).padStart(2,'0')+'时</option>';
    });
    // 初始化合盘省份选择
    let provinces=['北京','上海','天津','重庆','河北','山西','辽宁','吉林','黑龙江','江苏','浙江','安徽','福建','江西','山东','河南','湖北','湖南','广东','海南','四川','贵州','云南','陕西','甘肃','青海','台湾','内蒙古','广西','西藏','宁夏','新疆','香港','澳门'];
    ['hpApv','hpBpv'].forEach(id=>{let s=document.getElementById(id);provinces.forEach(p=>{s.innerHTML+='<option value="'+p+'">'+p+'</option>';});});
}

function calcHepan(){
    let ay=parseInt(document.getElementById('hpAy').value),am=parseInt(document.getElementById('hpAm').value),ad=parseInt(document.getElementById('hpAd').value),ah=parseInt(document.getElementById('hpAh').value);
    let by=parseInt(document.getElementById('hpBy').value),bm=parseInt(document.getElementById('hpBm').value),bd=parseInt(document.getElementById('hpBd').value),bh=parseInt(document.getElementById('hpBh').value);
    let ag=document.querySelector('#hpAgt button.active').dataset.g;
    let bg=document.querySelector('#hpBgt button.active').dataset.g;

    let aLon=parseFloat(document.getElementById('hpAlon').value)||116.4;
    let bLon=parseFloat(document.getElementById('hpBlon').value)||116.4;
    let aPillars=calcPillars(ay,am,ad,ah,aLon);
    let bPillars=calcPillars(by,bm,bd,bh,bLon);

    // 展示双方八字
    document.getElementById('hpAPillars').innerHTML=renderMiniPillars(aPillars);
    document.getElementById('hpBPillars').innerHTML=renderMiniPillars(bPillars);

    // ===== 合盘全面分析 =====
    let analysis='';
    analysis+='<p style="color:var(--accent);text-indent:0;">💑 来看看你们两人的缘分密码——</p>';

    let aDS=aPillars[2].s,bDS=bPillars[2].s;
    let aDB=aPillars[2].b,bDB=bPillars[2].b;

    // 1. 日干合化
    let ganHeScore=0;
    if(GAN_HE[aDS]===bDS){analysis+='<p><strong>【日干合化】</strong>双方日干<strong style="color:#8bc34a;">'+S[aDS]+'与'+S[bDS]+'相合</strong>，此为天干五合之象。两人一见如故，性格天然互补，沟通无障碍，是天作之合的基础。</p>';ganHeScore=15;}
    else{analysis+='<p><strong>【日干合化】</strong>双方日干为'+S[aDS]+'与'+S[bDS]+'，无合化关系。虽然没有天然默契，但这种组合也有好处——两人保持各自独立性，不会过度依赖对方。</p>';}

    // 2. 日支关系
    let zhiScore=0;
    if(ZHI_HE[aDB]===bDB){analysis+='<p><strong>【夫妻宫互动】</strong>双方日支<strong style="color:#8bc34a;">'+B[aDB]+'与'+B[bDB]+'六合</strong>，这是最理想的夫妻宫搭配。相处时温馨和谐，彼此有强烈的归属感，婚姻基础极为扎实。</p>';zhiScore=10;}
    else if(ZHI_CHONG[aDB]===bDB){analysis+='<p><strong>【夫妻宫互动】</strong><em>双方日支'+B[aDB]+'与'+B[bDB]+'相冲！</em>这是需要特别留意的组合。两人性格差异大，容易产生摩擦，但也因此能碰撞出火花。关键在于学会包容和换位思考。</p>';zhiScore=-15;}
    else{analysis+='<p><strong>【夫妻宫互动】</strong>双方日支为'+B[aDB]+'与'+B[bDB]+'，无冲无合。相处模式自由，彼此尊重个人空间，适合保持适当距离的关系。</p>';}

    // 3. 四柱交叉十神分析
    let crossScore=0;
    let crossEvents=[];
    analysis+='<p><strong>【十神互动】</strong>双方四柱十神交叉分析（甲方对乙方）：</p>';
    let pillarNames=['年柱','月柱','日柱','时柱'];
    analysis+='<div style="margin:8px 0;font-size:11px;color:#aaa;line-height:1.8;">';
    bPillars.forEach((bp,i)=>{
        let aDayToB=getShiShen(aDS,bp.s);
        let bDayToA=getShiShen(bDS,aPillars[i].s);
        let color='#aaa',note='';
        if(aDayToB==='正官'||aDayToB==='正财'){color='#8bc34a';note='吉';crossScore+=3;}
        else if(aDayToB==='七杀'||aDayToB==='劫财'){color='#ef5350';note='需磨合';crossScore-=2;}
        else if(aDayToB==='正印'||aDayToB==='偏印'||aDayToB==='食神'){color='#ff9800';note='中性';crossScore+=1;}
        analysis+='<span style="color:'+color+';">'+pillarNames[i]+'：'+bp.stem+bp.branch+' → 甲方看乙方为<strong>'+aDayToB+'</strong>('+note+')</span><br>';
    });
    analysis+='</div>';

    // 4. 五行深度互补
    let aWx={},bWx={};
    aPillars.forEach(p=>{aWx[SE[p.s]]=(aWx[SE[p.s]]||0)+1;aWx[BE[p.b]]=(aWx[BE[p.b]]||0)+1;});
    bPillars.forEach(p=>{bWx[SE[p.s]]=(bWx[SE[p.s]]||0)+1;bWx[BE[p.b]]=(bWx[BE[p.b]]||0)+1;});
    let wxScore=0, compDetails=[];
    if(aWx['水']&&bWx['火']){compDetails.push('水润火暖，互补极佳');wxScore+=3;}
    if(aWx['木']&&bWx['土']){compDetails.push('木疏土实，结构互补');wxScore+=3;}
    if(aWx['金']&&bWx['木']){compDetails.push('金雕木成，相辅互补');wxScore+=3;}
    if(aWx['火']&&bWx['金']){compDetails.push('火炼金纯，互相成就');wxScore+=3;}
    if(aWx['土']&&bWx['水']){compDetails.push('土制水势，平衡互补');wxScore+=3;}
    if(aWx['木']&&bWx['木']){compDetails.push('木木相同，习性相近');wxScore+=1;}
    if(aWx['火']&&bWx['火']){compDetails.push('火火相旺，热情默契');wxScore+=1;}
    if(compDetails.length>0){
        analysis+='<p><strong>【五行互补】</strong>'+compDetails.map(d=>'<span style="color:#8bc34a;">'+d+'</span>').join('；')+'。</p>';
    }else{
        analysis+='<p><strong>【五行互补】</strong>两人五行配置独立性较强，各自完整，在一起更像是两个独立个体的并肩前行。</p>';
    }
    // 五行互补深度解读
    let wxDeep='';
    let aDayWx=SE[aDS],bDayWx=SE[bDS];
    const wxRelMap={
        '木':{sheng:'水',ke:'土',shengBy:'火',keBy:'金',nature:'生发向上，代表成长、仁慈和创造力'},
        '火':{sheng:'木',ke:'金',shengBy:'土',keBy:'水',nature:'热情奔放，代表行动力、礼仪和表现力'},
        '土':{sheng:'火',ke:'水',shengBy:'金',keBy:'木',nature:'稳重厚实，代表诚信、包容和承载力'},
        '金':{sheng:'土',ke:'木',shengBy:'水',keBy:'火',nature:'刚毅果断，代表正义、决断和执行力'},
        '水':{sheng:'金',ke:'火',shengBy:'木',keBy:'土',nature:'智慧灵动，代表变通、深沉和适应力'}
    };
    let aNat=wxRelMap[aDayWx]?wxRelMap[aDayWx].nature:'';
    let bNat=wxRelMap[bDayWx]?wxRelMap[bDayWx].nature:'';
    if(aDayWx&&bDayWx){
        if(wxRelMap[aDayWx]&&wxRelMap[aDayWx].sheng===bDayWx){
            wxDeep='<p style="margin:4px 0;font-size:11px;color:#aaa;">五行深度：乙方五行（'+bDayWx+'）生甲方（'+aDayWx+'）——乙方在关系中扮演滋养者，甲方是被滋养的一方。这种"你生我"的关系让甲方在相处中感受到源源不断的能量补给，但也需注意甲方不要过度依赖乙方的付出。</p>';
        }else if(wxRelMap[bDayWx]&&wxRelMap[bDayWx].sheng===aDayWx){
            wxDeep='<p style="margin:4px 0;font-size:11px;color:#aaa;">五行深度：甲方五行（'+aDayWx+'）生乙方（'+bDayWx+'）——甲方是关系的付出者和滋养方，乙方是受益者。甲方乐于付出的天性让关系充满温暖，但长期单向付出可能让甲方疲惫，乙方需学会回馈。</p>';
        }else if(wxRelMap[aDayWx]&&wxRelMap[aDayWx].ke===bDayWx){
            wxDeep='<p style="margin:4px 0;font-size:11px;color:#aaa;">五行深度：甲方五行（'+aDayWx+'）克乙方（'+bDayWx+'）——甲方在关系中更有主导力，但"克"也意味着约束和塑造。若甲方能善用这份影响力去帮助乙方成长，则克中有情；若只是压制，则关系难以持久。</p>';
        }else if(wxRelMap[bDayWx]&&wxRelMap[bDayWx].ke===aDayWx){
            wxDeep='<p style="margin:4px 0;font-size:11px;color:#aaa;">五行深度：乙方五行（'+bDayWx+'）克甲方（'+aDayWx+'）——乙方在关系中更有主见和掌控力。甲方可能会感到一定的压力，但如果乙方是出于关心而非控制，这种"克"反而能帮助甲方变得更好。</p>';
        }else if(aDayWx===bDayWx){
            wxDeep='<p style="margin:4px 0;font-size:11px;color:#aaa;">五行深度：双方日主同为<strong>'+aDayWx+'</strong>——'+aNat+'。你俩像照镜子，优点和缺点都高度一致。在一起时默契十足，但也容易因为同样的性格盲点而互相激化。学会互补而非复制，是这段关系的关键。</p>';
        }else{
            wxDeep='<p style="margin:4px 0;font-size:11px;color:#aaa;">五行深度：甲方日主属<strong>'+aDayWx+'</strong>（'+aNat+'），乙方日主属<strong>'+bDayWx+'</strong>（'+bNat+'）。两人五行各具特色，在一起形成独特的化学反应。理解彼此五行特质的差异，才能更好地欣赏对方的与众不同。</p>';
        }
        analysis+=wxDeep;
    }

    // 4.5 年柱纳音五行生克（合婚核心维度）
    let nayinWxScore=0;
    const nayinWxMap={};
    for(let v of NAYIN_60){
        if(!nayinWxMap[v]){
            for(let wx of ['金','木','水','火','土']){
                if(v.includes(wx)){nayinWxMap[v]=wx;break;}
            }
        }
    }
    let aNayin=aPillars[0].nayin,bNayin=bPillars[0].nayin;
    let aNayinWx=nayinWxMap[aNayin]||'',bNayinWx=nayinWxMap[bNayin]||'';
    const wxSheng={金:'土生金→',水:'金生水→',木:'水生木→',火:'木生火→',土:'火生土→'};
    const wxKe={金:'火克金→',水:'土克水→',木:'金克木→',火:'水克火→',土:'木克土→'};
    let nayinRel='';
    if(aNayinWx&&bNayinWx){
        let wxShengMap={'金':['土'],'水':['金'],'木':['水'],'火':['木'],'土':['火']};
        let aLabel=(ag==='female'?'女方':'男方'),bLabel=(bg==='female'?'女方':'男方');
        if(wxShengMap[aNayinWx]&&wxShengMap[aNayinWx].includes(bNayinWx)){nayinRel=bLabel+bNayinWx+'生'+aLabel+aNayinWx+'，年柱根基相生——这是合婚中最看重的维度之一，大吉之象。B方旺A方运势，婚后家运蒸蒸日上。';nayinWxScore=18;}
        else if(wxShengMap[bNayinWx]&&wxShengMap[bNayinWx].includes(aNayinWx)){nayinRel=aLabel+aNayinWx+'生'+bLabel+bNayinWx+'，年柱相生，吉。A方付出滋养B方，家庭根基稳固。';nayinWxScore=12;}
        else if(aNayinWx===bNayinWx){nayinRel='纳音同为'+aNayinWx+'，比和——两人气场相近，宜齐心协力经营，但需防'+(aNayinWx==='火'?'火势过旺互相灼伤':aNayinWx==='水'?'水势泛滥缺乏方向':aNayinWx==='金'?'刚硬对刚硬缺少柔韧':'同质化导致缺少互补')+'。';nayinWxScore=5;}
        else{nayinRel='纳音'+aNayinWx+'与'+bNayinWx+'无直接生助，年柱根基一般。需靠日柱和其他维度的契合来弥补。';nayinWxScore=0;}
    }
    analysis+='<p><strong>【年柱纳音】</strong>男方年柱纳音<strong>'+aNayin+'</strong>（属'+aNayinWx+'），女方<strong>'+bNayin+'</strong>（属'+bNayinWx+'）。'+nayinRel+'</p>';
    // 日柱纳音互看
    let dNayinA=aPillars[2].nayin,dNayinB=bPillars[2].nayin;
    let dNayinAWx=nayinWxMap[dNayinA]||'',dNayinBWx=nayinWxMap[dNayinB]||'';
    let dNayinRel='';
    if(dNayinAWx&&dNayinBWx){
        if(wxShengMap[dNayinAWx]&&wxShengMap[dNayinAWx].includes(dNayinBWx))dNayinRel='日柱纳音'+dNayinBWx+'生'+dNayinAWx+'——夫妻宫纳音相生，中年后感情愈加深厚，婚姻质量高。';
        else if(wxShengMap[dNayinBWx]&&wxShengMap[dNayinBWx].includes(dNayinAWx))dNayinRel='日柱纳音'+dNayinAWx+'生'+dNayinBWx+'——夫妻宫相生，一方滋养另一方，感情有温度但也有失衡风险。';
        else if(dNayinAWx===dNayinBWx)dNayinRel='日柱纳音同为'+dNayinAWx+'——兴趣相投、性格相近，是"能玩到一起"的伴侣类型。';
    }
    if(dNayinRel)analysis+='<p><strong>【日柱纳音】</strong>男方日柱'+dNayinA+'，女方日柱'+dNayinB+'。'+dNayinRel+'</p>';

    // 4.6 生肖合冲
    let zScore=0;
    const zodiacNames=['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
    let aZodiac=zodiacNames[aPillars[0].b],bZodiac=zodiacNames[bPillars[0].b];
    const zLiuhe=[['鼠','牛'],['虎','猪'],['兔','狗'],['龙','鸡'],['蛇','猴'],['马','羊']];
    const zChong=[['鼠','马'],['牛','羊'],['虎','猴'],['兔','鸡'],['龙','狗'],['蛇','猪']];
    const zSanhe=[['猴','鼠','龙'],['虎','马','狗'],['猪','兔','羊'],['蛇','鸡','牛']];
    const zXing=[['鼠','兔'],['牛','狗'],['虎','蛇'],['兔','鼠'],['龙','龙'],['蛇','虎'],['马','马'],['羊','牛'],['猴','猪'],['鸡','狗'],['狗','鸡'],['猪','猴']];
    let zodiacRel='生肖'+aZodiac+'与'+bZodiac+'，';
    let foundZ=false;
    for(let [x,y] of zLiuhe){if((aZodiac===x&&bZodiac===y)||(aZodiac===y&&bZodiac===x)){zodiacRel+='六合之配，大吉！天生默契高，相处和谐。';zScore=8;foundZ=true;}}
    if(!foundZ)for(let s of zSanhe){if(s.includes(aZodiac)&&s.includes(bZodiac)){zodiacRel+='同在三合局中，互利互补，合作无间。';zScore=5;foundZ=true;}}
    if(!foundZ)for(let [x,y] of zChong){if((aZodiac===x&&bZodiac===y)||(aZodiac===y&&bZodiac===x)){zodiacRel+='六冲之配，需注意！性格冲突较大，但冲也能激发生机，关键看包容心。';zScore=-8;foundZ=true;}}
    if(!foundZ)for(let [x,y] of zXing){if((aZodiac===x&&bZodiac===y)||(aZodiac===y&&bZodiac===x)){zodiacRel+='刑害之配，小有摩擦，需多加沟通避免误会。';zScore=-3;foundZ=true;}}
    if(!foundZ){zodiacRel+='无冲无合，平和之配。';}
    analysis+='<p><strong>【生肖关系】</strong>'+zodiacRel+'</p>';

    // 5. 配偶星查法
    let aSpouse=ag==='male'?'正财':'正官';
    let bSpouse=bg==='male'?'正财':'正官';
    let aHas=false,bHas=false;
    aPillars.forEach(p=>{if(getShiShen(aDS,p.s)===aSpouse)aHas=true;});
    bPillars.forEach(p=>{if(getShiShen(bDS,p.s)===bSpouse)bHas=true;});
    let spouseScore=0;
    if(aHas&&bHas){analysis+='<p><strong>【配偶星匹配】</strong>双方命局中<strong style="color:#8bc34a;">配偶星均显著</strong>，彼此在对方八字中的定位非常清晰，是正缘的可能性极高。</p>';spouseScore=5;}
    else if(aHas||bHas){analysis+='<p><strong>【配偶星匹配】</strong>一方配偶星显著，另一方偏隐。需要通过更多现实互动来确认彼此的定位，但缘分仍在。</p>';spouseScore=2;}
    else{analysis+='<p><strong>【配偶星匹配】</strong>双方配偶星均不显著，这可能意味着你们在一起更多是因为现实因素而非命定，但只要经营好也是佳偶。</p>';}

    // 5.5 情感契合度深度分析
    analysis+='<p><strong>【💞 情感契合度·五维分析】</strong></p><div style="margin:6px 0;font-size:11px;line-height:1.8;color:#bbb;">';
    // 性格匹配
    let aPersonality='',bPersonality='';
    const personalityMap={
        '甲':'正直刚健，有领导力，自尊心强。','乙':'温柔有韧性，心思细腻，善于合作。',
        '丙':'热情似火，充满活力，慷慨大方。','丁':'外热内敛，细心周到，有艺术气质。',
        '戊':'稳重厚道，诚信可靠，有包容力。','己':'温和细腻，善于规划，注重细节。',
        '庚':'刚毅果断，雷厉风行，执行力强。','辛':'精致讲究，审美出众，思维敏锐。',
        '壬':'聪明灵活，适应力强，心胸开阔。','癸':'灵气逼人，直觉敏锐，内敛深沉。'
    };
    aPersonality=personalityMap[S[aDS]]||'性格自成一体。';
    bPersonality=personalityMap[S[bDS]]||'性格自成一体。';
    let personalityMatch='';
    if(GAN_HE[aDS]===bDS)personalityMatch='天干五合——性格天然互补，像两块奇妙的拼图。一个的强项正好是另一个的短板，相处起来轻松自然。';
    else if(aDayWx===bDayWx)personalityMatch='日主五行相同——核心价值观高度一致，但性格雷同也容易针锋相对。学会"和而不同"是关键。';
    else if(aDayWx&&bDayWx&&wxRelMap[aDayWx]&&wxRelMap[aDayWx].sheng===bDayWx)personalityMatch='五行相生——性格上天然形成和谐互动，彼此包容度高，相处时轻松少摩擦。';
    else personalityMatch='性格各有特点，需要时间和耐心来磨合。差异不是问题，如何看待差异才是。';
    analysis+='<p>✦ <strong>性格匹配：</strong>甲方（'+S[aDS]+'日主）——'+aPersonality+'乙方（'+S[bDS]+'日主）——'+bPersonality+personalityMatch+'</p>';
    // 价值观
    let valueMatch='';
    if(aDayWx===bDayWx)valueMatch='五行相同——价值观高度一致。对未来生活的想象和追求方向相近，是"想到一块去"的伴侣类型。';
    else if(GAN_HE[aDS]===bDS)valueMatch='天干五合——虽价值观不完全相同，但互相欣赏和吸引。你们的差异不是分歧而是互补，能把对方的世界观补得更完整。';
    else if(aDayWx&&bDayWx&&wxRelMap[aDayWx]&&(wxRelMap[aDayWx].sheng===bDayWx||wxRelMap[bDayWx].sheng===aDayWx))valueMatch='五行相生——价值观有自然的融和趋势。一方愿意理解和接纳另一方的观念，求同存异的能力较强。';
    else valueMatch='价值观存在一定差异，需要更多的沟通和换位思考。建立共同的"家庭愿景"有助于缩小差距。';
    analysis+='<p>✦ <strong>价值观：</strong>'+valueMatch+'</p>';
    // 生活习惯
    let habitMatch='';
    let aDe=SE[aDS],bDe=SE[bDS];
    if(aDe==='火'&&bDe==='水')habitMatch='火日主节奏快、水日主习惯慢——生活步调容易不同频。建议：快的一方等等慢的一方，慢的一方也试着跟上节奏。';
    else if(aDe==='水'&&bDe==='火')habitMatch='水日主节奏舒缓、火日主行动力强——日常生活容易"一个急一个缓"。建议：互相迁就，急事一起忙，闲时一起慢。';
    else if(aDe==='木'&&bDe==='金')habitMatch='木日主随性、金日主讲究——家居习惯和整洁标准可能不同。建议：划定各自的空间，公区保持双方能接受的标准。';
    else if(aDe==='金'&&bDe==='木')habitMatch='金日主注重规则、木日主随遇而安——生活秩序感不同。建议：制定一个双方都能接受的"家庭公约"。';
    else if(aDe===bDe)habitMatch='同为'+aDe+'日主——生活习惯天然契合，作息和节奏容易同步。这是很多夫妻羡慕的"同频"。';
    else habitMatch='双方五行无直接冲克——日常生活中小摩擦难免，但不会因为习惯差异而产生根本矛盾。';
    analysis+='<p>✦ <strong>生活习惯：</strong>'+habitMatch+'</p>';
    // 沟通方式
    let commMatch='';
    const commMap={木:'直接坦率，喜欢把话说清楚',火:'热情主动，表达欲强',土:'稳重务实，话不多但句句在点',金:'简洁利落，言辞精准',水:'细腻周全，善于倾听'};
    if(aDe===bDe)commMatch='同为'+aDe+'——沟通风格一致，一个眼神就懂对方。但也要注意：同样的问题盲点——比如两个"火"都上头时容易吵过头。';
    else commMatch='甲方偏<em>'+commMap[aDe]+'</em>，乙方偏<em>'+commMap[bDe]+'</em>——沟通风格互补。关键在于理解对方的表达方式而非改变对方。';
    analysis+='<p>✦ <strong>沟通方式：</strong>'+commMatch+'</p>';
    // 未来规划
    let futureMatch='';
    let aGuanCnt=aPillars.map(p=>getShiShen(aDS,p.s)).filter(s=>s==='正官'||s==='七杀').length;
    let bGuanCnt=bPillars.map(p=>getShiShen(bDS,p.s)).filter(s=>s==='正官'||s==='七杀').length;
    if(aGuanCnt>=2&&bGuanCnt>=2)futureMatch='双方命中官杀都重——都是事业心强的人。未来规划中，事业权重都很高。建议尽早商量"事业和家庭如何平衡"这个议题，它会是你们未来十年的核心命题。';
    else if(aGuanCnt>=2||bGuanCnt>=2)futureMatch='一方事业心更强——未来规划中，事业和家庭的分工需要提前沟通。不是谁牺牲多，而是怎么配合让两个人的总和更大。';
    else if(aDayWx&&bDayWx&&wxRelMap[aDayWx]&&wxRelMap[aDayWx].sheng===bDayWx)futureMatch='五行相生——对未来有天然的共识和信任。你们的方向感一致，即使具体路径不同，最终的目的地也是同一个。';
    else futureMatch='双方对未来的想象需要多沟通、多对齐。建议每年做一次"关系复盘"，把各自的想法摆到桌面上。';
    analysis+='<p>✦ <strong>未来规划：</strong>'+futureMatch+'</p>';
    analysis+='</div>';

    // 6. 神煞互动
    let aShensha=getShenSha(aPillars),bShensha=getShenSha(bPillars);
    let shaScore=0;
    if(aShensha.some(s=>s.includes('天乙贵人'))&&bShensha.some(s=>s.includes('天乙贵人'))){analysis+='<p><strong>【神煞互动】</strong>双方均<strong style="color:#8bc34a;">命带天乙贵人</strong>，这是非常吉利的组合，互相旺对方运势，在一起后各方面都会更顺遂。</p>';shaScore+=3;}
    if(aShensha.some(s=>s.includes('桃花'))||bShensha.some(s=>s.includes('桃花'))){analysis+='<p><strong>【神煞互动】</strong>一方命带桃花，异性缘佳，需彼此多一份信任和理解。但只要心定，桃花也能转化为感情中的浪漫因子。</p>';}

    // 7. 月柱互动（父母/事业宫）
    let aMoon=aPillars[1],bMoon=bPillars[1];
    let aMoonToB=getShiShen(aDS,bMoon.s),bMoonToA=getShiShen(bDS,aMoon.s);
    analysis+='<p><strong>【月柱互动（事业/家庭）】</strong>甲方月柱'+aMoon.stem+aMoon.branch+'（'+aMoon.nayin+'），乙方月柱'+bMoon.stem+bMoon.branch+'（'+bMoon.nayin+'）。';
    if(getShiShen(aDS,bMoon.s)==='正官'||getShiShen(bDS,aMoon.s)==='正官')analysis+='月柱互为官星——两人在事业上能互相扶持，适合共同创业或在同一单位发展。</p>';
    else if(getShiShen(aDS,bMoon.s)==='正印'||getShiShen(bDS,aMoon.s)==='正印')analysis+='月柱互为印星——双方家庭容易接纳彼此，父母认可度高。</p>';
    else analysis+='月柱互动在事业和家庭层面需多些磨合，但并非不可调和。</p>';

    // 8. 时柱互动（子女/晚年）
    let aHour=aPillars[3],bHour=bPillars[3];
    let aHS=getShiShen(aDS,aHour.s),bHS=getShiShen(bDS,bHour.s);
    analysis+='<p><strong>【时柱互动（晚年/子女）】</strong>甲方时柱'+aHour.stem+aHour.branch+'（'+aHS+'），乙方时柱'+bHour.stem+bHour.branch+'（'+bHS+'）。';
    if(aHS==='食神'||aHS==='伤官'||bHS==='食神'||bHS==='伤官')analysis+='时柱带食伤——两人在一起后子女缘分不错，晚年生活有温度。</p>';
    else if(aHS==='正印'||aHS==='偏印'||bHS==='正印'||bHS==='偏印')analysis+='时柱带印星——晚年心态平和，互相照顾，是"老来伴"的典范。</p>';
    else analysis+='时柱互动需结合大运来看，但整体晚年运势可期。</p>';

    // 9. 用神互补
    let aYS=aPillars.map(p=>SE[p.s]),bYS=bPillars.map(p=>SE[p.s]);
    let wxMap={'木':['水'],'火':['木'],'土':['火'],'金':['土'],'水':['金']};
    let aNeed=wxMap[aYS[2]][0],bNeed=wxMap[bYS[2]][0];
    let boostA=bYS.filter(w=>w===aNeed).length,boostB=aYS.filter(w=>w===bNeed).length;
    if(boostA>=2||boostB>=2){analysis+='<p><strong>【用神互补】</strong>✦ 双方五行有显著的互济之效——一方五行中大量存在另一方最需要的能量。这种组合在一起后，各自运势都会得到提升，如同两块拼图完美嵌合。</p>';}
    else if(boostA>=1||boostB>=1){analysis+='<p><strong>【用神互补】</strong>双方有一定的用神互补，虽不显著但基础在。多加互动会让这种互补效果更明显。</p>';}

    document.getElementById('hpAnalysis').innerHTML=analysis;

    // ===== 综合评分 =====
    let score=50;
    score+=ganHeScore;     // 日干合化 0~15
    score+=zhiScore;       // 日支冲合 -15~10
    score+=crossScore;     // 十神互动 -8~12
    score+=wxScore;        // 五行互补 0~15
    score+=nayinWxScore;   // 年柱纳音 -2~12
    score+=zScore;         // 生肖合冲 -8~8
    score+=spouseScore;    // 配偶星 0~5
    score+=shaScore;       // 神煞 0~3
    score=Math.min(98,Math.max(20,score));

    let scoreColor='#8bc34a',level='良缘',levelDesc='',events=[];
    if(score>=85){scoreColor='#8bc34a';level='天作之合';levelDesc='你们的八字如琴瑟和鸣，契合度极高。日柱相生、五行互补、十神呼应——不是偶然，是命定的默契。在一起后事业财运感情三线齐飞，互为对方最好的风水。';
        events.push({p:92,t:'婚后感情持续升温，彼此成就'},{p:85,t:'事业上互相助力，共同成长'},{p:78,t:'财运同旺，合伙创业易成功'},{p:65,t:'育有子女后家庭更加和谐'},{p:40,t:'偶有小吵但很快和好'});}
    else if(score>=70){scoreColor='#ff9800';level='佳偶天成';levelDesc='你们的八字像两棵并肩的树——各自有根，但枝桠在空中交握。虽然有需要磨合的棱角，但根基是稳的。多些耐心和包容，时间会让这份感情越来越醇。';
        events.push({p:82,t:'感情稳定，白头偕老概率高'},{p:70,t:'一方事业旺时能带动另一方'},{p:55,t:'需要磨合但越磨越好'},{p:40,t:'财务上各自独立更佳'},{p:25,t:'需要避免因小事累积矛盾'});}
    else if(score>=55){scoreColor='#fdd835';level='尚可磨合';levelDesc='你们的八字像两块不同硬度的木头——需要更多的打磨才能契合。不是没有缘分，而是缘分需要你们主动去"养"。理解彼此的命局差异，扬长避短，比强求改变对方更智慧。';
        events.push({p:70,t:'互相理解后关系逐步改善'},{p:55,t:'分开发展各自事业更稳定'},{p:45,t:'财务上保持相对独立'},{p:30,t:'情感上需要更多包容'},{p:20,t:'大运来助时关系会明显好转'});}
    else{scoreColor='#ef5350';level='需要慎重';levelDesc='你们的八字契合度偏低，日柱或五行存在明显的冲突。在一起需要比寻常情侣付出更多心力去经营。如果选择同行，请记住：命盘给的是起点，终点由你们亲手写。';
        events.push({p:65,t:'需要刻意维护才能保持关系'},{p:50,t:'聚少离多可能是常态'},{p:40,t:'财务上容易产生分歧'},{p:30,t:'感情投入和回报不成正比'},{p:15,t:'正缘另有其人'});}

    let hpScoreHTML='<div style="text-align:center;padding:16px;">';
    hpScoreHTML+='<div style="font-size:56px;font-weight:700;color:'+scoreColor+';">'+score+'<span style="font-size:22px;">分</span></div>';
    hpScoreHTML+='<div style="font-size:20px;color:'+scoreColor+';margin-top:4px;letter-spacing:3px;">'+level+'</div>';
    hpScoreHTML+='<div style="font-size:11px;color:#888;margin-top:8px;line-height:1.6;">合盘综合评分基于日干合化、夫妻宫互动、十神交叉、五行互补、年柱纳音、生肖合冲、配偶星匹配、神煞互动、月柱互动、时柱互动、用神互补等多维度综合分析。</div>';
    hpScoreHTML+='<p style="margin-top:8px;font-size:11px;color:#ccc;line-height:1.6;">'+levelDesc+'</p>';

    // 事件概率
    hpScoreHTML+='<div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--border);"><span style="font-size:10px;color:#888;">📋 双方关系事件概率</span></div>';
    if(events.length>0){
        events.sort((a,b)=>b.p-a.p);
        hpScoreHTML+='<div style="margin-top:4px;">';
        events.forEach(e=>{
            let c='#8bc34a';if(e.p<60)c='#ff9800';if(e.p<35)c='#ef5350';
            hpScoreHTML+='<div style="display:flex;align-items:center;gap:8px;padding:2px 0;font-size:11px;">';
            hpScoreHTML+='<span style="min-width:26px;text-align:right;font-weight:600;color:'+c+';">'+e.p+'%</span>';
            hpScoreHTML+='<div style="flex:1;height:3px;background:#1a1a30;border-radius:2px;overflow:hidden;"><div style="height:100%;width:'+e.p+'%;background:'+c+';border-radius:2px;"></div></div>';
            hpScoreHTML+='<span style="min-width:160px;color:#bbb;">'+e.t+'</span>';
            hpScoreHTML+='</div>';
        });
        hpScoreHTML+='</div>';
    }
    hpScoreHTML+='</div>';

    // ===== 合婚未来运势预测 =====
    let fuAnalysis='<div style="margin-top:12px;padding-top:8px;border-top:1px solid var(--border);">';
    fuAnalysis+='<p style="color:var(--accent);text-indent:0;">🔮 合婚未来运势全面预测</p>';

    //═ 感情走势三阶段 ═
    fuAnalysis+='<p><strong>【感情走势·三阶段】</strong></p>';
    fuAnalysis+='<p>✦ <strong>第一阶段（现在-3年）：</strong>';
    if(GAN_HE[aDS]===bDS)fuAnalysis+='日干五合——你们有天然的化学反应，像认识了很久。多创造共同回忆，它们是未来平淡期的养分。</p>';
    else if(score>=70)fuAnalysis+='虽无合化但多维匹配让初期顺畅自然。加分项是真诚坦率——你们都不玩心机。</p>';
    else if(score>=55)fuAnalysis+='你们会被对方身上和自己不同的部分吸引。享受当下但别忽略红灯。</p>';
    else fuAnalysis+='吸引是真实的，但"合适"和"喜欢"是两件事。激情褪去前看清底色是否兼容。</p>';

    fuAnalysis+='<p>✦ <strong>第二阶段（3-10年）：</strong>';
    if(ZHI_HE[aDB]===bDB)fuAnalysis+='日支六合——磨合期比大多数伴侣轻松。关键：谁管钱、谁管家、重大决策怎么定，把规则建好。</p>';
    else if(ZHI_CHONG[aDB]===bDB)fuAnalysis+='日支相冲——最大考验在磨合期。学会"争而不伤"——吵架可以，永远给对方一条回家的路。</p>';
    else fuAnalysis+='关键在建立有效的沟通机制。真正的亲密是"我愿意让你看到我不好的一面"。</p>';

    fuAnalysis+='<p>✦ <strong>第三阶段（10年以上）：</strong>';
    if(score>=70)fuAnalysis+='晚年宫位互动良好。十年后心动变习惯性温暖——不每天说爱，但对方生病第一个出现。</p>';
    else if(score>=55)fuAnalysis+='走到这里已赢过大多数情侣。你们建立了专属两人的相处法则。</p>';
    else fuAnalysis+='能走到这里不容易。年轻时的棱角被磨平，留下安宁的陪伴。</p>';

    //═ 吸引力解码 ═
    let attract='';
    if(GAN_HE[aDS]===bDS)attract='✨ 日干五合——最深层的精神吸引，像磁铁自然吸在一起。';
    if(ZHI_HE[aDB]===bDB)attract+=' 💫 日支六合——身体和情感层面的默契，无需多言。';
    if(!attract)attract='后天培养型——不是一见钟情的剧本，但越相处越离不开。慢热但恒温。';
    fuAnalysis+='<p><strong>【吸引力解码】</strong>'+attract+'</p>';

    //═ 沟通风格 ═
    aDe=SE[aDS];bDe=SE[bDS];
    let commTips={木:'直接坦率但偶尔啰嗦',火:'热情主动但容易上头',土:'稳重务实但不太会哄人',金:'简洁利落但言辞犀利',水:'细腻周全但喜欢绕弯'};
    fuAnalysis+='<p><strong>【沟通风格】</strong>甲方（'+aDe+'）偏<em>'+commTips[aDe]+'</em>，乙方（'+bDe+'）偏<em>'+commTips[bDe]+'</em>。';
    fuAnalysis+=aDe===bDe?'同五行——秒懂对方但也容易针锋相对。一个说时另一个先听完再回应。</p>':'互补型——天然形成攻守平衡，一个说一个听、一个冲动一个冷静。</p>';

    //═ 亲密关系 ═
    fuAnalysis+='<p><strong>【亲密关系】</strong>';
    let aPeach=aShensha.some(s=>s.includes('桃花')),bPeach=bShensha.some(s=>s.includes('桃花'));
    if(aPeach||bPeach)fuAnalysis+='带桃花方热度高——但身体的亲密容易，心灵的亲密更难。别把"床上和谐"等同于"关系健康"。';
    else fuAnalysis+='慢节奏型——先建立信任，再身体开放。这个顺序其实更健康。';
    if(aDe==='火'||bDe==='火')fuAnalysis+='火旺方主导欲强，留意对方节奏。';
    fuAnalysis+='</p>';

    //═ 潜在冲突 ═
    fuAnalysis+='<p><strong>【⚡ 潜在冲突】</strong>';
    let cf=[];
    if(ZHI_CHONG[aDB]===bDB)cf.push('日支相冲——性格差异引发争执。"争事不争人"，就事论事不人身攻击。');
    if(!GAN_HE[aDS]||GAN_HE[aDS]!==bDS)cf.push('日干不合——价值观可能有分歧。多找共同目标和兴趣。');
    if(aPillars[0].b===bPillars[0].b)cf.push('年支相同——双方都强势或都被动，需要明确分工。');
    fuAnalysis+=(cf.length?cf.join(' '):'整体匹配度不错，没有明显硬伤。功课是"经营"而非"修复"。')+'</p>';

    fuAnalysis+='<p><strong>【合婚财运】</strong>';
    if(score>=70)fuAnalysis+='在一起后财运有"1+1>2"的潜力。一方开源一方守成，合开店铺或共同投资成功概率高于单打独斗。但提前约定财务规则——好感情和好账本不矛盾。';
    else fuAnalysis+='建议财务上保持相对独立。开设共同账户用于共同开支，各自投资各自负责，反而是保护感情的做法。';
    fuAnalysis+='</p>';

    fuAnalysis+='<p><strong>【合婚健康】</strong>两人五行互济，长期同居对健康有正向影响。注意在某方体质偏弱的季节多些体贴。一起运动一起做饭，是最实在的养生。</p>';

    fuAnalysis+='<p><strong>【合婚子女运】</strong>';
    let aCh=getShiShen(aDS,aPillars[3].s),bCh=getShiShen(bDS,bPillars[3].s);
    if(aCh==='食神'||bCh==='食神')fuAnalysis+='时柱带食神——结合后子女缘分好，孩子聪明懂事，教育方式温和即可。';
    else if(aCh==='伤官'||bCh==='伤官')fuAnalysis+='时柱带伤官——子女聪明有主见，小时候需多些耐心，长大后才华出众。';
    else fuAnalysis+='子女运需结合大运来看，大运逢食伤之年缘分自来。';
    fuAnalysis+='</p>';
    // 子女缘分深度分析
    fuAnalysis+='<p><strong>【👼 子女缘分·深度分析】</strong></p><div style="margin:6px 0;font-size:11px;line-height:1.8;color:#bbb;">';
    let aChildStars=aPillars.map(p=>getShiShen(aDS,p.s)).filter(s=>s==='食神'||s==='伤官');
    let bChildStars=bPillars.map(p=>getShiShen(bDS,p.s)).filter(s=>s==='食神'||s==='伤官');
    let aChildCount=aChildStars.length,bChildCount=bChildStars.length;
    // 甲方子女缘分
    if(aChildCount>=2)fuAnalysis+='<p>✦ 甲方命局中食伤星<strong>旺盛</strong>（共'+aChildCount+'个），天生子女缘分深厚。将来对孩子有天然的亲和力，教育方式偏向鼓励和引导。';
    else if(aChildCount===1)fuAnalysis+='<p>✦ 甲方命局中食伤星<strong>适中</strong>，子女缘分正常。在合适的时机（大运逢食伤之年）自然得子，教育上理性与感性兼顾。';
    else fuAnalysis+='<p>✦ 甲方命局中食伤星<strong>不显</strong>，子女缘分需结合大运催动。但"不显"不代表没有——往往大运一到，缘分来得更珍惜和感恩。';
    // 乙方子女缘分
    if(bChildCount>=2)fuAnalysis+='乙方食伤星<strong>旺盛</strong>（共'+bChildCount+'个），同样是天生好父母。两人结合后子女运叠加，家庭氛围热闹温馨。</p>';
    else if(bChildCount===1)fuAnalysis+='乙方食伤星<strong>适中</strong>。两人结合后子女运互补，一方若缘分稍弱，另一方能补上。</p>';
    else fuAnalysis+='乙方食伤星<strong>不显</strong>。两人结合后，在大运流年配合下子女缘分可期。不必焦虑，缘分到来时自然圆满。</p>';
    // 合盘子女特质
    let aHrStem=S[aPillars[3].s],bHrStem=S[bPillars[3].s];
    let childTrait='';
    if(aDayWx==='火'||bDayWx==='火')childTrait+='火旺的家庭氛围培养出的孩子通常性格开朗、自信大方。';
    if(aDayWx==='水'||bDayWx==='水')childTrait+='水旺的家庭氛围培养出的孩子通常聪明灵活、善于变通。';
    if(aDayWx==='木'||bDayWx==='木')childTrait+='木旺的家庭氛围培养出的孩子通常有创造力、善良正直。';
    if(aDayWx==='金'||bDayWx==='金')childTrait+='金旺的家庭氛围培养出的孩子通常果断坚毅、有原则。';
    if(aDayWx==='土'||bDayWx==='土')childTrait+='土旺的家庭氛围培养出的孩子通常稳重可靠、踏实努力。';
    if(!childTrait)childTrait='你们的孩子将融合双方性格优点，取长补短。';
    fuAnalysis+='<p>✦ <strong>孩子特质预估：</strong>'+childTrait+'</p>';
    // 最佳生育时机
    fuAnalysis+='<p>✦ <strong>最佳生育时机：</strong>大运或流年逢食神、伤官之年份为最佳生育窗口期。若双方时柱均带食伤，则生育相对顺遂；若均不带，可重点关注双方大运中食伤星出现的时间段，提前做好备孕规划。</p>';
    fuAnalysis+='</div>';

    fuAnalysis+='<p><strong>【💡 关系建议】</strong>';
    let tl=[];
    if(!GAN_HE[aDS]||GAN_HE[aDS]!==bDS)tl.push('多做共同兴趣的事，创造属于你们俩的小宇宙。');
    if(ZHI_CHONG[aDB]===bDB)tl.push('日支相冲——给彼此留够独处时间，比别的伴侣多一个缓冲空间。');
    tl.push('定期"复盘"感情，像对待最重要的工作一样认真。');
    fuAnalysis+=tl.join(' ')+'</p>';

    //═ 谁爱谁更多 ═
    let aToB=getShiShen(aDS,bDS),bToA=getShiShen(bDS,aDS);
    fuAnalysis+='<p><strong>【❤️ 感情天平】</strong>';
    if(aToB==='正官'||aToB==='正财')fuAnalysis+='甲方看乙方是<strong>'+aToB+'</strong>——潜意识中甲方更"认定"乙方是自己的正缘，付出的主动性和坚定性更高。';
    else if(bToA==='正官'||bToA==='正财')fuAnalysis+='乙方看甲方是<strong>'+bToA+'</strong>——乙方在关系中可能投入更深，更需要被看见和回应。';
    else if(aToB==='正印'||aToB==='偏印')fuAnalysis+='甲方看乙方是<strong>'+aToB+'</strong>——甲方在关系中更像"照顾者"和"滋养者"，付出多于索取。乙方被宠着的同时也要记得回馈。';
    else if(bToA==='正印'||bToA==='偏印')fuAnalysis+='乙方看甲方是<strong>'+bToA+'</strong>——乙方在关系中付出更多滋养和保护。甲方享受这份温暖的同时别当成理所当然。';
    else fuAnalysis+='双方的付出相对均衡。没有明显的一方"更爱对方"——你们是势均力敌的搭档。但这也意味着两人都需要主动，不能等对方先迈步。</p>';

    //═ 权力结构 ═
    fuAnalysis+='<p><strong>【👑 关系中的权力结构】</strong>';
    let aGong=aPillars.map(p=>getShiShen(aDS,p.s)).filter(s=>s==='正官'||s==='七杀').length;
    let bGong=bPillars.map(p=>getShiShen(bDS,p.s)).filter(s=>s==='正官'||s==='七杀').length;
    if(aGong>bGong+1)fuAnalysis+='甲方官杀较重——关系中甲方更倾向于做决策者，主导节奏。乙方若接受这个模式会相处融洽；若不愿则需主动沟通。';
    else if(bGong>aGong+1)fuAnalysis+='乙方官杀较重——关系中乙方可能更有主见和掌控力。甲方不必勉强自己"必须主导"，平等的分工也是健康的模式。';
    else fuAnalysis+='双方官杀相当——你们在关系中倾向于平等协商。大事一起定，小事各自管，这种模式最稳定。但偶尔也需要一个人站出来做最后决定。</p>';

    //═ 最佳婚期 ═
    fuAnalysis+='<p><strong>【💒 合作/婚姻最佳时机】</strong>';
    let now=new Date().getFullYear();
    let goodYears=[];
    for(let i=0;i<10;i++){
        let cy=now+i;
        let cyGZ=getYearGZ(cy,6,15);
        let cyDe=SE[cyGZ.s];
        if(cyDe===SE[aDS]||cyDe===SE[bDS]||(GAN_HE[aDS]!==undefined&&cyDe===SE[bDS]))goodYears.push(cy);
    }
    if(goodYears.length>0){
        fuAnalysis+='未来十年中，<strong>'+goodYears.slice(0,3).join('年、')+'年</strong>是你们这段关系最适合走入婚姻或升级关系（同居/订婚）的年份。这些年份的五行气场对双方都友好，婚后稳定性更高。</p>';
    }else{
        fuAnalysis+='选在双方日柱纳音五行相生的年份结婚最佳。具体年份可结合"流年详批"功能查看。</p>';
    }
    // 最佳时机深度建议
    fuAnalysis+='<div style="margin:6px 0;font-size:11px;line-height:1.8;color:#bbb;">';
    fuAnalysis+='<p>✦ <strong>时机选择要诀：</strong></p>';
    // 季节建议
    let bestSeason='';
    let aWxNeed='',bWxNeed='';
    if(aDayWx&&wxRelMap[aDayWx])aWxNeed=wxRelMap[aDayWx].sheng;
    if(bDayWx&&wxRelMap[bDayWx])bWxNeed=wxRelMap[bDayWx].sheng;
    const wxSeason={木:'春季（2-4月）',火:'夏季（5-7月）',土:'四季末（3月、6月、9月、12月）',金:'秋季（8-10月）',水:'冬季（11-1月）'};
    if(aDayWx&&wxSeason[aDayWx])bestSeason=wxSeason[aDayWx]+'或';
    if(bDayWx&&wxSeason[bDayWx])bestSeason+=wxSeason[bDayWx];
    fuAnalysis+='<p>✦ <strong>最佳季节：</strong>'+bestSeason+'。在双方日主五行当令的季节举办婚礼或开启合作，气场最旺，事半功倍。</p>';
    // 避开冲突年份
    if(ZHI_CHONG[aDB]===bDB){
        fuAnalysis+='<p>✦ <strong>特别提醒：</strong>日支相冲的年份（如'+B[aDB]+'年与'+B[bDB]+'年）需特别注意——这些年份关系容易紧张，不适合做重大决定（如结婚、创业合伙）。反之，'+B[aDB]+'与'+B[bDB]+'六合之年（逢'+B[ZHI_HE[aDB]]+'年），则是修复和升级关系的黄金窗口。</p>';
    }
    // 合作时机
    fuAnalysis+='<p>✦ <strong>合作/创业时机：</strong>若考虑共同创业或事业合作，最佳时机在双方八字中"官星"或"财星"同时被流年引动的年份。具体而言——男方逢正财/偏财之年、女方逢正官/七杀之年，合作关系最容易出成果。</p>';
    fuAnalysis+='<p>✦ <strong>感情升级信号：</strong>当流年干支与双方日柱发生以下关系时，是感情进入下一阶段的天然信号——天干五合（关系升温）、地支六合（默契加深）、流年桃花入命（浪漫加分）。关注这些年份，顺势而为比强求更有效。</p>';
    fuAnalysis+='</div>';

    //═ 吵架与和解 ═
    fuAnalysis+='<p><strong>【💢 吵架与和解模式】</strong>';
    if(aDe==='火'&&bDe==='金')fuAnalysis+='火克金——甲方脾气来得快去得快，乙方则容易把话憋在心里。吵架时甲方先冷静三秒，乙方主动说出感受——和解的最佳方式是甲方先道歉、乙方给台阶。';
    else if(aDe==='金'&&bDe==='火')fuAnalysis+='火克金——乙方火气上头时甲方容易感到被灼伤。吵架时甲方别硬碰硬，先顺着乙方的话说"我理解你生气"，等火灭了再讲理。和解方式：乙方主动抱一下。';
    else if(aDe==='木'&&bDe==='土')fuAnalysis+='木克土——甲方的道理一套一套让乙方觉得"说不过你"。吵架时甲方别讲大道理，乙方也别冷战。和解方式：一起做顿饭吃，和解在烟火气里。';
    else if(aDe==='土'&&bDe==='木')fuAnalysis+='木克土——乙方更善于表达，甲方容易"闷"着。和解的最佳方式是甲方写一段话给乙方——不是吵架时写的，是冷静后写的真心话。';
    else if(aDe==='土'&&bDe==='水')fuAnalysis+='土克水——甲方说一不二，乙方容易觉得被压着。和解的方式是甲方带乙方去一个TA喜欢的地方（海边、河边），在水边聊开。';
    else if(aDe==='水'&&bDe==='土')fuAnalysis+='土克水——乙方可能更固执，甲方容易陷入自我怀疑。吵架后给彼此24小时冷静期，然后面对面重新谈——不谈对错，只谈感受。';
    else if(aDe===bDe)fuAnalysis+='五行相同——你们吵架像照镜子，对方最让你生气的点恰恰是你自己也有但不愿承认的。和解方式：各退一步，先笑着说"好吧我们俩真像"。';
    else fuAnalysis+='你们五行相生——吵架不常见，但一旦吵起来容易冷战。和解方式：谁先开口谁就赢了。别让沉默超过三天。';
    fuAnalysis+='</p>';

    //═ 生男生女 ═
    fuAnalysis+='<p><strong>【👶 生男生女倾向】</strong>';
    let childWx=[];
    if(aPillars[3].s%2===0)childWx.push('生男概率偏高');
    if(bPillars[3].s%2===1)childWx.push('生女概率偏高');
    if(!childWx.length)childWx.push('男女概率均衡');
    fuAnalysis+=childWx.join('，')+'。时柱食伤为食神者多生女、伤官者多生男（仅概率参考）。</p>';

    //═ 大运同步 ═
    fuAnalysis+='<p><strong>【📈 大运同步性】</strong>';
    let aDy=getYearGZ(ay,am,ad),bDy=getYearGZ(by,bm,bd);
    let dySync=Math.abs(aDy.s-bDy.s);
    if(dySync===0)fuAnalysis+='双方年柱相同——大运节奏几乎同步。这意味着你们的人生重大转折点往往在同一时期到来，要么一起走上坡，要么一起经历低谷。好时共享、难时共扛。';
    else if(dySync<=2)fuAnalysis+='大运节奏相近——一方的运起另一方也不远。如果其中一人当前运势低迷，另一人往往能扛起家庭。这种互补非常难得。';
    else fuAnalysis+='大运节奏不同步——你们可能在"我正想冲但他想稳"的阶段错位。不是命不好，是需要更多的沟通让对方知道"我现在在哪、我需要什么"。</p>';

    fuAnalysis+='</div>';
    hpScoreHTML+=fuAnalysis;

    document.getElementById('hpScore').innerHTML=hpScoreHTML;

    document.getElementById('hpResult').style.display='block';
    document.getElementById('hpResult').scrollIntoView({behavior:'smooth'});
}

function calcPillars(y,m,d,hh,lon){
    if(lon&&lon!==116.4){let ts=trueSolarTime(hh,0,lon,y,m,d);hh=ts.h;}
    let yGZ_=getYearGZ(y,m,d),mb_=getMonthBranch(y,m,d),ms_=getMonthStem(yGZ_.s,mb_);
    let mGZ={s:ms_,b:mb_},dGZ_=getDayGZ(new Date(y,m-1,d));
    let hb_=getHourBranch(hh),hs_=getHourStem(dGZ_.s,hb_),hGZ={s:hs_,b:hb_};
    return [{name:'年柱',s:yGZ_.s,b:yGZ_.b,stem:S[yGZ_.s],branch:B[yGZ_.b],nayin:getNayin(yGZ_.s,yGZ_.b)},{name:'月柱',s:mGZ.s,b:mGZ.b,stem:S[mGZ.s],branch:B[mGZ.b],nayin:getNayin(mGZ.s,mGZ.b)},{name:'日柱',s:dGZ_.s,b:dGZ_.b,stem:S[dGZ_.s],branch:B[dGZ_.b],nayin:getNayin(dGZ_.s,dGZ_.b)},{name:'时柱',s:hGZ.s,b:hGZ.b,stem:S[hGZ.s],branch:B[hGZ.b],nayin:getNayin(hGZ.s,hGZ.b)}];
}

function renderMiniPillars(pillars){
    let h='<div style="font-size:11px;line-height:1.6;">';
    pillars.forEach(p=>{
        h+='<div>'+p.name+'：<span class="wx-'+SE[p.s]+'">'+p.stem+'</span><span class="wx-'+BE[p.b]+'">'+p.branch+'</span>（'+p.nayin+'）</div>';
    });
    h+='</div>';
    return h;
}

// ==================== 紫微斗数 ====================
const ZW_GONG=['命宫','兄弟','夫妻','子女','财帛','疾厄','迁移','交友','官禄','田宅','福德','父母'];
const ZW_STARS_MAP={0:'紫微',1:'天机',2:'太阳',3:'武曲',4:'天同',5:'廉贞',6:'天府',7:'太阴',8:'贪狼',9:'巨门',10:'天相',11:'天梁',12:'七杀',13:'破军'};
function calcZiwei(){
    let y=parseInt(document.getElementById('zwYear').value);
    let m=parseInt(document.getElementById('zwMonth').value);
    let d=parseInt(document.getElementById('zwDay').value);
    let hh=parseInt(document.getElementById('zwHour').value);
    let mm=parseInt(document.getElementById('zwMin').value)||0;
    let dayGZ_=getDayGZ(new Date(y,m-1,d));
    let yGZ=getYearGZ(y,m,d); // 年柱用于五行局和四化
    let hb_zw=getHourBranch(hh);
    let mingPos=((m+1)%12 - hb_zw + 12)%12; // 命宫：寅起正月→顺数月→逆数到时
    // ── 五行局（命宫纳音→局数）──
    let huJiBase=[2,4,6,8,0]; // 五虎遁：甲己→丙(2),乙庚→戊(4),丙辛→庚(6),丁壬→壬(8),戊癸→甲(0)
    let mingGongStem=(huJiBase[yGZ.s%5]+(mingPos-2+12))%10; // 命宫天干 = 五虎遁基数 + (命宫地支-寅)
    let mingNayin=getNayin(mingGongStem,mingPos);
    let nayinWx={金:4,木:3,水:2,火:6,土:5};
    let juShu=nayinWx[mingNayin.match(/[金木水火土]/)?.[0]]||2; // 五行局数
    // ── 紫微星（标准算法：生日/局数，从寅起）──
    let ziweiPos=(Math.ceil(d/juShu)+1)%12; // 寅=2, ceil(d/juShu)格从寅起
    // ── 天府（紫微-天府固定映射）──
    let tianfuMap={2:4,3:5,4:2,5:3,6:0,7:1,8:10,9:11,10:8,11:9,0:6,1:7};
    let tianfuPos=tianfuMap[ziweiPos];
    let gongs=[];
    for(let i=0;i<12;i++){
        let gIdx=(mingPos-i+12)%12;
        gongs.push({name:ZW_GONG[i], idx:gIdx, stars:[]});
    }
    gongs.forEach((g,i)=>{
        if((i+ziweiPos)%12===0)g.stars.push('紫微(帝)');
        if((i+ziweiPos+1)%12===0)g.stars.push('天机');
        if((i+ziweiPos+2)%12===0)g.stars.push('太阳');
        if((i+ziweiPos+3)%12===0)g.stars.push('武曲');
        if((i+ziweiPos+4)%12===0)g.stars.push('天同');
        if((i+ziweiPos+5)%12===0)g.stars.push('廉贞');
        // 天府系8星（从天府位置起顺排）
        if((i+tianfuPos)%12===0)g.stars.push('天府');
        if((i+tianfuPos+1)%12===0)g.stars.push('太阴');
        if((i+tianfuPos+2)%12===0)g.stars.push('贪狼');
        if((i+tianfuPos+3)%12===0)g.stars.push('巨门');
        if((i+tianfuPos+4)%12===0)g.stars.push('天相');
        if((i+tianfuPos+5)%12===0)g.stars.push('天梁');
        if((i+tianfuPos+6)%12===0)g.stars.push('七杀');
        if((i+tianfuPos+7)%12===0)g.stars.push('破军');
    });
    // ── 辅星安星 ──
    // 左辅：正月起辰(4)，顺数
    let zfPos=(m+3)%12;
    // 右弼：正月起戌(10)，逆数  
    let ybPos=(14-m)%12;
    // 文昌：戌(10)起子时逆数
    let wcPos=(22-hh)%12;
    // 文曲：辰(4)起子时顺数
    let wqPos=(hh+4)%12;
    // 天魁天钺：年干定
    let tkPos={0:1,1:0,2:11,3:10,4:10,5:10,6:9,7:8,8:8,9:8}[yGZ.s];
    let tyPos={0:7,1:6,2:5,3:4,4:4,5:4,6:3,7:2,8:2,9:2}[yGZ.s];
    // 禄存：年干定
    let lcPos={0:2,1:3,2:4,3:5,4:6,5:7,6:8,7:9,8:0,9:1}[yGZ.s];
    // 擎羊：禄存前一位
    let qyPos=(lcPos+11)%12;
    // 陀罗：禄存后一位
    let tlPos=(lcPos+1)%12;
    // 火星铃星：年支+时辰综合（简化：年支三合起+时辰顺/逆）
    let hxSan={0:0,1:0,2:2,3:2,4:4,5:4,6:6,7:6,8:8,9:8,10:10,11:10};
    let hxBase=hxSan[yGZ.b]||0;
    let hxPos=(hxBase+hh)%12;
    // 铃星：火星三合对宫起，顺数到时辰
    let lxPos=(hxBase+6+hh)%12;
    // 地空：亥(11)起子时逆数
    let dkPos=(23-hh)%12;
    // 地劫：亥(11)起子时顺数
    let djPos=(hh+11)%12;
    // 天马：月支三合相冲位
    let tmMap={2:8,3:9,4:10,5:11,6:0,7:1,8:2,9:3,10:4,11:5,0:6,1:7};
    let tmPos=tmMap[yGZ.b];

    let fuStars=['文昌','文曲','左辅','右弼','天魁','天钺','禄存','天马','擎羊','陀罗','火星','铃星','地空','地劫'];
    let fuPos=[wcPos,wqPos,zfPos,ybPos,tkPos,tyPos,lcPos,tmPos,qyPos,tlPos,hxPos,lxPos,dkPos,djPos];
    let fuMean={
        '文昌':'📖 才学之星，主科甲功名，利考试深造',
        '文曲':'🎵 才艺之星，主文艺天赋，口才表达',
        '左辅':'🤝 辅佐吉星，贵人相助，左膀右臂',
        '右弼':'💪 助力之星，幕后支持，化险为夷',
        '天魁':'👑 天乙贵人之首，科甲成名，遇难呈祥',
        '天钺':'🌟 阴贵之星，暗中有助，女贵人运强',
        '禄存':'💰 财禄之星，主财富积累，衣食无忧',
        '天马':'🐎 驿马星动，主奔波变动，异地发展',
        '擎羊':'⚔ 刑伤之星，刚强好胜，需防冲突',
        '陀罗':'⏳ 拖延之星，好事多磨，持之以恒',
        '火星':'🔥 暴发之星，来得快去得猛，冲动是敌',
        '铃星':'🔔 暗火之星，内心焦灼，需学会放松',
        '地空':'💨 空灵之星，思想跳跃，不喜束缚',
        '地劫':'🌪 波折之星，大器晚成，柳暗花明'
    };
    let fuCat={文昌:'吉',文曲:'吉',左辅:'吉',右弼:'吉',天魁:'吉',天钺:'吉',禄存:'吉',天马:'中',擎羊:'煞',陀罗:'煞',火星:'煞',铃星:'煞',地空:'煞',地劫:'煞'};
    for(let i=0;i<fuStars.length;i++){
        let gi=fuPos[i];
        if(gi!==undefined&&gi>=0&&gi<12){
            let g=gongs.find(g=>g.idx===gi);
            if(g)g.stars.push(fuStars[i]+':'+fuCat[fuStars[i]]);
        }
    }

    let gridHTML='';
    gongs.forEach(g=>{
        let starText=g.stars.length>0?g.stars.join(' '):'-';
        gridHTML+='<div style="background:#0a0a1e;border:1px solid var(--border);padding:8px 4px;font-size:10px;border-radius:6px;"><div style="color:#888;font-size:9px;">'+g.name+'</div><div style="color:var(--accent);font-size:11px;margin-top:2px;">'+starText+'</div></div>';
    });
    document.getElementById('zwGongGrid').innerHTML=gridHTML;
    let starText='<p>紫微星落于<b>'+ZW_GONG[ziweiPos%12]+'宫</b>，以此为中心排布十四主星。</p>';
    starText+='<p>命宫主星：<b>'+gongs[0].stars.join('、')+'</b></p>';
    starText+='<p>财帛宫主星：<b>'+gongs[4].stars.join('、')+'</b></p>';
    starText+='<p>夫妻宫主星：<b>'+gongs[2].stars.join('、')+'</b></p>';
    starText+='<p>官禄宫主星：<b>'+gongs[8].stars.join('、')+'</b></p>';
    document.getElementById('zwStars').innerHTML=starText;

    // 扩展紫微分析 - 全面版本
    let analysis='';
    analysis+='<p style="color:var(--accent);text-indent:0;">🌟 来看看你的紫微命盘————</p>';
    analysis+='<p>紫微斗数以紫微星为核心，十二宫涵盖人生命运的各个维度。命宫为根看先天运势性格，财帛看财运聚散，夫妻看婚姻缘分，官禄看事业成就。</p>';
    analysis+='<p>命主命宫在<strong>'+ZW_GONG[mingPos]+'</strong>，紫微帝星落于<strong>'+ZW_GONG[ziweiPos%12]+'宫</strong>，为整个命盘之核心所在。</p>';

    // 十二宫逐一解读
    let gongDetail={
        '命宫':'命宫为十二宫之首，是整张命盘的灵魂所在。代表先天命格、性格特质和一生运势基调，也是自我认知和对外形象的宫位。命宫强旺则一生根基稳固，命宫主星决定你的天赋与人生主线。',
        '兄弟':'兄弟宫主手足缘分、朋友关系以及与同辈的互动模式。此宫也反映兄弟姐妹的个数、缘分深浅，以及你在团队中的协作能力。兄弟宫吉则手足互助、朋友众多；凶则兄弟姐妹缘薄或易有口舌之争。',
        '夫妻':'夫妻宫看婚姻缘分、配偶条件和婚后相处模式。此宫也反映你对感情的期望和择偶标准，以及婚姻中的幸福感。夫妻宫吉则配偶贤良、婚姻美满；凶则感情波折、需经历考验方能稳定。',
        '子女':'子女宫代表子女缘分、生育状况和与晚辈的关系。此宫也关联你的创造力和享乐方式，包括兴趣爱好和恋爱中的浪漫程度。子女宫吉则子女聪慧孝顺；凶则不易受孕或亲子关系需更多耐心经营。',
        '财帛':'财帛宫主一生财运、金钱观念和理财能力。此宫反映赚钱方式和金钱流动的规律，而非财富总量——有钱命还需好财帛宫来承接。财帛宫吉则财运亨通、手头宽裕；凶则需靠后天理财来弥补先天不足。',
        '疾厄':'疾厄宫看身体健康、疾病倾向和意外灾厄。此宫也反映你的抗压能力和面对危机时的韧性。疾厄宫吉则身体康健、灾祸远离；凶则需注意对应脏腑的保养，定期体检是保身之道。',
        '迁移':'迁移宫主外出发展、旅行运和社会适应能力。此宫也代表你在外地的表现和机遇，是命宫的"对外窗口"。迁移宫吉则适合离乡发展、出外遇贵人；凶则外出需谨慎，宜守不宜攻。',
        '交友':'交友宫看人脉关系、下属缘分和合作伙伴质量。此宫也反映你的人际魅力和社会地位的外部支撑。交友宫吉则得道多助、贵人环绕；凶则需防小人暗算，择友宜精不宜多。',
        '官禄':'官禄宫主事业发展、工作成就和社会地位。此宫是命宫在事业维度的延伸，代表你能走多高、走多远。官禄宫吉则事业有成、步步高升；凶则事业道路曲折，需靠坚持和智慧破局。',
        '田宅':'田宅宫看房产运、居家环境和家庭背景。此宫也代表你的安全感和归属感，是"安居"方能"乐业"的根基。田宅宫吉则置业顺利、居住舒适；凶则需关注家庭关系和谐度，房产运需耐心经营。',
        '福德':'福德宫主精神享受、晚年福气和内心世界。此宫是前世福德的体现，也代表你如何寻找快乐和内在平静。福德宫吉则心态乐观、老有所乐；凶则需刻意培养正向思维，多参与滋养心灵的活动。',
        '父母':'父母宫代表父母缘分、长辈关系和上司运。此宫也关联你的学历背景和早期成长环境，是"根"与"源"的象征。父母宫吉则父母康宁、长辈提携；凶则需主动修复与长辈的关系，自立自强是长久之道。'
    };
    analysis+='<p><strong>【十二宫逐宫解读】</strong></p>';
    analysis+='<div style="margin:6px 0;font-size:11px;line-height:1.8;color:#bbb;">';
    gongs.forEach((g,i)=>{
        let starStr=g.stars.length>0?g.stars.join('、'):'无主星';
        analysis+='<p><strong>'+g.name+'：</strong>'+starStr+' — '+gongDetail[g.name]+'</p>';
    });
    analysis+='</div>';

    // 辅星总览
    let hasFu=gongs.some(g=>g.stars.some(s=>s.includes(':')));
    if(hasFu){
        analysis+='<p><strong>【辅星总览】</strong></p><div style="margin:6px 0;font-size:11px;line-height:1.8;">';
        let jiStars=[],shaStars=[];
        gongs.forEach(g=>{
            g.stars.forEach(s=>{
                if(s.includes(':')){
                    let parts=s.split(':'),sn=parts[0],sc=parts[1];
                    let fn=sn+(fuMean[sn]?' '+fuMean[sn]:'');
                    if(sc==='吉')jiStars.push('<span style="color:#8bc34a;">'+g.name+'：'+fn+'</span>');
                    else if(sc==='煞')shaStars.push('<span style="color:#ef5350;">'+g.name+'：'+fn+'</span>');
                }
            });
        });
        if(jiStars.length>0)analysis+='<p>🟢 <strong>吉星加持：</strong>'+jiStars.join('<br>')+'</p>';
        if(shaStars.length>0)analysis+='<p>🔴 <strong>煞星考验：</strong>'+shaStars.join('<br>')+'</p>';
        let jiCount=jiStars.length,shaCount=shaStars.length;
        if(jiCount>shaCount+2)analysis+='<p>命盘吉星明显多于煞星——先天福泽深厚，人生道路相对平坦。善用吉星的优势领域，事半功倍。</p>';
        else if(shaCount>jiCount+2)analysis+='<p>煞星偏重——人生磨砺较多，但煞星也意味着"不平凡"。每一颗煞星都是一道淬炼，跨过去就是升级。大器晚成型。</p>';
        else analysis+='<p>吉煞均衡——有福气也有考验，人生不会太顺也不会太苦。这是最常见也最健康的配置：既有贵人相助，也有磨砺让你成长。</p>';
        analysis+='</div>';
    }

    // 四化（标准年干查表法）
    let sihuaStars={0:['廉贞','破军','武曲','太阳'],1:['天机','天梁','紫微','太阴'],2:['天同','天机','文昌','廉贞'],3:['太阴','天同','天机','巨门'],4:['贪狼','太阴','右弼','天机'],5:['武曲','贪狼','天梁','文曲'],6:['太阳','武曲','太阴','天同'],7:['巨门','太阳','文曲','文昌'],8:['天梁','紫微','左辅','武曲'],9:['破军','巨门','太阴','贪狼']};
    let sihuaName=['化禄','化权','化科','化忌'];
    let sihuaDetail={'化禄':'主福禄财富享受','化权':'主权势掌控竞争','化科':'主名声才艺贵人','化忌':'主困扰压力不足'};
    let sihuaText='<p><strong>【四化飞星】</strong>生年天干<strong>'+S[yGZ.s]+'</strong></p><div style="margin:6px 0;font-size:11px;line-height:1.8;">';
    let stars4=sihuaStars[yGZ.s]||['','','',''];
    for(let i=0;i<4;i++){
        let starName=stars4[i],foundGong='';
        gongs.forEach(g=>{if(g.stars.some(s=>s.startsWith(starName)))foundGong=g.name;});
        let isJi=(i===3);
        sihuaText+='<span style="color:'+(isJi?'#ef5350':'#8bc34a')+';">'+sihuaName[i]+'：<strong>'+starName+'</strong>'+(foundGong?'在'+foundGong+'宫':'')+' — '+sihuaDetail[sihuaName[i]]+'</span><br>';
    }
    sihuaText+='</div>';
    analysis+=sihuaText;

    // 三方四正
    let mingStars=gongs[0].stars;
    let caiStars=gongs[4].stars;
    let guanStars=gongs[8].stars;
    analysis+='<p><strong>【三方四正】</strong>命宫、财帛宫、官禄宫三合呼应，构成命运核心三角。此为紫微斗数最重要的宫位关联——命宫为根基看我是什么样的人，财帛宫为手段看我如何获取资源，官禄宫为舞台看我能走多高多远。</p>';
    // 三方四正深度分析
    analysis+='<p><strong>【三方四正·深度解读】</strong></p><div style="margin:6px 0;font-size:11px;line-height:1.8;color:#bbb;">';
    // 分析命宫-财帛关系
    let mingMain=mingStars.length>0?mingStars[0]:'';
    let caiMain=caiStars.length>0?caiStars[0]:'';
    let guanMain=guanStars.length>0?guanStars[0]:'';
    if(mingMain.includes('紫微')||mingMain.includes('天府')){
        analysis+='<p>命宫带帝星/库星，财帛宫为<strong>'+(caiMain||'无主星')+'</strong>——你天生具有掌控资源和驾驭财富的气场。命宫帝星坐镇，财帛宫为辅翼，适合做资源整合者而非单纯打工者。若财帛宫亦有强星（如武曲、太阴），则财富积累事半功倍。</p>';
    }else if(mingMain.includes('天机')||mingMain.includes('贪狼')){
        analysis+='<p>命宫带智星/桃花星，财帛宫为<strong>'+(caiMain||'无主星')+'</strong>——财富多靠智慧和人际而来。你赚钱的方式灵活多变，不拘一格，但也容易"来得快去得也快"。财帛宫若有库星（天府）或财星（武曲）坐镇，才能将智慧变现为稳定财富。</p>';
    }else if(mingMain.includes('太阳')||mingMain.includes('武曲')){
        analysis+='<p>命宫带阳性刚星，财帛宫为<strong>'+(caiMain||'无主星')+'</strong>——赚钱靠的是硬实力和执行力。太阳主散财也主名声变现，武曲为财星自带金钱嗅觉。三方组合若协调，事业成就与财富积累同步增长。</p>';
    }else{
        analysis+='<p>命宫主星为<strong>'+(mingMain||'无主星')+'</strong>，三方四正中财帛宫为<strong>'+(caiMain||'无主星')+'</strong>、官禄宫为<strong>'+(guanMain||'无主星')+'</strong>。三宫需互相呼应——命强财弱则怀才不遇，财强命弱则有钱但无方向，官强命弱则忙而少成。平衡方为上格。</p>';
    }
    // 分析命宫-官禄关系
    if(guanMain.includes('紫微')||guanMain.includes('天相')||guanMain.includes('天府')){
        analysis+='<p>官禄宫有<strong>'+guanMain+'</strong>加持——事业上有贵人提携，适合在体制内或大平台发展。命宫与官禄宫相呼应，事业发展顺遂，能在合适的位置上发光发热。</p>';
    }else if(guanMain.includes('七杀')||guanMain.includes('破军')||guanMain.includes('贪狼')){
        analysis+='<p>官禄宫带<strong>'+guanMain+'</strong>——事业上不走寻常路，适合创业、竞争性强或需要开拓精神的行业。杀破狼格局意味着人生必有大的转折和突破，关键在于乘风破浪、顺势而为。</p>';
    }else if(guanMain){
        analysis+='<p>官禄宫主星<strong>'+guanMain+'</strong>——事业风格与主星特质深度绑定。结合命宫主星来看，若命宫刚而官禄柔，则适合做"外刚内柔"的管理者；反之外柔内刚则适合在大机构中做核心执行者。</p>';
    }
    // 三合呼应总结
    let sameElem=0;
    if(mingMain&&caiMain){for(let k in ZW_STARS_MAP){if(ZW_STARS_MAP[k]===mingMain.replace('(帝)','')||ZW_STARS_MAP[k]===caiMain.replace('(帝)',''))sameElem++;}}
    if(mingMain&&guanMain){for(let k in ZW_STARS_MAP){if(ZW_STARS_MAP[k]===mingMain.replace('(帝)','')||ZW_STARS_MAP[k]===guanMain.replace('(帝)',''))sameElem++;}}
    analysis+='<p><em>三方平衡诀：命宫定格局，财帛定富贫，官禄定贵贱。三宫得位且互济者，一生富贵双全；一宫独强而两宫弱，则需靠后天努力来补足短板。你的命盘三方配置，建议将精力分配为——'+(mingMain?'命宫打底（自我成长占四成）、':'')+(caiMain?'财帛开路（理财能力占三成）、':'')+(guanMain?'官禄拔高（事业发展占三成）。':'')+'</em></p>';
    analysis+='</div>';

    // 命宫详细解读（老道士风格）
    if(mingStars.includes('紫微(帝)')){
        analysis+='<p><strong>【命宫解读】</strong>紫微坐命宫，帝王之格。主一生贵气凛然，有领导群伦之才能，易获得社会地位和他人拥戴。然帝王之性，自尊心极强，凡事须有主见，却也需防刚愎自用、一意孤行之弊。宜从事管理、政务、或独当一面之事业。</p>';
    }else if(mingStars.includes('天府')){
        analysis+='<p><strong>【命宫解读】</strong>天府坐命，稳重厚实之格。为人诚信可靠，善于理财和管理资源，有"库"的意象——能够积累财富和人脉。但天府之人有时过于保守求稳，错过发展良机。宜从事金融、地产、行政管理等行业。</p>';
    }else if(mingStars.includes('天机')){
        analysis+='<p><strong>【命宫解读】</strong>天机坐命，智谋善变之格。聪明伶俐，思维敏捷，善于谋划和分析。但天机星性多变，需防三心二意、举棋不定之态。宜从事策划、咨询、IT、写作等脑力劳动。</p>';
    }else if(mingStars.includes('太阳')){
        analysis+='<p><strong>【命宫解读】</strong>太阳坐命，光明磊落之格。为人热情大方，乐于助人，有奉献精神。太阳星喜在白天出生，更显其光明特质。宜从事教育、公益、外交等需要正能量的工作。</p>';
    }else if(mingStars.includes('武曲')){
        analysis+='<p><strong>【命宫解读】</strong>武曲坐命，刚毅果断之格。性格刚强，做事雷厉风行，有执行力。武曲亦为财星，理财能力较强。但过刚易折，需学会圆融处事。宜从事金融、军警、工程管理等。</p>';
    }else if(mingStars.includes('贪狼')){
        analysis+='<p><strong>【命宫解读】</strong>贪狼坐命，多才多艺之格。人缘极佳，富有魅力和交际手腕，桃花运也较旺。但需防欲望过重、贪多嚼不烂。宜从事演艺、公关、销售等需要人际魅力的行业。</p>';
    }else if(mingStars.includes('太阴')){
        analysis+='<p><strong>【命宫解读】</strong>太阴坐命，温柔细腻之格。性格温和，心思缜密，有艺术天赋和审美眼光。太阴星喜在夜晚出生，更显其柔美特质。宜从事设计、艺术、护理、服务等行业。</p>';
    }else{
        analysis+='<p><strong>【命宫解读】</strong>命宫主星配置独特，性格自成一体。命宫为人生根基，后天努力同样可以改变命运走向。建议结合实际生活中的优势和兴趣，选择适合的发展方向。</p>';
    }

    // 财帛宫分析
    if(caiStars.length>0){
        analysis+='<p><strong>【💰 财运分析】</strong>财帛宫主星为'+caiStars.join('、')+'。';
        if(caiStars.includes('武曲')){analysis+='武曲为财星坐财帛，天生与钱财有缘，理财能力出众，一生财运丰隆。建议从事与金融、金属相关行业。';}
        else if(caiStars.includes('天府')){analysis+='天府为库星坐财帛，善于积累财富，有储蓄习惯。大财需逢运来开库方显。';}
        else if(caiStars.includes('太阴')){analysis+='太阴为田宅主入财帛，可通过房产或稳定投资获利。财运细水长流型。';}
        else{analysis+='财运需结合大限流转来看，逢化禄大限易有较大进账。';}
        analysis+='</p>';
    }

    // 夫妻宫分析
    analysis+='<p><strong>【❤️ 姻缘分析】</strong>夫妻宫主星为'+gongs[2].stars.join('、')+'。';
    if(gongs[2].stars.includes('紫微(帝)')){analysis+='配偶条件优越，有领导气质，但相处需互相尊重。';}
    else if(gongs[2].stars.includes('廉贞')){analysis+='感情丰富但需防波折，廉贞亦主桃花，需用心经营。';}
    else{analysis+='感情运势与命宫主星密切相关，配偶性格可在命盘中寻得踪迹。';}
    analysis+='</p>';

    // 官禄分析
    analysis+='<p><strong>【📖 事业分析】</strong>官禄宫主星为'+guanStars.join('、')+'。';
    if(guanStars.includes('紫微(帝)')){analysis+='适合管理岗位或自主创业，有贵人扶持，事业可做大做强。';}
    else if(guanStars.includes('天相')){analysis+='适合辅助型岗位，为人处事周到，宜在大机构中发展。';}
    else{analysis+='事业发展需结合命宫和财帛宫综合判断，大限流转是关键。';}
    analysis+='</p>';

    // 四化飞星（含每颗星的详细含义）
    const SIHUA_DETAIL={
        '廉贞化禄':'廉贞为次桃花星化禄——桃花变财源，人际关系和艺术才华能直接变现。人缘财运亨通，适合从事与人打交道的行业。但也需防桃花过旺反成负累。',
        '破军化权':'破军为先锋星化权——破旧立新的行动力和决断力大增。适合开拓新市场、改革旧体制，能在混乱中建立新秩序。但需注意勿因过度强势而伤害合作关系。',
        '武曲化科':'武曲为财星化科——理财能力和专业技能获得社会认可，名声与财富同步增长。适合在金融、技术领域深耕，靠真本事扬名。',
        '太阳化忌':'太阳为光明之星化忌——阳光被遮蔽，事业上易遇阻碍或上司不赏识。需防眼疾或心血管问题。建议低调行事，在幕后积蓄力量，待云开见日。',
        '天机化禄':'天机为智谋星化禄——智慧和策划能力是财富之源，适合从事咨询、IT、写作等脑力工作。思维敏捷、点子变钱，但需防思虑过多导致行动迟缓。',
        '天梁化权':'天梁为荫星化权——长辈缘和贵人运转化为实际权力。适合在公益、医疗、教育领域担任管理岗位，以德服人、以善聚众。',
        '紫微化科':'紫微为帝星化科——领导能力和个人魅力获得广泛认可，名声在外。适合担任公众人物或企业领袖，但需谦虚自持以免高处不胜寒。',
        '太阴化忌':'太阴为母星化忌——情绪易陷入低谷，需注意心理健康和女性亲属的健康。感情上易有暗伤和误解，建议坦诚沟通、不积压情绪。',
        '天同化禄':'天同为福星化禄——福气和享受直接带来财富，生活品质和财运同步提升。适合餐饮、旅游、休闲产业。知足常乐，财来自有方。',
        '文昌化科':'文昌为文星化科——学业和文采获得社会认可，考试运佳、文章出众。适合学术、出版、传媒行业，靠知识和才华赢得尊重。',
        '廉贞化忌':'廉贞化忌——桃花变劫，情感纠葛易成困扰。需防因情破财或因人际纠纷影响事业。收敛锋芒、洁身自好是化解之道。',
        '太阴化禄':'太阴为田宅主化禄——房产运和家庭财运亨通，适合投资不动产。女性贵人和母亲缘分深厚，温柔细腻的性格带来财富机会。',
        '天同化权':'天同为福星化权——在轻松愉快的氛围中获得掌控力。适合创意产业或团队管理，不靠威严而靠魅力服人。',
        '天机化科':'天机为智星化科——智慧才华获得社会认可，学术和技术成就突出。适合做行业专家或技术权威，名声来自真才实学。',
        '巨门化忌':'巨门为暗星化忌——口舌是非和暗中阻力增多。需防小人暗算和言语误会，建议谨言慎行、不参与是非。消化系统也需注意保养。',
        '贪狼化禄':'贪狼为桃花星化禄——人缘、桃花、才艺全面开花。社交能力是最大财富来源，适合演艺、公关、销售。但需节制欲望，好运也怕贪多嚼不烂。',
        '太阴化权':'太阴化权——以柔克刚的管理风格，不怒自威。适合女性领导或需要细腻手腕的管理岗位。家庭和事业的平衡能力出众。',
        '右弼化科':'右弼为助星化科——辅助他人的能力获得认可，做幕后英雄也能扬名。适合做二把手或核心幕僚，靠忠诚和能力赢得信任。',
        '天机化忌':'天机化忌——思维易陷入混乱和犹豫不决。决策时容易瞻前顾后、错失良机。建议多做减法、简化选择，神经系统也需注意保养。',
        '武曲化禄':'武曲为财星化禄——金钱运势极佳，理财能力和执行力带来丰厚回报。适合金融、金属、机械行业。但需防为钱伤情，财聚人散。',
        '贪狼化权':'贪狼化权——交际手腕和掌控力结合，在社交圈中拥有话语权。适合做团队领袖或社群运营者，魅力与权威并存。',
        '天梁化科':'天梁为荫星化科——善举和品德获得社会赞誉。适合公益事业和教育工作，德高望重的形象自然形成。',
        '文曲化忌':'文曲为才艺星化忌——才艺发挥受阻或作品不被理解，易有怀才不遇之感。口舌表达也需注意分寸。建议沉下心打磨技艺，金子总会发光。',
        '太阳化禄':'太阳为光明之星化禄——名声和人脉直接转化为财富，曝光度越高财运越旺。适合做公众人物或品牌代言人。慷慨大方，财散人聚。',
        '武曲化权':'武曲化权——执行力和决断力达到顶峰，适合带领团队攻坚克难。金融和工程领域的管理者之位手到擒来。',
        '天同化忌':'天同为福星化忌——福气暂时退隐，容易感到不满足和空虚。需注意情绪管理和心理健康，勿过度追求享乐而忽略了内心的真正需求。',
        '巨门化禄':'巨门为暗星化禄——暗中智慧和不为人知的才能带来财富。适合研究、幕后策划、知识产权相关行业。寡言多思者能闷声发财。',
        '太阳化权':'太阳化权——领导力和公众影响力大增，适合从政或担任企业高管。光明正大的管理风格，以德服人、以理服众。',
        '文曲化科':'文曲为才艺星化科——才艺和表达能力获得社会认可，适合艺术、演艺、写作。口才和文采是你的金字招牌。',
        '文昌化忌':'文昌为文星化忌——学业或文书方面容易出错和受阻。考试运欠佳，合同和文件需仔细核对。建议踏踏实实读书做事，不投机取巧。',
        '天梁化禄':'天梁为荫星化禄——长辈提携和福报转化为实际财富。适合医疗、养老、教育行业。善有善报，助人即是助己。',
        '紫微化权':'紫微化权——帝王之星的掌控力全面激活。适合担任一把手或自己创业当老板。权威和魄力达到人生峰值，但需宽严并济、恩威兼施。',
        '左辅化科':'左辅为助星化科——辅助和协调能力获得认可。适合做首席运营官或项目协调人，靠高效执行和组织能力赢得口碑。',
        '武曲化忌':'武曲为财星化忌——财运受阻，金钱方面易有困扰和损失。投资需格外谨慎，不宜借贷担保。但困境也是历练，熬过低谷后理财能力会更强。',
        '破军化禄':'破军为先锋星化禄——破旧立新的行动力带来财富。适合创业和开拓新市场，越是别人不敢碰的领域越有机会。胆大心细者能成大事。',
        '巨门化权':'巨门化权——暗中策谋和战略规划的能力大增。适合做幕后推手或策略顾问，不求表面风光但求实际掌控。',
        '贪狼化忌':'贪狼化忌——欲望和现实脱节，易有求而不得之苦。感情和物质两方面都需降低期望值。学会知足，贪狼化忌其实是教人"取舍"的智慧。'
    };
    // 身宫
    let hbSH=getHourBranch(hh);
    let shenGongIdx=(m+1+hbSH)%12; // 身宫：寅起正月→顺数月→顺数时（非逆数）
    let shenGongName='';
    for(let i=0;i<12;i++){
        if(gongs[i].idx===shenGongIdx){shenGongName=ZW_GONG[i];break;}
    }
    if(shenGongName){
        analysis+='<p><strong>【身宫】</strong>身宫落在<strong>'+shenGongName+'</strong>，此宫为后天运势之根基，三十岁后影响渐显，是成年后人格定型和人生重心的关键。</p>';
        // 身宫具体建议
        let shenAdvice='';
        if(shenGongName==='命宫')shenAdvice='身命同宫——表里如一，自我认知清晰，三十岁后性情与天赋趋于稳定。建议：深耕自己的核心优势，不随波逐流。你的人生主线明确，适合走"专精"路线而非"博而不精"。保持初心，方得始终。';
        else if(shenGongName==='财帛')shenAdvice='身宫落财帛——成年后以财富积累为人生重心，经济独立和财务自由是你安全感的核心来源。建议：三十岁前多学理财技能，三十岁后财富自然汇聚。但勿让金钱定义你全部的价值，财富是工具而非目的。';
        else if(shenGongName==='夫妻')shenAdvice='身宫落夫妻——婚姻和伴侣关系在你的后半生占据极其重要的位置。三十岁后择偶标准趋于成熟，建议不急于早婚。身宫在此，配偶对你的运势影响极大——选对人如虎添翼，选错则身心俱疲。';
        else if(shenGongName==='子女')shenAdvice='身宫落子女——子女和下一代是你后半生的重心，也是幸福感和成就感的重大来源。三十岁后对家庭和亲子关系的投入会显著增加。建议：在生育前后做好人生规划，子女运旺但勿过度牺牲自我。';
        else if(shenGongName==='官禄')shenAdvice='身宫落官禄——事业成就是你后半生最核心的追求，职场和社会地位对你的自我认同至关重要。建议：三十岁是职业黄金期的起点，勇敢抓住机遇，不怕换跑道。身宫在官禄者，中年是巅峰期的开始。';
        else if(shenGongName==='疾厄')shenAdvice='身宫落疾厄——健康是你后半生最需要关注的课题。建议：三十岁起建立规律的运动和体检习惯，将健康管理纳入日常。身心一体，心理健康同样重要。身宫在此并非坏事——它让你更早觉醒对身体的觉察。';
        else if(shenGongName==='迁移')shenAdvice='身宫落迁移——三十岁后运势与"走出去"密切相关。无论是异地发展、出国深造还是跨界发展，动则生机。建议：不要安于现状，外面的世界有更大的舞台。身宫在迁移者，人生后半程往往比前半程精彩数倍。';
        else if(shenGongName==='交友')shenAdvice='身宫落交友——后半生的人脉圈层决定你的高度。建议：三十岁后注重社交质量和合作关系的筛选，宁缺毋滥。好的合作伙伴和下属是你成功的关键助力，但要防"成也萧何败也萧何"。';
        else if(shenGongName==='田宅')shenAdvice='身宫落田宅——家庭和房产是你后半生的稳定根基。建议：尽早规划置业或改善居住环境，稳定的居所能带给你最大的内心安宁。身宫在此也意味着晚年乐于居家，享受天伦之乐。';
        else if(shenGongName==='福德')shenAdvice='身宫落福德——后半生的幸福在于精神世界的富足。三十岁后人生重心从外在成就转向内心平静。建议：培养一个能滋养灵魂的爱好，学会与自己和解。你晚年的福气来自内心的从容，而非外在的繁华。';
        else if(shenGongName==='父母')shenAdvice='身宫落父母——长辈和原生家庭对你的后半生影响深远。建议：与父母或长辈关系是你人生的重要支撑，主动修复和经营这些关系。身宫在此也意味着你从长辈处获得的智慧和资源不可忽视。';
        else shenAdvice='身宫在此，三十岁后需结合宫位主星和四化来具体判断后天运势走向。';
        analysis+='<p style="margin:6px 0;font-size:11px;line-height:1.8;color:#bbb;"><strong>💡 身宫建议：</strong>'+shenAdvice+'</p>';
    }

    // 保持原SIHUA映射用于查找
    const SIHUA={
        0:{lu:'廉贞化禄',quan:'破军化权',ke:'武曲化科',ji:'太阳化忌'},
        1:{lu:'天机化禄',quan:'天梁化权',ke:'紫微化科',ji:'太阴化忌'},
        2:{lu:'天同化禄',quan:'天机化权',ke:'文昌化科',ji:'廉贞化忌'},
        3:{lu:'太阴化禄',quan:'天同化权',ke:'天机化科',ji:'巨门化忌'},
        4:{lu:'贪狼化禄',quan:'太阴化权',ke:'右弼化科',ji:'天机化忌'},
        5:{lu:'武曲化禄',quan:'贪狼化权',ke:'天梁化科',ji:'文曲化忌'},
        6:{lu:'太阳化禄',quan:'武曲化权',ke:'太阴化科',ji:'天同化忌'},
        7:{lu:'巨门化禄',quan:'太阳化权',ke:'文曲化科',ji:'文昌化忌'},
        8:{lu:'天梁化禄',quan:'紫微化权',ke:'左辅化科',ji:'武曲化忌'},
        9:{lu:'破军化禄',quan:'巨门化权',ke:'太阴化科',ji:'贪狼化忌'}
    };
    let si=SIHUA[yGZ.s]; // 四化以年干为准
    if(si){
        analysis+='<p><strong>【四化飞星】</strong>生年天干为<strong>'+S[yGZ.s]+'</strong>，四化星曜如下：</p>';
        analysis+='<div style="margin:6px 0;font-size:11px;line-height:1.8;">';
        let luDetail=SIHUA_DETAIL[si.lu]||'';
        let quanDetail=SIHUA_DETAIL[si.quan]||'';
        let keDetail=SIHUA_DETAIL[si.ke]||'';
        let jiDetail=SIHUA_DETAIL[si.ji]||'';
        analysis+='<p><span style="color:#8bc34a;">🟢 <strong>化禄：'+si.lu+'</strong></span><br>'+luDetail+'</p>';
        analysis+='<p><span style="color:#ff9800;">🔵 <strong>化权：'+si.quan+'</strong></span><br>'+quanDetail+'</p>';
        analysis+='<p><span style="color:#4fc3f7;">🟣 <strong>化科：'+si.ke+'</strong></span><br>'+keDetail+'</p>';
        analysis+='<p><span style="color:#ef5350;">🔴 <strong>化忌：'+si.ji+'</strong></span><br>'+jiDetail+'</p>';
        analysis+='</div>';
    }

    // ── 特殊格局自动识别 ──
    let geJu=[];
    let hasStar=(n,g)=>g.stars.some(s=>s.startsWith(n));
    let hasAnyStar=(ns,g)=>ns.some(n=>g.stars.some(s=>s.startsWith(n)));
    let starInGong=(n,gi)=>gongs[gi]&&gongs[gi].stars.some(s=>s.startsWith(n));
    // 紫微相关格局
    if(hasStar('紫微',gongs[0])&&hasStar('天府',gongs[0]))geJu.push({n:'紫府同宫格',d:'紫微天府同守命宫——帝王与财库合一。既有领导力又有理财能力，天生贵气藏身。但双星同宫也意味着责任重大——你必须对得起这份天赋。',a:'💡 行动指南：选择能同时发挥管理才能和财务头脑的赛道（如企业高管、投资管理）。切忌"小事亲为"——你的天赋在战略层而非执行层，学会授权是成败关键。'});
    if(hasStar('紫微',gongs[0])&&mingPos===6)geJu.push({n:'紫微朝垣格',d:'紫微坐午宫——午为"日丽中天"之位，如帝王坐明堂。自带威严和号召力，走到哪里都是焦点。',a:'💡 行动指南：你适合需要"威望"的岗位（高管、创始人、公众人物）。成功的关键不是更努力而是更有格局——站得高自然看得远。谦逊是帝星最好的伙伴。'});
    // 太阳太阴
    if(hasStar('太阳',gongs[0])&&mingPos===3)geJu.push({n:'日照雷门格',d:'太阳在卯宫——卯为日出之门，如旭日东升。光明磊落、热情主动，早年即有不错表现。',a:'💡 行动指南：你的魅力就是武器——适合教育、公益、外交等需要感染力的行业。但光芒太强时也记得给别人留阴影。'});
    if(hasStar('太阴',gongs[0])&&mingPos===11)geJu.push({n:'月朗天门格',d:'太阴在亥宫——亥为天门，太阴如皓月当空。温柔细腻但内心清醒，审美一流、直觉精准。',a:'💡 行动指南：你的天赋在"感受"而非"表达"——艺术、设计、心理、文化行业是你的主场。相信直觉，它比理性分析更准。'});
    // 贪狼
    if(hasStar('贪狼',gongs[0])&&mingPos===2)geJu.push({n:'雄宿乾元格',d:'贪狼在寅宫——欲望被正向引导为进取心和创造力。多才多艺且执行力强。',a:'💡 行动指南：选择能释放你表现欲的赛道（演艺、销售、创业）。关键是"聚焦"——贪狼最怕什么都想要。选一件事做到极致，人生自然开花。'});
    // 机月同梁
    if(hasAnyStar(['天机','太阴','天同','天梁'],gongs[0])&&(hasStar('天机',gongs[0])?1:0)+(hasStar('太阴',gongs[0])?1:0)+(hasStar('天同',gongs[0])?1:0)+(hasStar('天梁',gongs[0])?1:0)>=2)geJu.push({n:'机月同梁格',d:'天机太阴天同天梁汇聚——典型的"幕后军师"。擅长策划、分析、协调。',a:'💡 行动指南：你的优势在幕后——咨询、策划、研究、幕僚是最佳赛道。不要在"冲锋陷阵"上和别人比，你的价值在于"让别人冲得更准"。'});
    // 杀破狼
    let spStars=['七杀','破军','贪狼'];
    if(hasAnyStar(spStars,gongs[0])&&(hasStar('七杀',gongs[0])?1:0)+(hasStar('破军',gongs[0])?1:0)+(hasStar('贪狼',gongs[0])?1:0)>=1)geJu.push({n:'杀破狼格',d:'七杀、破军、贪狼入命——你的人生注定不平凡，要么大起大落要么一飞冲天。',a:'💡 行动指南：高风险高回报赛道（创业、军警、竞技）。但最关键的能力不是"冲"而是"停"——学会在关键时刻踩刹车，冲动是你最大的敌人也是最大的资产。'});
    // 府相朝垣
    if(hasStar('天府',gongs[0])&&hasStar('天相',gongs[0]))geJu.push({n:'府相朝垣格',d:'天府天相同守命宫——稳重与和谐兼备，是任何组织都欢迎的"靠谱担当"。',a:'💡 行动指南：体制内或大企业是你的最佳舞台。不需要冒险创业，在稳定架构中发挥管理才能，你的价值会随时间增长而非衰减。'});
    // 文星拱命
    if((hasStar('文昌',gongs[0])||hasStar('文曲',gongs[0]))&&(hasStar('文昌',gongs[0])?1:0)+(hasStar('文曲',gongs[0])?1:0)==2)geJu.push({n:'文桂文华格',d:'文昌文曲双星汇聚——天生的学者或艺术家。',a:'💡 行动指南：学术、写作、教育是你的一亩三分地。知识是最强武器——持续输入、系统输出，你输出的每篇文字都在为未来铺路。'});
    // 禄马交驰
    if(hasStar('禄存',gongs[0])&&hasStar('天马',gongs[0]))geJu.push({n:'禄马交驰格',d:'禄存天马同守命宫——财富与奔波同步，越动越有钱。',a:'💡 行动指南：贸易、物流、销售等流动性强的行业最适合你。但要学会理财——赚得快也花得快，每月强制储蓄是对自己最好的保护。'});
    // 日月并明
    if((hasStar('太阳',gongs[0])&&hasStar('太阴',gongs[0])))geJu.push({n:'日月并明格',d:'太阳太阴同守命宫——阴阳调和，刚柔并济。',a:'💡 行动指南：你天生是协调者——适合需要平衡多方利益的岗位（项目经理、外交、公关）。白天冲晚上思，记住：两种模式你都需要，不要只活在一种状态里。'});
    if(geJu.length>0){
        analysis+='<p><strong>【🏆 特殊格局】</strong></p><div style="margin:6px 0;">';
        geJu.forEach(g=>{analysis+='<div style="margin:6px 0;padding:10px 12px;background:linear-gradient(135deg,rgba(212,132,122,0.08),rgba(232,163,154,0.04));border-radius:8px;border-left:3px solid var(--accent);"><div style="font-weight:700;color:var(--accent);margin-bottom:4px;">'+g.n+'</div><div style="font-size:11px;line-height:1.8;">'+g.d+'</div>'+(g.a?'<div style="font-size:10px;color:#b8a49e;margin-top:4px;">'+g.a+'</div>':'')+'</div>';});
        analysis+='</div>';
    }

    // ── 每宫吉煞分布 ──
    analysis+='<p><strong>【📊 十二宫吉煞评等】</strong></p><div style="margin:6px 0;font-size:11px;line-height:1.8;">';
    gongs.forEach((g,i)=>{
        let jiCount=g.stars.filter(s=>s.includes(':吉')||s.includes('(帝)')).length;
        let shaCount=g.stars.filter(s=>s.includes(':煞')||s.includes('⚠')).length;
        let level=jiCount>shaCount+2?'⭐上吉':jiCount>shaCount?'👍中平':shaCount>jiCount+2?'⚡多舛':'➖一般';
        let mainStar=g.stars.filter(s=>!s.includes(':')).join('、')||'无主星';
        analysis+='<p>'+g.name+'：'+mainStar+' — '+level+'（吉'+jiCount+'/煞'+shaCount+'）</p>';
    });
    let maxJiGong=gongs.reduce((a,b)=>(b.stars.filter(s=>s.includes(':吉')||s.includes('(帝)')).length>a.stars.filter(s=>s.includes(':吉')||s.includes('(帝)')).length?b:a),gongs[0]);
    let maxShaGong=gongs.reduce((a,b)=>(b.stars.filter(s=>s.includes(':煞')).length>a.stars.filter(s=>s.includes(':煞')).length?a:b),gongs[0]);
    let jiCount=maxJiGong.stars.filter(s=>s.includes(':吉')||s.includes('(帝)')).length;
    let shaCount=maxShaGong.stars.filter(s=>s.includes(':煞')).length;
    if(jiCount>1)analysis+='<p><strong>🌟 最强吉宫：'+maxJiGong.name+'</strong>——吉星汇聚，此领域是你的先天优势所在，事半功倍。建议将人生重心向此方向倾斜。</p>';
    if(shaCount>1)analysis+='<p><strong>⚡ 需注意宫位：'+maxShaGong.name+'</strong>——煞星偏重，此领域需后天多花心思经营。煞星不全是坏事，重在"化解"而非"逃避"。</p>';
    analysis+='</div>';

    analysis+='<p style="margin-top:10px;">命盘吉凶需结合三方四正、四化、辅星煞星综合判断。命宫为根，身宫为果，大限流转方见人生起伏。以上皆为命理参考，后天努力与选择才是改变命运的关键。</p>';

    document.getElementById('zwAnalysis').innerHTML=analysis;
    document.getElementById('zwResult').style.display='block';
    document.getElementById('zwResult').scrollIntoView({behavior:'smooth'});
}

// ==================== 周易易经卦象对照 ====================
function getZhouyiHexagram(stemIdx, branchIdx){
    // 60甲子对应64卦（按纳甲卦序映射）
    const zhous={
        0:{name:'䷀ 乾为天',guaCi:'元亨利贞。自强不息，潜龙勿用。',yaoCi:'初九：潜龙勿用。今日宜积蓄力量，勿急于表现。'},
        1:{name:'䷫ 天风姤',guaCi:'女壮勿取。遇合之事需谨慎。',yaoCi:'初六：系于金柅，贞吉。今日宜守规矩，不宜冒进。'},
        2:{name:'䷠ 天山遁',guaCi:'遁亨小利贞。退避有时是以退为进。',yaoCi:'初六：遁尾厉。今日急流勇退方为上策。'},
        3:{name:'䷋ 天地否',guaCi:'否之匪人不利君子贞。闭塞之时宜守。',yaoCi:'初六：拔茅茹以其汇。今日团队协作胜过独自行动。'},
        4:{name:'䷓ 风地观',guaCi:'盥而不荐有孚颙若。观察入微审时度势。',yaoCi:'初六：童观小人无咎君子吝。今日眼光需放长远。'},
        5:{name:'䷖ 山地剥',guaCi:'不利有攸往。层层剥落宜退守。',yaoCi:'初六：剥床以足。今日根基不稳不宜大动作。'},
        6:{name:'䷢ 火地晋',guaCi:'康侯用锡马蕃庶昼日三接。晋升有路但需努力。',yaoCi:'初六：晋如摧如贞吉。今日进展虽缓但方向正确。'},
        7:{name:'䷍ 火天大有',guaCi:'元亨。大有收获富足昌盛。',yaoCi:'初九：无交害匪咎。今日收获在望保持谦逊。'},
        8:{name:'䷲ 震为雷',guaCi:'震来虩虩笑言哑哑。居安思危临危不乱。',yaoCi:'初九：震来虩虩后笑言哑哑吉。今日先难后易。'},
        9:{name:'䷏ 雷地豫',guaCi:'利建侯行师。悦乐安逸凡事豫则立。',yaoCi:'初六：鸣豫凶。今日不宜得意忘形。'},
        10:{name:'䷧ 雷水解',guaCi:'利西南无所往其来复吉。解除困难宽恕为怀。',yaoCi:'初六：无咎。今日困境可解。'},
        11:{name:'䷟ 雷风恒',guaCi:'亨无咎利贞利有攸往。恒久之道守正不移。',yaoCi:'初六：浚恒贞凶。今日勿操之过急。'},
        12:{name:'䷭ 地风升',guaCi:'元亨用见大人。步步高升需循序渐进。',yaoCi:'初六：允升大吉。今日稳扎稳打得以上升。'},
        13:{name:'䷯ 水风井',guaCi:'改邑不改井。井养不穷宜修德养民。',yaoCi:'初六：井泥不食。今日自身修养为先。'},
        14:{name:'䷛ 泽风大过',guaCi:'栋桡利有攸往亨。过犹不及宜适可而止。',yaoCi:'初六：藉用白茅无咎。今日谦谨为佳。'},
        15:{name:'䷐ 泽雷随',guaCi:'元亨利贞无咎。随时而动顺应变化。',yaoCi:'初九：官有渝贞吉。今日顺势而为方能成事。'}
    };
    let gzIdx = (stemIdx%10)*6 + (branchIdx%12)*5;
    let hexIdx = Math.floor((gzIdx%60)/4);
    return zhous[hexIdx]||{name:'䷀ 乾为天',guaCi:'天行健，君子以自强不息。',yaoCi:'今日宜保持中正平和之心，顺其自然。'};
}

function initZiweiSelects(){
    let ys=document.getElementById('zwYear');for(let i=2100;i>=1900;i--)ys.innerHTML+='<option value="'+i+'"'+(i===2000?' selected':'')+'>'+i+'年</option>';
    let ms=document.getElementById('zwMonth');for(let i=1;i<=12;i++)ms.innerHTML+='<option value="'+i+'"'+(i===1?' selected':'')+'>'+i+'月</option>';
    let ds=document.getElementById('zwDay');for(let i=1;i<=31;i++)ds.innerHTML+='<option value="'+i+'"'+(i===1?' selected':'')+'>'+i+'日</option>';
    let zs=document.getElementById('zwMin');for(let i=0;i<60;i++)zs.innerHTML+='<option value="'+i+'"'+(i===0?' selected':'')+'>'+String(i).padStart(2,'0')+'分</option>';
}

// ==================== 十神格局解析 ====================
function analyzeShiShenGeJu(dGZ,ps){
    let ssCount={};ps.forEach(p=>{let s=getShiShen(dGZ.s,p.s);ssCount[s]=(ssCount[s]||0)+1;});
    let names=['正官','七杀','正财','偏财','食神','伤官','正印','偏印','比肩','劫财'];
    let total=0;names.forEach(n=>total+=ssCount[n]||0);
    if(total===0)return '<p>无十神数据。</p>';

    // 分布表
    let html='<p style="color:var(--accent);font-weight:700;margin-bottom:8px;">📋 十神分布统计（四柱天干）</p>';
    html+='<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;">';
    names.forEach(n=>{
        let c=ssCount[n]||0;
        let barW=c>0?Math.max(10,c*22):4;
        html+='<div style="flex:1;min-width:80px;text-align:center;padding:6px 4px;background:#faf5f0;border-radius:8px;">';
        html+='<div style="font-size:10px;color:#888;">'+n+'</div>';
        html+='<div style="font-size:18px;font-weight:700;color:'+(c>0?'var(--accent)':'#ccc')+';">'+c+'</div>';
        html+='<div style="height:4px;background:#eee;border-radius:2px;margin-top:2px;"><div style="height:100%;width:'+barW+'px;background:var(--accent2);border-radius:2px;"></div></div>';
        html+='</div>';
    });
    html+='</div>';

    // 格局判断
    let hasGuan=(ssCount['正官']||0)+(ssCount['七杀']||0);
    let hasCai=(ssCount['正财']||0)+(ssCount['偏财']||0);
    let hasShiShang=(ssCount['食神']||0)+(ssCount['伤官']||0);
    let hasYin=(ssCount['正印']||0)+(ssCount['偏印']||0);
    let hasBiJie=(ssCount['比肩']||0)+(ssCount['劫财']||0);
    let hasShi=(ssCount['食神']||0)>0;
    let hasSha=(ssCount['七杀']||0)>0;
    let hasShang=(ssCount['伤官']||0)>0;
    let hasZhengGuan=(ssCount['正官']||0)>0;
    let hasZhengYin=(ssCount['正印']||0)>0;

    html+='<p style="color:var(--accent);font-weight:700;margin-bottom:6px;">🏷 格局判别</p>';
    let patterns=[];

    if(hasShiShang>=2&&hasCai>=2)
        patterns.push({name:'食伤生财格',desc:'食神伤官生财星——你的才华能直接转化为财富。这是命理中最经典的"靠本事吃饭"格局。你天生有将创意、技能、表达变现的能力，适合自由职业、艺术创作、技术研发等能将个人才华放大的赛道。'});
    else if(hasShiShang>=1&&hasCai>=1)
        patterns.push({name:'食伤生财（弱）',desc:'食伤和财星同现——有将才华变现的潜力，但力量尚需加强。建议深耕一项核心技能，专注打磨到行业前20%，财路自然通畅。'});

    if(hasGuan>=2&&hasYin>=2)
        patterns.push({name:'官印相生格',desc:'正官/七杀与正印/偏印双双有力——这是命理中的上等格局。官星给你规矩和事业心，印星给你学识和贵人。做事有理有据、有后台有资源，适合体制内、大平台管理、学术研究等需要"底蕴+规则"的领域。'});
    else if(hasGuan>=1&&hasYin>=1)
        patterns.push({name:'官印相生（弱）',desc:'官星与印星同现——有规矩也有学识，但火候尚浅。适合在稳定环境中逐步积累资历和话语权。'});

    if(hasCai>=2&&hasGuan>=2)
        patterns.push({name:'财官双美格',desc:'财星和官星双双旺盛——既有赚钱的能力又有管理的天赋，是"能赚钱也能管钱"的实干家。事业财运双轨并行，适合企业高管、自主创业等需要同时驾驭资源和人的位置。'});
    else if(hasCai>=1&&hasGuan>=1)
        patterns.push({name:'财官双美（弱）',desc:'财星与官星同现——财运和事业运皆有基础。建议选择一个能将两者结合的职业方向，稳步积累。'});

    if(hasShi&&hasSha)
        patterns.push({name:'食神制杀格',desc:'食神制七杀——以柔克刚的经典组合。七杀的攻击性和食神的智慧形成完美制衡。你天生有化解危机、处理复杂局面的能力，在职场上属于"救火队长"型人才——越乱的局面你越能展现价值。'});

    if(hasShang&&hasYin)
        patterns.push({name:'伤官配印格',desc:'伤官的才华锋芒配上印星的学识内涵——这是"天才+修养"的罕见组合。你的才华不是野路子的蛮力，而是有底蕴、有章法的精准输出。适合学术研究、高端创意、战略咨询等需要"深度思考+精准表达"的领域。'});

    if(hasBiJie>=2&&hasCai>=1)
        patterns.push({name:'比劫夺财格',desc:'比肩/劫财与财星相遇——朋友和社交是你的财富来源也是耗财通道。你的人脉就是钱脉，但合伙、借贷、担保需格外谨慎。建议：赚钱靠人脉，管钱靠自己，留足"防火墙"。'});

    if(hasZhengGuan&&hasZhengYin&&hasCai>=1)
        patterns.push({name:'官印财全格',desc:'正官+正印+财星三全——命中三大吉神齐聚，是难得的富贵双全之局。事业（官）、学识（印）、财富（财）三驾马车并驱，一生只需顺应运势节奏即可。'});

    if(patterns.length===0){
        // 单十神主导判断
        let maxSs='',maxN=0;
        names.forEach(n=>{let c=ssCount[n]||0;if(c>maxN){maxN=c;maxSs=n;}});
        if(maxN>=3)patterns.push({name:maxSs+'主导格',desc:'命局以<strong>'+maxSs+'</strong>为主导力量（出现'+maxN+'次）。四柱十神较为单一，格局纯粹。建议围绕'+maxSs+'的特质来规划人生方向，发挥单一十神的极致优势。'});
        else if(maxN>=1)patterns.push({name:'十神均衡格',desc:'十神分布较为均衡，没有哪一种力量压倒一切。这种人适应性最强，什么环境都能活，什么角色都能演。缺点是没有特别突出的天赋赛道——需要后天主动选择和深耕。'});
        else patterns.push({name:'格局待明',desc:'命局十神力量尚不显，需结合大运流年来观察格局走向。格局成于大运者，后发制人。'});
    }

    patterns.forEach(p=>{
        html+='<div style="margin:8px 0;padding:8px 12px;background:#fdf8f5;border-radius:8px;border-left:3px solid var(--accent);">';
        html+='<div style="font-weight:700;color:var(--accent);margin-bottom:4px;">'+p.name+'</div>';
        html+='<div style="font-size:11px;line-height:1.7;color:var(--text);">'+p.desc+'</div>';
        html+='</div>';
    });

    // 补充：官杀混杂提示
    if((ssCount['正官']||0)>=1&&(ssCount['七杀']||0)>=1){
        html+='<p style="font-size:10px;color:#b8a49e;margin-top:6px;">⚠ 命带官杀混杂：正官与七杀并存，事业和感情上易在"稳定"与"突破"间摇摆。建议选定一条主赛道后不再回头。</p>';
    }

    html+='<p style="font-size:10px;color:#b8a49e;margin-top:4px;">格局为四柱天干十神的组合判断。完整格局需结合地支藏干、大运流年综合考量，以上为天干层面的初步解析。</p>';
    return html;
}

// ==================== 五行流通分析 ====================
function analyzeWuxingFlow(wc,gys){
    let wx=['木','火','土','金','水'];
    let sheng={木:'火',火:'土',土:'金',金:'水',水:'木'}; // 相生
    let ke={木:'土',火:'金',土:'水',金:'木',水:'火'};    // 相克
    let beiKe={木:'金',火:'水',土:'木',金:'火',水:'土'}; // 被克

    let html='';

    // 1. 五行生克链条
    html+='<p style="color:var(--accent);font-weight:700;margin-bottom:6px;">🔄 五行生克关系链</p>';
    let chains=[];
    wx.forEach(w=>{
        let child=sheng[w];
        let c1=wc[w]||0,c2=wc[child]||0;
        if(c1>0&&c2>0)
            chains.push('<span style="color:var(--'+w+');">'+w+'</span> → <span style="color:var(--'+child+');">'+child+'</span>（'+w+'生'+child+'，流通顺畅 ✓）');
        else if(c1>0&&c2===0)
            chains.push('<span style="color:var(--'+w+');">'+w+'</span> → ❌ <span style="color:#ccc;">'+child+'（缺）</span>（'+w+'生'+child+'受阻 ⚡）');
    });
    html+='<p style="font-size:11px;line-height:1.8;">'+chains.join('<br>')+'</p>';

    // 2. 克的关系
    html+='<p style="color:var(--accent);font-weight:700;margin:10px 0 6px;">⚔ 制约关系</p>';
    let keChains=[];
    wx.forEach(w=>{
        let target=ke[w];
        let c1=wc[w]||0,c2=wc[target]||0;
        if(c1>0&&c2>0){
            if(c1>c2*2)
                keChains.push('<span style="color:var(--'+w+');">'+w+'</span> <strong>过克</strong> <span style="color:var(--'+target+');">'+target+'</span>（'+w+'('+c1+') ≫ '+target+'('+c2+')，'+target+'受损 ⚠）');
            else
                keChains.push('<span style="color:var(--'+w+');">'+w+'</span> 克 <span style="color:var(--'+target+');">'+target+'</span>（正常制约）');
        }
    });
    html+='<p style="font-size:11px;line-height:1.8;">'+(keChains.length>0?keChains.join('<br>'):'五行制约关系较为均衡。')+'</p>';

    // 3. 流通顺畅度判断
    html+='<p style="color:var(--accent);font-weight:700;margin:10px 0 6px;">🌡 流通诊断</p>';
    let missing=wx.filter(w=>(wc[w]||0)===0);
    let weak=wx.filter(w=>(wc[w]||0)>0&&(wc[w]||0)<=1);
    let strong=wx.filter(w=>(wc[w]||0)>=4);
    let ysSet=new Set(gys.ys||[]);
    let jsSet=new Set(gys.js||[]);

    let diag=[];
    if(missing.length===0)diag.push('✅ 五行齐全——你的八字五行完整，天生具备较好的适应能力和抗风险能力。五行俱全之人一生起伏相对平缓，是很多人羡慕的"命好"配置。');
    else if(missing.length===1)diag.push('⚡ 五行缺<strong>'+missing[0]+'</strong>——'+missing[0]+'所代表的器官、方位、六亲在你的命局中偏弱。可在生活中通过颜色（'+(missing[0]==='木'?'绿色':missing[0]==='火'?'红色':missing[0]==='土'?'黄色':missing[0]==='金'?'白色':'黑色')+'）、饰品、方位来补充。');
    else diag.push('⚠ 五行缺<strong>'+missing.join('、')+'</strong>——缺失较多，命局偏向明显。这让你在某个领域天赋突出，但也意味着需要在其他方面有意识补足。缺什么补什么：颜色、方位、职业选择均可调节。');

    if(weak.length>0)diag.push('💧 偏弱五行：<strong>'+weak.join('、')+'</strong>——这些五行力量不足，对应的脏腑、季节、人际关系需要多加关注。');
    if(strong.length>0)diag.push('🔥 偏旺五行：<strong>'+strong.join('、')+'</strong>——过犹不及，旺的五行需要适当疏导而非继续补充。');

    // 流通顺畅度
    let flowScore=0;
    wx.forEach(w=>{let c=wc[w]||0;if(c>0)flowScore++;});
    if(missing.length===0)flowScore+=2;
    if(strong.length<=1)flowScore+=1;
    let flowLevel=flowScore>=7?'非常顺畅':flowScore>=5?'基本顺畅':flowScore>=3?'部分阻滞':'严重阻塞';
    diag.push('📊 五行流通度：<strong>'+flowLevel+'</strong>（'+(flowScore>=7?'五行齐全且均衡，气场流通无碍。':flowScore>=5?'大部分五行能正常流转，个别环节需外力助推。':flowScore>=3?'存在明显阻滞，需有意识调节。':'五行严重失衡，建议从用神入手逐步调和。')+'）');

    html+='<p style="font-size:11px;line-height:1.8;">'+diag.join('<br>')+'</p>';

    // 4. 平衡建议
    html+='<p style="color:var(--accent);font-weight:700;margin:10px 0 6px;">💡 五行平衡建议</p>';
    let advice=[];
    if(missing.length>0){
        let m=missing[0];
        let bu={木:'多穿戴绿色衣物/木质饰品，家中养绿色植物。早餐多吃蔬菜水果。',火:'多穿戴红色/粉色，佩戴水晶手链。多做有氧运动提升阳气。',土:'多穿戴黄色/米色，佩戴黄水晶或玉器。稳定作息，脚踏实地。',金:'多穿戴白色/银色，佩戴金属饰品。练习深呼吸，增强肺气。',水:'多穿戴黑色/蓝色，佩戴黑曜石。多喝水，靠近水边散步。'};
        advice.push('补<strong>'+missing.join('、')+'</strong>：'+(bu[m]||'五行缺失需综合调理。'));
    }
    if(strong.length>0){
        let s=strong[0];
        let xie={木:'用火（红色）来泄木气——木生火，多余的木能量转化为火的热情和行动力。',火:'用土（黄色）来泄火气——火生土，将过剩热情转化为稳定的产出和积累。',土:'用金（白色）来泄土气——土生金，将厚重转化为果断和执行力。',金:'用水（黑色）来泄金气——金生水，将刚硬转化为智慧和灵活。',水:'用木（绿色）来泄水气——水生木，将泛滥的思绪转化为具体的行动和创造。'};
        advice.push('泄<strong>'+s+'</strong>：'+(xie[s]||'过旺五行需疏导。'));
    }
    let ysWx=gys.xs[0]||'';
    if(ysWx&&!missing.includes(ysWx)&&!strong.includes(ysWx)){
        advice.push('用神<strong>'+ysWx+'</strong>是你的调和剂——日常生活中多接触'+ysWx+'属性的人事物，能帮助五行流转更加顺畅。');
    }
    if(advice.length>0)html+='<p style="font-size:11px;line-height:1.8;">'+advice.join('<br>')+'</p>';

    html+='<p style="font-size:10px;color:#b8a49e;margin-top:4px;">五行流通分析基于四柱天干地支的五行分布。完整的流通分析需结合大运流年的五行引入，以上为命局静态分析。</p>';
    return html;
}

// ==================== 流年逐月运势 ====================
function analyzeLiunianMonths(cy,yearStem,yearBranch,dGZ,gys,gst){
    let ySet=new Set(gys.ys||[]),jSet=new Set(gys.js||[]);
    let monthNames=['正月（寅）','二月（卯）','三月（辰）','四月（巳）','五月（午）','六月（未）','七月（申）','八月（酉）','九月（戌）','十月（亥）','冬月（子）','腊月（丑）'];
    let monthBranches=[2,3,4,5,6,7,8,9,10,11,0,1]; // 寅=2 ... 丑=1
    let monthSeq=['寅','卯','辰','巳','午','未','申','酉','戌','亥','子','丑'];

    let html='<thead><tr><th>月份</th><th>干支</th><th>纳音</th><th>五行</th><th>吉凶</th><th>建议</th></tr></thead><tbody>';

    let monthAdvices={
        木:{good:'木旺之月，利于学习进修、拓展人脉。适合开启新项目。',bad:'木气过重，注意肝胆健康。避免冲动做决策。',neutral:'木气平和，按部就班即可。适合读书充电。'},
        火:{good:'火旺之月，热情高涨利于社交、公开演讲、竞聘。',bad:'火气太盛易急躁冲突，注意口舌是非和心血管。',neutral:'火气适中，保持温和节奏。适合适度运动。'},
        土:{good:'土旺之月，利于置业、签约、长期投资。稳扎稳打收获多。',bad:'土重沉闷，容易钻牛角尖。注意脾胃消化。',neutral:'土气平稳，适合整理规划。宜储蓄不宜投机。'},
        金:{good:'金旺之月，果断决策，利于谈判、诉讼、竞争性事务。',bad:'金气过刚易伤人伤己，注意呼吸道和筋骨。',neutral:'金气内敛，适合精打细算。坚守原则但勿固执。'},
        水:{good:'水旺之月，智慧灵动，利于创作、沟通、流动性工作。',bad:'水泛易情绪化，注意肾脏泌尿系统。避免过度思虑。',neutral:'水气柔和，适合反思和调整。多与朋友交流。'}
    };

    for(let i=0;i<12;i++){
        let mb=monthBranches[i];
        let ms=getMonthStem(yearStem,mb);
        let gz=S[ms]+B[mb];
        let nayin=getNayin(ms,mb);
        let me=SE[ms]; // month stem element
        let be=BE[mb]; // month branch element

        // 吉凶判断：月干五行在喜用神/忌神中
        let jiXiong='';
        let jxClass='';
        if(ySet.has(me)){jiXiong='🟢 吉';jxClass='color:#4caf50;';}
        else if(jSet.has(me)){jiXiong='🔴 凶';jxClass='color:#ef5350;';}
        else if(ySet.has(be)){jiXiong='🟡 平偏吉';jxClass='color:#ff9800;';}
        else if(jSet.has(be)){jiXiong='🟠 平偏凶';jxClass='color:#ff9800;';}
        else {jiXiong='⚪ 平';jxClass='color:#888;';}

        // 建议
        let adv='';
        if(ySet.has(me))adv=monthAdvices[me].good;
        else if(jSet.has(me))adv=monthAdvices[me].bad;
        else adv=monthAdvices[me]?monthAdvices[me].neutral:'平稳度过，宜静不宜动。';

        html+='<tr>';
        html+='<td style="font-weight:600;">'+monthNames[i]+'</td>';
        html+='<td><span class="wx-'+me+'">'+gz+'</span></td>';
        html+='<td style="font-size:10px;color:#888;">'+nayin+'</td>';
        html+='<td><span class="etag '+me+'">'+me+'</span></td>';
        html+='<td style="'+jxClass+'font-weight:700;">'+jiXiong+'</td>';
        html+='<td style="font-size:11px;line-height:1.5;">'+adv+'</td>';
        html+='</tr>';
    }
    html+='</tbody>';
    return html;
}
