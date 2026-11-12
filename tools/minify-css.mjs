// Minifies the CSS source files: assets/css/*.css -> assets/css/*.min.css
// Usage (from the project folder): node tools/minify-css.mjs
// Simple and dependency-free: removes comments, line breaks and useless spaces.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const cssDir = join(import.meta.dirname, "..", "assets", "css");

for (const file of readdirSync(cssDir)) {
    if (!file.endsWith(".css") || file.endsWith(".min.css")) continue;
    const source = readFileSync(join(cssDir, file), "utf8");
    // Quoted strings (e.g. content: "> ") are set aside so their spaces are kept.
    const strings = [];
    const minified = source
        .replace(/\/\*[\s\S]*?\*\//g, "")     // comments
        .replace(/"[^"]*"/g, (s) => `"@${strings.push(s) - 1}@"`)
        .replace(/\s+/g, " ")                  // whitespace runs
        .replace(/\s*([{}:;,>])\s*/g, "$1")    // spaces around symbols
        .replace(/;}/g, "}")                   // last semicolon of a block
        .replace(/\band\(/g, "and (")          // keep "and (" in media queries
        .replace(/"@(\d+)@"/g, (_, i) => strings[i])
        .trim();
    const output = inlineVariables(minified);
    const target = file.replace(/\.css$/, ".min.css");
    writeFileSync(join(cssDir, target), output + "\n");
    console.log(`${file} (${source.length} o) -> ${target} (${output.length} o)`);
}

// The W3C validator warns on every var(): the minified file gets the real
// values instead (variables stay in the readable source file).
function inlineVariables(css) {
    const root = css.match(/:root\{([^}]*)\}/);
    if (!root) return css;
    const vars = {};
    for (const declaration of root[1].split(";")) {
        const i = declaration.indexOf(":");
        vars[declaration.slice(0, i).trim()] = declaration.slice(i + 1).trim();
    }
    const resolve = (text) => text.replace(/var\((--[\w-]+)\)/g, (_, name) => resolve(vars[name]));
    return resolve(css.replace(root[0], ""));
}
