import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import AuthService from "../services/auth.service";


function Page() {
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
                <button disabled>
                  View mode only
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

 



const BoardModerator = () => {


  return (
    <div>
      <header className="jumbotron">
        <h1 className="text-center">Moderator can only view products</h1>
      </header>
      
        <Page />
    </div>
  );
};

export default BoardModerator;
