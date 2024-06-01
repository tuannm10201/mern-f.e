import { Alert } from "react-bootstrap";

function Message({ className, variant = "info", children }) {
  return (
    <Alert variant={variant} className={className}>
      {children}
      test hihi
    </Alert>
  );
}

export default Message;
