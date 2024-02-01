import express, { Express } from 'express';
import expressWs from 'express-ws';
import { createId, includes, isAnyEmpty } from './util';
import { Story, StorySentence, WebSocketMessage } from '../shared/core';

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const server: Express = express();
const { app } = expressWs(server);

app.use(express.json());

app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', CLIENT_URL);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

const connections: Set<any> = new Set();
const stories: Map<string, Story> = new Map();
const sentences: Map<string, StorySentence[]> = new Map();

const connectionHandler = (connection: any) => {
    connections.add(connection);

    connection.on('message', (message: any) => {
        connections.forEach((conn) => conn.send(message));
    });

    connection.on('close', () => {
        connections.delete(connection);
    });
};

const sendWebsocketMessage = (message: WebSocketMessage) => {
    console.log(`Sending message to ${connections.size} recipients: ${JSON.stringify(message)}`)
    connections.forEach((conn) => conn.send(JSON.stringify(message)));
};

app.ws('/game', connectionHandler);

app.post('/stories', (req, res) => {
    const payload: Story = req.body;
    const { title, sentenceLimit }: Story = payload;
    if (isAnyEmpty(title) || sentenceLimit === 0) {
        console.error('Invalid request body', req.body);
        res.status(400).send('Invalid request body');
        return;
    }

    if (includes(Array.from(stories.values()), payload, 'title')) {
        console.error('Story already exists', req.body);
        res.status(409).send('Story already exists');
        return;
    }

    const id = createId();
    const newStory: Story = { ...payload, id, dateCreated: Date.now() };
    stories.set(id, newStory);

    const message: WebSocketMessage = { type: 'CreateStory', message: newStory };
    sendWebsocketMessage(message);

    res.status(201).send(newStory);
});

app.get('/stories', (_req, res) => {
    const allStories: Story[] = Array.from(stories.values());
    res.status(200).send(allStories);
});

app.get('/stories/:id', (req, res) => {
    const story: Story | undefined = stories.get(req.params.id);

    if (!story) {
        console.error('Story not found', req.params.id);
        res.status(404).send('Story not found');
        return;
    }

    res.status(200).send(story);
});

app.post('/stories/:id/sentences', (req, res) => {
    const storyId = req.params.id;
    const story: Story | undefined = stories.get(storyId);

    if (!story) {
        console.error('Story not found', req.params.id);
        res.status(404).send('Story not found');
        return;
    }

    const storySentences: StorySentence[] = sentences.get(storyId) || [];
    const storySentence: StorySentence = req.body;
    const { content, username }: StorySentence = storySentence;

    if (isAnyEmpty(content, username)) {
        console.error('Invalid request body', req.body);
        res.status(400).send('Invalid request body');
        return;
    }

    if (storySentences.length >= story.sentenceLimit || story.status === 'completed') {
        console.error('Story is already completed', story);
        res.status(409).send('Story is already completed');
        return;
    }

    const id = createId();
    const newSentence: StorySentence = { ...storySentence, id, storyId, dateCreated: Date.now() };

    const updatedStorySentence: StorySentence[] = [...storySentences, newSentence];
    sentences.set(storyId, updatedStorySentence);

    const message: WebSocketMessage = {
        type: 'CreateStorySentence',
        message: newSentence
    };
    sendWebsocketMessage(message);

    if (updatedStorySentence.length >= story.sentenceLimit) {
        console.warn('Closing story due to storySentenceLimit exceed', story);
        const updatedStory: Story = { ...story, status: 'completed' };
        stories.set(storyId, updatedStory);
        const message: WebSocketMessage = {
            type: 'CloseStory',
            message: updatedStory
        };
        sendWebsocketMessage(message);
    }

    res.status(201).send(newSentence);
});

app.get('/stories/:id/sentences', (req, res) => {
    if (!stories.has(req.params.id)) {
        console.error(`Story not found for id: ${req.params.id}`);
        res.status(404).send('Story not found');
        return;
    }

    const storySentences: StorySentence[] = sentences.get(req.params.id) || [];
    res.status(200).send(storySentences);
});

app.patch('/stories/:id/completion', (req, res) => {
    const storyId = req.params.id;
    const story: Story | undefined = stories.get(storyId);

    if (!story) {
        console.error('Story not found', req.params.id);
        res.status(404).send('Story not found');
        return;
    }

    if (story.status === 'completed') {
        console.error('Story already completed', story);
        res.status(409).send('Story is already completed');
        return;
    }

    const updatedStory: Story = { ...story, status: 'completed' };
    stories.set(storyId, updatedStory);

    const message: WebSocketMessage = {
        type: 'CloseStory',
        message: storyId
    };
    sendWebsocketMessage(message);

    res.status(202).send(updatedStory);
});

app.use(express.static('build'));

app.listen(8080)
