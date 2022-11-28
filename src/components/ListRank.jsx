import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";

export default function ListRank({ obj }) {
  return (
    <ListGroup as="ol" numbered className="w-75 mx-auto mt-3">
      {Object.keys(obj).map((key) => (
        <ListGroup.Item
          as="li"
          className="d-flex justify-content-between align-items-start"
          key={key}
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold">{key}</div>
          </div>
          <Badge bg="primary" pill>
            {obj[key]}
          </Badge>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
