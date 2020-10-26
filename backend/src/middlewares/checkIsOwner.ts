import { Response, NextFunction } from 'express';
import {IAuthRequest} from './checkAuth';
import {Product} from '../models/product.model';

export async function checkIsOwner(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
        const product = await Product.findOne({
            where: {
                id: req.body.id,
                UserId: req.user.id
            }
        });
        if (product) {
            next();
        } else {
            res.status(403).send({ message: 'Unauthorized' });
        }
    } catch (err) {
       next(err);
    }
}
