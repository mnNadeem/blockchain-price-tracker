import { EChain } from 'src/enums/chain.enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: EChain,
  })
  chain: EChain;

  @Column({ name: 'target-price' })
  targetPrice: number;
}
