const { Sequelize } = require('../models')
const Op = Sequelize.Op;
const { Place } = require('../models')

let byDistance = false, byName = false

function calculateDistance (lat1, lat2, lon1, lon2) {
    lon1 =  lon1 * Math.PI / 180
    lon2 = lon2 * Math.PI / 180
    lat1 = lat1 * Math.PI / 180
    lat2 = lat2 * Math.PI / 180

    let dlon = lon2 - lon1
    let dlat = lat2 - lat1
    let a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2)

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    let r = 6371

    return(c * r)
}

function swap (items, leftIndex, rightIndex){
    let temp = items[leftIndex]
    items[leftIndex] = items[rightIndex]
    items[rightIndex] = temp
}

function partition (items, left, right) {
    let pivot = items[Math.floor((right + left) / 2)]
    i = left
    j = right

    if (byDistance == true) {
        while (i <= j) {
            while (items[i].distance < pivot.distance) {
                i++
            }
            while (items[j].distance > pivot.distance) {
                j--
            }
            if (i <= j) {
                swap(items, i, j)
                i++
                j--
            }
        }
    } else if (byName == true) {
        while (i <= j) {
            while (items[i].name < pivot.name) {
                i++
            }
            while (items[j].name > pivot.name) {
                j--
            }
            if (i <= j) {
                swap(items, i, j)
                i++
                j--
            }
        }
    }
    return i;
}

function quickSort (items, left, right) {
    let index;
    if (items.length > 1) {
        index = partition(items, left, right); 
        if (left < index - 1) { 
            quickSort(items, left, index - 1)
        }
        if (index < right) {
            quickSort(items, index, right)
        }
    }
    return items;
}

function makeCharTable (pattern) { //bad character heu
    const table = Array(65536).fill(pattern.length)
    
    for (let i = 0; i < pattern.length - 1; i++) {
        table[pattern.charCodeAt(i)] = pattern.length - 1 - i
    }
    return table
}

function isPrefix (pattern, index) {
    for (let i = index, j = 0; i < pattern.length; i++, j++) {
        return (pattern[i] === pattern[j])
    }
}

function suffixLength (pattern, index) {
    let len = 0;
    for (let i = index, j = pattern.length - 1; i >= 0 && pattern[i] === pattern[j]; i--, j--) {
        len += 1
    }
    return len;
} 

function makeOffsetTable (pattern) { //good suffix heu
    let table = Array(pattern.length).fill(0)
    let prefixIndex = pattern.length

    for (let i = pattern.length; i > 0; i--) {
        if (isPrefix(pattern, i)) {
            prefixIndex = i
        }
        table[pattern.length - i] = prefixIndex - 1 + pattern.length
    }
    
    for (let i = 0; i < pattern.length - 1; i++) {
        const suffLength = suffixLength(pattern, i)
        table[suffLength] = pattern.length - 1 - i + suffLength
        table[suffLength] = table[suffLength] > pattern.length ? pattern.length : table[suffLength]
    }
    return table
}

function boyerMooreSearch (text, pattern, index = 0) {
    if (typeof text !== 'string' || typeof pattern !== 'string') return -1

    const startIndex = Math.floor(index < 0 ? 0 : index)

    if (pattern === "") {
        return startIndex < text.length ? startIndex : text.length
    }

    let charTable = makeCharTable(pattern);
    let offsetTable = makeOffsetTable(pattern);
    
    for (let i = pattern.length - 1 + Math.floor(startIndex); i < text.length; ) {
        let j = pattern.length - 1
        while (pattern[j] === text[i]) {
            if (j === 0) return i
            i--
            j--
        }

        const charCode = text.charCodeAt(i);
        const deltai = Math.max(offsetTable[pattern.length - 1 - j], charTable[charCode])
        i += deltai
    }
    return -1;
}

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,".");
    return parts.join(",");
}

module.exports = {
    async showPlaceList (req, res) {
        try {
            let newModel = []
            const currentLatitude = req.body.position.latitude
            const currentLongitude = req.body.position.longitude
    
            if (req.body.sort.toLowerCase() == "jarak") {
                byDistance = true, byName = false
            } else {
                byDistance = false, byName = true
            }

            if (req.body.filter.toLowerCase() == "pantai") {
                placeList = await Place.findAll({
                    where: {name: {[Op.like]: '%pantai%'}}
                })
            } else if (req.body.filter.toLowerCase() == "gunung") {
                placeList = await Place.findAll({
                    where: {name: {[Op.like]: '%gunung%'}}
                })
            } else if (req.body.filter.toLowerCase() == "taman") {
                placeList = await Place.findAll({
                    where: {name: {[Op.like]: '%taman%'}}
                })
            } else if (req.body.filter.toLowerCase() == "museum") {
                placeList = await Place.findAll({
                    where: {name: {[Op.like]: '%museum%'}}
                })
            } else if (req.body.filter.toLowerCase() == "bukit") {
                placeList = await Place.findAll({
                    where: {name: {[Op.like]: '%bukit%'}}
                })
            } else if (req.body.filter.toLowerCase() == "biaya (0 - 5.000)") {
                placeList = await Place.findAll({
                    where: {entryFee: {[Op.and]: {[Op.gte]: 0, [Op.lte]: 5000}}}
                })
            } else if (req.body.filter.toLowerCase() == "biaya (5.000 - 25.000)") {
                placeList = await Place.findAll({
                    where: {entryFee: {[Op.and]: {[Op.gte]: 5000, [Op.lte]: 25000}}}
                })
            } else if (req.body.filter.toLowerCase() == "biaya (25.000 - 50.000)") {
                placeList = await Place.findAll({
                    where: {entryFee: {[Op.and]: {[Op.gte]: 25000, [Op.lte]: 50000}}}
                })
            }  else {
                placeList = await Place.findAll()
            }
    
            placeList.forEach((row) => {
                let attractionLatitude = row.latitude
                let attractionLongitude = row.longitude
                let distance = calculateDistance(currentLatitude, attractionLatitude, currentLongitude, attractionLongitude)

                newModel.push({
                    "placeId": row.placeId,
                    "name": row.name,
                    "desc": row.desc,
                    "address": row.address,
                    "latitude": row.latitude,
                    "longitude": row.longitude,
                    "distance": Math.round(distance * 100) / 100,
                    "entryFee": numberWithCommas(Math.trunc(row.entryFee)),
                    "image": row.image
                })
            }) 

            quickSort(newModel, 0, newModel.length - 1)
            return res.send(newModel)
        } catch (error) {
            res.status(500).send({
                error: 'Error on showing the list of places!'
            })
        }
    },
    async searchPlaces (req, res) {
        try {
            let tempResult = [], searchResult = []
            const currentLatitude = req.body.userPosition.lat
            const currentLongitude = req.body.userPosition.lng

            if (req.body.sort.toLowerCase() == "jarak") {
                byDistance = true, byName = false
            } else {
                byName = true, byDistance = false
            }
            
            const placeList = await Place.findAll()
            placeList.forEach(place => tempResult.push(boyerMooreSearch(place.name.toLowerCase(), req.body.searchEngine.toLowerCase(), 0)))
            for (let i = 0; i < placeList.length; i++) {
                if (tempResult[i] !== -1) {
                    let distance = calculateDistance(currentLatitude, placeList[i].latitude, currentLongitude, placeList[i].longitude)
                    searchResult.push({
                        "placeId": placeList[i].placeId,
                        "name": placeList[i].name,
                        "desc": placeList[i].desc,
                        "address": placeList[i].address,
                        "latitude": placeList[i].latitude,
                        "longitude": placeList[i].longitude,
                        "distance": Math.round(distance * 100) / 100,
                        "entryFee": numberWithCommas(Math.trunc(placeList[i].entryFee)),
                        "image": placeList[i].image
                    })
                }
            }
            quickSort(searchResult, 0, searchResult.length - 1)
            res.send(searchResult)
        } catch (error) {
            res.status(500).send({
                error: error+'Error on searching the list of places!'
            })
        }
    },
}