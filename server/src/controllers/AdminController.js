const { Sequelize } = require('../models')
const Op = Sequelize.Op;
const { Place } = require('../models')

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

module.exports = {
    async showPlaceList (req, res) {
        try {
            const placeList = await Place.findAll()
            res.send(placeList)
        } catch (error) {
            res.status(500).send({
                error: 'Error on showing the list of places!'
            })
        }
    },
    async addPlace (req, res) {
        try {
            const { name, desc, address, latitude, longitude, entryFee, image } = req.body
            const newPlace = await Place.create({
                 name: name,
                 desc: desc,
                 address: address,
                 latitude: latitude,
                 longitude: longitude,
                 entryFee: entryFee,
                 image: image
            })
            res.send(newPlace)
        } catch (error) {
            res.status(500).send({
                error: 'Error on creating new place!'
            })
        }
    },
    async editPlace (req, res) {
        try {
            const { placeId, name, desc, address, latitude, longitude, entryFee, image } = req.body
            const updatedPlace = await Place.update(
                {
                    name: name, 
                    desc: desc, 
                    address: address,
                    latitude: latitude, 
                    longitude: longitude,
                    entryFee: entryFee, 
                    image: image 
                },
                { where: { placeId: placeId }}
            )
            res.send(updatedPlace)
        } catch (error) {
            res.status(500).send({
                error: 'Error on editing the place!'
            })
        }
    },
    async deletePlace (req, res) {
        try {
            const { placeId } = req.body.placeId
            const deletedPlace = await Place.findOne({ 
                where: { placeId: placeId }
            })
            deletedPlace.destroy()
            res.send(deletedPlace)
        } catch (error) {
            res.status(500).send({
                error: 'Error on deleting the place!'
            })
        }
    },
    async searchPlaces (req, res) {
        try {
            let tempResult = [], searchResult = []
            const placeList = await Place.findAll()

            placeList.forEach(place => tempResult.push(boyerMooreSearch(place.name.toLowerCase(), req.body.searchEngine.toLowerCase(), 0)))
            for (let i = 0; i < placeList.length; i++) {
                if (tempResult[i] !== -1) {
                    searchResult.push({
                        "name": placeList[i].name,
                        "desc": placeList[i].desc,
                        "latitude": placeList[i].latitude,
                        "longitude": placeList[i].longitude,
                        "entryFee": placeList[i].entryFee,
                        "image": placeList[i].image
                    })
                }
            }
            res.send(searchResult)
        } catch (error) {
            res.status(500).send({
                error: 'Error on searching the list of places!'
            })
        }
    },
}