import { useEffect, useState } from 'react';
import { Activity } from './interfaces/activity';
import { Button } from './components/ui/button';
import axios from 'axios';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  useEffect(() => {
    const fetchActivities = async () => {
      const response = await axios.get<Activity[]>(
        'https://localhost:5001/api/activities'
      );
      setActivities(response.data);
    };
    fetchActivities();
  }, []);
  return (
    <>
      <h3 className='text-2xl underline'>Reactivities</h3>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id}>{activity.title}</li>
        ))}
      </ul>
      <Button>Hi</Button>
    </>
  );
}

export default App;
