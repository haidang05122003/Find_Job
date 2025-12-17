/**
 * Validation script to check for 'any' types in TypeScript files
 * This ensures type safety across the codebase
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface ValidationResult {
    file: string;
    line: number;
    column: number;
    context: string;
}

const results: ValidationResult[] = [];
const excludeDirs = ['node_modules', '.next', 'dist', 'build', '.git'];

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
        // Skip comments
        if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
            return;
        }

        // Check for 'any' type usage
        const anyRegex = /:\s*any\b|<any>|Array<any>|Promise<any>|as\s+any/g;
        let match;

        while ((match = anyRegex.exec(line)) !== null) {
            results.push({
                file: filePath,
                line: index + 1,
                column: match.index + 1,
                context: line.trim(),
            });
        }
    });
}

// Run validation
console.log('🔍 Scanning for "any" types...\n');
scanDirectory('./src');

if (results.length === 0) {
    console.log('✅ No "any" types found! Type safety is maintained.\n');
    process.exit(0);
} else {
    console.log(`❌ Found ${results.length} instances of "any" type:\n`);

    results.forEach((result) => {
        console.log(`  ${result.file}:${result.line}:${result.column}`);
        console.log(`    ${result.context}\n`);
    });

    console.log(`\n❌ Validation failed: ${results.length} "any" types found`);
    process.exit(1);
}
