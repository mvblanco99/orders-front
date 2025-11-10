export interface DateRange {
  startDate: string;
  endDate: string;
}

export type DateRangePickerProps =
  | 'today'
  | 'yesterday'
  | 'last7Days'
  | 'lastWeek'
  | 'currentMonth'
  | 'lastMonth'
  | 'last12Months'
  | 'currentYear'
  | 'lastYear';
