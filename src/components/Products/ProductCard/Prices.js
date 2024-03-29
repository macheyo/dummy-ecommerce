import {
	Price,
	PrevPrice,
} from './product-card-styling';
import DecimalPrecision from '../../../js/decimalPrecision';
import { discountedPrice } from '../../../js/reusableFuncs';
export default function ProductPrices(props) {
	const { discount, price } = props;
	const roundedPrice = DecimalPrecision.round(discountedPrice(price, discount), 2);
	return (
		<span>
			<Price>
				R{discount ? roundedPrice : price}
			</Price>
			{
				discount &&
				<PrevPrice>
					R{price}
				</PrevPrice>
			}
		</span>
	)
}