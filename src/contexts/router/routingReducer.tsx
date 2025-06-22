export type ComponentType = "Server" | "Client";

export type routingState = {
  routingType: ComponentType;
};

export type routingAction = {
  type: "APPLY_TYPE";
  componentsType: ComponentType;
};

export const initialState: routingState = {
  routingType: "Server",
};

export const routingReducer = (state: routingState, action: routingAction) => {
  switch (action.type) {
    case "APPLY_TYPE":
      return {
        routingType: action.componentsType,
      };

    default:
      return state;
  }
};
