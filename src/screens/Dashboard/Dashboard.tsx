import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../core/hooks/useRedux.ts';
import { Card, Col, Row } from 'react-bootstrap';
import NavigationContentHeader from '../../components/NavigationContentHeader';
import { gameSelector } from '../../core/store/slices/game/slice.ts';
import './Dashboard.css';
import { fetchStories } from '../../core/store/slices/game/actions.ts';

const Dashboard = () => {
    const { stories } = useAppSelector(gameSelector);
    const [stats, setStats] = useState<Map<string, string>>(new Map<string, string>);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!stories) {
            dispatch(fetchStories());
        }
    }, [stories, dispatch]);

    useEffect(() => {
        const stats = new Map<string, string>();
        stats.set('All Stories', stories?.length?.toString() || '0');
        stats.set('Completed Stories', stories?.filter(s => s.status === 'completed')?.length?.toString() || '0');
        stats.set('Open Stories', stories?.filter(s => s.status === 'open')?.length?.toString() || '0');
        setStats(stats);
    }, [stories]);

    return (
        <div className="dashboard">
            <NavigationContentHeader title="Welcome"/>
            <Row>
                {
                    Array.from(stats).map(([title, value], i) => (
                        <Col sm={4} key={i}>
                            <Card className="text-center mt-3">
                                <Card.Body>
                                    <Card.Title>{title}</Card.Title>
                                    <Card.Text className="h1">{value}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                }
            </Row>
        </div>
    );
};

export { Dashboard };
