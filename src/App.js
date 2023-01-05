import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import Routes from "./config/routes";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Chat from "./components/Chat";

function App() {
  const { userInfo } = useSelector((state) => state.userLogin);

  return (
    <div className="App">
      <Header />
      <main className="py-3">
        <Container>
          <Routes />
        </Container>
        {userInfo?.token && !userInfo?.isAdmin && <Chat user={userInfo} />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
