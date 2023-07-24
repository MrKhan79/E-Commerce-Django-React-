import React, { useEffect, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import { saveShippingAddress, savePaymentMethod } from "../actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";

const PaymentScreen = () => {
  const cart = useSelector((state) => state.cart);

  const { shippingAddress } = cart;

  const dispatch = useDispatch();
  let history = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("Gpay");

  if (!shippingAddress.address) {
    history("/shipping");
  }

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod))
    history("/placeorder");
  };

  return (
  <FormContainer>
    <CheckoutSteps step1 step2 step3 />
    <Form onSubmit={submitHandler}>
        <Form.Group>
            <Form.Label>Select Method</Form.Label>
            <Col>
            <Form.Check
            type="radio"
            label='Gpay or Credit Card (Demo)'
            id='Gpay'
            name="paymentMethod"
            checked
            onClick={(e)=> setPaymentMethod(e.target.value)}>

            </Form.Check>

            </Col>
        </Form.Group>
        <Button type="submit" variant="primary">
            Continue
        </Button>
    </Form>

  </FormContainer>
  
  )
}

export default PaymentScreen;
