import React, { useState, useEffect } from "react";
import { CartProvider, useCart } from "react-use-cart";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import AuthService from "../services/auth.service";


function Page() {
  const { addItem, inCart, setCartMetadata } = useCart();
  const [content, setContent] = useState([]);

  useEffect(() => {
    UserService.getProducts().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(_content);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }, []);

  return (
  <div className="container">
    <table className="table table-striped" id="homestable">
      <thead>
        <tr>
          <th className="text-center">ID</th>
          <th className="text-center">Title</th>
          <th className="text-center">Price</th>
          <th className="text-center">Category</th>
          <th className="text-center">Rating</th>
          <th className="text-center">Description</th>
          <th className="text-center">Photo</th>
          <th className="text-center">Add to cart</th>
        </tr>
      </thead>
      <tbody>
        {content.map(
          (obj) => {
            const alreadyAdded = inCart(obj.id);
            return(
            <tr key={obj.id}>
              <td className="text-center">{obj.id}</td>
              <td className="text-center">{obj.title}</td>
              <td className="text-center">{obj.price.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}</td>
              <td className="text-center">{obj.category}</td>
              <td className="text-center">{obj.rating.rate}</td>
              <td className="text-center" title={obj.description} style={{ maxWidth: 300, textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>{obj.description}</td>
              <td className="text-center"><img className="img-fluid rounded mx-auto d-block" src={obj.image} /></td>
              <td className="text-center">
                <button onClick={() => addItem(obj)}>
                  {alreadyAdded ? "Add again" : "Add to Cart"}
                </button>
              </td>
            </tr>
            );
          }
        )}
      </tbody>
    </table>
  </div>);
}

 

function Cart() {
  const {
    isEmpty,
    cartTotal,
    totalUniqueItems,
    items,
    updateItemQuantity,
    removeItem,
    emptyCart,
    metadata,
    clearCartMetadata,
    setCartMetadata,
    updateCartMetadata
  } = useCart();

  function doCheckout() {
    const currentUser = AuthService.getCurrentUser();
    UserService.postOrder({"productQty":items, "userId": currentUser.id}).then(
      (response) => {
        alert("New order generated: " + response.data.newOrderIdCreated);
        emptyCart();
      },
      (error) => {
        console.log("An error occured during post call: " + JSON.stringify(error));
  
        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }
  
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    // console.log("metdata: " + JSON.stringify(metadata));
    if(metadata == undefined) {
      console.log("metdata undefined");
      setCartMetadata(currentUser);
    } else {
      console.log("metdata: " + JSON.stringify(metadata));
      if(metadata.id !== currentUser.id) {
        emptyCart();
        clearCartMetadata();
        setCartMetadata(currentUser);
      } else {
        console.log("IDs in cart and metadata are same");
      }
    }
  }, []);

  if (isEmpty) return <h3>Your cart is empty</h3>;

  return (
    <>
      <h1>
        Cart ({totalUniqueItems == 1 ? "1 item" : totalUniqueItems + " items"} - Total: {cartTotal.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })})
      </h1>

      {/* <pre>{JSON.stringify(metadata, null, 2)}</pre> */}

      {!isEmpty && <button onClick={emptyCart}>Empty cart</button>}

      {!isEmpty && <button onClick={doCheckout}>Checkout</button>}


      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.quantity} x {item.title}
            <button
              onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
            >
              -
            </button>
            <button
              onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
            >
              +
            </button>
            <button onClick={() => removeItem(item.id)}>Remove &times;</button>
          </li>
        ))}
      </ul>
    </>
  );
}

const BoardShoppingCart = () => {


  return (
    <div>
      <header className="jumbotron">
        <h1 className="text-center">Add items to cart</h1>
      </header>
      <CartProvider
        id="jamie"
        onItemAdd={(item) => console.log(`Item ${item.id} added!`)}
        onItemUpdate={(item) => console.log(`Item ${item.id} updated.!`)}
        onItemRemove={() => console.log(`Item removed!`)}
      >
        <Cart />
        <Page />
      </CartProvider>
    </div>
  );
};

export default BoardShoppingCart;
