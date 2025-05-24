import type { Dayjs } from 'dayjs';

export type RangeValue = [Dayjs, Dayjs];

export type DcybhChild = {
  icon: string;
  name: string;
  key: string;
  filter: (val: string | null | undefined) => string;
};

export type StatusList = {
  header: string;
  children: DcybhChild[];
};

export type OtherStatusList = {
  name: string;
  key: string;
  filter: (val: string | null | undefined, key: string) => string;
};
