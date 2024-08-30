import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Measure } from './measure.entity'

@Entity('images')
export class Image {
  @PrimaryColumn('uuid')
  id: string

  @Column({ type: 'text' })
  imageName: string

  @Column({ type: 'text' })
  imageUrl: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToOne(() => Measure, (measure) => measure.image)
  measure: Measure
}
