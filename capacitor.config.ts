import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.mokk.bioma-block',
    appName: 'bioma-block',
    webDir: 'dist',
    // bundledWebRuntime: false,
    server: {
        androidScheme: 'https'
    },
    plugins: {
        StatusBar: {
            style: 'DARK',
            overlaysWebView: true,
        }
    }
};

export default config;
