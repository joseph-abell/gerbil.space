import Auth from "./Auth";

const RequireAuth = ({ session, children }: any) =>
  !session ? <Auth /> : <>{children}</>;

export default RequireAuth;