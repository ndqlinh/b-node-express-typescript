import express, { Request, Response } from 'express';
import serverless from 'serverless-http';
import { generateHashEmail } from '@shared/utils/common.util';
import { ROUTES } from '@config/routes';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post(`${ROUTES.shopify}/carrier`, async (req: Request, res: Response, next) => {
  const requestBody = req.body;
  const defaultShippingRate = 500000;
  const shippingFee = requestBody.rate.items.reduce((accumulator, item) => {
    const fee = 100 * parseInt(item.properties.shippingFee.slice(1).replace(',', ''));
    console.log('Accumulator: ', +accumulator);
    console.log('Item fee: ', fee);
    console.log('Sum', accumulator + fee);
    return accumulator + fee;
  }, 0);

  return res.send({
    rates: [
      {
        service_name: 'Carrier Rate',
        description: 'Provided by carrier service',
        service_code: generateHashEmail(`Carrier Shipping Rate ${Math.random()}`),
        currency: 'VND',
        total_price: shippingFee || defaultShippingRate
      }
    ]
  });
});

export const handler = serverless(app);
