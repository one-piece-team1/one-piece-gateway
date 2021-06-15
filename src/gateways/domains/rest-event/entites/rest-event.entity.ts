import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RestEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  status: boolean;

  @Column({ type: 'varchar', nullable: false })
  path: string;

  @Column({ type: 'jsonb', nullable: true })
  headers?: Array<any>;

  @Column({ type: 'jsonb', nullable: true })
  querys?: Array<any>;

  @Column({ type: 'jsonb', nullable: true })
  params?: Array<any>;

  @Column({ type: 'jsonb', nullable: true })
  body?: Array<any>;

  @Column({ type: 'jsonb', nullable: true })
  files?: Array<any>;

  @Column({ type: 'jsonb', nullable: true })
  cookies?: Array<any>;

  @Column({ type: 'jsonb', nullable: true })
  response?: Array<any>;
}
