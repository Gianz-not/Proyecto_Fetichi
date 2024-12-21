document.addEventListener('DOMContentLoaded', function () {
    const productsContainer = document.querySelector('.products__container');
    let cart = [];

    function updateCartDisplay() {
        // No vamos a mostrar el carrito en el html, esto lo hará la siguiente funcionalidad, solo actualiza la variable
    }

    function addItemToCart(productCard) {
        const productName = productCard.querySelector('.titulo__card h3').textContent;
        const priceElement = productCard.querySelector('.precio__card');
        const productPrice = parseFloat(priceElement.textContent.replace(/\D/g, ''));
        const productImage = productCard.querySelector('.img__product img').src;

        const existingItem = cart.find(item => item.name === productName);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name: productName, price: productPrice, quantity: 1, image: productImage });
        }
        updateCartDisplay();
        console.log("carrito actualizado:", cart)
    }

    productsContainer.addEventListener('click', function (event) {
        if (event.target.tagName === 'BUTTON') {
            const productCard = event.target.closest('.card');
            if (productCard) {
                addItemToCart(productCard);
                alert('Producto añadido al carrito');
            }
        }
    });

    // Crear el modal y añadirlo al body
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">×</span>
            <h2>Carrito de Compras</h2>
            <div id="cart-items">
                <!-- Aquí van los elementos del carrito -->
            </div>
             <p id="cart-total">Total: $0</p>
            <button id="checkout-button">Finalizar Compra</button>
        </div>
    `;
    document.body.appendChild(modal);

    //  Abre el modal cuando haces click en un botón en el header llamado "Carrito"
    const openCartButton = document.createElement('li');
    openCartButton.innerHTML = `<a href="#" class="nav-link">Carrito</a>`

    const navBar = document.querySelector('.nav-bar')
    navBar.appendChild(openCartButton)
    openCartButton.addEventListener('click', () => {
        modal.style.display = 'block';
        updateModalCartDisplay();
    });

    //  Cierra el modal cuando haces click en la "X"
    const closeModalButton = modal.querySelector('.close-modal');
    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cerrar el modal si se hace click fuera del modal
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    function removeItemFromCart(index) {
        cart.splice(index, 1);
        updateModalCartDisplay();
        console.log("carrito actualizado:", cart)
    }
    function updateModalCartDisplay() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        cartItemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
               <div class="cart-item-info">
                     <img class="cart-item-image" src="${item.image}" alt="${item.name}">
                    <p>${item.name} x ${item.quantity} - $${item.price * item.quantity}</p>
                </div>
                <button class="remove-item" data-index="${index}">Eliminar</button>

            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;


            const removeButton = itemElement.querySelector('.remove-item');
            removeButton.addEventListener('click', () => {
                const indexToRemove = removeButton.dataset.index;
                removeItemFromCart(indexToRemove);
            });
        });
        cartTotalElement.textContent = `Total: $${total}`;
    }
    // Finalizar compra
    const checkoutButton = modal.querySelector('#checkout-button');
    checkoutButton.addEventListener('click', () => {
        if (cart.length > 0) {
            const cartTotalString = document.getElementById('cart-total').textContent;
           const cartTotal = parseFloat(cartTotalString.replace("Total: $", ""));
            const lastPurchase = {
                items: cart,
                 total: cartTotal
             };
             localStorage.setItem('lastPurchase', JSON.stringify(lastPurchase));
            alert('¡Gracias por tu compra! Los productos y el precio han sido guardados.');
            cart = [];
            updateModalCartDisplay();
            modal.style.display = 'none';
        } else {
            alert('No hay productos en el carrito.');
        }
    });

    // Recuperar última compra del localStorage
    const lastPurchaseData = localStorage.getItem('lastPurchase');
    if (lastPurchaseData) {
        const lastPurchase = JSON.parse(lastPurchaseData)
        console.log('Última compra:', lastPurchase);
        // Puedes mostrar la info en algun otro lado
     }
});