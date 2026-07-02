// ==================== 典籍算法增强 ====================
// 基于滴天髓、三命通会、子平真诠、千里命稿的理论增强命理判断
// 仅提供算法函数，不涉及原文引用

/**
 * 滴天髓通变旺衰增强
 * @param {Object} dayGZ - 日柱 {s:天干索引, b:地支索引}
 * @param {number} mbI - 月支地支索引
 * @param {Array} ps - 四柱数组
 * @returns {Object} {sc, lv, st, flow, tongguan, zhenShen}
 */
function analyzeStrengthClassic(dayGZ, mbI, ps) {
    // 调用原始旺衰得到基础分
    let base = analyzeStrength(dayGZ, mbI, ps);
    let sc = base.sc;
    let st = base.st;
    let lv = base.lv;

    // 滴天髓通变思想：源流、通关、真神
    let dayStem = dayGZ.s;
    let dayBranch = dayGZ.b;
    let monthStem = ps[1].s;
    let monthBranch = ps[1].b;
    let yearStem = ps[0].s;
    let yearBranch = ps[0].b;
    let hourStem = ps[3].s;
    let hourBranch = ps[3].b;

    // 五行生克顺序：木->火->土->金->水->木
    const sheng = {木: '火', 火: '土', 土: '金', 金: '水', 水: '木'};
    const ke = {木: '土', 火: '金', 土: '水', 金: '木', 水: '火'};

    // 来源（源）：日主生助之五行（印星）所在的方向
    // 流向：日主克泄之五行（官杀、食伤、财星）所在的方向
    let source = []; // 五行：印星 (偏印/正印)
    let flow = [];   // 五行：官杀/食伤/财星
    ps.forEach(p => {
        let rel = getShiShen(dayStem, p.s);
        if (rel === '正印' || rel === '偏印') source.push(SE[p.s]);
        if (rel === '正官' || rel === '七杀' || rel === '偏财' || rel === '正财' || rel === '食神' || rel === '伤官') flow.push(SE[p.s]);
    });

    // 简单源流评分：源多于流则有利，流多于源则有损
    let flowScore = 0;
    if (source.length > flow.length) flowScore += 1;
    else if (flow.length > source.length) flowScore -= 1;

    // 通关：判断月令是否透干，以及是否有通关之神
    // 月令透干：月干是否为月令之气（即月支的主要藏干）或其生助之神
    let monthBranchHidden = HD[monthBranch]; // array of stem indices
    let monthQi = BE[monthBranch]; // 月支主要气（藏干第一位）? Actually 主气是藏干第一个
    // 简化：月令之气为月支的主要气（取第一个）
    let monthMain = monthBranchHidden[0];
    let monthTransparent = (monthStem === monthMain) || sheng[monthMain] === monthStem || ke[monthMain] === monthStem;
    // 通关五行：如果月令有冲，看是否有中和之神
    let tongguan = '';
    let monthBranchClash = ZHI_CHONG[monthBranch]; // 被冲的支
    if (monthBranchClash) {
        // 看是否有合化或有中和之神
        let hasHe = false;
        ps.forEach(p => {
            if (ZHI_HE[p.b] === monthBranchClash || ZHI_HE[monthBranch] === p.b) hasHe = true;
        });
        if (hasHe) tongguan = SE[sheng[BE[monthBranchClash]]]; // 举例：通关之神为冲突中间五行
    }

    // 真神/假神：月令司令是否透干，以及是否得助
    let zhenShen = '';
    if (monthTransparent) {
        zhenShen = SE[monthStem];
    } else {
        // 看藏干中是否透出
        let hiddenStems = monthBranchHidden.filter(h => ps.some(p => p.s === h));
        if (hiddenStems.length) {
            zhenShen = SE[hiddenStems[0]]; // 取首个透出的
        }
    }

    // 调整旺衰分数（简单示例）
    if (flowScore > 0) sc += 1;
    else if (flowScore < 0) sc -= 1;

    // 重新判定强弱
    let lvNew;
    if (sc >= 7) lvNew = '身强（旺）';
    else if (sc >= 4) lvNew = '身强（中和）';
    else if (sc >= 1) lvNew = '中和';
    else if (sc >= -2) lvNew = '身弱（中和）';
    else lvNew = '身弱（弱）';

    return {sc, lv: lvNew, st: sc >= 1, flow: flow.join(''), tongguan, zhenShen};
}

/**
 * 子平真诠格局用神增强
 * @param {Object} dayGZ - 日柱
 * @param {Array} ps - 四柱
 * @param {number} mbI - 月支索引
 * @returns {Object} {geju, yongShen, xiangShen, jiShen, description}
 */
function analyzeGejuClassic(dayGZ, ps, mbI) {
    let dayStem = dayGZ.s;
    let monthStem = ps[1].s;      // 天干索引
    let monthBranch = ps[1].b;    // 地支索引

    // 月支藏干（HD[branch] 为天干名数组，如 ['癸']），转为天干索引
    let hidden = (HD[monthBranch] || []).map(nm => S.indexOf(nm)).filter(i => i >= 0);
    let monthMainStem = hidden.length ? hidden[0] : monthStem; // 月令本气（天干索引）

    // 四柱天干索引集合（用于判断"透干"）
    let stems = ps.map(p => p.s);

    let geju = '平';
    let yongShenTenGod = '平';

    // 子平真诠取格：月令本气若透于天干，则取此格
    if (stems.includes(monthMainStem)) {
        geju = getShiShen(dayStem, monthMainStem);
        yongShenTenGod = geju;
    } else {
        // 本气不透，看月支中气/余气是否透出
        let exposed = hidden.find(h => stems.includes(h));
        if (exposed !== undefined) {
            geju = getShiShen(dayStem, exposed);
            yongShenTenGod = geju;
        } else {
            // 藏干全不透，以月令本气之十神为假格
            geju = getShiShen(dayStem, monthMainStem);
            yongShenTenGod = geju;
        }
    }

    // 相神/忌神（依格局大类判断）——子平真诠"用之官星，喜财印护官"等
    let xiangShen = [], jiShen = [];
    if (geju === '正官' || geju === '七杀') { xiangShen = ['正印', '偏印', '正财', '偏财']; jiShen = ['伤官', '食神']; }
    else if (geju === '正财' || geju === '偏财') { xiangShen = ['食神', '伤官', '正官']; jiShen = ['比肩', '劫财']; }
    else if (geju === '正印' || geju === '偏印') { xiangShen = ['正官', '七杀']; jiShen = ['正财', '偏财']; }
    else if (geju === '食神' || geju === '伤官') { xiangShen = ['正财', '偏财', '比肩']; jiShen = ['正印', '偏印']; }
    else if (geju === '比肩' || geju === '劫财') { xiangShen = ['正官', '七杀', '食神']; jiShen = ['正印', '偏印']; }

    return {
        geju: geju,
        yongShen: yongShenTenGod,
        xiangShen: xiangShen,
        jiShen: jiShen,
        description: '以月令 ' + B[monthBranch] + ' 取 ' + geju + ' 格'
    };
}

/**
 * 三命通会纳音论命增强
 * @param {Array} ps - 四柱
 * @returns {string} 纳音论命结论
 */
function analyzeNayinClassic(ps) {
    // 使用项目现有的 getNayin(stemIdx, branchIdx) 计算纳音（如"海中金"）
    function getNayinFromGZ(gz) {
        return (typeof getNayin === 'function') ? getNayin(gz.s, gz.b) : '';
    }
    let nayins = ps.map(getNayinFromGZ);
    let yearNayin = nayins[0];
    let monthNayin = nayins[1];
    let dayNayin = nayins[2];
    let hourNayin = nayins[3];
    // 提取五行
    function getWuxingFromNayin(str) {
        if (str.endsWith('金')) return '金';
        if (str.endsWith('木')) return '木';
        if (str.endsWith('水')) return '水';
        if (str.endsWith('火')) return '火';
        if (str.endsWith('土')) return '土';
        return '未知';
    }
    let yearWu = getWuxingFromNayin(yearNayin);
    let monthWu = getWuxingFromNayin(monthNayin);
    let dayWu = getWuxingFromNayin(dayNayin);
    let hourWu = getWuxingFromNayin(hourNayin);
    // 生克关系：年命为本，看月日时对年命的生克
    const sheng = {木: '火', 火: '土', 土: '金', 金: '水', 水: '木'};
    const ke = {木: '土', 火: '金', 土: '水', 金: '木', 水: '火'};
    let detail = '';
    let score = 0;
    // 月令
    if (sheng[yearWu] === monthWu) { detail += '月令生年命，吉。'; score += 2; }
    else if (ke[yearWu] === monthWu) { detail += '月令克年命，凶。'; score -= 2; }
    else if (yearWu === monthWu) { detail += '月令同类，平。'; }
    else { /* 其余五关系复杂 */ }
    // 日令
    if (sheng[yearWu] === dayWu) { detail += '日令生年命，吉。'; score += 1; }
    else if (ke[yearWu] === dayWu) { detail += '日令克年命，凶。'; score -= 1; }
    else if (yearWu === dayWu) { detail += '日令同类，平。'; }
    // 时令
    if (sheng[yearWu] === hourWu) { detail += '时令生年命，吉。'; score += 1; }
    else if (ke[yearWu] === hourWu) { detail += '时令克年命，凶。'; score -= 1; }
    else if (yearWu === hourWu) { detail += "时令同类，平。"; }
    let conclusion = score > 0 ? '纳音总体吉利' : score < 0 ? '纳音总体不利' : '纳音平和';
    return detail + ' ' + conclusion;
}

/**
 * 千里命稿用神量化与旺衰精确
 * @param {Object} dayGZ
 * @param {number} mbI
 * @param {Array} ps
 * @returns {Object} from analyzeStrengthClassic but with refined weights
 */
function analyzeStrengthQianli(dayGZ, mbI, ps) {
    // 千里命稿强调月令占旺衰 40%，时支次之，年支最低
    // 我们在 analyzeStrengthClassic 中已经加入了流通评分，这里可以进一步调权
    let base = analyzeStrength(dayGZ, mbI, ps);
    let sc = base.sc;
    // 重新计算权重：月令得令+4 → +5（占40%），时支得地+1 → +1.5，年支得地+1 → +0.5，等等
    // 由于原函数已经硬编码，我们这里做一个简单的调整示例
    // 实际应重写评分逻辑，这里仅演示
    // 月令贡献：原函数中 wm[de].includes(B[mbI]) ? +4 : ... 我们改为 +5
    // 但为了不改动原函数，我们在此基础上做一个修正
    let monthContrib = 0;
    let wm = {木:'寅卯',火:'巳午',土:'辰戌丑未',金:'申酉',水:'亥子'};
    let de = SE[dayGZ.s];
    if (wm[de].includes(B[mbI])) monthContrib = 5; else {
        let eg = {木:'水',火:'木',土:'火',金:'土',水:'金'};
        if (eg[de]===BE[mbI]) monthContrib = 2;
    }
    // 时支得地：原函数中每个柱子（不含日支）有印或比劫加分，这里我们简化
    let hourContrib = 0;
    ps.forEach((p, idx) => {
        if (idx === 2) return; // 跳过日支
        if (HD[p.b].includes(S[dayGZ.s])) hourContrib += 1.5;
        let s = getShiShen(dayGZ.s, p.s);
        if (s==='正印'||s==='偏印') hourContrib += 2;
        if (s==='比肩'||s==='劫财') hourContrib += 1.5;
        if (s==='七杀'||s==='正官') hourContrib -= 1.5;
        if (s==='食神'||s==='伤官') hourContrib -= 1;
        if (s==='正财'||s==='偏财') hourContrib -= 1;
    });
    // 年支得地：年支权重减半
    let yearContrib = 0;
    let yearIdx = 0;
    if (yearIdx !== 2) {
        if (HD[ps[yearIdx].b].includes(S[dayGZ.s])) yearContrib += 0.75; // 原1.5减半
        let s = getShiShen(dayGZ.s, ps[yearIdx].s);
        if (s==='正印'||s==='偏印') yearContrib += 1; // 原2减半
        if (s==='比肩'||s==='劫财') yearContrib += 0.75; // 原1.5减半
        if (s==='七杀'||s==='正官') yearContrib -= 0.75; // 原1.5减半
        if (s==='食神'||s==='伤官') yearContrib -= 0.5; // 原1减半
        if (s==='正财'||s==='偏财') yearContrib -= 0.5;
    }
    // 重新计算总分（大致）
    let delta = (monthContrib - 4) + (hourContrib - 0) + (yearContrib - 0); // 粗略
    sc += delta;
    // 重新判定强弱
    let lv;
    if (sc >= 6) lv = '身强（偏旺）';
    else if (sc >= 3) lv = '身强（中和偏强）';
    else if (sc >= -2) lv = '中和';
    else if (sc >= -5) lv = '身弱（中和偏弱）';
    else lv = '身弱（偏弱）';
    return {sc, lv, st: sc>=0};
}

// 导出（在浏览器环境下挂到 window 供其他文件使用，若使用模块化则另议）
if (typeof window !== 'undefined') {
    window.analyzeStrengthClassic = analyzeStrengthClassic;
    window.analyzeGejuClassic = analyzeGejuClassic;
    window.analyzeNayinClassic = analyzeNayinClassic;
    window.analyzeStrengthQianli = analyzeStrengthQianli;
}