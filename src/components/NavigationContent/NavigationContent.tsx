import { Route, Routes } from 'react-router-dom';
import { useAppSelector } from '../../core/hooks/useRedux.ts';
import Onboarding from '../../screens/Onboarding';
import StoryPlay from '../../screens/Story';
import Error from '../../screens/Error';
import React from 'react';
import { userSelector } from '../../core/store/slices/users/slice.ts';
import Stories from '../../screens/Stories';
import CreateStory from '../../screens/CreateStory';
import { Dashboard } from '../../screens/Dashboard/Dashboard.tsx';
import StoryView from '../../screens/StoryView';
import './NavigationContent.css';


const NavigationContent = (): React.JSX.Element => {
    const { user } = useAppSelector(userSelector);

    return (
        <div className="navigation-content">
            <Routes>
                {!user?.username ? (
                    <>
                        <Route path="/" element={<Onboarding/>}/>
                    </>
                ) : (
                    <>
                        <Route path="/" element={<Dashboard/>}/>
                        <Route path="/stories" element={<Stories/>}/>
                        <Route path="/stories/create" element={<CreateStory/>}/>
                        <Route path="/stories/:id/join" element={<StoryPlay/>}/>
                        <Route path="/stories/:id" element={<StoryView/>}/>
                    </>
                )}
                <Route path="*"
                       element={<Error title="Not Found" message="The page you are looking for does not exist"/>}/>
            </Routes>
        </div>
    );
};

export { NavigationContent };
