export interface VsCodeApi {
  postMessage: (message: unknown) => void;
  getState: <T>() => T | undefined;
  setState: (state: unknown) => void;
}

declare global {
  interface Window {
    acquireVsCodeApi?: () => VsCodeApi;
  }
}

export const vscode = window.acquireVsCodeApi ? window.acquireVsCodeApi() : undefined;
