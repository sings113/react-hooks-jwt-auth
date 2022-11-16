import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import AuthService from "../services/auth.service";

const BoardAdmin = () => {
  const [content, setContent] = useState([]);
  const [currentUser] = useState(AuthService.getCurrentUser());
  const [modCheckedState, setModCheckedState] = useState(
    new Array(content.length).fill(false)
  );
  const [adminCheckedState, setAdminCheckedState] = useState(
    new Array(content.length).fill(false)
  );
  useEffect(() => {
    UserService.getUsers().then(
      (response) => {
        const updatedModCheckedState = modCheckedState;
        const updatedAdminCheckedState = adminCheckedState;
        response.data.forEach(element => {
          if(element.roles.some(e=>e.id == 2)) {
            updatedModCheckedState[element.id] = true;
          }
          if(element.roles.some(e=>e.id == 3)) {
            updatedAdminCheckedState[element.id] = true;
          }
        });
        setModCheckedState(updatedModCheckedState);
        setAdminCheckedState(updatedAdminCheckedState);
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

  function updateRole(event, role, id) { 
    console.log("update role: " + JSON.stringify(event.target.checked) +", Role:" + role +", Id: " + id) ;
    let check;
    if(role == "mod") {
      // const updatedModCheckedState = modCheckedState.map((item, index) =>
      //   index == id ? !item : item
      // );
      const updatedModCheckedState = modCheckedState;
      updatedModCheckedState[id] = event.target.checked;
      setModCheckedState(updatedModCheckedState);
      check = "modcheck";
    } else if(role =="admin") {
      //   const updatedAdminCheckedState = adminCheckedState.map((item, index) =>
      //   index == id ? !item : item
      // );
      const updatedAdminCheckedState = adminCheckedState;
      updatedAdminCheckedState[id] = event.target.checked;
      setAdminCheckedState(updatedAdminCheckedState);
      check = "admincheck";
    }

    UserService.postModifyRole({"adminRole":adminCheckedState[id] ? "true": "false", "userId": id, "modRole": modCheckedState[id]? "true" : "false"}).then(
      (response) => {
        alert("Roles updated: " + response.data.message);
        window.location.reload();
      },
      (error) => {
        console.log("An error occured during post call: " + JSON.stringify(error));
  
        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
    
  }

  return (
    <div className="container">
      <header className="jumbotron text-center">
        <h3>Admin page</h3>
      </header>
      <table className="table table-striped" id="homestable">
      <thead>
        <tr>
          <th className="text-center">User ID</th>
          <th className="text-center">Username</th>
          <th className="text-center">Email</th>
          <th className="text-center">Password hash</th>
          <th className="text-center">User</th>
          <th className="text-center">Moderator</th>
          <th className="text-center">Admin</th>
        </tr>
      </thead>
      <tbody>
        {}
        {
        content.filter(e => e.id != currentUser.id).map(
          (obj) => {
            return(
            <tr key={obj.id}>
              <td className="text-center">{obj.id}</td>
              <td className="text-center">{obj.username}</td>
              <td className="text-center">{obj.email}</td>
              <td className="text-center" style={{ maxWidth: 300, textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }} title={obj.password}>{obj.password}</td>
             
             <td className="text-center">{(obj.roles.some(e => e.id == 1) && <input type="checkbox" id={"usercheck"+obj.id} disabled checked/>) || <input id={"usercheck"+obj.id} type="checkbox" disabled />}</td>
             <td className="text-center">
             <input
                    type="checkbox"
                    id={"modcheck"+obj.id}
                    checked={modCheckedState[obj.id]}
                    onChange={(e) => updateRole(e, "mod", obj.id)}
                  />
             </td>
             <td className="text-center">
             <input
                    type="checkbox"
                    id={"admincheck"+obj.id}
                    checked={adminCheckedState[obj.id]}
                    onChange={(e) => updateRole(e, "admin", obj.id)}
                  />
             </td>
              {/* 
              <td className="text-center">{(obj.roles.some(e => e.id == 2) && <input type="checkbox" id={"modcheck"+obj.id} checked onChange={(e) => updateRole(e, ""+obj.id+"_mod")}/>) || <input id={"modcheck"+obj.id} type="checkbox" />}</td>
              <td className="text-center">{(obj.roles.some(e => e.id == 3) && <input type="checkbox" id={"admincheck"+obj.id} disabled checked/>) || <input id={"admincheck"+obj.id} type="checkbox" disabled />}</td> */}
            </tr>
            );
          }
        )}
      </tbody>
    </table>
    </div>
  );
};

export default BoardAdmin;
