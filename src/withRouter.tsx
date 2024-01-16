import { useLocation, useNavigate, useParams } from "react-router-dom";

export function withRouter(Component: any) {
  function Wrapper(props: any) {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    return <Component navigate={navigate} location={location} params={params} {...props} />;
  }
  return Wrapper;
}
