# One Line Story
This is a basic implementation of the "One Line Story" game.
<br>
"One Line Story" is a collaborative storytelling game where participants work together to create a
narrative, one sentence at a time. The game begins with a starting sentence, and each player, in turn,
contributes one sentence to the story while only seeing the preceding sentence. This sequential
process continues, with each player building on the emerging plot or introducing unexpected twists.
The result is a unique and often humorous story that unfolds gradually, showcasing the creativity and
adaptability of the participants as they respond to the evolving narrative in real-time. The game is a
playful exercise in cooperative storytelling, demonstrating how a collective imagination can shape a
story in unexpected ways.
<br>
Despite being a minimal implementation, it's still a full-stack application with a React/Redux frontend and a Node.js backend.
<br>
I would say try not to judge the UI/UX too harshly, as this was done in a limited time. In a real-world scenario a lot of things would be done differently.
<br>

## User stories
- [x] User Story 1: As a player, I want to create a new story
  - **Acceptance Criteria**:
    - [x] Users can create a new story.
    - [x] Creating a new story involves setting basic parameters such as story title, amount of sentences
      and optional topic.
- [x] User Story 2: As a player, I want to see all ongoing and completed stories
  - **Acceptance Criteria**:
    - [x] Users can see all ongoing and completed stories.
    - [x] Stories are sorted by status (ongoing/completed).
    - [x] Each story shows the title, amount of sentences, topic (if any) and creation date.
- [x] User Story 3: As a player, I want to add a sentence to the story
    - **Acceptance Criteria**:
        - [x] Once in a story, users can see the previous sentence contributed by another player.
        - [x] There's an input field where users can type and submit their sentence.
        - [x] The updated sentences are shown automatically.
- [x] User Story 4: As a player, I want to view the story after it is completed
    - **Acceptance Criteria**:
        - [x] Upon ending, the entire story, including all contributed sentences, is presented.
- [x] User Story 5: As a player, I want to join other stories
    - **Acceptance Criteria**:
        - [x] Users can access a main menu with the option to join an existing story.
        - [x] Joining an existing story allows users to browse and select from available open stories or start
          a new one.

## Requirements
- Node.js 18+
- Yarn 2+

## Running the application
- `cd` into the project folder from the terminal
- Run `sh run.sh` to start the application
- Navigate to http://localhost:5173 on your browser to view the application

## Note
- The frontend app will run on port `5173` by default. While the backend server will run on port `8080`.
- If the backend app is restarted all data will be lost. This is because the data is stored in memory and not persisted to a database.
- If `yarn` fails on your environment, `npm` can be used instead, and is used by the run script.
- The frontend app will automatically refresh when changes are made to the code. However, the backend app will need to be restarted manually.
- The username required to use the app is only for the purpose of identifying players.
- A player is not allowed to submit consecutive lines. This is to prevent spam, and also to allow other players to participate.
- It's important to note that like any engineering task, there are many ways to implement this game.
- Most design decisions were made in the interest of time.

## Room for improvement
- It goes without saying the UI/UX could be improved.
- The frontend should be responsive. I used Bootstrap for the UI, so it's simply a matter of adding the appropriate classes. But frankly, I didn't have the time to do it.
- Also, there should be tests for both the frontend and backend.
- There should be an end-to-end encryption for the websocket connection.
- There should be authentication between the frontend and backend.
- There should be some sort of caching layer for the stories. Well, I mean on the backend, as the frontend already has what could technically be considered a cache.
- There could be a distinction between the host and the players.
- There could be a distinction between "Joining" and "Continuing" a game. But for now, the same button is used for both.
- For displaying completed / open stories, a tab could be used instead of a dropdown (although that might suffer from scalability issues if for example in the future there are more statuses and/or pseudo statuses, though that challenge could be overcome in some way but you get the idea).
- The backend could be refactored to use a database instead of storing data in memory.

Well, I'll stop there for now.. you get the idea --it suffice to say like in every system ever created there's room for improvement. 
