import {
	useState, useEffect, useReducer, useCallback,
} from 'react';
import './App.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import { stateReducer } from './js/reducers/stateReducer';
import {v4 as uuid} from 'uuid'

import Footer from './components/Footer';
import Header from './components/Header';
import Page from './route';

// setup api varibles
const DUMMY_JSON_ARGS = { limit: 70, skip: 0 };
const { limit, skip } = DUMMY_JSON_ARGS;
const jsonURL = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;

export default function App() {
	console.log(!!localStorage.getItem('cart'), !!localStorage.getItem('cart_id'));
	console.log(localStorage.getItem('cart_id'));
	const initialState = { products: [], cart: !!localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [], cart_id : !!localStorage.getItem('cart_id')? JSON.parse(localStorage.getItem('cart_id')) : '' };
	const [state, dispatch] = useReducer(stateReducer, initialState);
	const [itemsArranger, setItemsArranger] = useState({
		// type of methods used to arrange products in shop
		methods: {
			search: '',
			category: '',
			priceRange: {
				min: '', max: '',
			},
			orderBy: '',
			sortBy: 'desc',
		},
		previous: {
			// used items arranger method previously 
			usedType: 'desc',
		},
	});

	// fetch api data and initialize
	useEffect(() => {
		fetch(jsonURL)
			.then(res => res.json())
			.then(data => dispatch({
				type: 'INIT_PRODUCTS',
				payload: data.products,
			}));
	}, []);

	const handleItemsArranger = useCallback(({ value, type }) => {
		const lastMethodUsed = type === itemsArranger.previous.usedType;
		const isAnyValueChanged = !(lastMethodUsed && value === itemsArranger.methods[lastMethodUsed]);
		//if nothing changed skip the state update
		if (!isAnyValueChanged) return;
		// as the set of properties inside the method prop 
		if (!type) {
			setItemsArranger(itemsArranger => ({
				...itemsArranger,
				methods: {
					...itemsArranger.methods,
					...value,
				},
			}))
		} else {
			setItemsArranger(itemsArranger => ({
				...itemsArranger,
				methods: {
					...itemsArranger.methods,
					[type]: value,
				},
				previous: {
					...itemsArranger.previous,
					usedType: lastMethodUsed,
				},
			}))
		}
	}, [itemsArranger.methods, itemsArranger.previous.usedType]);

	// getters
	const getTotalItemsInCart = useCallback(() => {
		const { cart } = state;
		return cart.reduce((total, item) => {
			return total += item.quantity;
		}, 0);
	}, [state]);

	const getItemQty = (id) => {
		const { cart } = state;
		const cartItemByIdArr = cart.filter(item => id === item.id);
		return cartItemByIdArr.length ? cartItemByIdArr[0].quantity : 0;
	}

	// dispatching actions
	const addItemToCart = useCallback((payload) => dispatch({ type: 'ADD_ITEM_TO_CART', payload }), []);
	const setCartItemQty = useCallback((payload) => dispatch({ type: 'SET_ITEM_QTY', payload }), []);
	const decrementItemQty = useCallback((payload) => dispatch({ type: 'DECREMENT_ITEM_QTY', payload }), []);
	const removeItemFromCart = useCallback((payload) => dispatch({ type: 'REMOVE_ITEM', payload }), []);
	const resetCart = useCallback(() => dispatch({ type: 'RESET_CART' }), []);

	// passing dispatched actions as props
	const mapDispatchToProps = {
		addItemToCart, 
		setCartItemQty, 
		decrementItemQty, 
		removeItemFromCart, 
		resetCart,
	};
	const [currentCart, setCurrentCart] = useState([])

	useEffect(()=>{
		console.log('the state is : ', state)
		localStorage.setItem('cart', JSON.stringify(state.cart))
		localStorage.setItem('cart_id', JSON.stringify(state.cart_id))
		setCurrentCart(JSON.parse(localStorage.getItem('cart')))
	},[state])

	// compile props to pass to page components
	const propsForViews = {
		products: state.products,
		cart: currentCart,
		cart_id: state.cart_id,
		itemsArrangerMethods: itemsArranger.methods,
		getTotalItemsInCart,
		getItemQty,
		handleItemsArranger,
		mapDispatchToProps,
	};

	return (
		<div className="App">
			<Header getTotalItemsInCart={getTotalItemsInCart} />
			<Page {...propsForViews} />
			<Footer />
		</div>
	);
}