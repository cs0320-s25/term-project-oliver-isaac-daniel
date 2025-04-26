import { Dispatch, SetStateAction } from "react";

/**
 * An interface for logged-in state for mock.
 *
 * @params
 * isLoggedIn: true if the user is logged in, false otherwise
 * setIsLoggedIn: to update the state of isLoggedIn
 */
interface loginProps {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

/**
 * Builds a component that manage the login button and end-user's logged in state.
 *
 * @param props to access logged-in state (see interface loginProps for more details)
 * @returns JSX to let user know they can sign out if they are logged in
 *  or log-in if they are not logged in
 */
export function LoginButton(props: loginProps) {
  /**
   * Function to manage authentication;
   *  if the user is logged in, the user's log-in state will update to not logged in
   *  if the user is not logged in, the user's log-in state will update to logged in
   *
   * @returns whether they are logged in or not
   */
  const authenticate = () => {
    const newValue = !props.isLoggedIn;
    props.setIsLoggedIn(newValue);
    return newValue;
  };

  return (
    <button 
      aria-label={props.isLoggedIn ? "Sign Out" : "Login"} 
      onClick={authenticate} 
      aria-live="polite"
    >
      {props.isLoggedIn ? "Sign out" : "Login"}
    </button>
  );
}
