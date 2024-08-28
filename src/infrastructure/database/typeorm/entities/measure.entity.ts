import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Customer } from './customer.entity'
import { Image } from './image.entity'

export enum SupportedMeasureType {
  WATER = 'water',
  GAS = 'gas',
}

export type MeasureType = keyof typeof SupportedMeasureType

@Entity('measures')
export class Measure {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255 })
  customerCode: string

  @Column({ type: 'timestamp' })
  measureDatetime: Date

  @Column({ type: 'enum', enum: ['water', 'gas'] })
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
