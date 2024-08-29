import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Customer } from './customer.entity'
import { Image } from './image.entity'

export enum SupportedMeasureType {
  WATER = 'WATER',
  GAS = 'GAS',
}

export type MeasureType = keyof typeof SupportedMeasureType

export const measureTypes = Object.values(SupportedMeasureType)

@Index(
  'idx_customerCode_measureDatetime',
  ['customerCode', 'measureDatetime'],
  { unique: true }
)
@Entity('measures')
export class Measure {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255 })
  customerCode: string

  @Column({ type: 'timestamp' })
  measureDatetime: Date

  @Column({ type: 'enum', enum: measureTypes })
  measureType: MeasureType

  @Column({ type: 'text' })
  imageUrl: string

  @Column({ type: 'integer', nullable: true })
  confirmedValue?: number

  @Column({ type: 'boolean', default: false })
  hasConfirmed: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => Customer, (customer) => customer.measures)
  customer: Customer

  @OneToOne(() => Image, (image) => image.measure)
  @JoinColumn()
  image: Image
}
