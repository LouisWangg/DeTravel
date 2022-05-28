import Api from '@/services/Api'

export default {
  addToWishlist (item) {
    return Api().post('addToWishlist', item)
  },
  removeFromWishlist (item) {
    return Api().delete('removeFromWishlist', {
      data: { item: item }
    })
  },
  showFavoritePlaceList (data) {
    return Api().post('showFavoritePlaceList', data)
  },
  searchPlaces (searchEngine) {
    return Api().post('searchFavoritePlaces', searchEngine)
  }
}
