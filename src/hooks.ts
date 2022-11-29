import { AppContext } from "./context";
import * as React from "react";

export const useApp = () => {
	return React.useContext(AppContext);
}
