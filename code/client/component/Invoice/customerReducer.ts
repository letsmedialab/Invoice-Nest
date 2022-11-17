export enum selectedCustomerActionType {
  ADDED = 'ADDED',
  FETCH = 'FETCH',
}

const populateFullName = (customers: any) => {
  return customers.map((customer: any) => ({ ...customer, fullName: customer.firstName + ' ' + customer.lastName }))
}

const removeSelected = (customers: any) => {
  return customers.map((customer: any) => ({ ...customer, selected: false }))
}

export default function customerReducer(customers: any, action: any) {
  switch (action.type) {
    case selectedCustomerActionType.FETCH: {
      console.log('reducer fetch called...');
      return populateFullName(action.customers);
    }
    case selectedCustomerActionType.ADDED: {
      console.log('reducer added called...', JSON.stringify(action));
      const existingCustomer = removeSelected(customers)
      action.newCustomer.selected = true;
      return populateFullName([...existingCustomer, action.newCustomer]);
    }
  }

}