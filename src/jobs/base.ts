export default interface BaseJob {
  run: (...args: any[]) => any
}
