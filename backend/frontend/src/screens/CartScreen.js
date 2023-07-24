import { useEffect } from "react"
import React from 'react'
import { Link, useParams, useNavigate,useSearchParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col, ListGroup, Image, Form, Button, Card } from "react-bootstrap"
import Message from "../components/Message"
import { addToCart, removeFromCart } from "../actions/cartActions"

const CartScreen = () => {

const { id } = useParams();
const productId = id
console.log(id)
const [searchParams] = useSearchParams();
const qty = searchParams.get("qty")? Number(searchParams.get("qty")) :1
let history = useNavigate()
const dispatch = useDispatch()
const cart = useSelector(state => state.cart)
const {cartItems} =cart
console.log("cartItems: ", cartItems)

useEffect(()=>{
    if(id){
        console.log("lauda")
        dispatch(addToCart(id, qty))
    }
}, [dispatch, id, qty])

const removeFromCartHandler = (id) =>{
    dispatch(removeFromCart(id))
}


const checkoutHandler = () =>{
 
    history(`/shipping`)
}


  return (
    <Row>
        <Col md={8}>
            <h1>Shopping Cart</h1>
            {cartItems.length ===0?
            (<Message variant="info">
                Your cart is empty <Link to='/'>Go Back</Link>
            </Message>):(
                <ListGroup variant="flush">
                   {cartItems.map(item=>(
                    <ListGroup.Item key={item.product}>
                        <Row>
                            <Col md={2}>
                                <Image src={item.image} alt={item.name} fluid round/>
                            </Col>
                            <Col md={3}>
                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                            </Col>
                            <Col md={2}>
                                ${item.price}
                            </Col>
                            <Col md={3}>
                            <Form.Control
                          as="select"
                          value={item.qty}
                          onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                            </Col>
                            <Col md={1}>
                                <Button type='button' variant='light'
                                onClick={() => removeFromCartHandler(item.product)}>
                                    <i className="fas fa-trash"></i>
                                     
                                </Button>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                   ))}
                </ListGroup>
            )}
        </Col>
        <Col md={4}>
            <Card>
                <ListGroup variant="flush" >
                    <ListGroup.Item>
                        <h2>Subtotal ({cartItems.reduce((acc, item)=> acc+item.qty, 0)}) items</h2>
                        $({cartItems.reduce((acc, item)=> acc+item.qty * item.price, 0).toFixed(2)})

                    </ListGroup.Item>

                </ListGroup>
                <ListGroup.Item style={{margin: "20px 20px"}}>
                    <Button
                    type ='button'
                    className="btn-block"
                    disabled={cartItems.length === 0}
                    style={{width: "100%", fontSize:".9rem"}}
                    onClick={checkoutHandler}>
                        Proceed to Checkout
                    </Button>
                </ListGroup.Item>
            </Card>
        </Col>
      
    </Row>
  )
}

export default CartScreen
