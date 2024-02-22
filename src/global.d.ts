declare interface Window {
  ethereum: any
}
declare module 'jazzicon' {
  const jazzicon: any
  export default jazzicon
}

declare module '@hivehoney/hive' {
  const Hive__factory: any
  export { Hive__factory }
}

declare interface String {
  cutStr: (pre: number, trail: number) => any
}
