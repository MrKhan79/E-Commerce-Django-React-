import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LinkContainer } from 'react-router-bootstrap'
import { Button, Table} from "react-bootstrap";
import { listUsers, deleteUser, userLogin } from "../actions/userActions";


const UserListScreen = () => {
   
  const dispatch = useDispatch()
  const userList = useSelector(state=> state.userList)
  const {loading, error, users} = userList

  const userLogin = useSelector(state=> state.userLogin)
  const {userInfo} = userLogin

  
  const userDelete = useSelector(state=> state.userDelete)
  const {loading: deleteLoading, error: deleteError, success: successDelete} = userDelete

  const history = useNavigate()

  useEffect(()=>{
    
    if(userInfo && userInfo.isAdmin){
        dispatch(listUsers())
    }else{
        history('/login')
    }
    dispatch(listUsers())

  },[dispatch, history, successDelete, userInfo])

  const deleteHandler = (id) =>{
    if(window.confirm("Are you sure you want to delete this user?")){
        dispatch(deleteUser(id))

    }
  }
  
  return (
    <div>
        <h1>Users</h1>
        {loading?
         <Loader/>:
         error?
        <Message variant='danger'>{error}</Message>:
        (
            <Table striped bordered hover className="table-sm">
               <thead>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ADMIN</th>
                <th></th>

               </thead>
               <tbody>
                {users.map(user =>(
                    <tr key={user._id}>
                        <td>{user._id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.isAdmin?(
                            <i className="fas fa-check" style={{color: 'green'}}></i>
                        ):(
                            <i className="fas fa-close" style={{color: 'red'}}></i>
                        )}</td>
                        <td>
                            <LinkContainer to={`/admin/user/${user._id}/edit`} >
                                <Button variant="" className="btn">
                                <i  className="fas fa-edit" style={{color: '#2E8BC0'}}></i>
                                </Button>
                            </LinkContainer>
                            <Button variant="" className="btn" onClick={()=> deleteHandler(user._id)}>
                                <i  className="fas fa-trash" style={{color: '#E7625F'}}></i>
                            </Button>
                        </td>

                    </tr>
                ))}
               </tbody>
            </Table>
        )}
    </div>
  )
}

export default UserListScreen
