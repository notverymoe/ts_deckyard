import { defineConfig } from 'vite'

import preact from '@preact/preset-vite'
// import viteCompression from 'vite-plugin-compression'
import styleLint from 'vite-plugin-stylelint'

export default defineConfig({
    server: {
        port: 8080,
    },
    plugins: [
        styleLint({
            config: {
                extends: "stylelint-config-recommended",
            }
        }),
        preact(),
        // viteCompression({
        //     algorithm: "gzip",
        //     deleteOriginFile: true,
        // }),
    ],
    build: {
        sourcemap: true,
        cssMinify: false,
        minify: false,
        assetsInlineLimit: 0,
        rolldownOptions: {
            output: {
                advancedChunks: {
                    minSize: 0,
                    groups: [
                        {
                            name: 'deckyard',
                            test: /\/src\//,
                            priority: 5,
                        },
                        {
                            name: 'vendor',
                            test: /\/node_modules\//,
                            priority: 10,
                        },
                    ],
                },
            },
        }
    }
})
