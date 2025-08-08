declare interface NativeAddon {
  print(...args: string[]): void;
  createConsole(): boolean;
}
