import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import "../App.css";
import AuthService from "../services/auth.service";
import axios from "axios";
import authHeader from "../services/auth-header";

const BoardUser = () => {
  const [combi, setCombi] = useState({orders:[], productList:[]});

useEffect(() => {
  const fetchData = async () => {
    const currentUser = AuthService.getCurrentUser();
    const respOrders = await axios(
      'http://localhost:8080/api/test/orderhistoryforuser?userID='+currentUser.id, { headers: authHeader() }
    );
    const respProducts = await axios(
      'http://localhost:8080/api/test/products', { headers: authHeader() }
    );

    setCombi({ orders: respOrders.data, productList: respProducts.data });
  };

  fetchData();
}, []);

  return (
    <div className="container">
      <header className="jumbotron">
        <h3 className="text-center">Order History</h3>
        {/* <ul>
          {content.map((obj) => <li key={obj.id}>#{obj.id}. {obj.title}</li>)}
        </ul> */}
      </header>
      <ul>
      {
        combi.orders.map(
          (obj) => <li key={obj.order_id}><h3>Order ID: {obj.order_id}</h3>
            <table className="table table-striped">
              <thead>
                <tr>
                <th className="text-center">Product ID</th>
                <th className="text-center">Qty</th>
                <th className="text-center">Title</th>
                <th className="text-center">Category</th>
                <th className="text-center">Photo</th>
                </tr>
              </thead>
              <tbody>
                {
                  (obj.productQuantityList).map(
                    (product) => <tr key={product.id}>
                      <td className="text-center">{product.id}</td>
                      <td className="text-center">{product.quantity}</td>
                      <td className="text-center">{combi.productList.find(e => e.id == product.id).title}</td>
                      <td className="text-center">{combi.productList.find(e => e.id == product.id).category}</td>
                      <td className="text-center"><img className="img-fluid rounded mx-auto d-block thumbnail" style={{ maxWidth: 50, textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }} src={combi.productList.find(e => e.id == product.id).image} title= {"Price $"+combi.productList.find(e => e.id == product.id).price} /></td>
                    </tr>
                  )
                }
              </tbody>
            </table>
            <hr/>
          </li>
        )
      }
      </ul>
    </div>
  );
};

export default BoardUser;
