import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import {} from 'dotenv/config';

/* components */
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Container from './components/layout/Container';

/* pages */
import Peti from './components/pages/Peti';
import Adopt from './components/pages/Adopt';
import Login from './components/pages/Auth/Login';
import Register from './components/pages/Auth/Register';
import NewPasswordEmail from './components/pages/Auth/NewPasswordEmail';
import NewPasswordLink from './components/pages/Auth/NewPasswordLink';
import Profile from './components/pages/User/Profile';
import AddPet from './components/pages/Pet/AddPet';
import MyPets from './components/pages/Pet/MyPets';
import EditPet from './components/pages/Pet/EditPet';
import PetDetails from './components/pages/Pet/PetDetails';
import Favorites from './components/pages/User/Favorites';
import NotFound from './components/pages/NotFound';

/* contexts */
import { UserProvider } from './context/UserContext';
import Message from './components/layout/Message';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Navbar />
        <Message />
        <Container>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/login/:id/verify/:token" element={<Login />} />
            <Route path="/forgotmypassword" element={<NewPasswordEmail />} />
            <Route
              path="/forgotmypassword/:id/:token"
              element={<NewPasswordLink />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/user/favorites" element={<Favorites />} />
            <Route path="/pet/add" element={<AddPet />} />
            <Route path="/pet/edit/:id" element={<EditPet />} />
            <Route path="/pet/mypets" element={<MyPets />} />
            <Route path="/pet/:id" element={<PetDetails />} />
            <Route path="/adopt" element={<Adopt />} />
            <Route path="/" element={<Peti />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
        <Footer />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
