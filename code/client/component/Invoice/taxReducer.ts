import { DispatchActionType } from "./dispatchActionType";

const removeSelected = (taxes: any) => {
  return taxes.map((tax: any) => ({ ...tax, selected: false }))
}

export default function taxReducer(taxes: any, action: any) {
  switch (action.type) {
    case DispatchActionType.FETCH: {
      return action.taxes;
    }
    case DispatchActionType.ADDED: {
      const existingTax = removeSelected(taxes)
      action.newTax.selected = true;
      return [...existingTax, action.newTax];
    }
  }
}
