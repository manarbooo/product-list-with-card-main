document.addEventListener('DOMContentLoaded', () => {
    const cart = [];
    const cartDiv = document.querySelector('.orders');
    const headingSpan = document.querySelector('.headingSpan');
    const emptyImg = document.querySelector('.mainImg');
    const emptyDesc = document.querySelector('.emptyDesc');
    const neutral = document.querySelector('.neutral');
    const confirmBtn = document.querySelector('.confirmBtn');
    const totalOrder = document.querySelector('.totalOrder');
    const confirmOrdersContainer = document.querySelector('.confirmOrders');
    const confirmDivContainer = document.querySelector('.confirmDivContainer');
    const startNewBtn = document.querySelector('.startNew');

    let totalPrice = 0;

    confirmDivContainer.classList.add('invisible');

    

    
    

    confirmBtn.addEventListener('click', () => {
        confirmDivContainer.classList.remove('invisible');
        fillConfirmOrders();
    });

   

    const fillConfirmOrders = () => {
        confirmOrdersContainer.innerHTML = ''; 
    
        cart.forEach(item => {
    
            const orderElem = document.createElement('div');
            orderElem.classList.add('orderConfirmElem');
    
        
            const thumbnail = document.createElement('img');
            thumbnail.classList.add('thumbnail');
            thumbnail.src = item.image.thumbnail; 
            orderElem.appendChild(thumbnail);

            const textContent = document.createElement('article');
            textContent.classList.add('confirmTextContent');
            textContent.innerHTML = `
                <p class="confirmName">${item.name}</p>
                <span class="confirmPriceQuan">
                    <span class="confirmQuantity">${item.quantity}x </span> @$${item.price.toFixed(2)}
                </span>
            `;
            orderElem.appendChild(textContent);
    
            
            const totalConfirmPrice = document.createElement('span');
            totalConfirmPrice.classList.add('totalConfirmPri');
            totalConfirmPrice.textContent = `$${(item.price * item.quantity).toFixed(2)}`;
            orderElem.appendChild(totalConfirmPrice);
    
        
            confirmOrdersContainer.appendChild(orderElem);
    

            const separator = document.createElement('div');
            separator.classList.add('seperator');
            confirmOrdersContainer.appendChild(separator);
        });
    
    
        const totalElem = document.createElement('p');
        totalElem.classList.add('totalOrderConfirm');
        totalElem.innerHTML = `Order Total <span class="totalPriceConfirm"> $${totalPrice.toFixed(2)}</span>`;
        confirmOrdersContainer.appendChild(totalElem);
    };



    const updateCartUI = () => {
        cartDiv.innerHTML = '';  
    
        let updatedTotalPrice = 0;
        let numberOfOrders = 0;

        if (cart.length === 0) {
            emptyImg.classList.remove('invisible'); 
            emptyDesc.classList.remove('invisible');
            
            neutral.classList.add('invisible');
            confirmBtn.classList.add('invisible');

            totalOrder.classList.add('invisible');
            headingSpan.textContent = '(0)';
            

        }else{
            emptyImg.classList.add('invisible'); 
            emptyDesc.classList.add('invisible');

            neutral.classList.remove('invisible');
            confirmBtn.classList.remove('invisible');

            totalOrder.classList.remove('invisible');
            
            cart.forEach(item => {
                const orderDiv = document.createElement('div');
                orderDiv.classList.add('order');
    
                const orderText = document.createElement('article');
                orderText.classList.add('orderText');
                orderText.innerHTML = `  
                    <p class="orderName">${item.name}</p>
                    <p class="quanprice">
                        <span class="quantity">x${item.quantity}</span> 
                        <span class="pricePer1"> @$${item.price.toFixed(2)} </span> 
                        <span class="pricePerTo"> $${(item.price * item.quantity).toFixed(2)} </span>
                    </p>
                `;
                orderDiv.appendChild(orderText);
    
                const removeIcon = document.createElement('img');
                removeIcon.src = 'assets/images/icon-remove-item.svg';
                removeIcon.classList.add('removeIcon');
                removeIcon.addEventListener('click', () => removeFromCart(item.name));
                orderDiv.appendChild(removeIcon);
    
                cartDiv.appendChild(orderDiv);

                updatedTotalPrice += item.price * item.quantity;
                numberOfOrders += item.quantity;
                
            });

            totalOrder.textContent = "Order Total";
            const totalSpan = document.createElement('span');
            totalSpan.classList.add('tPrice');
            totalSpan.textContent = `$${updatedTotalPrice.toFixed(2)}`;
            totalOrder.appendChild(totalSpan);


            headingSpan.textContent = `(${numberOfOrders})`;
    


        }
        
    };
    

    const addToCart = (dessert) => {
        const existingItem = cart.find(item => item.name === dessert.name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...dessert,
                quantity: 1
            });
        }
        totalPrice += dessert.price;
        updateCartUI();
    };

    
    const removeFromCart = (dessertName) => { 
        const itemIndex = cart.findIndex(item => item.name === dessertName);
        if (itemIndex > -1) {
            const item = cart[itemIndex];
            totalPrice -= item.price * item.quantity;
            cart.splice(itemIndex, 1);
            

            const button = document.querySelector(`.btn[data-category="${item.category}"]`);
            if(button){
                button.innerHTML =`
                <img class="shopIcon" src="assets/images/icon-add-to-cart.svg">
                Add to cart
                `;
                button.classList.remove('addToCartBtn');

                const dessertCard = button.closest('.dessertCard');
                const dessertImg = dessertCard.querySelector('.img');

                dessertImg.style.border = 'none';


            }

            updateCartUI();
        }
    };

    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const dessertCategory = e.target.dataset.category.toLowerCase();
            
            const dessertCard = button.closest('.dessertCard');
            const dessertImg = dessertCard.querySelector('.img');

            
           

            fetch('data.json')
                .then(response => response.json())
                .then(data => {
                    const dessert = data.find(d => d.category.toLowerCase() === dessertCategory); 
                    if (dessert) {
                        button.innerHTML = ` 
                            <img class="minusIcon" src="assets/images/icon-decrement-quantity.svg">
                            <span class="quantityDisplay">0</span>
                            <img class="plusIcon" src="assets/images/icon-increment-quantity.svg">
                        `;

                        setTimeout(()=> {
                            button.classList.add('addToCartBtn');
                        }, 0);
                          
                        
                        dessertImg.style.border = '2px solid var(--Red)';



                        const minusIcon = button.querySelector('.minusIcon');
                        const plusIcon = button.querySelector('.plusIcon');
                        const quantityDisplay = button.querySelector('.quantityDisplay');

                        let quantity = 0;

                        plusIcon.addEventListener('click', () => {
                            quantity += 1;
                            quantityDisplay.textContent = quantity;

                            if (quantity === 1) {
                                addToCart(dessert);
                            } else {
                                updateCartQuantity(dessert, quantity);
                            }

                            updateCartUI();
                        });

                        minusIcon.addEventListener('click', () => {
                            if (quantity > 0) {
                                quantity -= 1;
                                quantityDisplay.textContent = quantity;
                            }
                            if (quantity === 0) {
                                removeFromCart(dessert.name); 
                            } else {
                                updateCartQuantity(dessert, quantity);
                            }

                            updateCartUI();
                        });
                    }
                });
        });
    });

    const updateCartQuantity = (dessert, newQuantity) => {  
        const itemIndex = cart.findIndex(item => item.name === dessert.name);
        if (itemIndex > -1) {
            cart[itemIndex].quantity = newQuantity;
            cart[itemIndex].totalPrice = cart[itemIndex].price * newQuantity;
        }
    };


    startNewBtn.addEventListener('click', () => {
        location.reload();
    });


});


