import React, { useEffect, useState } from "react";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import {
  Link,
  useNavigate,
  useSearchParams,
  useParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { PayPalButton } from "react-paypal-button-v2";

import { getOrderDetails, payOrder, deliverOrder } from "../actions/orderActions";
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET  } from "../constants/orderConstants";

const OrderScreen = () => {
  const { id } = useParams();
  const orderId = id;

  
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const {loading: loadingPay, success: successPay } = orderPay;

  
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const {loading: loadingDeliver, success: successDeliver } = orderDeliver;

  
  const userLogin = useSelector((state) => state.userLogin);
  const {userInfo } = userLogin;

  const [sdkReady, setSdkReady] = useState(false)

  let history = useNavigate();

  const dispatch = useDispatch();

  if (!loading && !error) {
    order.itemsPrice = order.orderItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2);
  }

  const addPaymentScript = () =>{
          setSdkReady(true)
  }

  useEffect(() => {
    if(!userInfo){
      history('/login')
    }
    if (!order || successPay || order._id !== Number(orderId) || successDeliver) {
      dispatch({type: ORDER_PAY_RESET})
      dispatch(getOrderDetails(orderId));
      dispatch({type: ORDER_DELIVER_RESET})
    }
    else if(!order.isPaid){
        setSdkReady(true)
    }
  }, [dispatch, order, orderId, successPay ,successDeliver]);

  const successPaymentHandler = () =>{
    dispatch(payOrder(orderId))
  }
  const deliverHandler = () =>{
    dispatch(deliverOrder(order))
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div>
      <h1>Order: {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>

              <p>
                <strong>Shipping:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}
                {"  "}
                {order.shippingAddress.postalCode},{"  "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">Delievred on {order.deliveredAt}</Message>
              ) : (
                <Message variant="warning">Not Delievred</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Payment:</strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAT}</Message>
              ) : (
                <Message variant="warning">Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message variant="info">Your order is Empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>

                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>

                        <Col md={4}>
                          {item.qty} X ${item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Col>Item:</Col>
                <Col>${order.itemsPrice}</Col>
              </ListGroup.Item>

              <ListGroup.Item>
                <Col>Shipping:</Col>
                <Col>${order.shippingPrice}</Col>
              </ListGroup.Item>

              <ListGroup.Item>
                <Col>GST:</Col>
                <Col>${order.taxPrice}</Col>
              </ListGroup.Item>

              <ListGroup.Item>
                <Col>Total Price:</Col>
                <Col>${order.totalPrice}</Col>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                    {loadingPay && <Loader/>}

                    {!sdkReady? (
                        <Loader/>
                    ):(
                        
                        <Button variant="success"
                        onClick={successPaymentHandler}>PAY (DEMO)</Button>
                         )}
                </ListGroup.Item>
              )}
            </ListGroup>
            {loadingDeliver && <Loader />}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered &&(
                <ListGroup.Item style={{display: 'flex', justifyContent: 'center'}} >
                  <Button 
                  style={{width: "80%", margin: "20px 0"}}
                  type="button"
                  className="btn btn-block"
                  onClick={deliverHandler}
                  >
                    Mark as Delivered
                  </Button>

                </ListGroup.Item>
            )}
          
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderScreen;
