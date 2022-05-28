const UserController = require('./controllers/UserController')
const WishlistController = require('./controllers/WishlistController')
const AdminController = require('./controllers/AdminController')
const AuthenticationController = require('./controllers/AuthenticationController')

const AuthenticationPolicy = require('./policies/AuthenticationPolicy')

module.exports = (app) => {
    app.post('/register', AuthenticationPolicy.register, AuthenticationController.register)
    app.post('/login', AuthenticationController.login)

    app.post('/showPlaceList', UserController.showPlaceList)
    app.post('/searchPlaces', UserController.searchPlaces)
    
    app.post('/addToWishlist', WishlistController.addToWishlist)
    app.delete('/removeFromWishlist', WishlistController.removeFromWishlist)
    app.post('/showFavoritePlaceList', WishlistController.showFavoritePlaceList)
    app.post('/searchFavoritePlaces', WishlistController.searchPlaces)

    app.get('/showPlaceList', AdminController.showPlaceList)
    app.post('/addPlace', AdminController.addPlace)
    app.put('/editPlace', AdminController.editPlace)
    app.delete('/deletePlace', AdminController.deletePlace)
    app.post('/searchPlace', AdminController.searchPlaces)
}
