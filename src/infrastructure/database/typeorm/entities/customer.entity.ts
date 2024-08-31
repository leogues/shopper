import {
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Measure } from './measure.entity'

@Entity('customers')
export class Customer {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  customerCode: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => Measure, (measure) => measure.customer)
  measures: Measure[]
}
