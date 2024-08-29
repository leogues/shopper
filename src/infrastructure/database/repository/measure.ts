export interface IMeasureRepository {
  existsMeasureForMonth(
    customerCode: string,
    measureType: string,
    date: Date
  ): Promise<boolean>
}
