const typescript = require('rollup-plugin-typescript');
const builtins = require('rollup-plugin-node-builtins');
// const commonjs = require('rollup-plugin-commonjs');
const { uglify } = require('rollup-plugin-uglify');

module.exports = exports = [
    {
        input: './src/index.ts',
        output: {
            file: './dist/report.esm.js',
            format: 'esm',
        },
        plugins: [
            builtins(),
            typescript(),
        ],
    },
    {
        input: './src/index.ts',
        output: {
            file: './dist/report.cjs.js',
            format: 'cjs',
        },
        plugins: [
            builtins(),
            typescript(),
        ],
    },
    {
        input: './src/index.ts',
        output: {
            file: './dist/report.js',
            name: 'ROReport',
            format: 'umd',
        },
        external: [
            'core-js/fn/object/assign',
        ],
        plugins: [
            builtins(),
            typescript(),
        ],
    },
    {
        input: './src/index.ts',
        output: {
            file: './dist/report.min.js',
            name: 'ROReport',
            format: 'umd',
        },
        external: [
            'core-js/fn/object/assign',
        ],
        plugins: [
            builtins(),
            typescript(),
            uglify(),
        ],
    },
    // {
    //     input: './src/index.ts',
    //     output: {
    //         file: './dist/report.polyfill.min.js',
    //         name: 'ROReport',
    //         format: 'umd',
    //     },
    //     plugins: [
    //         commonjs(),
    //         builtins(),
    //         typescript(),
    //         uglify(),
    //     ],
    // },
];