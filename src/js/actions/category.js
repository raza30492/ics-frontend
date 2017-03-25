import axios from "axios";

import {CATEGORY_CONSTANTS as c} from  '../utils/constants';

export function getCategories () {
  console.log("getCategories()");

  return function (dispatch) {
    dispatch({type:c.CATEGORY_FETCH_PROGRESS});

    axios.get(window.serviceHost + '/categories?expand=true')
    .then((response) => {
      if (response.status == 200 && response.data._embedded) {
        dispatch({type: c.CATEGORY_FETCH_SUCCESS, payload: {categories: response.data._embedded.categoryList}});
      }
    }).catch( (err) => {
      console.log(err); 
      dispatch({type: c.CATEGORY_FETCH_FAIL});
    });
  };
}

export function addCategory (category) {
  console.log('addCategory');

  return function (dispatch) {
    console.log(category);
    dispatch({type: c.CATEGORY_ADD_PROGRESS});

    axios.post(window.serviceHost + '/categories', JSON.stringify(category), {headers: {'Content-Type':'application/json'}})
    .then((response) => {
      console.log(response);
      if (response.status == 201) {
        dispatch({type: c.CATEGORY_ADD_SUCCESS, payload: {category: response.data}});
      }
    }).catch( (err) => {
      console.log(err);
      dispatch({type: c.CATEGORY_ADD_FAIL});
    });
  };
}

export function updateCategory (category) {
  console.log('updateCategory');
  return function (dispatch) {
    console.log(category);
    dispatch({type: c.CATEGORY_EDIT_PROGRESS});

    axios.put(category._links.self.href, JSON.stringify(category),{headers: {'Content-Type':'application/json'}})
    .then((response) => {
      console.log(response);
      if (response.status == 200) {
        dispatch({type: c.CATEGORY_EDIT_SUCCESS, payload: {category: response.data}});
      }
    }).catch( (err) => {
      console.log(err);
      dispatch({type: c.CATEGORY_ADD_FAIL});
    });
  };
}

export function removeCategory (category) {
  console.log('removeCategory');
  return function (dispatch) {
    console.log(category);

    axios.delete(category._links.self.href)
    .then((response) => {
      console.log(response);
      dispatch({type: c.CATEGORY_REMOVE_SUCCESS, payload: {category: category}});
    }).catch( (err) => {
      console.log(err);
      dispatch({type: c.CATEGORY_REMOVE_FAIL});
    });
  };
}
