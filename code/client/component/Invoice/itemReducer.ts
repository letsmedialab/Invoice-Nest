import { DispatchActionType } from "./dispatchActionType";

const removeSelected = (items: any) => {
  return items.map((item: any) => ({ ...item, selected: false }))
}

export default function itemReducer(items: any, action: any) {
  switch (action.type) {
    case DispatchActionType.FETCH: {
      return action.items;
    }
    case DispatchActionType.ADDED: {
      const existingItem = removeSelected(items)
      action.newItem.selected = true;
      return [...existingItem, action.newItem];
    }
  }
}
