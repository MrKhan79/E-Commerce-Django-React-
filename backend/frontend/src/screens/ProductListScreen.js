import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Table, Row, Col} from "react-bootstrap";
import { listProducts, deleteProduct, createProduct } from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";

const ProductListScreen = () => {
  const dispatch = useDispatch();

  let [searchParams, setSearchParams] = useSearchParams();
  let keyword =''
  let page = 1


  if(searchParams.get('keyword')){
    keyword = searchParams.get('keyword')
  }
  if(searchParams.get('page')){
     page = searchParams.get('page')
  }


  const productList = useSelector((state) => state.productList);
  const { loading, error, products, pages, page: page2, } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = productCreate;



  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  


  const history = useNavigate();

  useEffect(() => {
    dispatch({type: PRODUCT_CREATE_RESET})

    if (!userInfo.isAdmin) {
      history("/login");
    }
    if(successCreate){
        history(`/admin/product/${createdProduct._id}/edit`)
    }else{
      console.log(keyword, page)
      dispatch(listProducts(keyword, page));
    }
  }, [dispatch, history, userInfo, successDelete, successCreate, createProduct, keyword, page]);

  const deleteHandler = (id) => {
    if(window.confirm("Are you sure you want to delete this product?")){
         dispatch(deleteProduct(id))
    }
  };

  const createProductHandler = (product) =>{
    dispatch(createProduct())
  }
  return (
    <div>
     <Row className="align-items-center">
        <Col>
        <h1>Products</h1>
        </Col>
        <Col className="text-left" style={{ justifyContent: "right", display: "flex"}}>
            <Button className="my-3" onClick={createProductHandler}>
               <i className="fas fa-plus"></i> Create Product
            </Button>
        </Col>
     </Row>
     { loadingDelete && <Loader />}
     {errorDelete && <Message className="danger">{errorDelete}</Message>}

     { loadingCreate && <Loader />}
     {errorCreate && <Message className="danger">{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <diV>
        <Table striped bordered hover className="table-sm">
          <thead>
            <th>ID</th>
            <th>NAME</th>
            <th>PRICE</th>
            <th>CATEGORY</th>
            <th>BRAND</th>

            <th></th>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>

               
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant="" className="btn">
                      <i
                        className="fas fa-edit"
                        style={{ color: "#2E8BC0" }}
                      ></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant=""
                    className="btn"
                    onClick={() => deleteHandler(product._id)}
                  >
                    <i
                      className="fas fa-trash"
                      style={{ color: "#E7625F" }}
                    ></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div style={{display: 'flex', justifyContent: 'center' }}><Paginate pages={pages} page={page2} isAdmin={true} path='/admin/productList/'/></div>
        </diV>
      )}
    </div>
  );
};

export default ProductListScreen;
