import axios from 'axios'

export default() => {
  return axios.create({
    baseURL: `http://localhost:8081/`
    // http://localhost:8081/
    // https://detravel-database.herokuapp.com/
  })
}
