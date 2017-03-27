import {CATEGORY_CONSTANTS as c, SUB_CATEGORY_CONSTANTS as sc, PRODUCT_CONSTANTS as p} from "../utils/constants";

const initialState = {
  loaded: false,
  fetching: false,
  adding: false,
  editing: false,
  categories:[],
  filter: {},
  sort: 'category:asc',
  toggleStatus: true
};

const handlers = {
//////////////////////////////////////// Category //////////////////////////////////////////  
  [c.CATEGORY_FETCH_PROGRESS]: (_, action) => ({fetching: true}),
  [c.CATEGORY_FETCH_SUCCESS]: (_, action) => ({loaded: true, fetching: false,toggleStatus: !_.toggleStatus, categories: action.payload.categories}),
  [c.CATEGORY_FETCH_FAIL]: (_, action) => ({fetching: false}),
  [c.CATEGORY_ADD_FORM_TOGGLE]: (_, action) => ({adding: action.payload.adding}),
  [c.CATEGORY_ADD_SUCCESS]: (_, action) => {
    let categories = _.categories;
    categories.push(action.payload.category);
    return ({adding: false,toggleStatus: !_.toggleStatus, categories: categories});
  },
  [c.CATEGORY_ADD_FAIL]: (_, action) => ({adding: false}),
  [c.CATEGORY_EDIT_FORM_TOGGLE]: (_, action) => ({editing: action.payload.editing}),
  [c.CATEGORY_EDIT_SUCCESS]: (_, action) => {
    let categories = _.categories;
    let i = categories.findIndex(e=> e.id == action.payload.category.id);
    categories[i] = action.payload.category;
    return ({editing: false,toggleStatus: !_.toggleStatus, categories: categories});
  },
  [c.CATEGORY_EDIT_FAIL]: (_, action) => ({editing: false}),
  [c.CATEGORY_REMOVE_SUCCESS]: (_, action) => {
    let categories = _.categories.filter((c)=> c.id != action.payload.category.id);
    return ({toggleStatus: !_.toggleStatus,categories: categories});
  },
  [c.CATEGORY_FILTER]: (_, action) => ({filter: action.payload.filter, toggleStatus: !_.toggleStatus}),
  [c.CATEGORY_SORT]: (_, action) => ({sort: action.payload.sort, toggleStatus: !_.toggleStatus}),

//////////////////////////////////////////////// Sub Category /////////////////////////////////////////////////////////
  [sc.SUB_CATEGORY_ADD_FORM_TOGGLE]: (_, action) => ({adding: action.payload.adding}),
  [sc.SUB_CATEGORY_ADD_SUCCESS]: (_, action) => {
    const subCategory = action.payload.subCategory;
    let categories = _.categories;
    let i = categories.findIndex(c=> c._links.self.href === subCategory._links.category.href);
    let category = categories[i];
    category.subCategoryList.push(subCategory);
    categories[i] = category;
    return ({adding: false, toggleStatus: !_.toggleStatus, categories: categories});
  },
  [sc.SUB_CATEGORY_ADD_FAIL]: (_, action) => ({adding: false}),
  [sc.SUB_CATEGORY_EDIT_FORM_TOGGLE]: (_, action) => ({editing: action.payload.editing}),
  [sc.SUB_CATEGORY_EDIT_SUCCESS]: (_, action) => {
    const subCategory = action.payload.subCategory;
    //console.log(subCategory);
    let categories = _.categories;
    let i = categories.findIndex(c=> c._links.self.href === subCategory._links.category.href);
    let category = categories[i];
    //console.log(category.subCategoryList);
    let j = category.subCategoryList.findIndex(sc => sc.id === subCategory.id);
    category.subCategoryList[j] = subCategory;
    categories[i] = category;
    return ({editing: false,toggleStatus: !_.toggleStatus, categories: categories});
  },
  [sc.SUB_CATEGORY_EDIT_FAIL]: (_, action) => ({editing: false}),
  [sc.SUB_CATEGORY_REMOVE_SUCCESS]: (_, action) => {
    const subCategory = action.payload.subCategory;
    let categories = _.categories;
    let i = categories.findIndex(c=> c._links.self.href === subCategory._links.category.href);
    let category = categories[i];
    category.subCategoryList = category.subCategoryList.filter(sc => sc.id != subCategory.id);
    categories[i] = category;
    return ({toggleStatus: !_.toggleStatus,categories: categories});
  },
  //////////////////////////////////////////////// Product /////////////////////////////////////////////////////////
  [p.PRODUCT_ADD_FORM_TOGGLE]: (_, action) => ({adding: action.payload.adding}),
  [p.PRODUCT_ADD_SUCCESS]: (_, action) => {
    const product = action.payload.product;
    let categories = _.categories;
    const i = categories.findIndex(c=> c.id === product.category.id);
    const j = categories[i].subCategoryList.findIndex(sc=> sc.id === product.subCategory.id);
    let subCategory = categories[i].subCategoryList[j];
    subCategory.productList.push(product);
    categories[i].subCategoryList[j] = subCategory;
    return ({adding: false, toggleStatus: !_.toggleStatus, categories: categories});
  },
  [p.PRODUCT_ADD_FAIL]: (_, action) => ({adding: false}),
  [p.PRODUCT_EDIT_FORM_TOGGLE]: (_, action) => ({editing: action.payload.editing}),
  [p.PRODUCT_EDIT_SUCCESS]: (_, action) => {
    const product = action.payload.product;
    //console.log(product);
    let categories = _.categories;
    let i = categories.findIndex(c=> c._links.self.href === product._links.category.href);
    let category = categories[i];
    //console.log(category.productList);
    let j = category.productList.findIndex(p => p.id === product.id);
    category.productList[j] = product;
    categories[i] = category;
    return ({editing: false,toggleStatus: !_.toggleStatus, categories: categories});
  },
  [p.PRODUCT_EDIT_FAIL]: (_, action) => ({editing: false}),
  [p.PRODUCT_REMOVE_SUCCESS]: (_, action) => {
    const product = action.payload.product;
    let categories = _.categories;
    let i = categories.findIndex(c=> c._links.self.href === product._links.category.href);
    let category = categories[i];
    category.productList = category.productList.filter(p => p.id != product.id);
    categories[i] = category;
    return ({toggleStatus: !_.toggleStatus,categories: categories});
  }
};

export default function category (state = initialState, action) {
  let handler = handlers[action.type];
  if( !handler ) return state;
  return { ...state, ...handler(state, action) };
}
