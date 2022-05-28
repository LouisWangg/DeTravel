import Api from '@/services/Api'

export default {
  showPlaceList (position) {
    return Api().post('showPlaceList', position)
  },
  searchPlaces (searchEngine) {
    return Api().post('searchPlaces', searchEngine)
  }
}
