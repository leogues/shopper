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

@Index('idx_imageId', ['imageId'])
@Index('idx_customerCode_measureType', ['customerCode', 'measureType'])
@Index('idx_customerCode_measureDatetime', ['customerCode', 'measureDatetime'])
@Entity('measures')
export class Measure {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'timestamp', nullable: false })
  measureDatetime: Date

  @Column({ type: 'enum', enum: measureTypes, nullable: false })
  measureType: MeasureType

  @Column({ type: 'integer', nullable: false })
  measureValue: number

  @Column({ type: 'boolean', default: false })
  hasConfirmed: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({ type: 'varchar', length: 255, nullable: false })
  customerCode: string

  @Column({ type: 'uuid', nullable: false })
  imageId: string

  @ManyToOne(() => Customer, (customer) => customer.measures)
  @JoinColumn({ name: 'customerCode' })
  customer: Customer

  @OneToOne(() => Image, (image) => image.measure)
  @JoinColumn({ name: 'imageId' })
  image: Image
}
