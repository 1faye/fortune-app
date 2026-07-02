const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// 算命主站直接托管在根路径
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`\n  🪷 算命服务已启动！`);
    console.log(`  ───────────────────────────`);
    console.log(`  访问地址: http://localhost:${PORT}`);
    console.log(`  ───────────────────────────\n`);
});
