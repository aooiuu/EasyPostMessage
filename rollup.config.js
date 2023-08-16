import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import alias from '@rollup/plugin-alias'

const entries = [
  {
    path: 'src/index.ts',
    name: 'EasyPostMessage',
    format: ['esm', 'cjs', 'umd'],
  },
  {
    path: 'src/adapter/electron-adapter.ts',
    format: ['esm', 'cjs'],
  },
]

const plugins = [
  alias({
    entries: [
      {
        find: /^node:(.+)$/,
        replacement: '$1',
      },
    ],
  }),
  resolve({
    preferBuiltins: true,
  }),
  json(),
  commonjs(),
  esbuild({
    target: 'es2015',
    minify: true,
  }),
]

export default [
  ...entries.map(({ path: input, name, format }) => ({
    input,
    output: [
      {
        file: input.replace('src/', 'dist/').replace('.ts', '.mjs'),
        format: 'esm',
      },
      {
        file: input.replace('src/', 'dist/').replace('.ts', '.cjs'),
        format: 'cjs',
      },
      {
        file: input.replace('src/', 'dist/').replace('.ts', '.js'),
        format: 'umd',
        name,
      },
    ].filter(o => format.includes(o.format)),
    external: [],
    plugins,
  })),
  ...entries.map(({ path: input }) => ({
    input,
    output: {
      file: input
        .replace('src/adapter/', '')
        .replace('src/', '')
        .replace('.ts', '.d.ts'),
      format: 'esm',
    },
    external: [],
    plugins: [
      dts({
        respectExternal: true,
      }),
    ],
  })),
]
