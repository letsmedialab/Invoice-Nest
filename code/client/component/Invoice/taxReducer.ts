export enum TaxActionType {
  ADDED = 'ADDED',
  FETCH = 'FETCH',
}

const removeSelected = (taxes: any) => {
  return taxes.map((tax: any) => ({ ...tax, selected: false }))
}

export default function taxReducer(taxes: any, action: any) {
  switch (action.type) {
    case TaxActionType.FETCH: {
      console.log('reducer fetch called...');
      return action.taxes;
    }
    case TaxActionType.ADDED: {
      console.log('reducer added called...', JSON.stringify(action));
      const existingTax = removeSelected(taxes)
      action.newTax.selected = true;
      return [...existingTax, action.newTax];
    }
  }
}
