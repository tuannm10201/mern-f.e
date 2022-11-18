import { Alert } from "react-bootstrap";

function Message({ className, variant = "info", children }) {
  return (
    <Alert variant={variant} className={className}>
      {children}
    </Alert>
  );
}

export default Message;
