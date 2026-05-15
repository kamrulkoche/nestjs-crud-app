import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from '../../entities/setting.entity';
import { UpsertSettingDto } from './dto/upsert-setting.dto';

const DEFAULT_SETTINGS: Array<{
  key: string;
  value: string;
  label: string;
  description: string;
}> = [
  {
    key: 'site_name',
    value: 'Varsity',
    label: 'Site name',
    description: 'Displayed in the header, footer, and emails',
  },
  {
    key: 'site_tagline',
    value: 'A modern university management platform',
    label: 'Tagline',
    description: 'One-line description used on the home page',
  },
  {
    key: 'contact_email',
    value: 'admissions@varsity.edu',
    label: 'Contact email',
    description: 'Primary email shown on the contact page',
  },
  {
    key: 'contact_phone',
    value: '+880 1700-123456',
    label: 'Contact phone',
    description: 'Primary phone number',
  },
  {
    key: 'address',
    value: 'Main Campus, Dhaka 1212, Bangladesh',
    label: 'Address',
    description: 'Campus address shown in the footer and contact page',
  },
  {
    key: 'admission_open',
    value: 'true',
    label: 'Admissions open',
    description: 'Toggle the admission CTA on the home page',
  },
];

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  async findAll() {
    const existing = await this.settingRepository.find({
      order: { key: 'ASC' },
    });
    const existingKeys = new Set(existing.map((s) => s.key));
    const missing = DEFAULT_SETTINGS.filter((d) => !existingKeys.has(d.key));
    if (missing.length > 0) {
      await this.settingRepository.save(missing.map((m) => ({ ...m })));
      return this.settingRepository.find({ order: { key: 'ASC' } });
    }
    return existing;
  }

  async findOne(key: string) {
    const setting = await this.settingRepository.findOne({ where: { key } });
    if (!setting) {
      throw new NotFoundException(`Setting "${key}" not found`);
    }
    return setting;
  }

  async upsert(dto: UpsertSettingDto) {
    let setting = await this.settingRepository.findOne({
      where: { key: dto.key },
    });
    if (setting) {
      Object.assign(setting, dto);
    } else {
      setting = this.settingRepository.create(dto);
    }
    return this.settingRepository.save(setting);
  }

  async remove(key: string) {
    const result = await this.settingRepository.delete({ key });
    if (result.affected === 0) {
      throw new NotFoundException(`Setting "${key}" not found`);
    }
    return { deleted: true };
  }
}
