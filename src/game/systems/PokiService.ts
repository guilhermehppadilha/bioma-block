export class PokiService {
    private static isInitialized = false;

    public static async init(): Promise<void> {
        if (typeof window.PokiSDK !== 'undefined') {
            try {
                await window.PokiSDK.init();
                this.isInitialized = true;
                console.log("Poki SDK Initialized");
            } catch (error) {
                console.warn("Poki SDK Blocked (AdBlocker ou erro)", error);
                this.isInitialized = false;
            }
        }
    }

    public static gameLoadingFinished() {
        if (this.isInitialized) window.PokiSDK.gameLoadingFinished();
    }

    public static gameplayStart() {
        if (this.isInitialized) window.PokiSDK.gameplayStart();
    }

    public static gameplayStop() {
        if (this.isInitialized) window.PokiSDK.gameplayStop();
    }

    public static commercialBreak(): Promise<void> {
        return new Promise((resolve) => {
            if (this.isInitialized) {
                window.PokiSDK.commercialBreak().then(() => {
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    public static rewardedBreak(): Promise<boolean> {
        return new Promise((resolve) => {
            if (this.isInitialized) {
                window.PokiSDK.rewardedBreak().then((success: boolean) => {
                    resolve(success);
                });
            } else {
                resolve(false);
            }
        });
    }
}