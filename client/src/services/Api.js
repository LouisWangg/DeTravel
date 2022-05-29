import axios from 'axios'

export default() => {
  return axios.create({
    baseURL: `https://detravel-database.herokuapp.com/`
  })
}
