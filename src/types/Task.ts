import { Status } from './Status'
import { Relation } from './Relation'

export interface Task {
  id: string
  title: string
  status: Status
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  relationships?: Relation[]
}
