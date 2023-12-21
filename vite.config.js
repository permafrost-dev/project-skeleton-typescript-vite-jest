import { defineConfig } from 'vite'

const watcherConfig = {
    usePolling: true,
    include: [
        'src/**',
    ],
    buildDelay: 800,
    chokidar: {
        usePolling: true,
        interval: 300,
    }
}

/** @type {import ('vite/dist/node/config')} */
export default defineConfig({
    build: {
        target: 'esnext',
        outDir: 'dist',
        chunkSizeWarningLimit: 2048,
        emptyOutDir: true,
        minify: 'esbuild',
        watch: watcherConfig,
        lib: {
            entry: 'src/index.ts',
            name: '{{package.name}}',
            fileName: (format) => {
                const map = {
                    umd: 'umd.cjs',
                    cjs: 'cjs',
                    es: 'js',
                    esm: 'js',
                };
                const suffix = map[format] ?? map.esm;
                return `index.${suffix}`;
            },
            formats: ['es', 'umd', 'cjs'],
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: [],
            output: {
                format: 'umd',
                dir: 'dist',
                exports: 'auto',
                fileName: '{{package.name}}.umd.cjs',
                globals: { // Provide global variables to use in the UMD build for externalized deps
                    vue: 'Vue',
                    react: 'React',
                    axios: 'axios',
                },
            },
            watch: watcherConfig,
        },
    },
    server: {
        watch: {
            ...watcherConfig,
            ignored: [
                '**/vendor/**', './public/**', './app/**', './storage/**', '.git/**', './node_modules/**',
            ],
        },
    },
})
