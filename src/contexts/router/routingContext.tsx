import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from "react";
import {
  initialState,
  routingAction,
  routingReducer,
  routingState,
} from "./routingReducer";

const RoutingStateContext = createContext<routingState | undefined>(undefined);

const RoutingDispatchContext = createContext<
  Dispatch<routingAction> | undefined
>(undefined);

export const useRoutingState = () => {
  const context = useContext(RoutingStateContext);
  return context;
};

export const useRoutingDispatch = () => {
  const context = useContext(RoutingDispatchContext);
  return context;
};

export const RoutingProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(routingReducer, initialState);

  return (
    <RoutingStateContext.Provider value={state}>
      <RoutingDispatchContext.Provider value={dispatch}>
        {children}
      </RoutingDispatchContext.Provider>
    </RoutingStateContext.Provider>
  );
};
