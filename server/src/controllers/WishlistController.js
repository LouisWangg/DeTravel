const { Sequelize } = require('../models')
const Op = Sequelize.Op;
const { Place } = require('../models')
const { Wishlist } = require('../models')

let byName = false, byLast = false, byEarly = false

function swap (items, leftIndex, rightIndex){
    let temp = items[leftIndex]
    items[leftIndex] = items[rightIndex]
    items[rightIndex] = temp
}

function partition (items, left, right) {
    let pivot = items[Math.floor((right + left) / 2)] //middle element
    i = left //left pointer
    j = right //right pointer

    if (byName == true) {
        while (i <= j) {
            while (items[i].name < pivot.name) {
                i++
            }
            while (items[j].name > pivot.name) {
                j--
            }
            if (i <= j) {
                swap(items, i, j) //sawpping two elements
                i++
                j--
            }
        }
    } else if (byEarly == true) {
        while (i <= j) {
            while (Date.parse(items[i].createdAt) > Date.parse(pivot.createdAt)) {
                i++
            }
            while (Date.parse(items[j].createdAt) < Date.parse(pivot.createdAt)) {
                j--
            }
            if (i <= j) {
                swap(items, i, j) //sawpping two elements
                i++
                j--
            }
        }
    } else if (byLast == true) {
        while (i <= j) {
            while (Date.parse(items[i].createdAt) < Date.parse(pivot.createdAt)) {
                i++
            }
            while (Date.parse(items[j].createdAt) > Date.parse(pivot.createdAt)) {
                j--
            }
            if (i <= j) {
                swap(items, i, j) //sawpping two elements
                i++
                j--
            }
        }
    } else {
        while (i <= j) {
            while (items[i].placeId < pivot.placeId) {
                i++
            }
            while (items[j].placeId > pivot.placeId) {
                j--
            }
            if (i <= j) {
                swap(items, i, j) //sawpping two elements
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
        index = partition(items, left, right); //index returned from partition
        if (left < index - 1) { //more elements on the left side of the pivot
            quickSort(items, left, index - 1)
        }
        if (index < right) { //more elements on the right side of the pivot
            quickSort(items, index, right)
        }
    }
    return items;
}

function makeCharTable (pattern) {
    // javascript charCodeAt has maximum value of 65535, which from 2^16 - 1
    // so we can only make our table from index 0 to 65535
    const table = Array(65536).fill(pattern.length)
    
    // update table for each matching character
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

function makeOffsetTable (pattern) {
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
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,".");
    return parts.join(",");
}

module.exports = {
    async addToWishlist (req, res) {
        try {
            const { item, userId } = req.body
            const checkedPlace = await Wishlist.findOne({
                where: { placeId: item.placeId, userId: userId }
            })

            if (checkedPlace) {
                return res.status(403).send({
                    error: 'Tempat sudah terdaftar di favorit!'
                })
            }
            
            const addedPlace = await Wishlist.create({
                placeId: item.placeId,
                userId: userId
            })
            res.send(addedPlace)
        } catch (error) {
            res.status(500).send({ 
                error: 'Error on adding this place to favorite.'
            })
        }
    },
    async removeFromWishlist (req, res) {
        try {
            const { userId, placeId } = req.body.item
            const deletedPlace = await Wishlist.findOne({ 
                where: 
                    { 
                        placeId: placeId,
                        userId: userId
                    }
            })
            deletedPlace.destroy()
            res.send(deletedPlace)
        } catch (error) {
            res.status(500).send({
                error: 'Error on removing this place from favorite.'
            })
        }
    },
    async showFavoritePlaceList (req, res) {
        try {
            const { userId, sort, filter } = req.body
            let newModel = []

            if (sort.toLowerCase() == "nama") {
                byName = true, byEarly = false, byLast = false
            } else if (sort.toLowerCase() == "terakhir kali") {
                byEarly = true, byName = false, byLast = false
            } else if (sort.toLowerCase() == "pertama kali") {
                byLast = true, byName = false, byEarly = false
            } else {
                byName = false, byEarly = false, byLast = false
            }
            

            if (filter.toLowerCase() == "pantai") {
                placeList = await Wishlist.findAll({
                    where: { userId: userId },
                    include: [
                        {
                            model: Place,
                            where: {name: {[Op.like]: '%pantai%'}}
                        }
                    ]
                })
            } else if (filter.toLowerCase() == "gunung") {
                placeList = await Wishlist.findAll({
                    where: { userId: userId },
                    include: [
                        {
                            model: Place,
                            where: {name: {[Op.like]: '%gunung%'}}
                        }
                    ]
                })
            } else if (filter.toLowerCase() == "taman") {
                placeList = await Wishlist.findAll({
                    where: { userId: userId },
                    include: [
                        {
                            model: Place,
                            where: {name: {[Op.like]: '%taman%'}}
                        }
                    ]
                })
            } else if (filter.toLowerCase() == "museum") {
                placeList = await Wishlist.findAll({
                    where: { userId: userId },
                    include: [
                        {
                            model: Place,
                            where: {name: {[Op.like]: '%museum%'}}
                        }
                    ]
                })
            } else if (filter.toLowerCase() == "bukit") {
                placeList = await Wishlist.findAll({
                    where: { userId: userId },
                    include: [
                        {
                            model: Place,
                            where: {name: {[Op.like]: '%bukit%'}}
                        }
                    ]
                })
            } else if (filter.toLowerCase() == "biaya (0 - 5.000)") {
                placeList = await Wishlist.findAll({
                    where: { userId: userId },
                    include: [
                        {
                            model: Place,
                            where: {entryFee: {[Op.and]: {[Op.gte]: 0, [Op.lte]: 5000}}}
                        }
                    ]
                })
            } else if (filter.toLowerCase() == "biaya (5.000 - 25.000)") {
                placeList = await Wishlist.findAll({
                    where: { userId: userId },
                    include: [
                        {
                            model: Place,
                            where: {entryFee: {[Op.and]: {[Op.gte]: 5000, [Op.lte]: 25000}}}
                        }
                    ]
                })
            } else if (filter.toLowerCase() == "biaya (25.000 - 50.000)") {
                placeList = await Wishlist.findAll({
                    where: { userId: userId },
                    include: [
                        {
                            model: Place,
                            where: {entryFee: {[Op.and]: {[Op.gte]: 25000, [Op.lte]: 50000}}}
                        }
                    ]
                })
            }  else {
                placeList = await Wishlist.findAll({
                    where: { userId: userId },
                    include: [
                        {
                            model: Place
                        }
                    ]
                })
            }

            placeList.forEach((row) => {
                newModel.push({
                    "userId": row.userId,
                    "placeId": row.Place.placeId,
                    "name": row.Place.name,
                    "desc": row.Place.desc,
                    "address": row.Place.address,
                    "entryFee": numberWithCommas(Math.trunc(row.Place.entryFee)),
                    "image": row.Place.image,
                    "createdAt": row.createdAt
                })
            })

            quickSort(newModel, 0, newModel.length - 1)
            res.send(newModel)
        } catch (error) {
            res.status(500).send({ 
                error: error + 'Error on showing favorite place list.'
            })
        }
    },
    async searchPlaces (req, res) {
        try {
            const { userId, sort, searchEngine } = req.body
            let tempResult = [], searchResult = []

            if (sort.toLowerCase() == "nama") {
                byName = true, byEarly = false, byLast = false
            } else if (sort.toLowerCase() == "terakhir kali") {
                byEarly = true, byName = false, byLast = false
            } else if (sort.toLowerCase() == "pertama kali") {
                byLast = true, byName = false, byEarly = false
            } else {
                byName = false, byEarly = false, byLast = false
            }
            
            const placeList = await Wishlist.findAll({
                where: { userId: userId },
                include: [
                    {
                        model: Place
                    }
                ]
            })

            placeList.forEach(place => tempResult.push(boyerMooreSearch(place.Place.name.toLowerCase(), searchEngine.toLowerCase(), 0)))
            for (let i = 0; i < placeList.length; i++) {
                if (tempResult[i] !== -1) {
                    searchResult.push({
                        "placeId": placeList[i].placeId,
                        "name": placeList[i].Place.name,
                        "desc": placeList[i].Place.desc,
                        "address": placeList[i].Place.address,
                        "entryFee": numberWithCommas(Math.trunc(placeList[i].Place.entryFee)),
                        "image": placeList[i].Place.image,
                        "createdAt": placeList[i].Place.createdAt
                    })
                }
            }

            quickSort(searchResult, 0, searchResult.length - 1)
            res.send(searchResult)
        } catch (error) {
            res.status(500).send({
                error: error + 'Error on searching the list of places!'
            })
        }
    },
}
