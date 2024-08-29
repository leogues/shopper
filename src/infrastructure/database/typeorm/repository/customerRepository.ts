import { DataSource, Repository } from 'typeorm'
import { ICustomerRepository } from '../../repository/customer'
import { Customer } from '../entities/customer.entity'

export class CustomerRepository implements ICustomerRepository {
  private readonly customerRepository: Repository<Customer>
  constructor(dataSource: DataSource) {
    this.customerRepository = dataSource.getRepository(Customer)
  }
  async findByCodeOrCreate(customerCode: string): Promise<Customer> {
    let customer = await this.customerRepository.findOneBy({ customerCode })
    if (!customer) {
      customer = this.customerRepository.create({ customerCode })
      await this.customerRepository.save(customer)
    }
    return customer
  }
}
