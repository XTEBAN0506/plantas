document.addEventListener('DOMContentLoaded', () => {
    // Asegúrate de que estas variables estén correctamente inicializadas
    const cartCountElement = document.getElementById('cart-count');
    const totalItemsElement = document.getElementById('total-items');
    const totalCostElement = document.getElementById('total-cost');
    const cartContainer = document.getElementById('cart-container');

    function renderCart() {
        const state = store.getState();
        cartCountElement.textContent = state.totalItems;

        if (totalItemsElement && totalCostElement) {
            totalItemsElement.textContent = state.totalItems;
            totalCostElement.textContent = state.totalCost.toFixed(2);
        }

        if (cartContainer) {
            cartContainer.innerHTML = '';
            state.cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <p>${item.name}</p>
                    <p>$${item.price.toFixed(2)}</p>
                    <button class="remove-from-cart" data-id="${item.id}">Eliminar</button>
                `;
                cartContainer.appendChild(cartItem);
            });

            document.querySelectorAll('.remove-from-cart').forEach(button => {
                button.addEventListener('click', (event) => {
                    const id = parseInt(event.target.dataset.id);
                    const product = state.cart.find(item => item.id === id);
                    store.dispatch({ type: 'REMOVE_FROM_CART', payload: product });

                    // Reactiva el botón de añadir a la cesta
                    const addButton = document.querySelector(`.product[data-id="${id}"] .add-to-cart`);
                    if (addButton) addButton.disabled = false;
                });
            });
        }
    }

    store.subscribe(renderCart);
    renderCart();  // Llama a renderCart para inicializar la vista del carrito

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            const productElement = event.target.closest('.product');
            const id = parseInt(productElement.dataset.id);
            const name = productElement.querySelector('h2').textContent;
            const price = parseFloat(productElement.querySelector('p').textContent.replace('$', ''));
            const image = productElement.querySelector('img').src;

            store.dispatch({
                type: 'ADD_TO_CART',
                payload: { id, name, price, image }
            });

            event.target.disabled = true;  // Desactiva el botón después de añadir al carrito
        });
    });
});
