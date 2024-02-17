import axios from 'axios';


axios.get('http://localhost:8001/')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });




