import { Customer } from '../typeorm/entities/customer.entity'

export interface ICustomerRepository {
  findByCodeOrCreate(customerCode: string): Promise<Customer>
}
