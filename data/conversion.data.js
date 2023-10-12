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

export const Conversion = model('Conversion', ConversionSchema)
