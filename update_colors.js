const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'src');
const hex_colors = ['#E8734A', '#9B8CF0', '#2BB893', '#4A9FE8', '#F2679B', '#06b6d4'];

function processFile(filepath) {
    let content = fs.readFileSync(filepath, 'utf8');
    const original = content;

    for (const color of hex_colors) {
        // tailwind classes
        const regexBg = new RegExp(`bg-\\[${color}\\]`, 'gi');
        content = content.replace(regexBg, 'bg-accent');
        
        const regexText = new RegExp(`text-\\[${color}\\]`, 'gi');
        content = content.replace(regexText, 'text-accent');
        
        const regexBorder = new RegExp(`border-\\[${color}\\]`, 'gi');
        content = content.replace(regexBorder, 'border-accent');
        
        const regexBgOp = new RegExp(`bg-\\[${color}\\]\\/(\\d+)`, 'gi');
        content = content.replace(regexBgOp, 'bg-accent/$1');
        
        const regexTextOp = new RegExp(`text-\\[${color}\\]\\/(\\d+)`, 'gi');
        content = content.replace(regexTextOp, 'text-accent/$1');
        
        const regexBorderOp = new RegExp(`border-\\[${color}\\]\\/(\\d+)`, 'gi');
        content = content.replace(regexBorderOp, 'border-accent/$1');

        // js string literals
        const regexStr = new RegExp(`['"]${color}['"]`, 'gi');
        content = content.replace(regexStr, "'var(--accent)'");
        
        // border color inline styles
        const regexBorderColor = new RegExp(`borderColor:\\s*['"]${color}['"]`, 'gi');
        content = content.replace(regexBorderColor, "borderColor: 'var(--accent)'");
    }

    if (original !== content) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Updated ${filepath}`);
    }
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filepath = path.join(dir, file);
        const stat = fs.statSync(filepath);
        if (stat.isDirectory()) {
            walk(filepath);
        } else if (filepath.match(/\.(tsx|ts|jsx|js|css)$/)) {
            processFile(filepath);
        }
    }
}

walk(directory);
