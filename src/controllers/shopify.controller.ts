import express, { Request, Response } from 'express';
import serverless from 'serverless-http';
import { generateHashEmail } from '@shared/utils/common.util';
import { ROUTES } from '@config/routes';
import { Logger } from '@shared/helpers/logger.helper';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post(`${ROUTES.shopify}/carrier`, async (req: Request, res: Response, next) => {
  const requestBody = req.body;
  const defaultShippingRate = 500000;
  const shippingFee = requestBody.rate.items.reduce((accumulator: number, item: any) => {
    const fee = 100 * parseInt(item.properties['Shipping fee'].slice(1).replace(',', ''));
    return accumulator + fee;
  }, 0);

  return res.send({
    rates: [
      {
        service_name: 'Standard',
        description: 'Provided by MK',
        service_code: generateHashEmail(`Carrier Shipping Rate ${Math.random()}`),
        currency: 'VND',
        total_price: shippingFee || defaultShippingRate
      }
    ]
  });
});

export const handler = serverless(app);
