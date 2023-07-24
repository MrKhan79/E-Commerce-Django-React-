import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate, useLocation} from "react-router-dom";
import { listProducts } from "../actions/productActions";
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";


const HomeScreen = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { error, loading, products, page, pages,  } = productList;

  let history = useNavigate()
  let [searchParams, setSearchParams] = useSearchParams();
  // let keyword ='?keyword='+''

  let keyword 
  let page2 = 1
  if(searchParams.get('keyword')){
    keyword = searchParams.get('keyword')
  }else{
    keyword =''
  }
  if(searchParams.get('page')){
     page2 = searchParams.get('page')
  }

 


  useEffect(() => {
    dispatch(listProducts(keyword, page2));
  }, [dispatch, keyword, page2, history]);

  return (
    <div>
      {!keyword && <ProductCarousel /> }
      
      <h1>Latest Prodcts</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <div>
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
        <div style={{display: 'flex', justifyContent: 'center' }}><Paginate page={page} pages={pages} keyword={keyword} isAdmin={false} /></div>
        </div>
      )}
      
    </div>
  );
};

export default HomeScreen;
