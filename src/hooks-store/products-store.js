import { initStore } from "./store";

const initialProductList = [
	{
		id: "p1",
		title: "Red Scarf",
		description: "A pretty red scarf.",
		isFavorite: false,
	},
	{
		id: "p2",
		title: "Blue T-Shirt",
		description: "A pretty blue t-shirt.",
		isFavorite: false,
	},
	{
		id: "p3",
		title: "Green Trousers",
		description: "A pair of lightly green trousers.",
		isFavorite: false,
	},
	{
		id: "p4",
		title: "Orange Hat",
		description: "Street style! An orange hat.",
		isFavorite: false,
	},
];

// configure products-specific store with
// products state (initial products array) and products-specific actions
// beware of (potential) action names clash!
const configureProductsStore = () => {
	const actions = {
		TOGGLE_FAV: (currentState, productId) => {
			const updatedProducts = currentState.products.map((product) =>
				product.id !== productId
					? product
					: { ...product, isFavorite: !product.isFavorite }
			);
      return { ...currentState, products: updatedProducts };
		},
	};
  // initialize products store
	initStore(actions, { products: initialProductList });
};

export default configureProductsStore;
