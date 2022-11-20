import { DispatchActionType } from "./dispatchActionType";

const populateFullName = (customers: any) => {
  return customers.map((customer: any) => ({ ...customer, fullName: customer.firstName + ' ' + customer.lastName }))
}

const removeSelected = (customers: any) => {
  return customers.map((customer: any) => ({ ...customer, selected: false }))
}

export default function customerReducer(customers: any, action: any) {
  switch (action.type) {
    case DispatchActionType.FETCH: {
      return populateFullName(action.customers);
    }
    case DispatchActionType.ADDED: {
      const existingCustomer = removeSelected(customers)
      action.newCustomer.selected = true;
      return populateFullName([...existingCustomer, action.newCustomer]);
    }
  }
}
