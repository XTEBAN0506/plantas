const initialState = {
    cart: [],
    totalItems: 0,
    totalCost: 0
};

function cartReducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD_TO_CART':
            const existingItem = state.cart.find(item => item.id === action.payload.id);
            if (existingItem) {
                return state; // Evitar añadir el mismo artículo más de una vez
            }
            return {
                ...state,
                cart: [...state.cart, action.payload],
                totalItems: state.totalItems + 1,
                totalCost: state.totalCost + action.payload.price
            };
        case 'REMOVE_FROM_CART':
            const updatedCart = state.cart.filter(item => item.id !== action.payload.id);
            return {
                ...state,
                cart: updatedCart,
                totalItems: state.totalItems - 1,
                totalCost: state.totalCost - action.payload.price
            };
        default:
            return state;
    }
}

function createStore(reducer) {
    let state = reducer(undefined, {});  // Inicializa el estado
    const listeners = [];

    const getState = () => state;

    const dispatch = (action) => {
        state = reducer(state, action);
        listeners.forEach(listener => listener());
    };

    const subscribe = (listener) => {
        listeners.push(listener);
        return () => {
            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
        };
    };

    dispatch({}); // Inicializa el estado

    return { getState, dispatch, subscribe };
}

const store = createStore(cartReducer);
