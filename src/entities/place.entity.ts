import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DecimalColumnTransformer } from 'src/utils/transformers/decimalColumnTransformer';
import { PlaceReview } from './placeReview.entity';
import { PlaceVisitRecord } from './placeVisitRecord.entity';

@Entity()
export class Place {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  googlePlaceId: string;

  @Column()
  name: string;

  @Column('decimal', { transformer: new DecimalColumnTransformer() })
  latitude: number;

  @Column('decimal', { transformer: new DecimalColumnTransformer() })
  longitude: number;

  @OneToMany(() => PlaceReview, (review) => review.place)
  reviews: PlaceReview[];

  @OneToMany(() => PlaceVisitRecord, (visitRecord) => visitRecord.place)
  visitRecords: PlaceVisitRecord[];
}
