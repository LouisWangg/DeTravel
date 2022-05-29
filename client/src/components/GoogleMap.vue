<template>
  <v-container fluid grid-list-md class="ml-9 pl-6 pr-6">
    <v-row no-gutters>
      <v-col md="6">
        <GmapAutocomplete @place_changed="setPlace" class="mb-6 pac-input elevation-2" placeholder="Masukkan nama posisi awal..." />
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn @click="changeUserPosition" outlined icon
              v-bind="attrs" v-on="on" class="ml-6 shadow" color="green">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </template>
          <span>Ubah TEST</span>
        </v-tooltip>
        <GmapMap :center="userPosition" :zoom='15' id ="map" style='width:100%; height:710px;' :options="{zoomControl: false, mapTypeControl: false}"> 
          <GmapMarker  
            :key="index" v-for="(m, index) in markers" 
            :position="m.position" @click="userPosition=m.position" />
        </GmapMap>
      </v-col>

      <v-col md="5" v-show="hidePanel == false" class="mr-2 ml-6">
        <v-btn @click="hidePanel = true" 
          class="mr-8" style="float:right;">
          <v-icon left>mdi-arrow-left-circle</v-icon>
          Pilih destinasi lain
        </v-btn>
        <v-list id="directionsPanel" style="float:right; width:900px; height:730px" class="directionPanel mt-3"></v-list>
      </v-col>
      
      <v-col md="5" v-show="hidePanel" class="ml-10">
        <div class="d-flex pb-2">
          <v-text-field solo dense placeholder="Masukkan nama tempat yang dituju..." hide-details v-model="searchEngine" class="text mb-6 elevation-2"></v-text-field>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn @click="searchPlaces(searchEngine)" outlined rounded icon 
                v-bind="attrs" v-on="on" class="ml-6 mt-1 shadow" color="green">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </template>
            <span>Cari</span>
          </v-tooltip>
        </div>
        <div class="d-flex sortSelection mb-7">
          <v-select label="Filter berdasarkan" outlined dense :items="filterList" hide-details v-model="filterDefault" @input="changeSortMethod" class="mr-12 shadow-2" />
          <v-select label="Urut berdasarkan" outlined dense :items="sortList" hide-details v-model="sortDefault" @input="changeSortMethod" class="ml-6 shadow-2" />
        </div>
        
        <v-card>
          <v-data-table 
            :headers="headers" :items="places[0]" class="mr-0">
            <template v-slot:[`item.icons`]="{ item }">
              <v-icon v-if="item.name.toLowerCase().includes('pantai')">mdi-beach</v-icon>
              <v-icon v-if="item.name.toLowerCase().includes('gunung')">mdi-image-filter-hdr</v-icon>
              <v-icon v-if="item.name.toLowerCase().includes('taman')">mdi-pine-tree</v-icon>
              <v-icon v-if="item.name.toLowerCase().includes('museum')">mdi-bank</v-icon>
              <v-icon v-if="item.name.toLowerCase().includes('bukit')">mdi-summit</v-icon>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn @click="changeDestination(item)" small outlined rounded icon 
                    v-bind="attrs" v-on="on" class="shadow" color="green">
                    <v-icon>mdi-routes</v-icon>
                  </v-btn>
                </template>
                <span>Rute jalan</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn @click="showDetailPlace(item)" small outlined rounded icon 
                    v-bind="attrs" v-on="on" class="shadow ml-3 mr-3" color="green">
                    <v-icon>mdi-note-search-outline</v-icon>
                  </v-btn>
                </template>
                <span>Detail tempat</span>
              </v-tooltip>
              <v-tooltip v-if="$store.state.isLoggedIn" top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn @click="addToWishlist(item)" small outlined rounded icon 
                    v-bind="attrs" v-on="on" class="shadow" color="green">
                    <v-icon>mdi-bookmark-outline</v-icon>
                  </v-btn>
                </template>
                <span>Simpan ke favorit</span>
              </v-tooltip>
              <v-tooltip v-if="!$store.state.isLoggedIn" top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn @click="error='Harap melakukan login terlebih dahulu!', errorSnackbar=true" small outlined rounded icon 
                    v-bind="attrs" v-on="on" class="shadow" color="green">
                    <v-icon>mdi-bookmark-outline</v-icon>
                  </v-btn>
                </template>
                <span>Simpan ke favorit</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="detailPlaceDialog" dark width="800">
      <v-card>
        <v-row no-gutters>
          <v-col>
            <v-card-title class="headline">Detail Tempat</v-card-title>
            <v-card-text class="detailPlaceText">
              <v-text-field label="Nama tempat" v-model="detailPlace.name" />
              <v-textarea label="Deskripsi" v-model="detailPlace.desc" />
              <v-textarea label="Alamat" rows="2" v-model="detailPlace.address" />
              <v-text-field label="Jarak (km)" v-model="detailPlace.distance" />
              <v-text-field label="Biaya masuk / orang (Rp)" v-model="detailPlace.entryFee" />
            </v-card-text>
          </v-col>
          <v-col>
            <img :src="detailPlace.image" class="imagePlace" />
          </v-col>
        </v-row>
        
        <v-card-actions>
          <v-btn @click="detailPlaceDialog=false" class="closeBtn" color="red darken-2">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="errorSnackbar" :timeout="timeout">
      {{ error }}
      <template v-slot:action="{ attrs }">
        <v-btn color="red darken-2" text v-bind="attrs" @click="errorSnackbar=false">Tutup</v-btn>
      </template>
    </v-snackbar>

  </v-container>
</template>

<script>
import UserService from '@/services/UserService'
import WishlistService from '@/services/WishlistService'

export default {
  data() {
    return {
      userPosition: { lat: '', lng: '' },
      currentPlace: null,
      markers: [],
      places: [],
      test: [],
      headers: [
        { value: "icons", sortable: false },
        { text: "Nama", value: "name", sortable: false, align: "center", width: '35%' },
        { text: "Jarak (km)", value: "distance", sortable: false, align: "center", width: '5px' },
        { text: "Biaya masuk", value: "entryFee", sortable: false, align: "center", width: '5px' },
        { value: "actions", sortable: false },
      ],
      sortList: ["Jarak", "Nama"],
      sortDefault: "Jarak",
      filterList: ["None", "Pantai", "Gunung", "Taman", "Museum", "Bukit", "Biaya (0 - 5.000)", "Biaya (5.000 - 25.000)", "Biaya (25.000 - 50.000)"],
      filterDefault: "None",
      searchEngine: '',
      detailPlaceDialog: false,
      detailPlace: {},
      hidePanel: true,
      error: null,
      errorSnackbar: false,
      timeout: 5000,
    }
  },
  async mounted() {
    this.getUserPosition()
  },
  methods: {
    getUserPosition() {
      navigator.geolocation.getCurrentPosition(position => {
        this.userPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        this.showPlaceList()
        const marker = {
          lat: parseFloat(this.userPosition.lat),
          lng: parseFloat(this.userPosition.lng)
        }
        this.markers.push({ position: marker })
      })
    },
    changeDestination(place) {
      this.errorSnackbar = false
      this.setPlace(place)
      if (this.currentPlace) {
        const marker = {
          lat: parseFloat(this.currentPlace.latitude),
          lng: parseFloat(this.currentPlace.longitude)
        }
        this.markers[1] = { position: marker }
        this.userPosition = marker
        this.currentPlace = null
      }
      this.renderingDirection()
    },
    changeUserPosition() {
      this.places.splice(0)
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
        }
        this.markers[0] = { position: marker }
        this.userPosition = marker
        this.currentPlace = null
        this.showPlaceList()
      }
      if (this.markers[1] != null) {
        this.renderingDirection()
      }
    },
    searchPlaces(searchEngine) {
      this.places.splice(0)
      UserService.searchPlaces({searchEngine: searchEngine, userPosition: this.userPosition, sort: this.sortDefault})
        .then(a => (this.places.push(a.data)))
      this.filterDefault = "None"
    },
    showDetailPlace(item) {
      this.detailPlace = item
      this.detailPlaceDialog = true
    },
    changeSortMethod() {
      this.places.splice(0)
      this.showPlaceList()
    },
    setPlace(place) {
      this.currentPlace = place;
    },
    showPlaceList() {
      UserService.showPlaceList({position: { latitude: this.userPosition.lat, longitude: this.userPosition.lng}, sort:this.sortDefault, filter: this.filterDefault})
        .then(a => (this.places.push(a.data)))
    },
    renderingDirection() {
      this.hidePanel = false
      const directionsService = new google.maps.DirectionsService()
      const directionsRenderer = new google.maps.DirectionsRenderer()
      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: { lat: parseFloat(this.userPosition.lat), lng: parseFloat(this.userPosition.lng)},
        disableDefaultUI: true,
      })
      directionsRenderer.setMap(map)
      document.getElementById("directionsPanel").innerHTML = "";
      directionsRenderer.setPanel(document.getElementById('directionsPanel'))
      this.calculateAndDisplayRoute(directionsService, directionsRenderer)
    },
    calculateAndDisplayRoute(directionsService, directionsRenderer) {
        directionsService.route({
        origin: this.markers[0].position,
        destination: this.markers[1].position,
        travelMode: google.maps.TravelMode.DRIVING
      }).then((response) => {directionsRenderer.setDirections(response)
      }).catch(error => {this.error = "Rute jalan tidak dapat ditampilkan!", this.errorSnackbar = true})
    },
    addToWishlist(item) {
      WishlistService.addToWishlist({item: item, userId: this.$store.state.user.userId})
        .catch(error => {this.error = error.response.data.error, this.errorSnackbar = true})
    },
    navigateTo (route) {
      this.$router.push(route)
    },
  }
}
</script>

<style>
.sortSelection {
  width: 100%;
}

.detailPlaceText {
  width: 350px;
}

.imagePlace {
  width: 400px;
  height: 280px;
  margin-top: 105px;
  margin-right: 30px;
}

.closeBtn {
  margin-left: 350px;
  margin-bottom: 3px;
}

.pac-input {
  background-color: white;
  padding: 0 11px 0 13px;
  width: 400px;
  outline-color: #8DE2A1;
  line-height: 2.2;
  border: 2px solid #8DE2A1;
  border-radius: 4px;
  box-shadow: 2px 0 8px 1px #BEEEC9;
}

.directionPanel {
  padding: 6px;
  max-width: 35rem;
  height: 100%;
  overflow: auto;
}

.contain {
  background-color: #4d90fe;
}

.text {
  font-weight: 100;
  border: 2px solid #8DE2A1;
}

.shadow {
  background-color: white;
  box-shadow: 2px 0 6px 0 #BEEEC9;
}

.shadow-2 {
  background-color: white;
  box-shadow: 2px 0 5px 0 #BEEEC9;
}

</style>