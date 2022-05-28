import Api from '@/services/Api'

export default {
  showPlaceList () {
    return Api().get('showPlaceList')
  },
  addPlace (place) {
    return Api().post('addPlace', place)
  },
  editPlace (place) {
    return Api().put('editPlace', place)
  },
  deletePlace (placeId) {
    return Api().delete('deletePlace', {
      data: { placeId: placeId }
    })
  },
  searchPlaces (searchEngine) {
    return Api().post('searchPlace', searchEngine)
  }
}
