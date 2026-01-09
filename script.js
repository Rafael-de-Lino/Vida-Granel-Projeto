import { products } from "./products.js";



const productsContainer = document.getElementById("products");

let allProducts = products;

function renderProducts(list) {
    productsContainer.innerHTML = "";

    list.forEach(product => {
        const productHTML = `
            <div class="border-2 border-green-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition flex flex-col items-center text-center bg-green">
                <img 
                    src="${product.image}"
                    alt="${product.name}"
                    class="w-28 h-28 rounded-md"
                />
                <div>
                    <p class="font-bold">${product.name}</p>
                    <p class="text-sm">${product.description}</p>

                    <div class="flex items-center gap-2 mt-2">
                        <p class="font-bold">R$ ${product.price.toFixed(2)}</p>
                        <button 
                            class="add-to-cart-btn bg-gray-900 px-3 rounded"
                            data-name="${product.name}"
                            data-price="${product.price}"
                        >
                            <i class="fa fa-cart-plus text-white"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        productsContainer.insertAdjacentHTML("beforeend", productHTML);
    });
}

renderProducts(allProducts);


const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContaner = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-Total")
const chceckoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document. getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function(){
    upadateCartModal();
    cartModal.style.display = "flex"
})

// Fechar o modal quando clicar fora
cartModal.addEventListener("click",function(event){
   if(event.target === cartModal){
      cartModal.style.display = "none"
   }
})

//Botao de fechar do modal
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

productsContainer.addEventListener("click", function(event){
    const parentButton = event.target.closest(".add-to-cart-btn")

    if(!parentButton) return;

        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));

        addToCart(name, price);
    
})

//Função para adicionar no carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        //Se o item já existe, aumenta apenas a quantidade + 1
        existingItem.quantity +=1;

    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    upadateCartModal()

}

//Atualiza o carrinho
function upadateCartModal(){
    cartItemsContaner.innerHTML = "";
    let total = 0;
    cart.forEach(item=> {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML =`
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

                    <button class="remove-from-cart-btn bg-red-500 text-white px-3 py-1 rounded" data-name="${item.name}">
                        Remover
                    </button>

            </div>
        `

        total += item.price * item.quantity;
        
        cartItemsContaner.appendChild(cartItemElement)

    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;

}

//FUNÇÃO PARA REMOVER O ITEM
cartItemsContaner.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -=1;
            upadateCartModal();
            return;
        }

        cart.splice(index, 1);
        upadateCartModal();


    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }

})
//Finalizar pedido
chceckoutBtn.addEventListener("click", function(){
    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //Enviar o pedido para api whats
    const cartItems = cart.map((item) => {
        return (
            `${item.name}
            Quantidade: ${item.quantity}
            Preço: R$ ${item.price.toFixed(2)}`
        )
    }).join("\n\n")

    const totalPedido = cart.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
}, 0);


    const finalMessage=`
    *Pedido Vida Granel*

    ${cartItems}
    \nTotal do pedido: R$ ${totalPedido.toFixed(2)}
      Endereço de entrega: ${addressInput.value}`;



    const message = encodeURIComponent(finalMessage)
    const phone = "+5512992168213"

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank")

    cart = [];
    upadateCartModal();

})

//Verificar a hora e manipular o card horario
function checkLojaOpen(){
    const data = new Date();
    const hora = data.getHours();
    const diaSemana = data.getDay();
    //Seg a Sex
    if(diaSemana >= 1 && diaSemana <= 5){
        return hora >=8 && hora < 18;
    }
    //Sabádo
    if(diaSemana === 6){
        return hora >=8 && hora < 12;
    }
    //Domingo
    return false;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkLojaOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}


//CAMPO DE BUSCA
const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", function () {
    const value = searchInput.value.toLowerCase();

    const filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(value)
    );

    renderProducts(filteredProducts);
});
//FIM CAMPO DE BUSCA