import axios from "axios";
import {getHeaders} from  '../utils/restUtil';
import {PRODUCT_CONSTANTS as c, MISC_CONSTANTS as m} from  '../utils/constants';

axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.response.status == 401) {
    delete sessionStorage.session;
  }
  return Promise.reject(error);
});

export function addProduct (url,product) {
  console.log('addProduct');

  return function (dispatch) {
    console.log(product);
    axios.post(url, JSON.stringify(product), {headers: getHeaders()})
    .then((response) => {
      console.log(response);
      if (response.status == 201) {
        dispatch({type: c.PRODUCT_ADD_SUCCESS, payload: {product: response.data}});
      }
    }).catch( (err) => {
      console.log(err);
      dispatch({type: c.PRODUCT_ADD_FAIL});
    });
  };
}

export function updateProduct (url,product) {
  console.log('updateProduct');
  return function (dispatch) {
    console.log(product);
    axios.put(url, JSON.stringify(product),{headers: getHeaders()})
    .then((response) => {
      console.log(response);
      if (response.status == 200) {
        dispatch({type: c.PRODUCT_EDIT_SUCCESS, payload: {product: response.data}});
      }
    }).catch( (err) => {
      console.log(err);
      dispatch({type: c.PRODUCT_EDIT_FAIL});
    });
  };
}

export function removeProduct (product) {
  console.log('removeProduct');
  const url = window.serviceHost + '/categories/' + product.category.id + "/subCategories/" + product.subCategory.id + "/products/" + product.id;
  return function (dispatch) {
    console.log(product);

    axios.delete(url, {headers: getHeaders()})
    .then((response) => {
      console.log(response);
      dispatch({type: c.PRODUCT_REMOVE_SUCCESS, payload: {product: product}});
    }).catch( (err) => {
      console.log(err);
      dispatch({type: c.PRODUCT_REMOVE_FAIL});
    });
  };
}

export function uploadProducts (file) {
  return function (dispatch) {
    dispatch({type: c.PRODUCT_UPLOAD_PROGRESS});
    var data = new FormData();
    data.append("file", file);

    axios.post(window.serviceHost + '/uploads/products', data, {headers: {'Authorization': 'Bearer ' + sessionStorage.access_token}})
    .then((response) => {
      console.log(response);
      if (response.status == 201) {
        dispatch({type: c.PRODUCT_UPLOAD_SUCCESS});
        dispatch({type: m.STORE_INITIALIZED, payload:{ initialized: false}});
      }
    }).catch( (err) => {
      console.log(err);
      dispatch({type: c.PRODUCT_UPLAOD_FAIL});
    });
  };
}

export function syncProduct () {
  return function (dispatch) {
    dispatch({type: c.PRODUCT_SYNC_PROGRESS});
    axios.post(window.serviceHost + '/products/sync', null, {headers: getHeaders()})
    .then((response) => {
      console.log(response);
      if (response.status == 200) {
        dispatch({type: c.PRODUCT_SYNC_SUCCESS});
        dispatch({type: m.STORE_INITIALIZED, payload:{ initialized: false}});
      }
    }).catch( (err) => {
      console.log(err);
      dispatch({type: c.PRODUCT_SYNC_SUCCESS});
    });
  };
}

