import axios from 'axios'

export default() => {
  return axios.create({
    baseURL: `https://detravel.herokuapp.com/`
    // http://localhost:8081/
    // https://detravel-database.herokuapp.com/
  })
}
