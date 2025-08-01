import { useParams } from 'react-router-dom';

const Profile = () => {
  const { id } = useParams();
  return (
    <div className="p-10 text-center text-xl">
      <p>Profile Page for Book ID: <strong>{id}</strong></p>
    </div>
  );
};

export default Profile;
