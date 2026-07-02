// ==================== 完整命理报告生成器 ====================
function pad(s,n){s=String(s||'');let l=0;for(let c of s)l+=c.charCodeAt(0)>127?2:1;for(let i=l;i<n;i++)s+=' ';return s;}

function generateReport(){
    if(!ps||ps.length<4)return '请先排盘再生成报告。';
    
    let dGZ_=cdGZ,yGZ_=cyGZ;
    let report='';
    let sep='\n——————————————————————\n';
    
    // ═══ 标题 ═══
    report+='           八字命理综合分析报告\n';
    report+='    八字：'+ps.map(p=>p.stem+p.branch).join(' ')+'\n';
    report+='    日主：'+S[dGZ_.s]+'（'+SE[dGZ_.s]+'性）性别：'+ggen+'\n';
    report+='    生成时间：'+new Date().toLocaleString('zh-CN')+'\n';
    report+=sep;
    
    // ═══ 一、八字排盘 ═══
    report+='【一、八字排盘】\n';
    report+=pad('四柱',10)+pad('年柱',12)+pad('月柱',12)+pad('日柱',12)+pad('时柱',12)+'\n';
    report+=pad('天干',10)+pad(ps[0].stem,12)+pad(ps[1].stem,12)+pad(ps[2].stem,12)+pad(ps[3].stem,12)+'\n';
    report+=pad('地支',10)+pad(ps[0].branch,12)+pad(ps[1].branch,12)+pad(ps[2].branch,12)+pad(ps[3].branch,12)+'\n';
    report+=pad('纳音',10)+pad(ps[0].nayin,12)+pad(ps[1].nayin,12)+pad(ps[2].nayin,12)+pad(ps[3].nayin,12)+'\n';
    let zx0=getShiShen(dGZ_.s,ps[0].s)||'－',zx1=getShiShen(dGZ_.s,ps[1].s)||'－',zx2=getShiShen(dGZ_.s,ps[2].s)||'－',zx3=getShiShen(dGZ_.s,ps[3].s)||'－';
    report+=pad('主星',10)+pad(zx0,12)+pad(zx1,12)+pad(zx2,12)+pad('元男',12)+'\n';
    let kw_=getKongWang(dGZ_);
    report+=pad('空亡',10)+pad(kw_[0]+kw_[1],12)+pad(kw_[0]+kw_[1],12)+pad(kw_[0]+kw_[1],12)+pad(kw_[0]+kw_[1],12)+'\n';
    report+=sep;
    
    // ═══ 二、五行力量 ═══
    report+='【二、五行力量分析】\n';
    let wxNames=['木','火','土','金','水'];
    wxNames.forEach(w=>{
        let c=wc[w]||0;let bar='';
        for(let i=0;i<Math.min(c,8);i++)bar+='■';
        if(c===0)bar='□';
        report+='  '+w+'  '+bar+'  ('+c+'分)\n';
    });
    report+='\n';
    report+='  日主'+S[dGZ_.s]+B[dGZ_.b]+'：';
    let strong=gst&&gst.st;
    if(strong)report+='身强。\n    得令+得地+得势，属炎上之格。\n';
    else report+='身弱。\n';
    report+='  调候用神：【'+(gys.ys||[]).join('】【')+'】\n  喜神：【'+(gys.xs||[]).join('】【')+'】\n  忌神：【'+(gys.js||[]).join('】【')+'】\n';
    report+=sep;
    
    // ═══ 三、十神格局 ═══
    report+='【三、十神格局】\n';
    if(typeof analyzeShiShenGeJu==='function'){
        let ssHtml=analyzeShiShenGeJu(dGZ_,ps);
        report+=stripHtml2(ssHtml)+'\n';
    }
    report+='\n  地支藏干：\n';
    ps.forEach(p=>{
        let hc=HD[p.b]||[];let hcStr=hc.map(h=>S[h]).join('、');
        report+='    '+p.name+p.branch+' 藏：'+hcStr+'\n';
    });
    report+=sep;
    
    // ═══ 四、神煞 ═══
    report+='【四、神煞总览】\n';
    if(typeof getShenSha==='function'){
        let ssha=getShenSha(ps);
        if(Array.isArray(ssha)&&ssha.length){
            let ji=[],sha=[];
            ssha.forEach(s=>{
                if(typeof s==='string'){
                    if(s.includes('天乙')||s.includes('文昌')||s.includes('天德')||s.includes('月德')||s.includes('福星')||s.includes('学堂'))ji.push(s);
                    else sha.push(s);
                }
            });
            if(ji.length)report+='  吉神：'+ji.join('、')+'\n';
            if(sha.length)report+='  其他：'+sha.join('、')+'\n';
        }
    }
    report+=sep;
    
    // ═══ 五、大运 ═══
    report+='【五、起运与大运】\n';
    let dyY=parseInt(document.getElementById('byear').value)||1970;
    let dyM=parseInt(document.getElementById('bmonth').value)||1;
    let dyD=parseInt(document.getElementById('bday').value)||1;
    let dyH=parseInt(document.getElementById('bhour').value)||12;
    let dyResult=dayun(yGZ_,dyY,dyM,dyD,dyH,ggen);
    if(dyResult&&dyResult.dys){
        report+='  起运：约'+dyResult.qa+'岁\n\n';
        report+='  大运一览：\n';
        dyResult.dys.forEach((d,i)=>{
            let startAge=d.age;
            let endAge=d.age+9;
            let startYear=dyY+startAge;
            report+='    '+(i+1)+'. '+d.stem+d.branch+'  '+startAge+'-'+endAge+'岁  '+startYear+'年\n';
        });
        report+='\n  排法：'+(dyResult.sp?'顺排（阳男阴女）':'逆排（阴男阳女）')+'\n';
    }
    report+=sep;
    
    // ═══ 六、财运 ═══
    report+='【六、财运分析】\n';
    if(typeof analyzeCaiYun==='function'){
        let html=analyzeCaiYun(dGZ_,ps,gst?gst.st:false,gys);
        report+=stripHtml2(html)+'\n';
    }
    report+=sep;
    
    // ═══ 七、健康 ═══
    report+='【七、健康分析】\n';
    if(typeof analyzeHealth==='function'){
        let html=analyzeHealth(dGZ_,ps,wc);
        report+=stripHtml2(html)+'\n';
    }
    report+=sep;
    
    // ═══ 八、事业性格 ═══
    report+='【八、事业与性格】\n';
    if(typeof analyzePersonality==='function'){
        let html=analyzePersonality(dGZ_,ps,gst?gst.st:false,gys);
        report+=stripHtml2(html)+'\n';
    }
    if(typeof analyzeCareer==='function'){
        let html=analyzeCareer(dGZ_,ps,gst?gst.st:false,gys);
        report+=stripHtml2(html)+'\n';
    }
    report+=sep;
    
    // ═══ 九、婚姻 ═══
    report+='【九、婚姻感情】\n';
    if(typeof analyzeLove==='function'){
        let html=analyzeLove(dGZ_,ps,ggen);
        report+=stripHtml2(html)+'\n';
    }
    report+=sep;
    
    // ═══ 十、综合建议 ═══
    report+='【十、综合建议】\n';
    // 五行→方位/颜色/饮食 宜忌映射（依据实际用神/忌神动态生成）
    let wxFang={木:'东/东南（木）',火:'南（火）',土:'中/西南/东北（土）',金:'西/西北（金）',水:'北（水）'};
    let wxColor={木:'绿/青（木）',火:'红/紫（火）',土:'黄/棕（土）',金:'白/银（金）',水:'黑/蓝（水）'};
    let wxDiet={木:'绿叶菜、酸味、芽类',火:'苦瓜、莲子、红色食物',土:'山药、南瓜、甘味',金:'百合、梨、辛味',水:'黑豆、海带、咸味'};
    let ysL=gys.ys||[],jsL=gys.js||[];
    report+='  【方位建议】\n';
    report+='    吉利：'+ysL.map(e=>wxFang[e]).join('、')+'\n';
    if(jsL.length)report+='    忌用：'+jsL.map(e=>wxFang[e]).join('、')+'\n';
    report+='  【颜色建议】\n';
    report+='    宜用：'+ysL.map(e=>wxColor[e]).join('、')+'\n';
    if(jsL.length)report+='    忌用：'+jsL.map(e=>wxColor[e]).join('、')+'\n';
    report+='  【饮食建议】\n';
    report+='    宜：'+ysL.map(e=>wxDiet[e]).join('、')+'\n';
    if(jsL.length)report+='    忌：'+jsL.map(e=>wxDiet[e]).join('、')+'\n';
    report+='  【作息建议】\n';
    report+='    午时（11-13点）小憩养心\n';
    report+='    子时（23点前）入睡养胆\n';
    report+='    避免熬夜、暴怒、过劳\n';
    report+=sep;
    
    // ═══ 附、每日简运 ═══
    report+='【附：近7日简运】\n';
    let today=new Date();
    for(let i=0;i<7;i++){
        let d=new Date(today);d.setDate(d.getDate()+i);
        let gz=getDayGZ(d);
        let wx=SE[gz.s];
        let good=gys&&gys.ys&&gys.ys.includes(wx);
        let w=(d.getMonth()+1)+'/'+d.getDate();
        report+='  '+pad(w,6)+S[gz.s]+B[gz.b]+pad(wx,4)+(good?' ★ 吉':' 平')+'\n';
    }
    
    report+='\n───────────────────────────────────────\n';
    report+='命运虽有轨迹，人生贵在当下。\n';
    report+='本报告由AI生成，仅供传统文化探讨与娱乐参考。\n';
    
    return report;
}

// HTML去标签 + 保留段落
function stripHtml2(html){
    if(!html)return '';
    return html
        .replace(/<br\s*\/?>/gi,'\n')
        .replace(/<\/p>/gi,'\n\n')
        .replace(/<\/div>/gi,'\n')
        .replace(/<\/tr>/gi,'\n')
        .replace(/<[^>]*>/g,'')
        .replace(/&nbsp;/g,' ')
        .replace(/&lt;/g,'<')
        .replace(/&gt;/g,'>')
        .replace(/&amp;/g,'&')
        .replace(/[ \t]+/g,' ')
        .replace(/\n{3,}/g,'\n\n')
        .trim();
}

// 复制全文（含HTTP环境降级）
function copyReport(){
    let txt=document.getElementById('reportContent').textContent;
    if(navigator.clipboard&&navigator.clipboard.writeText){
        navigator.clipboard.writeText(txt).then(()=>alert('✅ 已复制')).catch(()=>fallbackCopy(txt));
    }else{fallbackCopy(txt);}
}
function fallbackCopy(t){
    let ta=document.createElement('textarea');ta.value=t;ta.style.position='fixed';ta.style.left='-9999px';
    document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);
    alert('✅ 已复制');
}
// 显示报告
function showReport(){
    let report=generateReport();
    let el=document.getElementById('reportContent');
    if(!el)return;
    el.textContent=report;
    document.getElementById('reportCard').style.display='block';
    document.getElementById('reportCard').scrollIntoView({behavior:'smooth'});
}

// 保存为TXT
function saveReport(){
    let r=generateReport();
    let b=new Blob([r],{type:'text/plain;charset=utf-8'});
    let a=document.createElement('a');
    a.href=URL.createObjectURL(b);
    let gz=S[cdGZ.s]+B[cdGZ.b];
    a.download='命理报告_'+gz+'_'+new Date().toISOString().slice(0,10)+'.txt';
    a.click();
    URL.revokeObjectURL(a.href);
}
