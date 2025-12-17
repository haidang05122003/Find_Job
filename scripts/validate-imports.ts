/**
 * Validation script to check import patterns
 * Ensures proper import organization and tree-shaking
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface ImportIssue {
    file: string;
    line: number;
    issue: string;
    context: string;
}

const issues: ImportIssue[] = [];
const excludeDirs = ['node_modules', '.next', 'dist', 'build', '.git'];

// Libraries that should use named imports for tree-shaking
const treeShakeableLibs = ['lodash', 'date-fns', 'ramda'];

function scanDirectory(dir: string): void {
    const files = readdirSync(dir);

    for (const file of files) {
        const filePath = join(dir, file);
        const stat = statSync(filePath);

        if (stat.isDirectory()) {
            if (!excludeDirs.includes(file)) {
                scanDirectory(filePath);
            }
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            scanFile(filePath);
        }
    }
}

function scanFile(filePath: string): void {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();

        // Check for default imports from tree-shakeable libraries
        treeShakeableLibs.forEach((lib) => {
            const defaultImportRegex = new RegExp(`import\\s+\\w+\\s+from\\s+['"]${lib}['"]`);
            if (defaultImportRegex.test(trimmedLine)) {
                issues.push({
                    file: filePath,
                    line: index + 1,
                    issue: `Default import from "${lib}" prevents tree-shaking`,
                    context: trimmedLine,
                });
            }
        });

        // Check for wildcard imports
        if (/import\s+\*\s+as\s+\w+\s+from/.test(trimmedLine)) {
            issues.push({
                file: filePath,
                line: index + 1,
                issue: 'Wildcard import may prevent tree-shaking',
                context: trimmedLine,
            });
        }
    });
}

// Run validation
console.log('🔍 Scanning import patterns...\n');
scanDirectory('./src');

if (issues.length === 0) {
    console.log('✅ All imports follow best practices!\n');
    process.exit(0);
} else {
    console.log(`⚠️  Found ${issues.length} import issues:\n`);

    issues.forEach((issue) => {
        console.log(`  ${issue.file}:${issue.line}`);
        console.log(`    Issue: ${issue.issue}`);
        console.log(`    ${issue.context}\n`);
    });

    console.log(`\n⚠️  Consider fixing these imports for better tree-shaking`);
    process.exit(0); // Warning only, don't fail build
}
