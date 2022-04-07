import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportUserEntity } from './entities/report-user.entity';

@Injectable()
export class UserReportService {
  constructor(
    @InjectRepository(ReportUserEntity)
    private followRepository: Repository<ReportUserEntity>,
  ) {}

  report(userReportedId: number, reason: string): Promise<ReportUserEntity> {
    const report = new ReportUserEntity();
    report.userId = userReportedId;
    report.reason = reason;
    return this.followRepository.save(report);
  }
}
