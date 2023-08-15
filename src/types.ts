import type { Emitter, EventType } from 'mitt'

export type Event = string | symbol

export interface IMessage {
  __IframeMessage: any
  seq: number // 序列号
  event: Event // 事件类型
  data: any
}

export interface EventData {
  data: IMessage
  seq?: number
  source: MessageEventSource | null
}

export interface IAdapterValue {
  postMessage: (target: { postMessage: Function }, data: IMessage) => ({})

  addMessageListener: (callback: (arg: { data: IMessage; source: Window }) => void) => () => void
}

export type IAdapter = () => IAdapterValue

export { Emitter, EventType }
