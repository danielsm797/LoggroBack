import { ConversionSchema } from '../models/conversion.model.js'
import { model } from 'mongoose'

ConversionSchema.statics.create = async function ({ doc }) {

  const obj = {
    dta: null,
    err: false
  };

  try {

    const conversion = new Conversion(doc)

    obj.dta = await conversion.save()

  } catch (error) {

    obj.dta = error;

    obj.err = true;
  }

  return obj;
}

ConversionSchema.statics.searchByFilter = async function ({ filter, fields }) {

  const obj = {
    dta: null,
    err: false
  };

  try {

    obj.dta = await this.find(filter, fields).lean()

  } catch (error) {

    obj.dta = error;

    obj.err = true;
  }

  return obj;
}

ConversionSchema.statics.searchGroupByHour = async function () {

  const obj = {
    dta: null,
    err: false
  };

  try {

    obj.dta = await this.aggregate(
      [
        {
          $addFields:
          {
            hora:
            {
              $dateToString:
              {
                // format: "%Y%m%d%H",
                format: "%H",
                date: "$createdAt"
              }
            }
          }
        },
        {
          $group:
          {
            _id: '$hora',
            count:
            {
              $count: {}
            }
          }
        },
        {
          $sort:
          {
            _id: 1
          }
        }
      ]
    )

  } catch (error) {

    obj.dta = error;

    obj.err = true;
  }

  return obj;
}

export const Conversion = model('Conversion', ConversionSchema)
