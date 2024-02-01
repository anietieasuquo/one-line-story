export interface Entity {
    id?: string;
    dateCreated?: number;
}

export type EntityMap<T extends Entity> = { [key: string]: T[] };

export interface StorySentence extends Entity {
    storyId: string;
    content: string;
    username: string;
    self?: boolean;
}

export interface User extends Entity {
    username: string;
}

export type StoryStatus =
    | 'completed'
    | 'open';

export interface Story extends Entity {
    title: string;
    sentenceLimit: number;
    topic?: string;
    creator?: string;
    status: StoryStatus;
}

export type GameActionType =
    | 'CreateStory'
    | 'PushStory'
    | 'CloseStory'
    | 'UpdateClosedStory'
    | 'FetchStories'
    | 'PushStorySentence'
    | 'CreateStorySentence'
    | 'FetchStorySentences'
    | 'None';

export type UserActionType =
    | 'SignInUser'
    | 'SignOutUser'
    | 'None';

export type ActionStateValue = 'success' | 'loading' | 'error' | null;

export interface ActionWithType<T> {
    actionType: T;
    actionState: ActionStateValue;
}

export interface ErrorState {
    responseError?: any;
}

export interface GameState extends ActionWithType<GameActionType>, ErrorState {
    stories?: Story[];
    newStory?: Story;
    newSentence?: StorySentence;
    storySentences: EntityMap<StorySentence>;
}

export interface UserState extends ActionWithType<UserActionType>, ErrorState {
    user?: User;
}

export enum SortOrder {
    ASC,
    DESC
}

export interface WebSocketMessage {
    type: GameActionType | UserActionType;
    message: any;
}

export interface HandlerProps<T> {
    handle: (arg: T, ...other: any) => void;
}
