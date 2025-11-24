export type RelationType = 'DEPENDS_ON' | 'BLOCKS' | 'RELATED'

export interface Relation {
  id: string
  sourceTaskId: string
  targetTaskId: string
  type: RelationType
  title: string
  createdAt: Date
  updatedAt: Date
}
