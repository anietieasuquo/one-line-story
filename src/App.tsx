import { Col, Container, Row } from 'react-bootstrap';
import Navigation from './components/Navigation';
import './App.css';
import NavigationContent from './components/NavigationContent';
import Header from './components/Header';

const App = () => {
    return (
        <Container id="root">
            <div className="container">
                <Header/>
                <main className="main">
                    <Row>
                        <Col className="bg-light border" xs="3">
                            <Navigation/>
                        </Col>
                        <Col className="bg-light border">
                            <NavigationContent/>
                        </Col>
                    </Row>
                </main>
            </div>
        </Container>
    );
};

export default App;
