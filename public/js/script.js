
function addToCart(productId) {
  
  $.ajax({
    url: "/addtocart/" + productId,
    method: "get",
    success: (response) => {
      location.reload()
      console.log(response);
      if(response.success){
        alert('added to cart');
      }else{
        window.location.replace('/login')
      }
      
    },
  });
}
function changeQuantity(cartId, productId, count) {
  let quantity = parseInt(document.getElementById(productId).innerHTML);
  count = parseInt(count);
  $.ajax({
    url: "/change-product-quantity/",
    data: {
      cartId: cartId,
      productId: productId,
      count: count,
      quantity: quantity,
    },
    method: "post",
    success: (response) => {
      
      if (response.removeProduct) {
        Swal.fire("product removed from cart");
        location.reload();
      } else {
        location.reload();
        document.getElementById(productId).innerHTML = quantity + count;
        // document.getElementById()
        
      }
    },
  });
}
function removeProduct(cartId,productId){
  $.ajax({
    url:"/remove-cart-item/",
    data:{
      cartId:cartId,
      productId:productId
    },
    method:"post",
    success:(response)=>{
      Swal.fire("one item removed from cart")
      location.reload()
    }
  })
}

function addToWishlist(productId) {
  $.ajax({
    url: "/addtoWishlist/" + productId,
    method: "get",
    success: (response) => {
      if(response){

        Swal.fire('item already exists in wishlist')
      }else{
        Swal.fire('Added To Wishlist')

      }

    },
  });
}

function removeWishlist(wishlistID,productId){
  $.ajax({
    url:"/remove-wishlist-item/",
    data:{
      wishlistID:wishlistID,
      productId:productId
    },
    method:"post",
    success:(response)=>{
      if(response.removeProduct){

      Swal.fire('one item removed from cart')
      location.reload();
      }
    }
  })
}
function moveToCart(wishlistID,productID){
  $.ajax({
    url:"/move-to-cart/",
    data:{
      wishlistID:wishlistID,
      productID:productID
    },
    method:"post",
    success:(response)=>{
      Swal.fire('Added To Cart')
      location.reload();

    }
  })
}
