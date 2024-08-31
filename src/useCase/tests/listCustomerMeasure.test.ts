import { describe, expect, it, vi } from 'vitest'
import { Errors, IError } from '../../errors'
import { IMeasureRepository } from '../../infrastructure/database/repository/measure'
import { MeasureType } from '../../infrastructure/database/typeorm/entities/measure.entity'
import { ListCustomerMeasure } from '../listCustomerMeasure'

const mockMeasureRepository: IMeasureRepository = {
  findAllByCustomerCode: vi.fn(),
  existsMeasureForMonth: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
}

describe('ListCustomerMeasure', () => {
  it('should return measures when valid customerCode and measureType are provided', async () => {
    const listCustomerMeasure = new ListCustomerMeasure(mockMeasureRepository)

    const input = {
      customerCode: '12345',
      measureType: 'WATER',
    }

    const mockMeasures = [
      {
        id: 'measure-uuid-1',
        measureDatetime: new Date(),
        measureType: 'WATER',
        hasConfirmed: true,
        image: { imageUrl: 'http://example.com/image1.png' },
      },
    ]

    mockMeasureRepository.findAllByCustomerCode = vi
      .fn()
      .mockResolvedValue(mockMeasures)

    const output = await listCustomerMeasure.execute(input)

    expect(output).toEqual({
      customer_code: '12345',
      measures: mockMeasures.map((measure) => ({
        measure_uuid: measure.id,
        measure_datetime: measure.measureDatetime,
        measure_type: measure.measureType,
        has_confirmed: measure.hasConfirmed,
        image_url: measure.image.imageUrl,
      })),
    })
  })

  it('should return measures when measureType is undefined', async () => {
    const listCustomerMeasure = new ListCustomerMeasure(mockMeasureRepository)

    const input = {
      customerCode: '12345',
      measureType: undefined as string | undefined,
    }

    const mockMeasures = [
      {
        id: 'measure-uuid-1',
        measureDatetime: new Date(),
        measureType: 'someType' as MeasureType,
        hasConfirmed: true,
        image: { imageUrl: 'http://example.com/image1.png' },
      },
    ]

    mockMeasureRepository.findAllByCustomerCode = vi
      .fn()
      .mockResolvedValue(mockMeasures)

    const output = await listCustomerMeasure.execute(input)

    expect(output).toEqual({
      customer_code: '12345',
      measures: mockMeasures.map((measure) => ({
        measure_uuid: measure.id,
        measure_datetime: measure.measureDatetime,
        measure_type: measure.measureType,
        has_confirmed: measure.hasConfirmed,
        image_url: measure.image.imageUrl,
      })),
    })
  })

  it('should throw an error if an invalid measureType is provided', async () => {
    const listCustomerMeasure = new ListCustomerMeasure(mockMeasureRepository)

    const input = {
      customerCode: '12345',
      measureType: 'invalidType',
    }

    await expect(listCustomerMeasure.execute(input)).rejects.toEqual(<IError>{
      code: Errors.EINVALIDTYPE,
      message: 'Tipo de medição não permitida',
    })
  })

  it('should throw an error if no measures are found', async () => {
    const listCustomerMeasure = new ListCustomerMeasure(mockMeasureRepository)

    const input = {
      customerCode: '12345',
      measureType: 'WATER',
    }

    mockMeasureRepository.findAllByCustomerCode = vi.fn().mockResolvedValue([])

    await expect(listCustomerMeasure.execute(input)).rejects.toEqual(<IError>{
      prefixCode: 'MEASURE',
      code: Errors.ENOTFOUND,
      message: '"Nenhuma leitura encontrada',
    })
  })
})
